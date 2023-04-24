module.exports = (userInfo, friendList, invitedList, invitedByList, access_token) => {
    // console.log(userInfo)
    // console.log(friendList)
    // console.log(invitedList)
    // console.log(invitedByList)
    return /*html*/`
    <!DOCTYPE html>
    <html lang="en">
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


                strg += '<a href="' + process.env.URL + 'result?refresh_token=' + friend.refresh_token + '">' + friend.display_name + ' (' + friend.id + ') ' + ', ultimo accesso: ' + String(new Date(friend.lastAccess*1000)) + '</a><button onclick="removeFriend(`' + friend.id +'`)">Rimuovi amico</button><br>'
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
        <div id="friend-invited-by-list" class="column">

        </div>
        <br>
        <div>Richieste di amicizia in uscita:</div>
        <div id="friend-invited-list" class="column">

        </div>
        </p>

        <script>
            async function removeFriend(id) {
                let myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

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
            })()
        </script>
    </body>
    </html>
    `
}