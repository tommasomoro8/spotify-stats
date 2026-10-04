const { db, addNotifications } = require("../services/firebase")
const spotify = require("../services/spotify")

const express = require("express")
const router = express.Router()

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
        logError(500, "error retrieving user", req.path, userInfo.id, error)
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
        logError(500, "error check1", req.path, userInfo.id, error)
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
        logError(500, "friend-invited-by friend-invited error", req.path, userInfo.id, error)
    }

    const notification = await addNotifications(friendId, `${userInfo.display_name} ti ha invitato ad essere suo amico!`)
    if (notification.error) {
        logError(500, "fnotifications error", req.path, userInfo.id, error)
        return res.status(500).send("notifications.error")
    }

    res.send("done")
})
//FINISCI DA QUI E PAGINA NOTIFICATION.JS

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
        logError(500, "retrieving user error", req.path, userInfo.id, error)
        return res.status(500).send("error retrieving user")
    }

    if (!friend.exists)
        return res.status(404).send(`the user "${friendId}" does not exist`)

    let check
    try {
        check = await db.collection('users').doc(userInfo.id).collection('friends').doc(friendId).get()
    } catch (error) {
        logError(500, "checking user error", req.path, userInfo.id, error)
        return res.status(500).send("error checking user")
    }

    if (!check.exists)
        return res.status(400).send(`${friendId} non è tuo amico`)

    try {
        await db.collection('users').doc(userInfo.id).collection('friends').doc(friendId).delete()
        await db.collection('users').doc(friendId).collection('friends').doc(userInfo.id).delete()
    } catch (error) {
        logError(500, "database error", req.path, userInfo.id, error)
        return res.status(500).send("database error")
    }

    const notification = await addNotifications(friendId, `${userInfo.display_name} ti ha rimosso dai suoi amici`)
    if (notification.error) {
        logError(500, "notifications error", req.path, userInfo.id, error)
        return res.status(500).send("notifications.error")
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
        logError(500, "retrieving user error", req.path, userInfo.id, error)
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
        logError(500, "checking user error", req.path, userInfo.id, error)
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
        logError(500, "database error", req.path, userInfo.id, error)
        return res.status(500).send("database error")
    }

    const notification = await addNotifications(friendId, `${userInfo.display_name} ha cancellato la sua richiesta di amicizia`)
    if (notification.error) {
        logError(500, "notifications error", req.path, userInfo.id, error)
        return res.status(500).send("notifications.error")
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
        logError(500, "retrieving user error", req.path, userInfo.id, error)
        return res.status(500).send("error retrieving user")
    }

    if (!friend.exists) {
        return res.status(404).send(`the user "${friendId}" does not exist`)
    }

    let isInvitedCheck
    try {
        isInvitedCheck = await db.collection('users').doc(userInfo.id).collection('friend-invited-by').doc(friendId).get()
    } catch (error) {
        logError(500, "checking user error", req.path, userInfo.id, error)
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
        logError(500, "database error", req.path, userInfo.id, error)
        return res.status(500).send("database error")
    }

    const notification = await addNotifications(friendId, `${userInfo.display_name} ha accettato la tua richiesta di amicizia!`)
    if (notification.error) {
        logError(500, "notifications error", req.path, userInfo.id, error)
        return res.status(500).send("notifications.error")
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
        logError(500, "retrieving user error", req.path, userInfo.id, error)
        return res.status(500).send("error retrieving user")
    }

    if (!friend.exists) {
        return res.status(404).send(`the user "${friendId}" does not exist`)
    }

    let isInvitedCheck
    try {
        isInvitedCheck = await db.collection('users').doc(userInfo.id).collection('friend-invited-by').doc(friendId).get()
    } catch (error) {
        logError(500, "checking user error", req.path, userInfo.id, error)
        return res.status(500).send("error checking user")
    }

    if (!isInvitedCheck.exists) {
        return res.status(400).send(`l'user ${friendId} non ti ha invitato a essere suo amico`)
    }

    try {
        await db.collection('users').doc(userInfo.id).collection('friend-invited-by').doc(friendId).delete()
        await db.collection('users').doc(friendId).collection('friend-invited').doc(userInfo.id).delete()
    } catch (error) {
        logError(500, "database error", req.path, userInfo.id, error)
        return res.status(500).send("database error")
    }

    const notification = await addNotifications(friendId, `${userInfo.display_name} ha rifiutato la tua richiesta di amicizia`)
    if (notification.error) {
        logError(500, "notifications error", req.path, userInfo.id, error)
        return res.status(500).send("notifications.error")
    }

    res.send("done")
})

module.exports = { router }