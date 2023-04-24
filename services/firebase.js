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

async function addNotifications(userId) {
    try {
        await db.collection('users').doc(userId).collection('friend-invited').doc(friendId).set({}) //QUI
    } catch (error) {
        console.log(error)
        return res.status(500).send("database error")
    }
}


module.exports = { db, addNotifications }