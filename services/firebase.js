const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const credentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

initializeApp({
    credential: cert(credentials)
})

const db = getFirestore()

async function addNotifications(userId, text = "", action) {
    let notifications = {
        addedAt: Math.trunc(new Date().getTime()/1000),
        text,
    }

    if (action)
        notifications.action = action

    try {
        await db.collection('users').doc(userId).collection('notifications').add(notifications)
    } catch (error) {
        console.log(error)
        return {
            error: "error sending notifications"
        }
    }

    return {
        status: 200
    }
}

async function retrieveNotifications(userId) {
    let notificationsQuerySnapshot
    try {
        notificationsQuerySnapshot = await db.collection('users').doc(userId).collection('notifications').orderBy('addedAt', 'desc').get();
    } catch (error) {
        console.log(error)
        return {
            error: "db error"
        }
    }

    if (notificationsQuerySnapshot.empty)
        return []

    let notifications = []

    notificationsQuerySnapshot.forEach(async notification => {
        let notificationObj = notification.data()
        notificationObj.id = notification.id
        notifications.push(notificationObj)
    })

    return notifications
}



module.exports = { db, addNotifications, retrieveNotifications }