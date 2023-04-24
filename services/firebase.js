const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({
    credential: cert({
        type: process.env.TYPE,
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY,
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
    })
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