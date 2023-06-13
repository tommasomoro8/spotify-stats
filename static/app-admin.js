let data = JSON.parse(document.getElementById("hidden-init-data").innerText); document.getElementById("hidden-init-data").remove()
const access_token = JSON.parse(document.getElementById("hidden-access-token").innerText); document.getElementById("hidden-access-token").remove()
console.log(data)

const dividers = [1, 1000, 60, 60, 24, 30, 12]
const dividersName = ["now", "seconds", "minutes", "hours", "days", "months", "years"]
const dividersNameIta = ["Ora", ["secondi fa", "secondo fa"], ["minuti fa", "minuto fa"], ["ore fa", "ora fa"], ["giorni fa", "giorno fa"], ["mesi fa", "mese fa"], ["anni fa", "anno fa"]]
const monthIta = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

function seeTimeDifference(time, returnMs = false) {
    const now = new Date().getTime()
    const song = new Date(time).getTime()

    let value = now - song

    if (returnMs)
        return value

    for (let i = 0; i < dividers.length; i++) {
        if (value/dividers[i] < 1) {
            return {
                value,
                measureOfTime: dividersName[i-1],
                measureOfTimeNum: i-1,
                nowDate: now,
                songDate: song,
            }
        }
        value = value/dividers[i]
    }

    return {
        value,
        measureOfTime: dividersName[dividers.length-1],
        measureOfTimeNum: dividers.length-1,
        nowDate: now,
        songDate: song,
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// min (inclusive) - max (exclusive)
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}


async function getArtistRandomImg() {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer  ${access_token}`);
    
    let result = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&time_range=short_term`, {
        method: 'GET',
        headers: myHeaders,
        redirect: "follow"
    })
    
    if (result.status !== 200) return

    result = await result.json()
    
    let img = []
    let indexes = []
    let loopNum = 0

    for (let i = 0; i < 8; i++) {
        if (loopNum > result.total)
            return undefined
        loopNum ++

        let whileNum = 0
        let randomIndex
        do {
            if (whileNum > result.total)
                return undefined
            whileNum++
            randomIndex = getRandomInt(0, result.total)  
        } while (indexes.includes(randomIndex))
        indexes.push(randomIndex)
        
        try {
            img.push(result.items[randomIndex].images[0].url)
        } catch (error) {
            i--
            continue
        }
    }

    return img
}

(async () => {
    let imgCollection = document.getElementsByClassName("top-left-img")
    let imgList = await getArtistRandomImg()
    for (let i = 0; i < imgList.length; i++) {
        imgCollection[i].src = imgList[i]
    }

    for (let i = 0; i < imgList.length; i++) {
        setTimeout(() => {
            imgCollection[i].classList.add("show")
        }, getRandomInt(50, 120)*i);
    }
})()




function addErrorLog(error) {
    console.log(error)
    const div = document.createElement("div")
    div.classList.add("last-stream-track", "right", error.id)

        const spanoutside = document.createElement("div")
        spanoutside.classList.add("spanoutsiderow")

            const divLeft = document.createElement("div")
            divLeft.classList.add("last-stream-track-left")

                const divLeftdiv1 = document.createElement("span")
                divLeftdiv1.classList.add("last-stream-track-img", "admin", "error-num", (error.status >= 500) ? "error-code-500" : "error-code-400")
                divLeftdiv1.innerText = error.status
                divLeft.append(divLeftdiv1)

                const divLeftdiv2 = document.createElement("span")
                divLeftdiv2.classList.add("last-stream-track-txt")

                    const divLeftdiv2div1 = document.createElement("span")
                    divLeftdiv2div1.classList.add("last-stream-track-title")
                    divLeftdiv2div1.innerText = capitalizeFirstLetter(error.errorName)
                    divLeftdiv2.append(divLeftdiv2div1)

                    const divLeftdiv2div2 = document.createElement("span")
                    divLeftdiv2div2.classList.add("last-stream-track-artist")
                    divLeftdiv2div2.innerText = error.url
                    divLeftdiv2.append(divLeftdiv2div2)

                divLeft.append(divLeftdiv2)

            spanoutside.append(divLeft)


            const spanRight = document.createElement("span")
            spanRight.classList.add("last-stream-track-right-admin-span", "row")

                const spanRightdiv1 = document.createElement("div")
                spanRightdiv1.classList.add("last-stream-track-right")
                spanRight.append(spanRightdiv1)

                function modifyTime() {
                    const time = seeTimeDifference(error.time * 1000)
                    if (time.measureOfTimeNum === 0 || time.measureOfTimeNum === 1)
                        spanRightdiv1.innerText = dividersNameIta[0]
                    else {
                        spanRightdiv1.innerText = `${Math.trunc(time.value)} ${dividersNameIta[time.measureOfTimeNum][+(Math.trunc(time.value) === 1)]}`
                    }
                }

                modifyTime()
                setInterval(modifyTime, 60000)

                const spanRightdiv2 = document.createElement("div")
                spanRightdiv2.classList.add("last-stream-track-right", "admin")
                spanRight.append(spanRightdiv2)

            spanoutside.append(spanRight)

        div.append(spanoutside)


        const divunder = document.createElement("div")
        divunder.classList.add("last-stream-track", "right", "show", "open", "fillbottom", "last-stream-track-content")

            const divunderUserReference = document.createElement("div")

                const divunderUserReferenceSpan1 = document.createElement("span")
                divunderUserReferenceSpan1.classList.add("column")
                divunderUserReferenceSpan1.style.fontWeight = 500

                    const divunderUserReferenceSpan1row = document.createElement("span")
                    divunderUserReferenceSpan1row.classList.add("row")

                        const divunderUserReferenceSpan2 = document.createElement("span")
                        divunderUserReferenceSpan2.classList.add("txt-grey")
                        divunderUserReferenceSpan2.innerHTML = "User Reference:&nbsp"
                        if (error.user_reference)
                            divunderUserReferenceSpan1row.append(divunderUserReferenceSpan2)

                        const divunderUserReferenceSpan3 = document.createElement("span")
                        divunderUserReferenceSpan3.id = `${error.user_reference}-action`
                        divunderUserReferenceSpan3.innerText = error.user_reference
                        divunderUserReferenceSpan3.addEventListener("click", () => {
                            window.location.href = "/admin?user-activity=" + error.user_reference
                        })
                        divunderUserReferenceSpan3.classList.add("pointer")
                        if (error.user_reference)
                            divunderUserReferenceSpan1row.append(divunderUserReferenceSpan3)

                    divunderUserReferenceSpan1.append(divunderUserReferenceSpan1row)

                    const divunderUserReferenceSpan1showmore = document.createElement("div")
                    divunderUserReferenceSpan1showmore.classList.add("seemore-el")
                    divunderUserReferenceSpan1showmore.innerText = "Show more"
                    divunderUserReferenceSpan1showmore.addEventListener("click", () => {
                        window.open(`https://console.firebase.google.com/u/0/project/spotify-stats-tommaso-moro/firestore/data/~2Flog~2F${error.id}`)
                    })
                    divunderUserReferenceSpan1.append(divunderUserReferenceSpan1showmore)

                divunderUserReference.append(divunderUserReferenceSpan1)

            divunder.append(divunderUserReference)

            const divunderActions = document.createElement("div")
            divunderActions.classList.add("divunderActions")

                const divunderActionsHide = document.createElement("div")
                divunderActionsHide.classList.add("divunderActionsHide")
                divunderActionsHide.addEventListener("click", async () => {
                    div.classList.remove("open", "show")
                    setTimeout(() => div.remove(), 1500)

                    let myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    
                    let result = await fetch(`/admin/hide-error/${error.id}`, {
                        method: 'POST',
                        headers: myHeaders,
                        redirect: "follow"
                    })

                    console.log(result)
                    
                    if (result.status !== 200)
                        return console.error("l'errore " + error.id + " non è stato nascosto per un errore interno del server")
                })

                    const divunderActionsHideImg = document.createElement("img")
                    divunderActionsHideImg.classList.add("divunderActionsHideImg")
                    divunderActionsHideImg.src = "hide.svg"
                    divunderActionsHide.append(divunderActionsHideImg)

                divunderActions.append(divunderActionsHide)


                const divunderActionsDelete = document.createElement("div")
                divunderActionsDelete.classList.add("divunderActionsDelete")
                divunderActionsDelete.addEventListener("click", async () => {
                    div.classList.remove("open", "show")
                    setTimeout(() => div.remove(), 1500)

                    let myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    
                    let result = await fetch(`/admin/delete-error/${error.id}`, {
                        method: 'POST',
                        headers: myHeaders,
                        redirect: "follow"
                    })

                    console.log(result)
                    
                    if (result.status !== 200)
                        return console.error("l'errore " + error.id + " non è stato nascosto per un errore interno del server")
                })

                    const divunderActionsDeleteImg = document.createElement("img")
                    divunderActionsDeleteImg.classList.add("divunderActionsDeleteImg")
                    divunderActionsDeleteImg.src = "trash.svg"
                    divunderActionsDelete.append(divunderActionsDeleteImg)

                divunderActions.append(divunderActionsDelete)

            divunder.append(divunderActions)

        div.append(divunder)

    document.getElementById("last-stream").prepend(div)


    spanoutside.addEventListener("click", () => {
        if(!div.classList.contains("open")) {
            div.classList.add("open")
            spanRightdiv2.classList.add("rotate-90")
        } else {
            div.classList.remove("open")
            spanRightdiv2.classList.remove("rotate-90")
        }
    })

    return div
}





let showUserInfoOpen = false
let showUserInfoOpenId

function showClient(client) {
    const div = document.createElement("div")
    div.classList.add("right-column-user-client", client.id)

        const div_txt = document.createElement("div")
        div_txt.classList.add("right-column-user-clients-text", "no-left-padding-no-left-margin")

            const div_txt_1 = document.createElement("div")
            div_txt_1.classList.add("right-column-user-clients-text-title")
            div_txt_1.innerText = client.client.host
            div_txt.append(div_txt_1)
            
            const div_txt_2 = document.createElement("div")
            div_txt_2.classList.add("right-column-user-clients-text-subtitle")
            div_txt_2.innerText = ""
            if (client.client["sec-ch-ua"])
                div_txt_2.innerText += client.client["sec-ch-ua"]
            if (client.client["user-agent"])
                div_txt_2.innerText += client.client["user-agent"]
            if (client.client["sec-ch-ua-platform"])
                div_txt_2.innerText += " on " + client.client["sec-ch-ua-platform"]
            
            div_txt.append(div_txt_2)

        div.append(div_txt)

    document.getElementById("right-column-user-clients").prepend(div)
}

function removeClient(clientId) {
    const clientDiv = document.getElementsByClassName(clientId)[0]
    clientDiv.remove()
}


function addUserToData(userObj) {
    console.log("addUserToData", userObj)
    data.userConnected.push(userObj)
    console.log(data.userConnected)
}

function removeUserToData(userObj) {
    console.log("removeUserToData", userObj)
    for (let i = 0; i < data.userConnected.length; i++) {
        if (data.userConnected[i].id == userObj.id) {
            data.userConnected.splice(i, 1)
            break
        }
    }
}

function modifiedClientUserToData(userObj, clientObj, action) {
    for (let i = 0; i < data.userConnected.length; i++) {
        if (data.userConnected[i].id == userObj.id) {
            data.userConnected.splice(i, 1)
            break
        }
    }
    data.userConnected.push(userObj)

    if (showUserInfoOpen && showUserInfoOpenId === userObj.id) {
        if (action === "add-deviceConnected-to-userConnected") {
            showClient(clientObj)
        } else if (action === "remove-deviceConnected-in-userConnected") {
            removeClient(clientObj.id)
        }
    }
}

document.getElementById("userConnectedLen-live").innerText = data.userConnectedLen
document.getElementById("userConnectedLen-live-persone-a").innerText = (data.userConnectedLen !== 1) ? "persone" : "persona"
document.getElementById("totalConnectionsLen-live").innerText = data.totalConnectionsLen
document.getElementById("userConnectedLen-live-connessi-o").innerText = (data.totalConnectionsLen !== 1) ? "connessi" : "connesso"
document.getElementById("usersCount-live").innerText = data.usersCount
document.getElementById("userConnectedLen-live-registrati-o").innerText = (data.usersCount !== 1) ? "registrati" : "registrato"

const noImgSrc = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"

let socket = io("/admin")

socket.on("log", log => {
    log.reverse()
    for (let i = 0; i < log.length; i++) {
        if (!document.getElementsByClassName(log[i].id)[0]) {
            let div = addErrorLog(log[i])

            setTimeout(() => {
                div.classList.add("show")
            }, i*50 + 50)
        }
    }
})

socket.on("connectionAlives", connectionAlives => {
    console.log("connectionAlives", connectionAlives)

    switch (connectionAlives.action) {
        case "add-userConnected":
            document.getElementById("userConnectedLen-live").innerText = parseInt(document.getElementById("userConnectedLen-live").innerText)+1
            document.getElementById("totalConnectionsLen-live").innerText = parseInt(document.getElementById("totalConnectionsLen-live").innerText)+1
            addUserOnline(connectionAlives.body.userConnected)
            addUserToData(connectionAlives.body.userConnected)
            if (showUserInfoOpen && showUserInfoOpenId === connectionAlives.body.userConnected.id) {
                showClient(connectionAlives.body.userConnected.devicesConnected[0])
            }
          break;
        
        case "remove-userConnected":
            document.getElementById("userConnectedLen-live").innerText = parseInt(document.getElementById("userConnectedLen-live").innerText)-1
            document.getElementById("totalConnectionsLen-live").innerText = parseInt(document.getElementById("totalConnectionsLen-live").innerText)-1
            removeUserOnline(connectionAlives.body.userConnected)
            removeUserToData(connectionAlives.body.userConnected)

            if (showUserInfoOpen && showUserInfoOpenId === connectionAlives.body.userConnected.id) {
                removeClient(connectionAlives.body.userConnected.devicesConnected[0].id)
            }
          break;
        
        case "add-deviceConnected-to-userConnected":
            document.getElementById("totalConnectionsLen-live").innerText = parseInt(document.getElementById("totalConnectionsLen-live").innerText)+1
            if (document.getElementById("last-stream-online-users").childNodes[0] !== retrieveUserDiv(connectionAlives.body.userConnected.userInfo.id))
                goToTopUserOnline(connectionAlives.body.userConnected)
            modifiedClientUserToData(connectionAlives.body.userConnected, connectionAlives.body.deviceConnected, "add-deviceConnected-to-userConnected")
          break;
        
        case "remove-deviceConnected-in-userConnected":
            document.getElementById("totalConnectionsLen-live").innerText = parseInt(document.getElementById("totalConnectionsLen-live").innerText)-1
            console.log(connectionAlives.body.deviceConnected.id)
            modifiedClientUserToData(connectionAlives.body.userConnected, connectionAlives.body.deviceConnected, "remove-deviceConnected-in-userConnected")
          break;
    
        default:
            break;
    }


    document.getElementById("userConnectedLen-live-persone-a").innerText = (parseInt(document.getElementById("userConnectedLen-live").innerText) !== 1) ? "persone" : "persona"
    document.getElementById("userConnectedLen-live-connessi-o").innerText = (parseInt(document.getElementById("totalConnectionsLen-live").innerText) !== 1) ? "connessi" : "connesso"
})

console.log(data.userConnected.length)
for (let i = 0; i < data.userConnected.length; i++) {
    addUserOnline(data.userConnected[i])
}

socket.on("usersCount", count => {
    document.getElementById("usersCount-live").innerText = count
    document.getElementById("userConnectedLen-live-registrati-o").innerText = (count !== 1) ? "registrati" : "registrato"
})

function retrieveUserDiv(userId, online = true) {
    return document.getElementsByClassName(userId + "-" + online)[0]
}

function removeUserOnline(user) {
    const userDiv = retrieveUserDiv(user.id)
    console.log(userDiv)
    userDiv.classList.remove("show")
    setTimeout(() => {
        userDiv.remove()

        document.getElementById("last-stream-offline-users").prepend(userDiv)
        setTimeout(() => userDiv.classList.add("show"), 50); 
    }, 1500); 


}

function addUserOnline(user) {
    let isOnOffline
    let userDiv
    try {
        userDiv = retrieveUserDiv(user.id)
        userDiv.classList.remove("show")
        isOnOffline = true
    } catch (error) {
        isOnOffline = false
    }

    setTimeout(() => {
        if (isOnOffline)
            userDiv.remove()


    const div = document.createElement("div")
    div.classList.add("last-stream-track", "admin", user.id + "-true")

    div.addEventListener("click", () => {
        if (!showUserInfoOpen) {
            showUserInfo(user)
        }
        else {

            if (showUserInfoOpenId === user.id) {
                retrieveUserDiv(user.id).childNodes[1].classList.remove("rotate-180")
                hideUserInfo()
            } else {
                retrieveUserDiv(showUserInfoOpenId).childNodes[1].classList.remove("rotate-180")
                showUserInfo(user, false)
            }
        }
    })

        //left
        const divleft = document.createElement("div")
        divleft.classList.add("last-stream-track-left")

            const img = document.createElement("img")
            img.classList.add("last-stream-track-img", "admin")
            try {
                img.src = user.userInfo.images[0].url
            } catch (e) {
                img.src = noImgSrc
            }
            img.alt = user.userInfo.display_name + "'s img"
            divleft.appendChild(img)

            const div2 = document.createElement("div")
            div2.classList.add("last-stream-track-txt")

                const div2text = document.createElement("div")
                div2text.classList.add("last-stream-track-title")
                div2text.innerText = user.userInfo.display_name
                div2.appendChild(div2text)

                const div2artist = document.createElement("div")
                div2artist.classList.add("last-stream-track-artist")
                div2artist.innerText = user.id
                div2.appendChild(div2artist)

            divleft.appendChild(div2)

        div.appendChild(divleft)

        //right
        const divright = document.createElement("div")
        divright.classList.add("last-stream-track-right", "admin")
        if (showUserInfoOpen && showUserInfoOpenId === user.id)
            divright.classList.add("rotate-180")
        div.appendChild(divright)

    document.getElementById("last-stream-online-users").prepend(div)
    
    setTimeout(() => div.classList.add("show"), 50); 
        
    }, (isOnOffline) ? 1500 : 1); 
}

function goToTopUserOnline(user) {
    const userDiv = retrieveUserDiv(user.id)
    userDiv.classList.remove("show")
    setTimeout(() => {
        userDiv.remove()
        document.getElementById("last-stream-online-users").prepend(userDiv)
        setTimeout(() => userDiv.classList.add("show"), 50); 
    }, 1500)
}

function showUserInfo(user, animation = true) {
    showUserInfoOpen = true
    showUserInfoOpenId = user.id

    retrieveUserDiv(user.id).childNodes[1].classList.add("rotate-180")

    document.getElementById("right-column-user-info-id").innerText = user.id
    document.getElementById("right-column-user-info-display_name").innerText = user.userInfo.display_name
    document.getElementById("right-column-user-email").innerText = user.userInfo.email
    
    document.getElementById("right-column-user-info-img").alt = user.id + "'s img"
    try {
        document.getElementById("right-column-user-info-img").src = user.userInfo.images[0].url
    } catch (error) {
        document.getElementById("right-column-user-info-img").src = noImgSrc
    }

    document.getElementById("right-column-user-type").innerText = user.userInfo.type
    document.getElementById("right-column-user-product").innerText = user.userInfo.product
    document.getElementById("right-column-user-explicit_content-filter_enabled").innerText = user.userInfo.explicit_content.filter_enabled
    document.getElementById("right-column-user-explicit_content-filter_locked").innerText = user.userInfo.explicit_content.filter_locked
    document.getElementById("right-column-user-clients").innerHTML = ""

//     console.log(data.userConnected.length)
// for (let i = 0; i < data.userConnected.length; i++) {
//     addUserOnline(data.userConnected[i])
// }

console.log("data.userConnected", data.userConnected)

    for (let i = 0; i < data.userConnected.length; i++) {
        if (data.userConnected[i].id === user.id) {
            for (let j = 0; j < data.userConnected[i].devicesConnected.length; j++) {
                showClient(data.userConnected[i].devicesConnected[j])
            }
            break
        }
    }

    document.getElementById("href-activity").href = "/admin?user-activity="+user.id


    if (animation) {
        document.getElementById("right-column-content").classList.add("hidden")
        document.getElementById("right-column-user-info").classList.add("show")
    }
}

function hideUserInfo() {
    showUserInfoOpen = false

    document.getElementById("right-column-user-info").classList.remove("show")
    document.getElementById("right-column-content").classList.remove("hidden")
}
