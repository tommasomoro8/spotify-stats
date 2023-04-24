module.exports = (userInfo, friendList, invitedList, invitedByList, access_token) => {
    // console.log(userInfo)
    // console.log(friendList)
    // console.log(invitedList)
    // console.log(invitedByList)
    return /*html*/`
    <!DOCTYPE html>
    <html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="base.css">
        <link rel="icon" type="image/x-icon" href="spotify-logo.png">
        <title>Spotify Stats</title>
    </head>
    <body>
        <p>ciao ${String(userInfo.display_name)}!<br>
        <a href="/result">Vai alla tua classifica</a>
        <br><br>Le classifiche dei tuoi amici:<br></p>

        <div>${(() => {
            let strg = ""

            friendList.forEach(friend => {
                console.log(friend)


                strg += '<div class="row" id="button-' + friend.id +'"><a href="' + process.env.URL + friend.id + '">' + friend.display_name + ' (' + friend.id + ') ' + ', ultimo accesso: ' + String(new Date(friend.lastAccess*1000)) + '</a><button onclick="removeFriend(`' + friend.id +'`)">Rimuovi amico</button></div><br>'
            })

            return strg
        })()}</div>

        <p>
        <br><br>
        <div class="column">
            <div class="row">
                <input type="text" id="invite-friend-id"/>
                <button id="invite-friend">Invita un amico</button>
            </div>
            <div id="invite-friend-response"></div>
        </div>
        <br><br>
        <div>Richieste di amicizia in entrata:</div>
        <div id="friend-invited-by-list" class="column"></div>
        <br>
        <div>Richieste di amicizia in uscita:</div>
        <div id="friend-invited-list" class="column"></div>
        <br><br>
        <div>Notifiche:</div>
        <div id="notifications-list" class="column"></div>
        </p>

        <script>
            async function removeFriend(id) {
                let myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                document.getElementById("button-" + id).remove()
                const result = await fetch('${process.env.URL}friends/remove/' + id, {
                    method: 'POST',
                    headers: myHeaders,
                    redirect: "follow",
                })

                if (result.status != 200) {
                    console.log("errore")
                    document.getElementById("invite-friend-response").innerText = await result.text()
                    return
                }

                console.log(await result.text())
            };

            document.getElementById("invite-friend").addEventListener("click", async () => {
                let myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                const result = await fetch('${process.env.URL}friends/invite/' + document.getElementById("invite-friend-id").value, {
                    method: 'POST',
                    headers: myHeaders,
                    redirect: "follow",
                })

                if (result.status != 200) {
                    console.log("errore")
                    document.getElementById("invite-friend-response").innerText = await result.text()
                    return
                }

                document.getElementById("invite-friend-response").innerText = await result.text()
            });

            (async () => {
                const resultJ = ${JSON.stringify(invitedByList)}
                console.log(resultJ)

                if (resultJ.length > 0)
                    document.getElementById("friend-invited-by-list").innerHTML = ""
                else
                    document.getElementById("friend-invited-by-list").innerHTML = "vuoto"

                for (let i = 0; i < resultJ.length; i++) {
                    let div = document.createElement("div")
                    div.classList.add("row")

                        let name = document.createElement("div")
                        name.innerText = resultJ[i].display_name + " (" + resultJ[i].id + ")"
                        div.appendChild(name)

                        let accept_button = document.createElement("button")
                        accept_button.innerText = "Accetta"
                        accept_button.addEventListener("click", async () => {
                            let myHeaders = new Headers();
                            myHeaders.append("Content-Type", "application/json");

                            div.remove()
                            const result = await fetch('${process.env.URL}friends/invite-accept/' + resultJ[i].id, {
                                method: 'POST',
                                headers: myHeaders,
                                redirect: "follow",
                            })

                            if (result.status != 200) {
                                console.log("errore")
                                return console.log(await result.text())
                            }

                            console.log(await result.text())
                        })
                        div.appendChild(accept_button)

                        let decline_button = document.createElement("button")
                        decline_button.innerText = "Rifiuta"
                        decline_button.addEventListener("click", async () => {
                            let myHeaders = new Headers();
                            myHeaders.append("Content-Type", "application/json");

                            div.remove()
                            const result = await fetch('${process.env.URL}friends/invite-decline/' + resultJ[i].id, {
                                method: 'POST',
                                headers: myHeaders,
                                redirect: "follow",
                            })

                            if (result.status != 200) {
                                console.log("errore")
                                return console.log(await result.text())
                            }

                            console.log(await result.text())
                        })
                        div.appendChild(decline_button)

                    document.getElementById("friend-invited-by-list").appendChild(div)
                }
            })();

            (() => {
                const resultJ = ${JSON.stringify(invitedList)}
                console.log(resultJ)

                if (resultJ.length > 0)
                    document.getElementById("friend-invited-list").innerHTML = ""
                else
                    document.getElementById("friend-invited-list").innerHTML = "vuoto"

                for (let i = 0; i < resultJ.length; i++) {
                    let div = document.createElement("div")
                    div.classList.add("row")

                        let name = document.createElement("div")
                        name.innerText = resultJ[i].display_name + " (" + resultJ[i].id + ")"
                        div.appendChild(name)

                        let cancel_button = document.createElement("button")
                        cancel_button.innerText = "Annulla"
                        cancel_button.addEventListener("click", async () => {
                            let myHeaders = new Headers();
                            myHeaders.append("Content-Type", "application/json");

                            div.remove()
                            const result = await fetch('${process.env.URL}friends/invite-cancel/' + resultJ[i].id, {
                                method: 'POST',
                                headers: myHeaders,
                                redirect: "follow",
                            })

                            if (result.status != 200) {
                                console.log("errore")
                                return console.log(await result.text())
                            }

                            console.log(await result.text())
                        })
                        div.appendChild(cancel_button)

                    document.getElementById("friend-invited-list").appendChild(div)
                }
            })();


            (async () => {
                let myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", "Bearer  ${access_token}");

                const result = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=30', {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: "follow",
                })

                if (result.status != 200) {
                    console.log("errore")
                    console.log(await result.text())
                } else {
                    const resultJ = await result.json()
                    console.log(resultJ)
                }
            })();

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            async function checkNotifications() {
                const result = await fetch('${process.env.URL}notifications/list', {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: "follow",
                })

                if (result.status != 200) {
                    console.log("errore")
                    console.log(await result.text())
                    return
                }
                
                const resultJ = await result.json()

                document.getElementById("notifications-list").innerText = ""
                for (let i = 0; i < resultJ.length; i++) {
                    let div = document.createElement("div")
                    div.classList.add("row")

                        let name = document.createElement("div")
                        name.innerText = resultJ[i].text
                        div.appendChild(name)

                        let cancel_button = document.createElement("button")
                        cancel_button.innerText = "Cancella notifica"
                        cancel_button.addEventListener("click", async () => {
                            div.remove()
                            const result = await fetch('${process.env.URL}notifications/delete/' + resultJ[i].id, {
                                method: 'POST',
                                headers: myHeaders,
                                redirect: "follow",
                            })
                        })
                        div.appendChild(cancel_button)

                    document.getElementById("notifications-list").appendChild(div)
                }

            }; checkNotifications();
            setInterval(checkNotifications, ${process.env.NOTIFICATIONS_REQ_EVERY} * 1000)
    
        </script>

        <div class="row">
        <button class="button" id="button-0">4 Settimane</button>
        <button class="button" id="button-1">6 Mesi</button>
        <button class="button" id="button-2">Sempre</button>
        </div>
        <div id="name"></div>
        <div id="timeRange"></div>
        <div class="row" id="container">
        <div id="traks-container" class="container">
            <!-- <div class="classified-container before-show">
                <div class="num">1</div>
                <img class="img" src="https://i.scdn.co/image/ab67616d00001e025501a23567ddb15818d2dd0e" alt="img">
                <div class="txt">
                    <div class="title">On Me</div>
                    <div class="artist">Lil Baby</div>
                </div>
            </div> -->
        </div>
        <div id="artists-container" class="container">
            <!-- <div class="classified-container">
                <div class="num">1</div>
                <img class="img" src="https://i.scdn.co/image/ab6761610000e5ebcc5865053e7177aeb0c26b62" alt="img">
                <div class="txt">
                    <div class="title">NLE Choppa</div>
                    <div class="artist">Popularity: 89%</div>
                </div>
            </div> -->
        </div>

        </div>

        <style>
        .button {
            width: 300px;
            height: 200px;
        }

        #container {
            width: max(100vw, 900px);
            max-width: 1080px;
        }

        .container {
            display: flex;
            flex-direction: column;
            /* overflow: hidden; */
        }

        #traks-container {
            /* background-color: #00ff3c; */
            width: max(50vw, 450px);
        }

        #artists-container {
            /* background-color: aqua; */
            width: max(50vw, 450px);
        }

        .classified-container {
            display: flex;
            flex-direction: row;
            margin: 15px;
            transform: translateX(0);
            opacity: 1;
            transition: transform 1s cubic-bezier(0.05, 0.90, 0.85, 1), opacity 1s cubic-bezier(0.05, 0.90, 0.85, 1);
        }
        /* .classified-container:hover {
            z-index: 10;
        } */



        .before-show {
            transform: translateX(100px)!important;
            opacity: 0!important;
        }

        .fade {
            transform: translateX(-100px)!important;
            opacity: 0!important;
        }

        .num {
            font-size: 20px;
            font-weight: bolder;

            width: 20px;
            display: flex;
            flex-direction: column;
            align-items: end;
        }

        .img {
            object-fit : "cover";
            width: 100px;
            height: 100px;
            border-radius: 10px;
            margin-left: 15px;
            /* z-index: 100; */
            /* transition: transform 0.5s cubic-bezier(0.05, 0.90, 0.85, 1); */
        }
        .img:hover {
            cursor: pointer;
            /* transform: scale(2) translate(25px, 25px);
            z-index: 200;
            box-shadow: -2px -2px 10px #00000053; */
        }

        .no-pointer:hover {
            cursor: default!important;
        }

        .txt {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: start;
            margin-left: 15px;
            height: 100px;
        }

        .title {
            font-size: 24px;
            font-weight: bolder;
        }
        .title:hover {
            cursor: pointer;
        }

        .artist:hover {
            cursor: pointer;
        }

        #hidden-access-token, #hidden-user-info {
            display: none!important;
        }

        </style>

        <div id="hidden-access-token">${access_token}</div>
        <div id="hidden-user-info">${JSON.stringify(userInfo)}</div>
        <script src="app.js"></script>
    </body>
    </html>
    `
}