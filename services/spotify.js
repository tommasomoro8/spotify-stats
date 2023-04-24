const request = require("request-promise-native")
const { db } = require("./firebase")

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

    let dbUserInfo = {
        display_name: userInfo.display_name,
        email: userInfo.email,
        lastAccess: Math.trunc(new Date().getTime()/1000)
    }

    if (userInfo.images && userInfo.images.length >=1 && userInfo.images[0].url)
        dbUserInfo.imageUrl = userInfo.images[0].url

    if (refresh_token)
        dbUserInfo.refresh_token = refresh_token

    try {
        await db.collection('users').doc(userInfo.id).set(dbUserInfo, { merge: true });
    } catch (error) {
        console.log("error database userInfo", error)
        return { error }
    }

    return userInfo
}

module.exports = { getUserInfo }