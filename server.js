const querystring = require("querystring")
const request = require("request-promise-native")
const cookieParser = require("cookie-parser")
const cookie = require("cookie")
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const express = require("express")
const app = express()

const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

require('dotenv').config()
const dev = process.env.NODE_ENV === 'development'

const { db, logError } = require("./services/firebase")
const spotify = require("./services/spotify")
const generateRandomString = require("./services/randString")

/* routes */
const { router: friends } = require('./routes/friends')
const notifications = require('./routes/notifications')

/* views */
const landingpage = require('./views/landing')
const homepage = require('./views/home')
const errorpage = require('./views/error')
const adminpage = require('./views/admin')

/* downloads */
const pythonscript = require('./downloads/python-script')

/* middleware */
const secureHttps = require("./middleware/secureHttps")
const removeLastSlash = require("./middleware/removeLastSlash")

const client_id = process.env.CLIENT_ID_SPOTIFY;
const client_secret = process.env.CLIENT_SECRET_SPOTIFY;
const redirect_uri = process.env.REDIRECT_URI_SPOTIFY;

const connectionAlives = []
const adminConnectionAlives = []

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.socket.io"],
            imgSrc: ["'self'", "https://i.scdn.co", "https://upload.wikimedia.org"],
            connectSrc: ["'self'", "https://api.spotify.com"],
            scriptSrcAttr: ["'unsafe-inline'"],
            mediaSrc: ["https://p.scdn.co"]
        },
    }
}))
app.use(rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    message: 'Too many requests from this IP, please try again later',
    handler: (req, res) => {
        logError(429, "Too Many Requests", req.path, req.ip)

        res.setHeader("Content-Type", "text/html")
        res.status(429).send('<b>429 - Too Many Requests</b><br>Too many requests from this IP, please try again later')
    }
}))
app.set("trust proxy", true)
app.use(secureHttps(dev))
app.use(cookieParser())
app.use(removeLastSlash)

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
    try {
        userInfo.imageUrl = userInfo.images[0].url
    } catch (e) {}

    res.setHeader("Content-Type", "text/html")
    res.send(homepage(userInfo, userInfo, access_token))
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
        })
    )
})


app.get('/logout', (req, res) => {
    res.clearCookie("access_token")
    res.clearCookie("refresh_token")

    res.redirect("/")
})


app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
  
    if (state === null) {
        logError(401, "state_mismatch", req.path, "")

        res.setHeader("Content-Type", "text/html")
        return res.status(401).send(errorpage("401 - Unauthorized", "state_mismatch", "401"))
    }

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
        logError(500, "error request tokens", req.path, "", error)

        res.setHeader("Content-Type", "text/html")
        return res.status(500).send(errorpage("500 - Internal error", "That’s all we know.", "500"))
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

        if (req.query.result === "string") {
            res.setHeader("Content-Type", "text/html")
            return res.status(401).send(errorpage("401 - Unauthorized", "That’s all we know.", "401"))
        }

        return res.redirect("/")
    }

    let userInfo = await spotify.getUserInfo(tokens.access_token)
    if (userInfo.error) {
        if (req.query.result !== "string") {
            res.clearCookie("access_token")
            res.clearCookie("refresh_token")
        }

        if (req.query.result === "string") {
            res.setHeader("Content-Type", "text/html")
            return res.status(401).send(errorpage("401 - Unauthorized", "That’s all we know.", "401"))
        }

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


app.get("/admin", async (req, res) => {
    const access_token = req.cookies.access_token
    const refresh_token = req.cookies.refresh_token

    if (!access_token && !refresh_token)
        return res.redirect("/login")

    if (!access_token && refresh_token)
        return res.redirect("/refresh_token?then=admin")


    let userInfo = await spotify.getUserInfo(access_token)
    if (userInfo.error) {
        res.clearCookie("access_token")
        return res.redirect("/refresh_token?then=admin")
    }

    if (userInfo.id !== process.env.ADMIN_SPOTIFY_ID) {
        logError(403, "admin panel access attempt", req.path, userInfo.id)
        
        res.setHeader("Content-Type", "text/html")
        return res.status(403).send(errorpage("403 - Forbidden", "Non hai i poteri per accedere a questa risorsa.", "403"))
    }

    if (req.query["user-activity"]) {
        const friendId = req.query["user-activity"]
    
        let friend
        try {
            friend = await db.collection('users').doc(friendId).get()
        } catch (error) {
            logError(500, "admin user-activity error", req.path, userInfo.id, error)

            res.setHeader("Content-Type", "text/html")
            return res.status(500).send(errorpage("500 - Internal error", "That’s all we know.", "500"))
        }
    
        let friendData = friend.data()

        if (!friendData) {
            res.setHeader("Content-Type", "text/html")
            return res.status(404).send(errorpage("404 - Utente non trovato", `Non esiste nessun utente con id "${friendId}"`, "404"))
        }
    
        friendData.id = friendId
    
        let snapshot
        try {
            snapshot = await db.collection('users').doc(friendId).collection("friends").count().get();
        } catch (error) {
            logError(500, "admin database user-activity friends number", req.path, userInfo.id, error)
            
            res.setHeader("Content-Type", "text/html")
            return res.status(500).send(errorpage("500 - Internal error", "That’s all we know.", "500"))
        }
        friendData.friendsNum = snapshot.data().count || 0
    
    
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
            res.setHeader("Content-Type", "text/html")
            return res.status(403).send(errorpage("403 - Forbidden", `Non potrai vedere l'attività di ${friendData.display_name} fin quando non eseguirà nuovamente il login.`, "403"))
        }
            
        res.setHeader("Content-Type", "text/html")
        return res.send(homepage(userInfo, friendData, tokens.access_token, true)) //user result
    }


    const data = {}

    let totalConnectionsLen = 0
    for (let i = 0; i < connectionAlives.length; i++)
        totalConnectionsLen += connectionAlives[i].devicesConnected.length

    data.userConnected = connectionAlives
    data.userConnectedLen = connectionAlives.length
    data.totalConnectionsLen = totalConnectionsLen

    let usersCount
    try {
        usersCount = await db.collection('users').count().get();
    } catch (error) {
        logError(500, "error database usersCount", req.path, userInfo.id, error)

        res.setHeader("Content-Type", "text/html")
        return res.status(500).send(errorpage("500 - Internal error", "That’s all we know", "500"))
    }
    data.usersCount = usersCount.data().count || 0


    let lastUsersOffline
    try {
        lastUsersOffline = await db.collection("users").orderBy("lastAccess", "desc").limit(10).get();

        const usersOfflineData = []

        lastUsersOffline.forEach(lastUserOffline => {
            let obj = lastUserOffline.data()
            obj.id = lastUserOffline.id
            delete obj.refresh_token

            usersOfflineData.push(obj)
        })
        data.lastUsersOffline = usersOfflineData
    } catch (error) {
        logError(500, "error database lastUsersOffline", req.path, userInfo.id, error)

        res.setHeader("Content-Type", "text/html")
        return res.status(500).send(errorpage("500 - Internal error", "That’s all we know", "500"))
    }

    res.setHeader("Content-Type", "text/html")
    res.send(adminpage(data, access_token))
})


function emitToAdmins(event, message) {
    for (let i = 0; i < adminConnectionAlives.length; i++)
        adminConnectionAlives[i].socket.emit(event, message)
}

io.of("/admin").on('connection', async socket => {
    let access_token
    try {
        access_token = cookie.parse(socket.handshake.headers.cookie).access_token
    } catch (error) {
        logError(400, "websocket admin panel access attempt without access_token", "websocket /admin", "", error)
    }

    if (access_token === undefined || access_token === null)
        return socket.disconnect()
    
    let userInfo = await spotify.getUserInfo(access_token)
    if (userInfo.error || userInfo.id !== process.env.ADMIN_SPOTIFY_ID) {
        logError(403, "websocket admin panel access attempt", "websocket /admin", "", userInfo.error)
        return socket.disconnect()
    }


    let usersCountObserver
    try {
        usersCountObserver = db.collection('users').onSnapshot(querySnapshot => {
            socket.emit("usersCount", querySnapshot._size)
        }, error => {
            logError(500, "websocket admin panel usersCountObserver", "websocket /admin", userInfo.id, error)
            socket.emit("usersCount", "internal error")
        })
    } catch (error) {
        logError(500, "websocket admin panel usersCountObserver", "websocket /admin", userInfo.id, error)
        socket.emit("socket error", "internal error")
    }


    let logObserver
    try {
        logObserver = db.collection('log').orderBy('time', 'desc').limit(30).onSnapshot(querySnapshot => {
            if (querySnapshot.empty)
                return socket.emit("log", [])
        
            let log = []
        
            querySnapshot.forEach(querySnapshotLog => {
                let logObj = querySnapshotLog.data()
                logObj.id = querySnapshotLog.id
                if (!logObj.hide)
                    log.push(logObj)
            })
    
            socket.emit("log", log)
        }, error => {
            logError(500, "websocket admin panel logObserver", "websocket /admin", userInfo.id, error)
            socket.emit("log", "internal error")
        })
    } catch (error) {
        logError(500, "websocket admin panel logObserver", "websocket /admin", userInfo.id, error)
        socket.emit("socket error", "internal error")
    }

    adminConnectionAlives.push({
        id: socket.conn.id,
        socket,
        userInfo
    })
    
    socket.on('disconnect', () => {
        logObserver()
        usersCountObserver()

        for (let i = 0; i < adminConnectionAlives.length; i++)
            if (adminConnectionAlives[i].id === socket.conn.id)
                adminConnectionAlives.splice(i, 1)
    })
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

function connectionAlivesSearch(id) {
    for (let i = 0; i < connectionAlives.length; i++)
        if (connectionAlives[i].id === id)
            return { contains: true, index: i }
    return { contains: false }
}

io.of("/").on('connection', async socket => {
    let access_token
    try {
        access_token = cookie.parse(socket.handshake.headers.cookie).access_token
    } catch (error) {
        logError(400, "websocket access attempt without access_token", "websocket", "", error)
    }

    if (access_token === undefined || access_token === null)
        return socket.disconnect()
    
    let userInfo = await spotify.getUserInfo(access_token)
    if (userInfo.error) {
        logError(403, "websocket access attempt", "websocket", "", userInfo.error)
        return socket.disconnect()
    }
    
    let notificationsObserver
    let friendsObserver
    let friendsInvitedObserver
    let friendsInvitedByObserver

    try {
            
        notificationsObserver = db.collection('users').doc(userInfo.id).collection("notifications").onSnapshot(querySnapshot => {
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
            logError(500, "websocket notificationsObserver", "websocket", userInfo.id, error)
            socket.emit("notifications", "internal error")
        })

        friendsObserver = db.collection('users').doc(userInfo.id).collection("friends").onSnapshot(querySnapshot => {
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
                    logError(500, "websocket error get friend", "websocket", userInfo.id, error)
                    socket.emit("friends", "internal error")
                }

                if (!friend.exists) {
                    logError(400, "websocket friend does not exists", "websocket", userInfo.id)
                    socket.emit("friends", "internal error")
                }

                const friendData = friend.data()
                friendData.id = doc.id
                delete friendData.refresh_token
                
                friends.push(friendData)

                if (size === index)
                    socket.emit("friends", friends)
            })
        }, error => {
            logError(500, "websocket friendsObserver error", "websocket", userInfo.id, error)
            socket.emit("friends", "internal error")
        })

        friendsInvitedObserver = db.collection('users').doc(userInfo.id).collection("friend-invited").onSnapshot(querySnapshot => {
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
                    logError(500, "websocket error get friend", "websocket", userInfo.id, error)
                    socket.emit("friendsInvited", "internal error")
                }

                if (!friend.exists) {
                    logError(400, "websocket friend does not exists", "websocket", userInfo.id)
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
            logError(500, "websocket friendsInvitedObserver error", "websocket", userInfo.id, error)
            socket.emit("friendsInvited", "internal error")
        })

        friendsInvitedByObserver = db.collection('users').doc(userInfo.id).collection("friend-invited-by").onSnapshot(querySnapshot => {
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
                    logError(500, "websocket error get friend", "websocket", userInfo.id, error)
                    socket.emit("friendsInvitedBy", "internal error")
                }

                if (!friend.exists) {
                    logError(400, "websocket friend does not exists", "websocket", userInfo.id)
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
            logError(500, "websocket friendsInvitedByObserver error", "websocket", userInfo.id, error)
            socket.emit("friendsInvitedBy", "internal error")
        })
        
    } catch (error) {
        console.log("socket error", error)
    }
    
    const deviceConnected = {
        id: socket.conn.id,
        client: socket.handshake.headers
    }

    try {
        delete deviceConnected.client.cookie
    } catch (e) {}

    let connectionAlivesSearchRes = connectionAlivesSearch(userInfo.id)
    if (!connectionAlivesSearchRes.contains) {
        const userConnected = {
            id: userInfo.id,
            userInfo,
            connectionTime: Math.trunc((new Date()).getTime()/1000),
            devicesConnected: [deviceConnected]
        }

        connectionAlives.push(userConnected)
        
        emitToAdmins("connectionAlives", {
            event: "connection",
            action: "add-userConnected",
            body: {
                userConnected
            }
        })
    } else {
        connectionAlives[connectionAlivesSearchRes.index].devicesConnected.push(deviceConnected)

        emitToAdmins("connectionAlives", {
            event: "connection",
            action: "add-deviceConnected-to-userConnected",
            body: {
                userConnected: connectionAlives[connectionAlivesSearchRes.index],
                deviceConnected: deviceConnected
            }
        })
    }



    socket.on('disconnect', () => {
        notificationsObserver()
        friendsObserver()
        friendsInvitedObserver()
        friendsInvitedByObserver()

        let connectionAlivesSearchRes = connectionAlivesSearch(userInfo.id)
        if (connectionAlivesSearchRes.contains) {
            if (connectionAlives[connectionAlivesSearchRes.index].devicesConnected.length === 1) {
                emitToAdmins("connectionAlives", {
                    event: "disconnect",
                    action: "remove-userConnected",
                    body: {
                        userConnected: connectionAlives[connectionAlivesSearchRes.index]
                    }
                })

                connectionAlives.splice(connectionAlivesSearchRes.index, 1)
            }
            else {
                for (let i = 0; i < connectionAlives[connectionAlivesSearchRes.index].devicesConnected.length; i++) {
                    if (connectionAlives[connectionAlivesSearchRes.index].devicesConnected[i].id === socket.conn.id) {

                        const deviceConnected = connectionAlives[connectionAlivesSearchRes.index].devicesConnected[i]

                        connectionAlives[connectionAlivesSearchRes.index].devicesConnected.splice(i, 1)

                        emitToAdmins("connectionAlives", {
                            event: "disconnect",
                            action: "remove-deviceConnected-in-userConnected",
                            body: {
                                userConnected: connectionAlives[connectionAlivesSearchRes.index],
                                deviceConnected
                            }
                        })
                    }
                }
            }
        }
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
    try {
        userInfo.imageUrl = userInfo.images[0].url
    } catch (e) {}

    if (friendId === userInfo.id)
        return res.redirect("/")

    let check
    try {
        check = await db.collection('users').doc(userInfo.id).collection('friends').doc(friendId).get()
    } catch (error) {
        logError(500, "check error", req.path, userInfo.id, error)

        res.setHeader("Content-Type", "text/html")
        return res.status(500).send(errorpage("500 - Internal error", "That’s all we know.", "500"))
    }

    if (!check.exists) {
        res.setHeader("Content-Type", "text/html")
        return res.status(403).send(errorpage("403 - Forbidden", `${friendId} non è tuo amico o non esiste.`, "403"))
    }


    let friend
    try {
        friend = await db.collection('users').doc(friendId).get()
    } catch (error) {
        logError(500, "friend retrieve error", req.path, userInfo.id, error)

        res.setHeader("Content-Type", "text/html")
        return res.status(500).send(errorpage("500 - Internal error", "That’s all we know.", "500"))
    }

    let friendData = friend.data()

    friendData.id = friendId

    let snapshot
    try {
        snapshot = await db.collection('users').doc(friendId).collection("friends").count().get();
    } catch (error) {
        logError(500, "error database friends number", req.path, userInfo.id, error)

        res.setHeader("Content-Type", "text/html")
        return res.status(500).send(errorpage("500 - Internal error", "That’s all we know.", "500"))
    }
    friendData.friendsNum = snapshot.data().count || 0


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
        logError(500, "error request friend token", req.path, userInfo.id, error)

        res.setHeader("Content-Type", "text/html")
        return res.status(403).send(errorpage("403 - Forbidden", `Non potrai vedere l'attività di ${friendData.display_name} fin quando non eseguirà nuovamente il login.`, "403"))
    }
        
    res.setHeader("Content-Type", "text/html")
    return res.send(homepage(userInfo, friendData, tokens.access_token)) //friend result
})


app.get("*", (req, res) => {
    res.setHeader("Content-Type", "text/html")
    res.status(404).send(errorpage("404 - Pagina non trovata", "E' tutto quello che sappiamo", "404", req))
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    logError(500, "fatal error", req.path, "", err.stack)

    res.setHeader("Content-Type", "text/html")
    res.status(500).send(errorpage("500 - Internal error", "That’s all we know", "500"))
})

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`listening on port ${port} in ${process.env.NODE_ENV} mode...`)
})