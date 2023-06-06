module.exports = (userInfo, contentInfo, access_token, admin = false) => {
    // console.log(userInfo.id)
    // console.log(contentInfo.id)
    return /*html*/`
    <!DOCTYPE html>
    <html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="base.css">
        <link rel="stylesheet" type="text/css" href="style.css">
        <link rel="icon" type="image/x-icon" href="spotify-logo.png">
        <title>Spotify Stats - ${contentInfo.display_name}</title>
    </head>
    <body>
        <main>
            <div id="top">
                <div id="top-bar">
                    <span id="top-bar-logo-text" class="pointer">
                        <img class="top-bar-img" id="top-bar-logo" src="spotify-logo.png" alt="logo">
                        <div id="top-bar-text">${(!admin) ? "Spotify Stats" : "Spotify Stats Admin"}</div>
                    </span>          
                    ${(()=>{
                        if (admin) {
                            return /*html*/`
                                <span id="top-bar-logo-userimg-admin">
                                    Torna alla console
                                </span>
                            `
                        } else {
                            return /*html*/`
                                <span id="top-bar-logo-userimg">
                                    <img class="top-bar-img" id="top-bar-userimg" src="${userInfo.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}" alt="user-img">
                                    <div id="notification-dot">1</div>
                                </span>
                            `
                        }
                    })()}
                </div>
                <div id="top-main">
                    <div id="top-main-content" class="row">
                        <img id="top-userimg" src="${contentInfo.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}" alt="user-img">
    
                        <div id="top-main-content-text">
                            <div id="top-main-name">${contentInfo.display_name}</div>
                            <div id="top-main-email">${contentInfo.email}</div>
                            <div id="top-main-friends">${contentInfo.friendsNum} ${(contentInfo.friendsNum) === 1 ? "Amico" : "Amici"}</div>
                        </div>
                    </div>
                    
                </div>
            </div>
    
            <div id="content">
                <div class="section first-section">
                    <div id="selector">
                        <div id="selector-wrapper">
                            <div id="onemonth" class="selection green">1 mese</div>
                            <div id="sixmonth" class="selection">6 mesi</div>
                            <div id="ever" class="selection">sempre</div>
                            <div id="selector-selected"></div>
                        </div>
                    </div>
                    <div class="section-titles">
                        <div class="title-text">Top generi</div>
                        <div id="genre-subtitle-text" class="subtitle-text">I tuoi generi preferiti nelle ultime 4 settimane</div>
                    </div>
                    <div id="genre-scrolls-wrapper">
                        <div id="genre-scrolls" class="scrollbar">
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-titles">
                        <span id="section-titles-text-audiotrigger">
                            <div class="column">
                                <div class="title-text">Top canzoni</div>
                                <div id="track-subtitle-text" class="subtitle-text">Le tue canzoni preferite nelle ultime 4 settimane</div>
                            </div>
                            <div id="audiotrigger" class="pointer">
                                <img id="audiotriggerimg" src="/mute.png"/>
                            </div>
                        </span>
                    </div>
                    <div id="track-scrolls-wrapper">
                        <div id="track-scrolls" class="scrollbar">
                        </div>
                    </div>
                </div>
    
                <div class="section">
                    <div class="section-titles">
                        <div class="title-text">Top artisti</div>
                        <div id="artist-subtitle-text" class="subtitle-text">I tuoi artisti preferiti nelle ultime 4 settimane</div>
                    </div>
                    <div id="artist-scrolls-wrapper">
                        <div id="artist-scrolls" class="scrollbar">
                        </div>
                    </div>
                </div>
    
                <div class="section">
                    <div class="section-titles">
                        <span id="section-titles-text-audiotrigger2">
                            <div class="column">
                                <div class="title-text">Stream recenti</div>
                                <div id="last-stream-subtitle-text" class="subtitle-text">I tuoi brani riprodotti di recente</div>
                            </div>
                            <div id="audiotrigger2" class="pointer">
                                <img id="audiotriggerimg2" src="/mute.png"/>
                            </div>
                        </span>
                    </div>
                    <div id="last-stream" class="last-stream">
                    </div>
                </div>
            </div>
    
            <div id="last-section" class="section">
                <div id="last-section-links">
                    <a class="last-section-link" href="/python-script-download">Scarica lo script Python</a>
                    <div class="last-section-links-separator">&nbsp;&nbsp;|&nbsp;&nbsp;</div>
                    <a class="last-section-link" onclick="window.open('https://github.com/tommasomoro8')">Visita il mio GitHub</a>
                    <div class="last-section-links-separator">&nbsp;&nbsp;|&nbsp;&nbsp;</div>
                    <a class="last-section-link" onclick="window.open('https://www.instagram.com/tommaso.moroo/')">Visita il mio Instagram</a>
                </div>
                <div id="last-section-credits">Creato con&nbsp;<div id="last-section-heart">💚</div>&nbsp;da Tommaso Moro</div>
                <div id="last-section-fill-left"></div>
                <div id="last-section-fill-right"></div>
            </div>
    
            <div id="lateral-bar">
                <div id="bar-section-top">
                    <a id="logout" class="bar-section-top-button" href="/logout">Log out</a>
                    <div id="add-friend" class="bar-section-top-button pointer">Aggiungi un amico</div>
                </div>
                <div id="lateral-bar-content">
                    <span id="bar-section-friends">
                        <div class="bar-section-titles">
                            <div class="title-text">Amici</div>
                            <div id="artist-subtitle-text" class="subtitle-text">Persone con cui condividete le vostre attività</div>
                        </div>
                        <div class="artist-scrolls-wrapper">
                            <div id="friends-append" class="artist-scrolls scrollbar"></div>
                        </div>
                    </span>
                    
                    <span id="bar-section-friends-invited-by">
                        <div class="bar-section-titles">
                            <div class="title-text">Inviti ricevuti</div>
                            <div id="artist-subtitle-text" class="subtitle-text">Persone che ti hanno invitato a condividere la vostra attività</div>
                        </div>
                        <div class="artist-scrolls-wrapper">
                            <div id="friends-invited-by-append" class="artist-scrolls scrollbar"></div>
                        </div>
                    </span>

                    <span id="bar-section-friends-invited">
                        <div class="bar-section-titles">
                            <div class="title-text">Amici Invitati</div>
                            <div id="artist-subtitle-text" class="subtitle-text">Persone che hai invitato a condividere la vostra attività</div>
                        </div>
                        <div class="artist-scrolls-wrapper">
                            <div id="friends-invited-append" class="artist-scrolls scrollbar"></div>
                        </div>
                    </span>
                </div>
            </div>
            <div id="lateral-bar-overlay"></div>

            <div id="new-friend">
                <div id="new-friend-topbar">
                    <div id="new-friend-close" class="pointer">x</div>
                </div>
                <div id="new-friend-title">Invita un amico</div>
                <div id="new-friend-subtitle">Inserisci il suo Spotify ID e clicca aggiungi</div>
                <input id="new-friend-txtinput" type="text" placeholder="&nbsp;&nbsp;Spotify ID">
                <div id="new-friend-row">
                    <div id="new-friend-submit" class="pointer">Aggiungi</div>
                    <div id="new-friend-response"></div>
                </div>
            </div>
            <div id="new-friend-overlay"></div>
        </main>
        
        <div id="hidden-access-token">${access_token}</div>
        <div id="hidden-user-info">${JSON.stringify(userInfo)}</div>
        <div id="hidden-is-same-account">${userInfo.id === contentInfo.id}</div>
        
        <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
        <script src="app.js"></script>

        <div id="fill-top-left"></div>
        <div id="fill-top-right"></div>
    </body>
    </html>
    `
}