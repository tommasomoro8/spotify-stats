module.exports = (userInfo, access_token) => {
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
        <title>Spotify Stats</title>
    </head>
    <body>
        <main>
            <div id="top">
                <div id="top-bar">
                    <span id="top-bar-logo-text">
                        <img class="top-bar-img" id="top-bar-logo" src="spotify-logo.png" alt="logo">
                        <div id="top-bar-text">Spotify Stats</div>
                    </span>
    
                    <img class="top-bar-img" id="top-bar-userimg" src="https://i.scdn.co/image/ab6775700000ee856aeb0cf4d3371882dd4fdaf0" alt="user-img">
                </div>
                <div id="top-main">
                    <div id="top-main-content" class="row">
                        <img id="top-userimg" src="https://i.scdn.co/image/ab6775700000ee856aeb0cf4d3371882dd4fdaf0" alt="user-img">
    
                        <div id="top-main-content-text">
                            <div id="top-main-name">${userInfo.display_name}</div>
                            <div id="top-main-email">${userInfo.email}</div>
                            <div id="top-main-friends">0 Amici</div>
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
                        <div class="title-text">Top canzoni</div>
                        <div id="track-subtitle-text" class="subtitle-text">Le tue canzoni preferite nelle ultime 4 settimane</div>
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
                        <div class="title-text">Stream recenti</div>
                        <div id="last-stream-subtitle-text" class="subtitle-text">I tuoi brani riprodotti di recente</div>
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
            </div>
    
            <div id="lateral-bar"></div>
            <div id="lateral-bar-overlay"></div>
        </main>
        
        <div id="hidden-access-token">${access_token}</div>
        <script src="app.js"></script>
    </body>
    </html>
    `
}

//<div id="hidden-user-info">${JSON.stringify(userInfo)}</div>