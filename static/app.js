const access_token = document.getElementById("hidden-access-token").innerText; document.getElementById("hidden-access-token").remove()
const user_info = JSON.parse(document.getElementById("hidden-user-info").innerText); document.getElementById("hidden-user-info").remove()
const is_same_account = eval(document.getElementById("hidden-is-same-account").innerText); document.getElementById("hidden-is-same-account").remove()

const timeRanges = [/* 1m */"short_term", /* 6m */"medium_term", /* all */"long_term"]
const noImgSrc = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const onemonth = document.getElementById("onemonth")
const sixmonth = document.getElementById("sixmonth")
const ever = document.getElementById("ever")
const buttons = [onemonth, sixmonth, ever]
const selectorBg = document.getElementById("selector-selected")

let selected = 0
let oldClassName = selectorBg.className

onemonth.addEventListener("mouseenter", () => {
    selectorBg.className = ""
    onemonth.classList.add("green")
    if (selected !== 0)
        buttons[selected].classList.remove("green")
})
sixmonth.addEventListener("mouseenter", () => {
    if (selected === 2)
        selectorBg.classList.remove("two")

    selectorBg.classList.add("one")
    sixmonth.classList.add("green")
    if (selected !== 1)
        buttons[selected].classList.remove("green")
})
ever.addEventListener("mouseenter", () => {
    selectorBg.classList.add("two")
    ever.classList.add("green")
    if (selected !== 2)
        buttons[selected].classList.remove("green")
})

onemonth.addEventListener("mouseleave", () => {
    selectorBg.className = oldClassName
    if (selected !== 0) {
        buttons[selected].classList.add("green")
        onemonth.classList.remove("green")
    }
})
sixmonth.addEventListener("mouseleave", () => {
    selectorBg.className = oldClassName
    if (selected !== 1) {
        buttons[selected].classList.add("green")
        sixmonth.classList.remove("green")
    }
})
ever.addEventListener("mouseleave", () => {
    selectorBg.className = oldClassName
    if (selected !== 2) {
        buttons[selected].classList.add("green")
        ever.classList.remove("green")
    }
})

onemonth.addEventListener("click", () => {
    selected = 0
    oldClassName = selectorBg.className

    document.getElementById("genre-subtitle-text").innerText = "I tuoi generi preferiti nelle ultime 4 settimane"
    document.getElementById("track-subtitle-text").innerText = "Le tue canzoni preferite nelle ultime 4 settimane"
    document.getElementById("artist-subtitle-text").innerText = "I tuoi artisti preferiti nelle ultime 4 settimane"
    document.getElementById("last-stream-subtitle-text").innerText = "I tuoi brani riprodotti di recente"
    
    displayResult(0)
})
sixmonth.addEventListener("click", () => {
    selected = 1
    oldClassName = selectorBg.className

    document.getElementById("genre-subtitle-text").innerText = "I tuoi generi preferiti negli ultimi 6 mesi"
    document.getElementById("track-subtitle-text").innerText = "Le tue canzoni preferite negli ultimi 6 mesi"
    document.getElementById("artist-subtitle-text").innerText = "I tuoi artisti preferiti negli ultimi 6 mesi"
    document.getElementById("last-stream-subtitle-text").innerText = "I tuoi brani riprodotti di recente"

    displayResult(1)
})
ever.addEventListener("click", () => {
    selected = 2
    oldClassName = selectorBg.className

    document.getElementById("genre-subtitle-text").innerText = "I tuoi generi preferiti di sempre"
    document.getElementById("track-subtitle-text").innerText = "Le tue canzoni preferite di sempre"
    document.getElementById("artist-subtitle-text").innerText = "I tuoi artisti preferiti di sempre"
    document.getElementById("last-stream-subtitle-text").innerText = "I tuoi brani riprodotti di recente"

    displayResult(2)
})

async function delete_all_notifications() {
    const result = await fetch("/notifications/delete-all", {
        method: 'POST',
        headers: myHeaders,
        redirect: "follow"
    })

    return result.status
}

let isLateralBarOpen = false

function open_close_top_bar() {
    if (isLateralBarOpen) {
        document.getElementById("lateral-bar").classList.remove("active")
        document.getElementById("lateral-bar-overlay").classList.remove("active")
        document.body.classList.remove("noscroll")
    }
    else {
        window.scrollTo(0, 0);
        document.getElementById("lateral-bar").classList.add("active")
        document.getElementById("lateral-bar-overlay").classList.add("active")
        document.body.classList.add("noscroll")

        delete_all_notifications()
        document.getElementById("notification-dot").classList.remove("active")
    }

    isLateralBarOpen = !isLateralBarOpen
}
document.getElementById("top-bar-logo-userimg").addEventListener("click", open_close_top_bar)
document.getElementById("lateral-bar-overlay").addEventListener("click", open_close_top_bar)


function apiKeyExpired() {
    window.location.replace("/refresh_token")
}


function placeholders_set() {
    document.getElementById("genre-scrolls").innerHTML = ""
    document.getElementById("track-scrolls").innerHTML = ""
    document.getElementById("artist-scrolls").innerHTML = ""
    document.getElementById("last-stream").innerHTML = ""

    //genre-scrolls
    for (let i = 0; i < 30; i++) {
        const div = document.createElement("div")
        div.classList.add("genre", "placeholder")
        if (i === 0)
            div.classList.add("genre-first")
        else if (i === 29)
            div.classList.add("genre-last")

        
            const div2 = document.createElement("div")
            div2.classList.add("genre-text", "placeholder")
            div.appendChild(div2)

        document.getElementById("genre-scrolls").appendChild(div)
    }

    //track-scrolls
    for (let i = 0; i < 30; i++) {
        const div = document.createElement("div")
        div.classList.add("track", "placeholder")
        if (i === 0)
            div.classList.add("track-first")
        else if (i === 29)
            div.classList.add("track-last")

        
            const img = document.createElement("div")
            img.classList.add("track-img", "placeholder")

                const imgAnimation = document.createElement("div")
                imgAnimation.classList.add("track-img-animation-placeholder")
                img.appendChild(imgAnimation)
                
            div.appendChild(img)

            const title = document.createElement("div")
            title.classList.add("track-title", "placeholder")
                
                const titleAnimation = document.createElement("div")
                titleAnimation.classList.add("track-img-animation-placeholder")
                title.appendChild(titleAnimation)
                
            div.appendChild(title)

            const artist = document.createElement("div")
            artist.classList.add("track-artist", "placeholder")

                const artistAnimation = document.createElement("div")
                artistAnimation.classList.add("track-img-animation-placeholder")
                artist.appendChild(artistAnimation)
                
            div.appendChild(artist)

        document.getElementById("track-scrolls").appendChild(div)
    }

    //artist-scrolls
    for (let i = 0; i < 30; i++) {
        const div = document.createElement("div")
        div.classList.add("artist", "placeholder")
        if (i === 0)
            div.classList.add("artist-first")
        else if (i === 29)
            div.classList.add("artist-last")


            const img = document.createElement("div")
            img.classList.add("artist-img", "placeholder")

                const imgAnimation = document.createElement("div")
                imgAnimation.classList.add("track-img-animation-placeholder")
                img.appendChild(imgAnimation)
                
            div.appendChild(img)

            const title = document.createElement("div")
            title.classList.add("artist-title", "placeholder")
                
                const titleAnimation = document.createElement("div")
                titleAnimation.classList.add("track-img-animation-placeholder")
                title.appendChild(titleAnimation)
                
            div.appendChild(title)

            const artist = document.createElement("div")
            artist.classList.add("artist-popularity", "placeholder")

                const artistAnimation = document.createElement("div")
                artistAnimation.classList.add("track-img-animation-placeholder")
                artist.appendChild(artistAnimation)
                
            div.appendChild(artist)

        document.getElementById("artist-scrolls").appendChild(div)
    }

    //last-stream
    const div = document.createElement("div")
    div.classList.add("last-stream-day-wrapper")

        const div2 = document.createElement("div")
        div2.classList.add("last-stream-day")
        div2.innerText = "Oggi"
        div.appendChild(div2)


        for (let i = 0; i < 15; i++) {
            const div3 = document.createElement("div")
            div3.classList.add("last-stream-track", "placeholder")
    
                const left = document.createElement("div")
                left.classList.add("last-stream-track-left", "placeholder")

                    const img = document.createElement("div")
                    img.classList.add("last-stream-track-img", "placeholder")
                        const imgInside = document.createElement("div")
                        imgInside.classList.add("track-img-animation-placeholder")
                        img.appendChild(imgInside)
                    left.appendChild(img)

                    const txt = document.createElement("div")
                    txt.classList.add("last-stream-track-txt", "placeholder")

                        const title = document.createElement("div")
                        title.classList.add("last-stream-track-title", "placeholder")
                            const titleInside = document.createElement("div")
                            titleInside.classList.add("last-stream-track-placeholder")
                            title.appendChild(titleInside)
                        txt.appendChild(title)

                        const titleLonger = document.createElement("div")
                        titleLonger.classList.add("last-stream-track-title", "placeholder", "longer")
                            const titleLongerInside = document.createElement("div")
                            titleLongerInside.classList.add("last-stream-track-placeholder")
                            titleLonger.appendChild(titleLongerInside)
                        txt.appendChild(titleLonger)

                    left.appendChild(txt)

                div3.appendChild(left)

                const right = document.createElement("div")
                right.classList.add("last-stream-track-title", "placeholder")

                    const rightAnimation = document.createElement("div")
                    rightAnimation.classList.add("last-stream-track-placeholder")
                    right.appendChild(rightAnimation)

                div3.appendChild(right)
                
            div.appendChild(div3)
        }
    
    document.getElementById("last-stream").appendChild(div)
}


async function spotifyTop_artists_tracks_genres_recentlyPlayed(timeRange = 0) {
    if (timeRange < 0 || timeRange > 2 || isNaN(timeRange))
        return new Error("timeRange not accepted")

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer  ${access_token}`);

    const postURL = [
        `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${timeRanges[timeRange]}`,
        `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${timeRanges[timeRange]}`,
        `https://api.spotify.com/v1/me/player/recently-played?limit=30`,
    ]

    let tracks = []
    let artists = []
    let genres = []
    let recentlyPlayed = []


    for (let i = 0; i < 3; i++) {
        const result = await fetch(postURL[i], {
            method: 'GET',
            headers: myHeaders,
            redirect: "follow"
        })

        if (result.status != 200) {
            if (result.status == 401) {
                apiKeyExpired()
                return
            }
            return {
                error: await result.text()
            }
        }

        if (i === 0)
            tracks = await result.json()
        else if (i === 2)
            recentlyPlayed = await result.json()
        else {
            artists = await result.json()

            if (artists.total === 0) {
                genres = []
            } else {
                for (let i = 0; i < artists.items.length; i++) {
                    for (let j = 0; j < artists.items[i].genres.length; j++) {
                        let genres_contains_genre = false
                        let genere_index
        
                        for (let x = 0; x < genres.length; x++) {
                            if (genres[x].genre === artists.items[i].genres[j]) {
                                genres_contains_genre = true
                                genere_index = x
                            }
                        }
        
                        if (genres_contains_genre === false) {
                            genres.push({
                                genre: artists.items[i].genres[j],
                                num: 1
                            })
                        } else {
                            genres[genere_index].num += 1
                        }
                    }
                }
            
                genres.sort((a, b) => b.num - a.num);
            }
        }
    }

    return { tracks, artists, genres, recentlyPlayed }
}

let playAudio = false

function playAudioAction() {
    playAudio = !playAudio
    if (playAudio) {
        document.getElementById("audiotriggerimg").src = "/volume.png"
        document.getElementById("audiotriggerimg2").src = "/volume.png"
    } else {
        document.getElementById("audiotriggerimg").src = "/mute.png"
        document.getElementById("audiotriggerimg2").src = "/mute.png"
    }
}

document.getElementById("audiotrigger").addEventListener("click", playAudioAction)
document.getElementById("audiotrigger2").addEventListener("click", playAudioAction)

async function displayResult(timeRange = 0) {
    placeholders_set()
    let { tracks, artists, genres, recentlyPlayed } = await spotifyTop_artists_tracks_genres_recentlyPlayed(timeRange)

    document.getElementById("genre-scrolls").innerHTML = ""
    document.getElementById("track-scrolls").innerHTML = ""
    document.getElementById("artist-scrolls").innerHTML = ""
    document.getElementById("last-stream").innerHTML = ""

    //genre-scrolls
    for (let i = 0; i < genres.length; i++) {
        const div = document.createElement("div")
        div.classList.add("genre")
        if (i === 0)
            div.classList.add("genre-first")
        else if (i === 29)
            div.classList.add("genre-last")

        
            const div2 = document.createElement("div")
            div2.classList.add("genre-text")

            const genre = genres[i].genre
            const words = genre.split(" ")

            for (let i = 0; i < words.length; i++)
                words[i] = words[i][0].toUpperCase() + words[i].substr(1);
            
            div2.innerText = words.join(" ")
            div.appendChild(div2)

        document.getElementById("genre-scrolls").appendChild(div)
    }

    //track-scrolls
    for (let i = 0; i < tracks.total; i++) {
        const div = document.createElement("div")
        div.classList.add("track")
        if (i === 0)
            div.classList.add("track-first")
        else if (i === 29)
            div.classList.add("track-last")

        
            const img = document.createElement("img")
            img.classList.add("track-img", "pointer")
            try {
                img.src = tracks.items[i].album.images[0].url
            } catch (error) {}
            img.alt = "img"
            try {
                img.addEventListener("click", () => window.open(tracks.items[i].album.external_urls.spotify))
                img.title = `Album name: ${tracks.items[i].album.name}`
            } catch (error) {} 

            img.addEventListener("mouseenter", () => {
                if (!playAudio || tracks.items[i].preview_url == null || tracks.items[i].preview_url == undefined)
                    return

                img.title = ""

                let error = false

                let audio = new Audio(tracks.items[i].preview_url)
                let musicPlaying = false
                img.style.scale = 0.95

                let vol = 0;

                let fadein
                let timeout = setTimeout(async () => {
                    setTimeout(async () => {
                        handleMouseleave()
                    }, (audio.duration * 1000) - 3000)
                    

                    vol = 0;
                    let interval = 100
                    audio.volume = vol

                    try {
                        await audio.play()
                    } catch (e) {
                        console.log(error)
                        error = true
                    }
                    if (error) return

                    fadein = setInterval(() => {
                        if (vol < 1) {
                            vol += 0.05
                            if (vol > 1)
                                vol = 1
                            audio.volume = vol
                        }
                        else {
                            clearInterval(fadein)
                        }
                    }, interval);

                    img.classList.add("musicPlayingAnimation")
                    musicPlaying = true
                }, 1000)


                function handleMouseleave() {
                    clearInterval(fadein)
                    
                    if (musicPlaying) {
                        img.style.scale = 1
                        setTimeout(() => {
                            img.classList.remove("musicPlayingAnimation")
                        }, 1000);
                        clearInterval(fadein)
                        let interval = 100;
                        let fadeout = setInterval(() => {
                            if (vol > 0) {
                                vol -= 0.05
                                if (vol < 0)
                                    vol = 0
                                audio.volume = vol
                            }
                            else {
                                clearInterval(fadeout)
                                audio.pause()
                                audio.currentTime = 0
                            }
                        }, interval);
                    } else {
                        clearTimeout(timeout)
                        img.style.scale = 1
                    }
                    img.removeEventListener("mouseleave", handleMouseleave)
                    img.title = `Album name: ${tracks.items[i].album.name}`
                }

                img.addEventListener("mouseleave", handleMouseleave)
            
            })          
            div.appendChild(img)

            const title = document.createElement("div")
            title.classList.add("track-title", "pointer")
            try {
                title.innerHTML = '<span class="track-title-num">' + (i+1) + '.</span> ' + tracks.items[i].name
                title.addEventListener("click", () => window.open(tracks.items[i].external_urls.spotify))
                title.title = `Song name: ${tracks.items[i].name}`
            } catch (error) {}
            div.appendChild(title)

            const artist = document.createElement("div")
            artist.classList.add("track-artist", "pointer")
            try {
                for (let j = 0; j < tracks.items[i].artists.length; j++)
                    if (j == 0)
                        artist.innerText = tracks.items[i].artists[0].name
                    else
                        artist.innerText += `, ${tracks.items[i].artists[j].name}`
                artist.addEventListener("click", () => window.open(tracks.items[i].artists[0].external_urls.spotify))
                artist.title = `Artist name: ${tracks.items[i].artists[0].name}`
            } catch (error) {}
            div.appendChild(artist)

        document.getElementById("track-scrolls").appendChild(div)   
    }

    //artist-scrolls
    for (let i = 0; i < artists.total; i++) {
        const div = document.createElement("div")
        div.classList.add("artist")
        if (i === 0)
            div.classList.add("artist-first")
        else if (i === 29)
            div.classList.add("artist-last")


            const img = document.createElement("img")
            img.classList.add("artist-img", "pointer")
            try {
                img.src = artists.items[i].images[0].url
                img.addEventListener("click", () => window.open(artists.items[i].external_urls.spotify))
            } catch (error) {}
            img.alt = "img"
            div.appendChild(img)

            const title = document.createElement("div")
            title.classList.add("artist-title", "pointer")
            try {
                title.innerHTML = '<span class="artist-title-num">' + (i+1) + '.</span> ' + artists.items[i].name
                title.addEventListener("click", () => window.open(artists.items[i].external_urls.spotify))
                title.title = `Artist name: ${artists.items[i].name}`
            } catch (error) {}
            div.appendChild(title)

            const artist = document.createElement("div")
            artist.classList.add("artist-popularity")
            try {
                artist.innerText = `${artists.items[i].popularity}% Popularity`
            } catch (error) {}
            div.appendChild(artist)

        document.getElementById("artist-scrolls").appendChild(div)
    }

    //last-stream

    let lastDay
    const lastStream = recentlyPlayed.items

    let div

        for (let i = 0; i < lastStream.length; i++) {
            if (!lastDay || !isSameDay(lastStream[i].played_at, lastDay)) {
                div = document.createElement("div")
                div.classList.add("last-stream-day-wrapper")

                    const div2 = document.createElement("div")
                    div2.classList.add("last-stream-day")

                    if (isSameDay((new Date()), lastStream[i].played_at))
                        div2.innerText = "Oggi"
                    else if (isSameDay(((new Date()) - 86400000), lastStream[i].played_at))
                        div2.innerText = "Ieri"
                    else {
                        const data = new Date(lastStream[i].played_at)
                        div2.innerText = `${data.getDate()} ${monthIta[data.getMonth()]}`
                    }
                    div.appendChild(div2)

                document.getElementById("last-stream").appendChild(div)
            }
            
            lastDay = lastStream[i].played_at


            const div3 = document.createElement("div")
            div3.classList.add("last-stream-track")
    
                const left = document.createElement("div")
                left.classList.add("last-stream-track-left")

                    const img = document.createElement("img")
                    img.classList.add("last-stream-track-img")
                    try {
                        img.src = lastStream[i].track.album.images[0].url
                    } catch (error) {}
                    img.alt = "img"
                    left.appendChild(img)

                    img.addEventListener("mouseenter", () => {
                        if (!playAudio || lastStream[i].track.preview_url == null || lastStream[i].track.preview_url == undefined)
                            return
        
                        let error = false
        
                        let audio = new Audio(lastStream[i].track.preview_url)
                        let musicPlaying = false
                        img.style.scale = 0.95
        
                        let vol = 0;
        
                        let fadein
                        let timeout = setTimeout(async () => {
                            setTimeout(async () => {
                                handleMouseleave()
                            }, (audio.duration * 1000) - 3000)
                            
        
                            vol = 0;
                            let interval = 100
                            audio.volume = vol
        
                            try {
                                await audio.play()
                            } catch (e) {
                                console.log(error)
                                error = true
                            }
                            if (error) return
        
                            fadein = setInterval(() => {
                                if (vol < 1) {
                                    vol += 0.05
                                    if (vol > 1)
                                        vol = 1
                                    audio.volume = vol
                                }
                                else {
                                    clearInterval(fadein)
                                }
                            }, interval);
        
                            img.classList.add("musicPlayingAnimation")
                            musicPlaying = true
                        }, 1000)
        
        
                        function handleMouseleave() {
                            clearInterval(fadein)
                            
                            if (musicPlaying) {
                                img.style.scale = 1
                                setTimeout(() => {
                                    img.classList.remove("musicPlayingAnimation")
                                }, 1000);
                                clearInterval(fadein)
                                let interval = 100;
                                let fadeout = setInterval(() => {
                                    if (vol > 0) {
                                        vol -= 0.05
                                        if (vol < 0)
                                            vol = 0
                                        audio.volume = vol
                                    }
                                    else {
                                        clearInterval(fadeout)
                                        audio.pause()
                                        audio.currentTime = 0
                                    }
                                }, interval);
                            } else {
                                clearTimeout(timeout)
                                img.style.scale = 1
                            }
                            img.removeEventListener("mouseleave", handleMouseleave)
                        }
        
                        img.addEventListener("mouseleave", handleMouseleave)
                    
                    })          

                    const txt = document.createElement("div")
                    txt.classList.add("last-stream-track-txt")

                        const title = document.createElement("div")
                        title.classList.add("last-stream-track-title")
                        title.innerText = lastStream[i].track.name
                        txt.appendChild(title)

                        const titleLonger = document.createElement("div")
                        titleLonger.classList.add("last-stream-track-artist")
                        try {
                            for (let j = 0; j < lastStream[i].track.artists.length; j++)
                                if (j == 0)
                                    titleLonger.innerText = lastStream[i].track.artists[0].name
                                else
                                    titleLonger.innerText += `, ${lastStream[i].track.artists[j].name}`
                        } catch (error) {}
                        titleLonger.innerText += " • " + lastStream[i].track.album.name
                        txt.appendChild(titleLonger)

                    left.appendChild(txt)

                div3.appendChild(left)

                const right = document.createElement("div")
                right.classList.add("last-stream-track-right")
                const time = seeTimeDifference(lastStream[i].played_at)
                if (time.measureOfTimeNum === 0 || time.measureOfTimeNum === 1)
                    right.innerText = dividersNameIta[0]
                else {
                    right.innerText = `${Math.trunc(time.value)} ${dividersNameIta[time.measureOfTimeNum][+(Math.trunc(time.value) === 1)]}`
                }
                div3.appendChild(right)
                
            div.appendChild(div3)
        }
}

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

function isSameDay(date1, date2) {
    return ((new Date(date1)).getDate() === (new Date(date2)).getDate() && (new Date(date1)).getMonth() === (new Date(date2)).getMonth() && (new Date(date1)).getFullYear() === (new Date(date2)).getFullYear())
}

displayResult(0)



let isNewFriendOpen = false

function open_close_add_friends() {
    if (isNewFriendOpen) {
        document.getElementById("new-friend").classList.remove("active")
        document.getElementById("new-friend-overlay").classList.remove("active")
    }
    else {
        window.scrollTo(0, 0);
        
        document.getElementById("new-friend-response").innerText = ""
        document.getElementById("new-friend-txtinput").value = ""

        document.getElementById("new-friend").classList.add("active")
        document.getElementById("new-friend-overlay").classList.add("active")
    }

    isNewFriendOpen = !isNewFriendOpen
}
document.getElementById("add-friend").addEventListener("click", open_close_add_friends)
document.getElementById("new-friend-overlay").addEventListener("click", open_close_add_friends)
document.getElementById("new-friend-close").addEventListener("click", open_close_add_friends)


const fill_friends_placeholders_ID = ["friends-append", "friends-invited-by-append", "friends-invited-append"]
function fill_friends_placeholders() {
    for (let r = 0; r < 3; r++) {
        document.getElementById(fill_friends_placeholders_ID[r]).innerText = ""
        for (let i = 0; i < 4; i++) {
            const div = document.createElement("div")
            div.classList.add("artist", "placeholder")
            if (i === 0)
                div.classList.add("artist-first")
            else if (i === 29)
                div.classList.add("artist-last")
    
    
                const img = document.createElement("div")
                img.classList.add("artist-img", "placeholder")
    
                    const imgAnimation = document.createElement("div")
                    imgAnimation.classList.add("track-img-animation-placeholder")
                    img.appendChild(imgAnimation)
                    
                div.appendChild(img)
    
                const title = document.createElement("div")
                title.classList.add("artist-title", "placeholder")
                    
                    const titleAnimation = document.createElement("div")
                    titleAnimation.classList.add("track-img-animation-placeholder")
                    title.appendChild(titleAnimation)
                    
                div.appendChild(title)
    
                const artist = document.createElement("div")
                artist.classList.add("artist-popularity", "placeholder")
    
                    const artistAnimation = document.createElement("div")
                    artistAnimation.classList.add("track-img-animation-placeholder")
                    artist.appendChild(artistAnimation)
                    
                div.appendChild(artist)
    
            document.getElementById(fill_friends_placeholders_ID[r]).appendChild(div)
        }
    }
}
fill_friends_placeholders()

let socket = io()

socket.on("notifications", notifications => {
    console.log("notifications", notifications)
    if (notifications.length > 0) {
        document.getElementById("notification-dot").innerText = notifications.length
        if (!isLateralBarOpen) {
            document.getElementById("notification-dot").classList.add("active")
        } else {
            delete_all_notifications()
        }
    } else {
        document.getElementById("notification-dot").classList.remove("active")
    }
    
})

let timeoutfriends

socket.on("friends", friends => {
    console.log("friends", friends)
    document.getElementById("friends-append").innerText = ""

    if (is_same_account) {
        clearTimeout(timeoutfriends)
        timeoutfriends = setTimeout(() => {
            document.getElementById("top-main-friends").innerText = (friends.length).toString() + " " + ((friends.length) === 1 ? "Amico" : "Amici")
        }, 1000);
    }

    if (friends.length > 0)
        document.getElementById("bar-section-friends").style.display = "block"
    else
        document.getElementById("bar-section-friends").style.display = "none"

    for (let i = 0; i < friends.length; i++) {
        const div = document.createElement("div")
        div.classList.add("artist", "placeholder")
        if (i === 0)
            div.classList.add("artist-first")
        else if (i === 29)
            div.classList.add("artist-last")

            const img = document.createElement("img")
            img.classList.add("artist-img", "pointer")
            try {
                img.src = friends[i].imageUrl || noImgSrc
            } catch (error) {
                img.src = noImgSrc
            }
            img.alt = "img"
            img.addEventListener("click", () => {
                document.getElementById("top-userimg").src = friends[i].imageUrl || noImgSrc
                document.getElementById("top-main-name").innerText = friends[i].display_name
                document.getElementById("top-main-email").innerText = friends[i].email
                document.getElementById("top-main-friends").innerText = ""
                placeholders_set()
                open_close_top_bar()
                window.location.replace("/"+friends[i].id)
            })
            div.appendChild(img)

            const title = document.createElement("div")
            title.classList.add("artist-title", "pointer")
            try {
                title.innerText = friends[i].display_name
            } catch (error) {}
            title.addEventListener("click", () => {
                document.getElementById("top-userimg").src = friends[i].imageUrl || noImgSrc
                document.getElementById("top-main-name").innerText = friends[i].display_name
                document.getElementById("top-main-email").innerText = friends[i].email
                document.getElementById("top-main-friends").innerText = ""
                placeholders_set()
                open_close_top_bar()
                window.location.replace("/"+friends[i].id)
            })
            div.appendChild(title)

            const lastAccess = document.createElement("div")
            lastAccess.classList.add("artist-popularity", "bar-section-small-txt")
            try {
                const time = seeTimeDifference(friends[i].lastAccess*1000)
                if (time.measureOfTimeNum === 0 || time.measureOfTimeNum === 1)
                    lastAccess.innerText = `Online ora`
                else {
                    lastAccess.innerText = `Ultimo accesso ${Math.trunc(time.value)} ${dividersNameIta[time.measureOfTimeNum][+(Math.trunc(time.value) === 1)]}`
                }
            } catch (error) {
                console.error(error)
            }
            div.appendChild(lastAccess)

            const removeFriend = document.createElement("div")
            removeFriend.classList.add("bar-section-remove", "pointer")
            try {
                removeFriend.innerText = `Rimuovi amico`
            } catch (error) {}
            removeFriend.addEventListener("click", async () => {
                const result = await fetch("/friends/remove/"+friends[i].id, {
                    method: 'POST',
                    headers: myHeaders,
                    redirect: "follow"
                })
            })
            div.appendChild(removeFriend)

        document.getElementById("friends-append").appendChild(div)
    }
})

socket.on("friendsInvited", friendsInvited => {
    console.log("friendsInvited", friendsInvited)
    document.getElementById("friends-invited-append").innerText = ""

    if (friendsInvited.length > 0)
        document.getElementById("bar-section-friends-invited").style.display = "block"
    else
        document.getElementById("bar-section-friends-invited").style.display = "none"

    for (let i = 0; i < friendsInvited.length; i++) {
        const div = document.createElement("div")
        div.classList.add("artist", "placeholder")
        if (i === 0)
            div.classList.add("artist-first")
        else if (i === 29)
            div.classList.add("artist-last")

            const img = document.createElement("img")
            img.classList.add("artist-img", "pointer")
            try {
                img.src = friendsInvited[i].imageUrl || noImgSrc
            } catch (error) {
                img.src = noImgSrc
            }
            img.alt = "img"
            img.addEventListener("click", () => {
                open_close_top_bar()
                window.location.replace("/"+friendsInvited[i].id)
            })
            div.appendChild(img)

            const title = document.createElement("div")
            title.classList.add("artist-title", "pointer")
            try {
                title.innerText = friendsInvited[i].display_name
            } catch (error) {}
            title.addEventListener("click", () => {
                open_close_top_bar()
                window.location.replace("/"+friendsInvited[i].id)
            })
            div.appendChild(title)

            const lastAccess = document.createElement("div")
            lastAccess.classList.add("bar-section-cancel", "pointer")
            lastAccess.innerText = "Annulla"
            lastAccess.addEventListener("click", async () => {
                const result = await fetch("/friends/invite-cancel/"+friendsInvited[i].id, {
                    method: 'POST',
                    headers: myHeaders,
                    redirect: "follow"
                })
            })
            div.appendChild(lastAccess)

        document.getElementById("friends-invited-append").appendChild(div)
    }
})

socket.on("friendsInvitedBy", friendsInvitedBy => {
    console.log("friendsInvitedBy", friendsInvitedBy)
    document.getElementById("friends-invited-by-append").innerText = ""

    if (friendsInvitedBy.length > 0)
        document.getElementById("bar-section-friends-invited-by").style.display = "block"
    else
        document.getElementById("bar-section-friends-invited-by").style.display = "none"

    for (let i = 0; i < friendsInvitedBy.length; i++) {
        const div = document.createElement("div")
        div.classList.add("artist", "placeholder")
        if (i === 0)
            div.classList.add("artist-first")
        else if (i === 29)
            div.classList.add("artist-last")

            const img = document.createElement("img")
            img.classList.add("artist-img", "pointer")
            try {
                img.src = friendsInvitedBy[i].imageUrl || noImgSrc
            } catch (error) {
                img.src = noImgSrc
            }
            img.alt = "img"
            img.addEventListener("click", () => {
                open_close_top_bar()
                window.location.replace("/"+friendsInvitedBy[i].id)
            })
            div.appendChild(img)

            const title = document.createElement("div")
            title.classList.add("artist-title", "pointer")
            try {
                title.innerText = friendsInvitedBy[i].display_name
            } catch (error) {}
            title.addEventListener("click", () => {
                open_close_top_bar()
                window.location.replace("/"+friendsInvitedBy[i].id)
            })
            div.appendChild(title)

            const row = document.createElement("div")
            row.classList.add("row")

                const lastAccess = document.createElement("div")
                lastAccess.classList.add("bar-section-accept", "pointer")
                lastAccess.innerText = "Accetta"
                lastAccess.addEventListener("click", async () => {
                    const result = await fetch("/friends/invite-accept/"+friendsInvitedBy[i].id, {
                        method: 'POST',
                        headers: myHeaders,
                        redirect: "follow"
                    })
                })
                row.appendChild(lastAccess)

                const removeFriend = document.createElement("div")
                removeFriend.classList.add("bar-section-decline", "pointer")
                removeFriend.innerText = "Rifiuta"
                removeFriend.addEventListener("click", async () => {
                    const result = await fetch("/friends/invite-decline/"+friendsInvitedBy[i].id, {
                        method: 'POST',
                        headers: myHeaders,
                        redirect: "follow"
                    })
                })
                row.appendChild(removeFriend)

            div.appendChild(row)

        document.getElementById("friends-invited-by-append").appendChild(div)
    }
})


document.getElementById("new-friend-submit").addEventListener("click", async () => {
    document.getElementById("new-friend-response").innerText = "Caricamento..."

    const result = await fetch("/friends/invite/"+document.getElementById("new-friend-txtinput").value, {
        method: 'POST',
        headers: myHeaders,
        redirect: "follow"
    })

    if (result.status === 200)
        open_close_add_friends()
    else
        document.getElementById("new-friend-response").innerText = "Si è verificato un errore"
})

document.getElementById("new-friend").style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"

document.getElementById("top-bar-logo-text").addEventListener("click", () => {
    document.getElementById("top-userimg").src = user_info.imageUrl || noImgSrc
    document.getElementById("top-main-name").innerText = user_info.display_name
    document.getElementById("top-main-email").innerText = user_info.email
    document.getElementById("top-main-friends").innerText = ""
    placeholders_set()
    window.location.replace("/")
})