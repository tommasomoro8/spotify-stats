const { db, retrieveNotifications } = require("../services/firebase")
const spotify = require("../services/spotify")

const express = require("express")
const router = express.Router()
/*
//DA LEVARE
router.get("/list", async (req, res) => {
    const access_token = req.cookies.access_token

    let userInfo = await spotify.getUserInfo(access_token)
    if (userInfo.error) {
        res.clearCookie("access_token")
        return res.redirect("/refresh_token")
    }

    let notifications = await retrieveNotifications(userInfo.id)

    if (notifications.error)
        return res.status(500).send(notifications.error)

    res.send(notifications)
})
*/
router.post("/delete/:notificationId", async (req, res) => {
    const access_token = req.cookies.access_token
    const notificationId = req.params.notificationId

    if (!notificationId)
        return res.sendStatus(400)

    let userInfo = await spotify.getUserInfo(access_token)
    if (userInfo.error) {
        res.clearCookie("access_token")
        return res.redirect("/refresh_token")
    }

    let notification
    try {
        notification = await db.collection('users').doc(userInfo.id).collection('notifications').doc(notificationId).get();
    } catch (error) {
        console.log(error)
        return res.status(500).send("db error")
    }

    if (!notification.exists)
        return res.status(404).send(`notification with id: '${notificationId}' does not exist`)

    try {
        await db.collection('users').doc(userInfo.id).collection('notifications').doc(notificationId).delete()
    } catch (error) {
        console.log(error)
        return res.status(500).send("db error")
    }

    res.send("done")
})

module.exports = router

/*
let notifications = await addNotifications(userInfo.id, "testo della notifica")
if (notifications.error)
    return res.status(500).send(notifications.error)
*/