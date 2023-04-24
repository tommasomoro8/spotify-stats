const { db, addNotifications } = require("../services/firebase")
const spotify = require("../services/spotify")

const express = require("express")
const router = express.Router()


async function friendList(userInfo, callback = () => {}) {
    let friends = []

    let snapshot
    try {
        snapshot = await db.collection('users').doc(userInfo.id).collection("friends").get();
    } catch (error) {
        console.log(error)
        return {
            error
        }
    }
    
    if (!snapshot.empty) {
        let size = snapshot._size
        let index = 0

        snapshot.forEach(async doc => {
            index++

            let friend
            try {
                friend = await db.collection('users').doc(doc.id).get();
            } catch (error) {
                console.log("error get friend", error)
                callback({ error })
            }

            if (!friend.exists) {
                console.log("error friend !exists")
                callback({ error: "error friend !exists" })
            }

            const friendData = friend.data()
            friendData.id = doc.id
            
            friends.push(friendData)

            if (size === index)
                callback(friends)
        })
    } else callback([])
}


async function invitedList(userInfo, callback = () => {}) {
    let friends = []

    let snapshot
    try {
        snapshot = await db.collection('users').doc(userInfo.id).collection("friend-invited").get();
    } catch (error) {
        console.log(error)
        return {
            error
        }
    }
    
    if (!snapshot.empty) {
        let size = snapshot._size
        let index = 0

        snapshot.forEach(async doc => {
            index++

            let friend
            try {
                friend = await db.collection('users').doc(doc.id).get();
            } catch (error) {
                console.log("error get friend", error)
                callback({ error })
            }

            if (!friend.exists) {
                console.log("error friend !exists")
                callback({ error: "error friend !exists" })
            }

            const friendData = friend.data()
            friendData.id = doc.id
            delete friendData.refresh_token
            delete friendData.lastAccess
            delete friendData.email
            
            friends.push(friendData)

            if (size === index)
                callback(friends)
        })
    } else callback([])
}


async function invitedByList(userInfo, callback = () => {}) {
    let friends = []

    let snapshot
    try {
        snapshot = await db.collection('users').doc(userInfo.id).collection("friend-invited-by").get();
    } catch (error) {
        console.log(error)
        return {
            error
        }
    }
    
    if (!snapshot.empty) {
        let size = snapshot._size
        let index = 0

        snapshot.forEach(async doc => {
            index++

            let friend
            try {
                friend = await db.collection('users').doc(doc.id).get();
            } catch (error) {
                console.log("error get friend", error)
                callback({ error })
            }

            if (!friend.exists) {
                console.log("error friend !exists")
                callback({ error: "error friend !exists" })
            }

            const friendData = friend.data()
            friendData.id = doc.id
            delete friendData.refresh_token
            delete friendData.lastAccess
            delete friendData.email
            
            friends.push(friendData)

            if (size === index)
                callback(friends)
        })
    } else callback([])
}



router.post("/invite/:user", async (req, res) => {
    if (!req.params.user)
        return res.status(400).send("bad request, no user")

    let access_token = req.cookies.access_token

    let userInfo = await spotify.getUserInfo(access_token)
    if (userInfo.error) {
        res.clearCookie("access_token")
        return res.redirect("/refresh_token")
    }

    let friendId = req.params.user
    let friend

    if (userInfo.id === friendId)
        return res.status(400).send(`non puoi invitare te stesso`)

    try {
        friend = await db.collection('users').doc(friendId).get()
    } catch (error) {
        console.log(error)
        return res.status(500).send("error retrieving user")
    }

    if (!friend.exists)
        return res.status(404).send(`the user "${friendId}" does not exist`)

    let check1
    let check2
    let check3
    try {
        check1 = await db.collection('users').doc(friendId).collection('friend-invited-by').doc(userInfo.id).get()
        check2 = await db.collection('users').doc(userInfo.id).collection('friend-invited-by').doc(friendId).get()
        check3 = await db.collection('users').doc(userInfo.id).collection('friends').doc(friendId).get()
    } catch (error) {
        console.log(error)
        return res.status(500).send("error checking user")
    }

    if (check1.exists)
        return res.status(404).send(`l'user ${friendId} è già stato invitato`)
    if (check2.exists)
        return res.status(404).send(`sei già stato invitato da ${friendId}, accetta la sua richiesta di amicizia dalla home`)
    if (check3.exists)
        return res.status(400).send(`${friendId} è già tuo amico`)


    try {
        await db.collection('users').doc(friendId).collection('friend-invited-by').doc(userInfo.id).set({})
        await db.collection('users').doc(userInfo.id).collection('friend-invited').doc(friendId).set({})
    } catch (error) {
        console.log(error)
        return res.status(500).send("database error")
    }

    res.send("done")
})


router.post("/remove/:user", async (req, res) => {
    if (!req.params.user)
        return res.status(400).send("bad request, no user")

    let access_token = req.cookies.access_token

    let userInfo = await spotify.getUserInfo(access_token)
    if (userInfo.error) {
        res.clearCookie("access_token")
        return res.redirect("/refresh_token")
    }

    let friendId = req.params.user
    let friend

    if (userInfo.id === friendId)
        return res.status(400).send(`non puoi rimuovere te stesso`)

    try {
        friend = await db.collection('users').doc(friendId).get()
    } catch (error) {
        console.log(error)
        return res.status(500).send("error retrieving user")
    }

    if (!friend.exists)
        return res.status(404).send(`the user "${friendId}" does not exist`)

    let check
    try {
        check = await db.collection('users').doc(userInfo.id).collection('friends').doc(friendId).get()
    } catch (error) {
        console.log(error)
        return res.status(500).send("error checking user")
    }

    if (!check.exists)
        return res.status(400).send(`${friendId} non è tuo amico`)

    try {
        await db.collection('users').doc(userInfo.id).collection('friends').doc(friendId).delete()
        await db.collection('users').doc(friendId).collection('friends').doc(userInfo.id).delete()
    } catch (error) {
        console.log(error)
        return res.status(500).send("database error")
    }

    res.send("done")
})


router.post("/invite-cancel/:user", async (req, res) => {
    if (!req.params.user)
        return res.status(400).send("bad request, no user")

    let access_token = req.cookies.access_token

    let userInfo = await spotify.getUserInfo(access_token)
    if (userInfo.error) {
        res.clearCookie("access_token")
        return res.redirect("/refresh_token")
    }

    let friendId = req.params.user
    let friend

    if (userInfo.id === friendId)
        return res.status(400).send(`non puoi invitare te stesso`)

    try {
        friend = await db.collection('users').doc(friendId).get()
    } catch (error) {
        console.log(error)
        return res.status(500).send("error retrieving user")
    }

    if (!friend.exists)
        return res.status(404).send(`the user "${friendId}" does not exist`)

    let check1
    let check2
    let check3
    try {
        check1 = await db.collection('users').doc(friendId).collection('friend-invited-by').doc(userInfo.id).get()
        check2 = await db.collection('users').doc(userInfo.id).collection('friend-invited-by').doc(friendId).get()
        check3 = await db.collection('users').doc(userInfo.id).collection('friends').doc(friendId).get()
    } catch (error) {
        console.log(error)
        return res.status(500).send("error checking user")
    }

    if (!check1.exists || check2.exists)
        return res.status(404).send(`l'user ${friendId} non è stato invitato`)
    if (check3.exists)
        return res.status(400).send(`${friendId} è già tuo amico`)

    try {
        await db.collection('users').doc(userInfo.id).collection('friend-invited').doc(friendId).delete()
        await db.collection('users').doc(friendId).collection('friend-invited-by').doc(userInfo.id).delete()
    } catch (error) {
        console.log(error)
        return res.status(500).send("database error")
    }

    res.send("done")
})


router.post("/invite-accept/:user", async (req, res) => {
    if (!req.params.user)
        return res.status(400).send("bad request, no user")

    let access_token = req.cookies.access_token

    let userInfo = await spotify.getUserInfo(access_token)
    if (userInfo.error) {
        res.clearCookie("access_token")
        return res.redirect("/refresh_token")
    }

    let friendId = req.params.user
    let friend

    if (userInfo.id === friendId)
        return res.status(400).send(`non puoi accettare l'amicizia a te stesso`)

    try {
        friend = await db.collection('users').doc(friendId).get()
    } catch (error) {
        console.log(error)
        return res.status(500).send("error retrieving user")
    }

    if (!friend.exists) {
        return res.status(404).send(`the user "${friendId}" does not exist`)
    }

    let isInvitedCheck
    try {
        isInvitedCheck = await db.collection('users').doc(userInfo.id).collection('friend-invited-by').doc(friendId).get()
    } catch (error) {
        console.log(error)
        return res.status(500).send("error checking user")
    }

    if (!isInvitedCheck.exists) {
        return res.status(400).send(`l'user ${friendId} non ti ha invitato a essere suo amico`)
    }

    try {
        await db.collection('users').doc(friendId).collection('friends').doc(userInfo.id).set({})
        await db.collection('users').doc(userInfo.id).collection('friends').doc(friendId).set({})

        await db.collection('users').doc(userInfo.id).collection('friend-invited-by').doc(friendId).delete()
        await db.collection('users').doc(friendId).collection('friend-invited').doc(userInfo.id).delete()
    } catch (error) {
        console.log(error)
        return res.status(500).send("database error")
    }

    res.send("done")
})


router.post("/invite-decline/:user", async (req, res) => {
    if (!req.params.user)
        return res.status(400).send("bad request, no user")

    let access_token = req.cookies.access_token

    let userInfo = await spotify.getUserInfo(access_token)
    if (userInfo.error) {
        res.clearCookie("access_token")
        return res.redirect("/refresh_token")
    }

    let friendId = req.params.user
    let friend

    if (userInfo.id === friendId)
        return res.status(400).send(`non puoi accettare l'amicizia a te stesso`)

    try {
        friend = await db.collection('users').doc(friendId).get()
    } catch (error) {
        console.log(error)
        return res.status(500).send("error retrieving user")
    }

    if (!friend.exists) {
        return res.status(404).send(`the user "${friendId}" does not exist`)
    }

    let isInvitedCheck
    try {
        isInvitedCheck = await db.collection('users').doc(userInfo.id).collection('friend-invited-by').doc(friendId).get()
    } catch (error) {
        console.log(error)
        return res.status(500).send("error checking user")
    }

    if (!isInvitedCheck.exists) {
        return res.status(400).send(`l'user ${friendId} non ti ha invitato a essere suo amico`)
    }

    try {
        await db.collection('users').doc(userInfo.id).collection('friend-invited-by').doc(friendId).delete()
        await db.collection('users').doc(friendId).collection('friend-invited').doc(userInfo.id).delete()
    } catch (error) {
        console.log(error)
        return res.status(500).send("database error")
    }

    res.send("done")
})


router.get("/list", async (req, res) => {
    let access_token = req.cookies.access_token

    let userInfo = await spotify.getUserInfo(access_token)
    if (userInfo.error) {
        res.clearCookie("access_token")
        return res.redirect("/refresh_token")
    }

    await friendList(userInfo, (friends) => {
        if (friends.error)
            return res.status(500).send("retrieve friends error")
    
        res.send(friends)
    })
})


router.get("/invited-list", async (req, res) => { //chi ho invitato io a essere mio amico
    let access_token = req.cookies.access_token

    let userInfo = await spotify.getUserInfo(access_token)
    if (userInfo.error) {
        res.clearCookie("access_token")
        return res.redirect("/refresh_token")
    }

    await invitedList(userInfo, (friends) => {
        if (friends.error)
            return res.status(500).send("retrieve invitedList error")
    
        res.send(friends)
    })
})


router.get("/invited-by-list", async (req, res) => { //chi mi ha invitato a essere suo amico
    let access_token = req.cookies.access_token

    let userInfo = await spotify.getUserInfo(access_token)
    if (userInfo.error) {
        res.clearCookie("access_token")
        return res.redirect("/refresh_token")
    }

    await invitedByList(userInfo, (friends) => {
        if (friends.error)
            return res.status(500).send("retrieve invitedList error")
    
        res.send(friends)
    })
})


module.exports = { router, friendList, invitedList, invitedByList }