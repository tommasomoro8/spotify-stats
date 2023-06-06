let data = JSON.parse(document.getElementById("hidden-init-data").innerText); document.getElementById("hidden-init-data").remove()
console.log(data)


let showUserInfoOpen = false
let showUserInfoOpenId

function showClient(client) {
    const div = document.createElement("div")
    div.classList.add("right-column-user-client", client.id)
    
        // const div_img = document.createElement("div")
        // div_img.classList.add("right-column-user-clients-img")
        // div.append(div_img)

        const div_txt = document.createElement("div")
        div_txt.classList.add("right-column-user-clients-text", "no-left-padding-no-left-margin")

            const div_txt_1 = document.createElement("div")
            div_txt_1.classList.add("right-column-user-clients-text-title")
            div_txt_1.innerText = client.client.host
            div_txt.append(div_txt_1)
            
            const div_txt_2 = document.createElement("div")
            div_txt_2.classList.add("right-column-user-clients-text-subtitle")
            div_txt_2.innerText = client.client["sec-ch-ua"] + " on " + client.client["sec-ch-ua-platform"]
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
document.getElementById("totalConnectionsLen-live").innerText = data.totalConnectionsLen
document.getElementById("usersCount-live").innerText = data.usersCount

const noImgSrc = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"

let socket = io("/admin")

socket.on("log", log => {
    console.log(log)
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
})

console.log(data.userConnected.length)
for (let i = 0; i < data.userConnected.length; i++) {
    addUserOnline(data.userConnected[i])
}

socket.on("usersCount", count => {
    document.getElementById("usersCount-live").innerText = count
})

// socket.on("lastUsersOffline", lastUsersOffline => {
//     console.log("lastUsersOffline", lastUsersOffline)
// })

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
