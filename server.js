const querystring = require("querystring")
const request = require("request-promise-native")
const cookieParser = require("cookie-parser")
const cookie = require("cookie")

const express = require("express")
const app = express()

const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

const dev = app.get("env") === 'development'

if (dev) require('dotenv').config()

const { db } = require("./services/firebase")
const spotify = require("./services/spotify")
const generateRandomString = require("./services/randString")

/* routes */
const { router: friends, friendList, invitedList, invitedByList } = require('./routes/friends')
const notifications = require('./routes/notifications')

/* views */
const resultpage = require('./views/result')
const landingpage = require('./views/landing')
const homepage = require('./views/home')

/* downloads */
const pythonscript = require('./downloads/python-script')

/* middleware */
const secureHttps = require("./middleware/secureHttps")
const { async } = require("@firebase/util")

const client_id = process.env.CLIENT_ID_SPOTIFY;
const client_secret = process.env.CLIENT_SECRET_SPOTIFY;
const redirect_uri = process.env.REDIRECT_URI_SPOTIFY;


app.set("trust proxy", true);
app.use(secureHttps(dev))
app.use(cookieParser())

app.use("/", express.static('./static'))

app.use("/friends", friends)
app.use("/notifications", notifications)

app.get("/", async (req, res) => {
    const access_token = req.cookies.access_token
    const refresh_token = req.cookies.refresh_token

    if (!access_token && !refresh_token) {
        res.setHeader("Content-Type", "text/html")
        return res.send(landingpage())
    }

    if (!access_token && refresh_token)
        return res.redirect("/refresh_token")


    let userInfo = await spotify.getUserInfo(access_token)
    if (userInfo.error) {
        res.clearCookie("access_token")
        return res.redirect("/refresh_token")
    }

    res.setHeader("Content-Type", "text/html")
    res.send(homepage(userInfo, access_token))
})


app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email user-top-read user-read-recently-played';
    
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }))
})


app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
  
    if (state === null)
        return res.status(401).send('state_mismatch')

    let tokens
    try {
        tokens = await request({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
              Authorization: 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            form: {
                code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            json: true
        })
    } catch (error) {
        console.log("error request tokens", error)
        return res.status(500).send("error request tokens")
    }

    let userInfo = await spotify.getUserInfo(tokens.access_token, tokens.refresh_token)
    if (userInfo.error) {
        res.clearCookie("access_token")
        return res.redirect("/refresh_token")
    }

    res.cookie("access_token", tokens.access_token, { maxAge: 60 * 60 * 1 * 1000 /* 1h */, httpOnly: true, secure: !dev, SameSite: 'strict' })
    res.cookie("refresh_token", tokens.refresh_token, { maxAge: 60 * 60 * 87600 * 1000 /* 1y */, httpOnly: true, secure: !dev, SameSite: 'strict' })

    return res.redirect("/")
})


app.get('/refresh_token', async (req, res) => {
    const refresh_token = req.cookies.refresh_token || req.query.refresh_token

    let tokens
    try {
        tokens = await request({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
              Authorization: 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            form: {
                refresh_token,
                grant_type: 'refresh_token'
            },
            json: true
        })
    } catch (error) {
        if (req.query.result !== "string") {
            res.clearCookie("access_token")
            res.clearCookie("refresh_token")
        }

        if (req.query.result === "string")
            return res.sendStatus(401)

        return res.redirect("/")
    }

    let userInfo = await spotify.getUserInfo(tokens.access_token)
    if (userInfo.error) {
        if (req.query.result !== "string") {
            res.clearCookie("access_token")
            res.clearCookie("refresh_token")
        }

        if (req.query.result === "string")
            return res.sendStatus(401)

        return res.redirect("/")
    }

    if (req.query.result !== "string")
        res.cookie("access_token", tokens.access_token, { maxAge: 60 * 60 * 1 * 1000 /* 1h */, httpOnly: true, secure: !dev, SameSite: 'strict' })
            
    if (req.query.then)
        return res.redirect("/"+req.query.then)

    if (req.query.result === "string")
        return res.send(tokens.access_token)
    
    return res.redirect("/")
})


app.get("/python-script-download", async (req, res) => {
    const access_token = req.cookies.access_token
    const refresh_token = req.cookies.refresh_token

    let userInfo = await spotify.getUserInfo(access_token, refresh_token)
    if (userInfo.error) {
        res.clearCookie("access_token")
        return res.redirect(`/refresh_token?then=python-script-download`)
    }

    res.status(200)
        .attachment(`spotifystats.py`)
        .send(pythonscript(refresh_token, userInfo))
})


io.on('connection', async socket => {
    let userInfo = await spotify.getUserInfo(cookie.parse(socket.handshake.headers.cookie).access_token)
    if (userInfo.error)
        socket.disconnect()

    const notificationsObserver = db.collection('users').doc(userInfo.id).collection("notifications").onSnapshot(querySnapshot => {
        if (querySnapshot.empty)
            return socket.emit("notifications", [])
    
        let notifications = []
    
        querySnapshot.forEach(notification => {
            let notificationObj = notification.data()
            notificationObj.id = notification.id
            notifications.push(notificationObj)
        })

        socket.emit("notifications", notifications)
    }, error => {
        console.log(`Encountered error: ${error}`)
        socket.emit("notifications", "internal error")
    })

    const friendsObserver = db.collection('users').doc(userInfo.id).collection("friends").onSnapshot(querySnapshot => {
        if (querySnapshot.empty)
            return socket.emit("friends", [])
            
        let friends = []
        const size = querySnapshot._size
        let index = 0
    
        querySnapshot.forEach(async doc => {
            index++

            let friend
            try {
                friend = await db.collection('users').doc(doc.id).get();
            } catch (error) {
                console.log("error get friend", error)
                socket.emit("friends", "internal error")
            }

            if (!friend.exists) {
                console.log("error friend !exists")
                socket.emit("friends", "internal error")
            }

            const friendData = friend.data()
            friendData.id = doc.id
            
            friends.push(friendData)

            if (size === index)
                socket.emit("friends", friends)
        })
    }, error => {
        console.log(`Encountered error: ${error}`)
        socket.emit("friends", "internal error")
    })

    const friendsInvitedObserver = db.collection('users').doc(userInfo.id).collection("friend-invited").onSnapshot(querySnapshot => {
        if (querySnapshot.empty)
            return socket.emit("friendsInvited", [])

        let friends = []
        const size = querySnapshot._size
        let index = 0

        querySnapshot.forEach(async doc => {
            index++

            let friend
            try {
                friend = await db.collection('users').doc(doc.id).get();
            } catch (error) {
                console.log("error get friend", error)
                socket.emit("friendsInvited", "internal error")
            }

            if (!friend.exists) {
                console.log("error friend !exists")
                socket.emit("friendsInvited", "internal error")
            }

            const friendData = friend.data()
            friendData.id = doc.id
            delete friendData.refresh_token
            delete friendData.lastAccess
            delete friendData.email
            
            friends.push(friendData)

            if (size === index)
                socket.emit("friendsInvited", friends)
        })
    }, error => {
        console.log(`Encountered error: ${error}`)
        socket.emit("friendsInvited", "internal error")
    })

    const friendsInvitedByObserver = db.collection('users').doc(userInfo.id).collection("friend-invited-by").onSnapshot(querySnapshot => {
        if (querySnapshot.empty)
            return socket.emit("friendsInvitedBy", [])

        let friends = []
        const size = querySnapshot._size
        let index = 0

        querySnapshot.forEach(async doc => {
            index++

            let friend
            try {
                friend = await db.collection('users').doc(doc.id).get();
            } catch (error) {
                console.log("error get friend", error)
                socket.emit("friendsInvitedBy", "internal error")
            }

            if (!friend.exists) {
                console.log("error friend !exists")
                socket.emit("friendsInvitedBy", "internal error")
            }

            const friendData = friend.data()
            friendData.id = doc.id
            delete friendData.refresh_token
            delete friendData.lastAccess
            delete friendData.email
            
            friends.push(friendData)

            if (size === index)
                socket.emit("friendsInvitedBy", friends)
        })
    }, error => {
        console.log(`Encountered error: ${error}`)
        socket.emit("friendsInvitedBy", "internal error")
    })
    
    socket.on('disconnect', () => {
        notificationsObserver()
        friendsObserver()
        friendsInvitedObserver()
        friendsInvitedByObserver()
    })
})


app.get('/:friendId', async (req, res) => {
    const friendId = req.params.friendId
    const access_token = req.cookies.access_token
    const refresh_token = req.cookies.refresh_token

    let userInfo = await spotify.getUserInfo(access_token, refresh_token)
    if (userInfo.error) {
        res.clearCookie("access_token")
        return res.redirect(`/refresh_token?then=${friendId}`)
    }

    let check
    try {
        check = await db.collection('users').doc(userInfo.id).collection('friends').doc(friendId).get()
    } catch (error) {
        console.log(error)
        return res.status(500).send("error checking user")
    }

    if (!check.exists)
        return res.status(403).send(`${friendId} non è tuo amico o non esiste`)


    let friend
    try {
        friend = await db.collection('users').doc(friendId).get()
    } catch (error) {
        console.log(error)
        return res.status(500).send("error checking user")
    }

    let friendData = friend.data()

    let tokens
    try {
        tokens = await request({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                Authorization: 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            form: {
                refresh_token: friendData.refresh_token,
                grant_type: 'refresh_token'
            },
            json: true
        })
    } catch (error) {
        console.log("error request tokens", error)
        return res.status(403).send("refresh_token non valido, l'utente proprietario protrebbe averlo disabilitato. potrai continuare a vedere la sua attività quando esso eseguirà il login nuovamente")
    }
        
    res.setHeader("Content-Type", "text/html")
    return res.send(resultpage(tokens.access_token, friendData)) //friend result
})


app.get("*", (req, res) => {
    res.setHeader("Content-Type", "text/html")
    res.status(404).send("404 page not found")
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`listening on port ${port} in ${app.get("env")} mode...`)
})