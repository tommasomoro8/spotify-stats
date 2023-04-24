const querystring = require("querystring")
const request = require("request-promise-native")
const cookieParser = require("cookie-parser")

const express = require("express")
const app = express()

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

/* middleware */
const secureHttps = require("./middleware/secureHttps")

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

    let friendL = []
    let invitedL = []
    let invitedByL = []
    let index = 0

    function sendResponse() {
        if (friendL === undefined || invitedL === undefined || invitedByL === undefined)
            return res.status(500).send("retrieve friends error")

        res.setHeader("Content-Type", "text/html")
        res.send(homepage(userInfo, friendL, invitedL, invitedByL, access_token))
    }

    friendList(userInfo, (_friends) => {
        index++

        if (_friends.error)
            friendL = undefined

        friendL = _friends

        if (index === 3) 
            sendResponse()
    })
    invitedList(userInfo, (_invited) => {
        index++
        
        if (_invited.error)
            invitedL = undefined

        invitedL = _invited
        
        if (index === 3)
            sendResponse()
    })
    invitedByList(userInfo, (_invitedBy) => {
        index++
        
        if (_invitedBy.error)
            invitedByL = undefined

        invitedByL = _invitedBy

        if (index === 3) 
            sendResponse()
    })
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

    res.cookie("access_token", tokens.access_token, { maxAge: 60 * 60 * 1 * 1000 /* 1h */, httpOnly: true, secure: true, SameSite: 'strict' })
    res.cookie("refresh_token", tokens.refresh_token, { maxAge: 60 * 60 * 87600 * 1000 /* 1y */, httpOnly: true, secure: true, SameSite: 'strict' })

    return res.redirect("/")
})



app.get('/refresh_token', async (req, res) => {
    const refresh_token = req.query.refresh_token || req.cookies.refresh_token

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
        res.clearCookie("access_token")
        res.clearCookie("refresh_token")
        return res.redirect("/")
    }

    let userInfo = await spotify.getUserInfo(tokens.access_token)
    if (userInfo.error) {
        res.clearCookie("access_token")
        res.clearCookie("refresh_token")
        return res.redirect("/")
    }

    res.cookie("access_token", tokens.access_token, { maxAge: 60 * 60 * 1 * 1000 /* 1h */, httpOnly: true, secure: true, SameSite: 'strict' })
            
    if (req.query.then)
        return res.redirect("/"+req.query.then)

    return res.redirect("/")
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
app.listen(port, () => {
    console.log(`listening on port ${port} in ${app.get("env")} mode...`)
}) //export NODE_ENV=production or development