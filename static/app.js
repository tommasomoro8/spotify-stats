if (innerHeight > innerWidth) {
    document.body.style.zoom = "40%";
    const a = document.getElementsByClassName("button")
    for (let i = 0; i < a; i++) {
        a[i].style.width = "300px"
        a[i].style.height = "200px"
    }
}

const timeRanges = [/* 1m */"short_term", /* 6m */"medium_term", /* all */"long_term"]
const APIKey = document.getElementById("hidden-access-token").innerText; document.getElementById("hidden-access-token").remove()
let timeRange
let tracksTotal
let artistsTotal
removeNodes(true)

function apiKeyExpired() {
    window.location.replace("/refresh_token")
}

async function spotifyTopTracks(timeRange = 1, createUi = true) {
    if (timeRange < 0 || timeRange > 2 || isNaN(timeRange))
        return new Error("timeRange not accepted")

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer  ${APIKey}`);

    const postURL = `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${timeRanges[timeRange]}`

    // try {
        const result = await fetch(postURL, {
            method: 'GET',
            headers: myHeaders,
            redirect: "follow"
        })

        if (result.status != 200) {
            if (result.status == 401) {
                apiKeyExpired()
                return
            }
            console.log("errore")
            console.log(await result.text())
            return
        }

        const tracks = await result.json()

        if (tracks.total === 0) {
            alert("Non hai tracce preferite")
            return
        }

        if (createUi) {
            for (let i = 0; i < 50/*tracks.items.length*/; i++) {
                let classifiedContainer = document.createElement("div")
                classifiedContainer.classList.add("classified-container")
                if (i < tracks.items.length)
                    classifiedContainer.classList.add("before-show")

                    let num = document.createElement("div")
                    num.classList.add("num")
                    num.innerText = i + 1
                    // if (i == 0)
                    //     num.style.color = "#ffd700"//gold
                    // else if (i == 1)
                    //     num.style.color = "#c0c0c0"//silver
                    // else if (i == 2)
                    //     num.style.color = "#CD7F32"//bronze
                    classifiedContainer.appendChild(num)

                    let img = document.createElement("img")
                    img.classList.add("img")
                    img.src = tracks.items[i].album.images[0].url
                    img.alt = "img"
                    img.addEventListener("click", () => window.open(tracks.items[i].album.external_urls.spotify))
                    img.title = `Album name: ${tracks.items[i].album.name}`
                    classifiedContainer.appendChild(img)

                    let txt = document.createElement("div")
                    txt.classList.add("txt")

                        let title = document.createElement("div")
                        title.classList.add("title")
                        title.innerText = tracks.items[i].name
                        title.addEventListener("click", () => window.open(tracks.items[i].external_urls.spotify))
                        title.title = `Song name: ${tracks.items[i].name}`
                        txt.appendChild(title)

                        let artist = document.createElement("div")
                        artist.classList.add("artist")
                        for (let j = 0; j < tracks.items[i].artists.length; j++)
                            if (j == 0)
                                artist.innerText = tracks.items[i].artists[0].name
                            else
                                artist.innerText += `, ${tracks.items[i].artists[j].name}`
                        artist.addEventListener("click", () => window.open(tracks.items[i].artists[0].external_urls.spotify))
                        artist.title = `Artist name: ${tracks.items[i].artists[0].name}`
                        txt.appendChild(artist)
                    
                    classifiedContainer.appendChild(txt)

                    if (i >= tracks.items.length)
                        classifiedContainer.classList.add("fade")
                    
                document.getElementById("traks-container").appendChild(classifiedContainer)
            } 
        }

        return tracks
    // } catch (error) {
    //     console.log(error)
    // }
}

async function spotifyTopArtists(timeRange = 1, createUi = true) {
    if (timeRange < 0 || timeRange > 2 || isNaN(timeRange))
        return new Error("timeRange not accepted")

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer  ${APIKey}`);

    const postURL = `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${timeRanges[timeRange]}`

    // try {
        const result = await fetch(postURL, {
            method: 'GET',
            headers: myHeaders,
            redirect: "follow"
        })

        if (result.status != 200) {
            if (result.status == 401) {
                apiKeyExpired()
                return
            }
            console.log("errore")
            console.log(await result.text())
            return
        }

        const artists = await result.json()

        if (artists.total === 0) {
            alert("Non hai artisti preferiti")
            return
        }

        if (createUi) {
            for (let i = 0; i < 50/*artists.items.length*/; i++) {
                let classifiedContainer = document.createElement("div")
                classifiedContainer.classList.add("classified-container")
                if (i < artists.items.length)
                    classifiedContainer.classList.add("before-show")
                

                    let num = document.createElement("div")
                    num.classList.add("num")
                    num.innerText = i + 1
                    classifiedContainer.appendChild(num)

                    let img = document.createElement("img")
                    img.classList.add("img")
                    img.classList.add("no-pointer")
                    try {
                        img.src = artists.items[i].images[0].url
                    } catch (error) {}
                    img.alt = "img"
                    classifiedContainer.appendChild(img)

                    let txt = document.createElement("div")
                    txt.classList.add("txt")

                        let title = document.createElement("div")
                        title.classList.add("title")
                        try {
                            title.innerText = artists.items[i].name
                            title.addEventListener("click", () => window.open(artists.items[i].external_urls.spotify))
                            title.title = `Song name: ${artists.items[i].name}`
                        } catch (error) {}
                        txt.appendChild(title)

                        let artist = document.createElement("div")
                        artist.classList.add("artist")
                        artist.classList.add("no-pointer")
                        try {
                            artist.innerText = `Popularity: ${artists.items[i].popularity}%`
                        } catch (error) {}
                        txt.appendChild(artist)
                    
                    classifiedContainer.appendChild(txt)

                if (i >= artists.items.length)
                    classifiedContainer.classList.add("fade")
                    
                document.getElementById("artists-container").appendChild(classifiedContainer)
            }
        }

        return artists
    // } catch (error) {
    //     console.log(error)
    // }
}

async function showUI() {

    const tracks = await spotifyTopTracks(timeRange)
    console.log(tracks)
    tracksTotal = tracks.total


    const artists = await spotifyTopArtists(timeRange)
    console.log(artists)
    artistsTotal = artists.total

    for (let i = 0; i < tracks.total; i++) {
        setTimeout(() => {
            try {
                document.getElementsByClassName("classified-container")[i].classList.remove("before-show")
            } catch (error) {}
        }, 1000 + i*100);

        
    }

    for (let i = 0; i < artists.total; i++) {
        setTimeout(() => {
            try {
                document.getElementsByClassName("classified-container")[i+tracks.total].classList.remove("before-show")
            } catch (error) {}
        }, 1500 + i*100);
    }

    
}

function removeNodes(first = false) {
    if (!first)
        console.log("Ok")

    const myNode = document.getElementById("traks-container");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }

    const myNode2 = document.getElementById("artists-container");
    while (myNode2.firstChild) {
        myNode2.removeChild(myNode2.lastChild);
    }

    if (!first)
        showUI()
}

async function removeUI() {

    const tracks = await spotifyTopTracks(timeRange, false)
    console.log(tracks)
    tracksTotal = tracks.total

    const artists = await spotifyTopArtists(timeRange, false)
    console.log(artists)
    artistsTotal = artists.total

    for (let i = 0; i < tracksTotal; i++) {
        setTimeout(() => {
            if (i < tracksTotal) {
                try {
                    document.getElementsByClassName("classified-container")[i].classList.add("fade")
                    setTimeout(() => {
    
                        const oldImg = document.getElementsByClassName("classified-container")[i].getElementsByClassName("img")[0]
                        const img = oldImg.cloneNode(true);
                        oldImg.parentNode.replaceChild(img, oldImg);
    
                        const oldTitle = document.getElementsByClassName("classified-container")[i].getElementsByClassName("title")[0]
                        const title = oldTitle.cloneNode(true);
                        oldTitle.parentNode.replaceChild(title, oldTitle);
    
                        const oldArtist = document.getElementsByClassName("classified-container")[i].getElementsByClassName("artist")[0]
                        const artist = oldArtist.cloneNode(true);
                        oldArtist.parentNode.replaceChild(artist, oldArtist);
    
    
                        img.src = tracks.items[i].album.images[0].url
                        img.addEventListener("click", () => window.open(tracks.items[i].album.external_urls.spotify))
                        img.title = `Album name: ${tracks.items[i].album.name}`
    
                        title.innerText = tracks.items[i].name
                        title.addEventListener("click", () => window.open(tracks.items[i].external_urls.spotify))
                        title.title = `Song name: ${tracks.items[i].name}`
    
                        for (let j = 0; j < tracks.items[i].artists.length; j++)
                            if (j == 0)
                                artist.innerText = tracks.items[i].artists[0].name
                            else
                                artist.innerText += `, ${tracks.items[i].artists[j].name}`
                        artist.addEventListener("click", () => window.open(tracks.items[i].artists[0].external_urls.spotify))
                        artist.title = `Artist name: ${tracks.items[i].artists[0].name}`
    
                        document.getElementsByClassName("classified-container")[i].classList.remove("fade")
                    }, 1000)
                } catch (error) {}
            }
            else {
                try {
                    document.getElementsByClassName("classified-container")[i].classList.add("fade")
                } catch (error) {}
            }
        }, 0 + i*100);
    }

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            if (i < artistsTotal) {
                try {
                    document.getElementsByClassName("classified-container")[i+tracksTotal].classList.add("fade")
                    setTimeout(() => {
    
                        const oldImg = document.getElementsByClassName("classified-container")[i+tracksTotal].getElementsByClassName("img")[0]
                        const img = oldImg.cloneNode(true);
                        oldImg.parentNode.replaceChild(img, oldImg);
    
                        const oldTitle = document.getElementsByClassName("classified-container")[i+tracksTotal].getElementsByClassName("title")[0]
                        const title = oldTitle.cloneNode(true);
                        oldTitle.parentNode.replaceChild(title, oldTitle);
    
                        const oldArtist = document.getElementsByClassName("classified-container")[i+tracksTotal].getElementsByClassName("artist")[0]
                        const artist = oldArtist.cloneNode(true);
                        oldArtist.parentNode.replaceChild(artist, oldArtist);
    
    
    
                        img.src = artists.items[i].images[0].url
    
                        title.innerText = artists.items[i].name
                        title.addEventListener("click", () => window.open(artists.items[i].external_urls.spotify))
                        title.title = `Song name: ${artists.items[i].name}`
    
                        artist.innerText = `Popularity: ${artists.items[i].popularity}%`
                        
                        document.getElementsByClassName("classified-container")[i+tracksTotal].classList.remove("fade")
                    }, 1000)
                } catch (error) {}
            } else {
                try {
                    document.getElementsByClassName("classified-container")[i+tracksTotal].classList.add("fade")
                } catch (error) {}
            }
        }, 500 + i*100);
    }
}

for (let i = 0; i < 3; i++) {
    document.getElementById(`button-${i}`).addEventListener("click", () => {

        if (i === timeRange) {
            console.log("già selezionato")
            return
        }

        timeRange = i

        const timeRangeTxt = ["nelle ultime 4 settimane", "negli ultimi 6 mesi", "nell'intera vita dell'account"]
        document.getElementById("timeRange").innerText = `Brani calcolati ${timeRangeTxt[timeRange]}.`

        if (!document.getElementById("traks-container").firstChild && !document.getElementById("artists-container").firstChild) {
            showUI()
        }
        else
            removeUI()
    })
}

(async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer  ${APIKey}`);

    const result = await fetch(`https://api.spotify.com/v1/me`, {
        method: 'GET',
        headers: myHeaders,
        redirect: "follow"
    })

    if (result.status != 200) {
        if (result.status == 401) {
            apiKeyExpired()
            return
        }
        console.log("errore")
        console.log(await result.text())

        return
    }

    const resultJ = await result.json()

    document.getElementById("name").innerHTML = `Brani e artisti preferiti di ${resultJ.display_name}!`


    timeRange = 0

    const timeRangeTxt = ["nelle ultime 4 settimane", "negli ultimi 6 mesi", "nell'intera vita dell'account"]
    document.getElementById("timeRange").innerText = `Brani calcolati ${timeRangeTxt[timeRange]}.`

    showUI()
})()