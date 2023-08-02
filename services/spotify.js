const request = require("request-promise-native")
const { db } = require("./firebase")
const { FieldValue } = require('firebase-admin/firestore');

async function getUserInfo(access_token, refresh_token) {
    let userInfo
    try {
        userInfo = await request({
            method: 'get',
            url: 'https://api.spotify.com/v1/me',
            headers: {
              Authorization: 'Bearer  ' + access_token
            },
            json: true
        })
    } catch (error) {
        console.log("error request userInfo", error)
        return { error }
    }


    let snapshot
    try {
        snapshot = await db.collection('users').doc(userInfo.id).collection("friends").count().get();
    } catch (error) {
        console.log("error database friends number", error)
        return { error }
    }
    userInfo.friendsNum = snapshot.data().count || 0

    const lastAccess = Math.trunc(new Date().getTime()/1000)

    let dbUserInfo = {
        display_name: userInfo.display_name,
        email: userInfo.email,
        lastAccess
    }

    delete dbUserInfo.friendsNum

    if (refresh_token)
        dbUserInfo.refresh_token = refresh_token

    try {
        userInfo.images.sort((a,b) => b.width - a.width)
        dbUserInfo.imageUrl = userInfo.images[0].url
    } catch (error) {
        dbUserInfo.imageUrl = FieldValue.delete()
    }

    try {
        await db.collection('users').doc(userInfo.id).set(dbUserInfo, { merge: true });
    } catch (error) {
        console.log("error database userInfo", error)
        return { error }
    }

    userInfo.lastAccess = lastAccess

    return userInfo
}

module.exports = { getUserInfo }
