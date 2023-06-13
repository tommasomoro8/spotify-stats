module.exports = (data, access_token) => {
    return /*html*/`
    <!DOCTYPE html>
    <html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="base.css">
        <link rel="stylesheet" type="text/css" href="style.css">
        <link rel="stylesheet" type="text/css" href="style-admin.css">
        <link rel="icon" type="image/x-icon" href="spotify-logo.png">
        <title>Spotify Stats Admin - Console</title>
    </head>
    <body>
        <main>
            <div id="top">
                <div id="top-bar">
                    <span id="top-bar-logo-text" class="pointer">
                        <img class="top-bar-img" id="top-bar-logo" src="spotify-logo.png" alt="logo">
                        <div id="top-bar-text">Spotify Stats Admin</div>
                    </span>
                </div>
                <div id="top-main">
                    <div id="top-main-content" class="row">
                        <div id="top-main-content-text" class="admin">
                            <div class="admin" id="top-main-name">
                                <div><span id="userConnectedLen-live"></span> <span id="userConnectedLen-live-persone-a">persone</span> online</div>
                                <span style="position: relative;">
                                    <div class="live-dot"></div>
                                    <div class="live-dot-bg"></div>
                                </span>
                            </div>
                            <div id="top-main-email"><span id="totalConnectionsLen-live"></span> client <span id="userConnectedLen-live-connessi-o">connessi</span></div>
                            <div id="top-main-friends"><span id="usersCount-live"></span> account <span id="userConnectedLen-live-registrati-o">registrati</span></div>
                        </div>
                    </div>
                    <div id="top-left-img-container">
                        <img class="top-left-img img-1" src="" alt="img">
                        <img class="top-left-img img-2" src="" alt="img">
                        <img class="top-left-img img-3" src="" alt="img">
                        <img class="top-left-img img-4" src="" alt="img">
                        <img class="top-left-img img-5" src="" alt="img">
                        <img class="top-left-img img-6" src="" alt="img">
                        <img class="top-left-img img-7" src="" alt="img">
                        <img class="top-left-img img-8" src="" alt="img">
                    </div>

                </div>
            </div>
    
            <div id="content">

                <div class="section row-admin">
                    <span id="left-column" class="column">
                        <div class="section-titles admin">
                            <div class="column">
                                <div class="title-text admin">
                                    Account online ora
                                    <span class="live-dot-title-text" style="position: relative;">
                                        <div class="live-dot"></div>
                                        <div class="live-dot-bg"></div>
                                    </span>
                                </div>
                                <div id="last-stream-subtitle-text" class="subtitle-text">Persone che stanno visitando il sito in questo momento</div>
                            </div>
                        </div>

                        <div id="last-stream-online-users" class="last-stream admin online">
                    
                        </div>



                        <div class="section-titles admin margin-top">
                            <div class="column">
                                <div class="title-text admin">
                                    Account offline
                                </div>
                                <div id="last-stream-subtitle-text" class="subtitle-text">Ultime persone andate offline</div>
                            </div>
                        </div>

                        <div id="last-stream-offline-users" class="last-stream admin">

                        </div>








                    </span>

                    <span id="right-column" class="row">
                        <span id="right-column-user-info" class="column">

                            <div id="right-column-user-info-content" class="last-stream admin">
                                <div class="right-column-user-info-title no-margin-top">Utente</div>
                                <div class="row">
                                    <img id="right-column-user-info-img" src="" alt=""/>
                                    <span id="right-column-user-info-display_name-id" class="column">
                                        <div id="right-column-user-info-display_name" class="last-stream-track-title"></div>
                                        <div id="right-column-user-info-id" class="last-stream-track-artist"></div>
                                        <div id="right-column-user-email" class="last-stream-track-artist"></div>
                                        <a id="href-activity">Visualizza la sua attività</a>
                                    </span>
                                </div>
                                <div class="right-column-user-info-title">Informazioni account</div>
                                <div class="right-column-user-info-title-content"><span class="txt-grey">Tipo: </span><span id="right-column-user-type">user</span></div>
                                <div class="right-column-user-info-title-content"><span class="txt-grey">Abbonamento: </span><span id="right-column-user-product">free</span></div>
                                <div class="right-column-user-info-title-content"><span class="txt-grey">Explicit enabled: </span><span id="right-column-user-explicit_content-filter_enabled">free</span></div>
                                <div class="right-column-user-info-title-content"><span class="txt-grey">Filter locked: </span><span id="right-column-user-explicit_content-filter_locked">free</span></div>
                                
                                <div class="right-column-user-info-title">Client connessi</div>
                                <div id="right-column-user-clients">
                                
                                </div>

                                <br>
                            </div>

                        </span>

                        <span id="right-column-content" class="column">
                            <div class="section-titles admin">
                                <div class="column">
                                    <div class="title-text admin">
                                        Errors log
                                        <span class="live-dot-title-text" style="position: relative;">
                                            <div class="live-dot"></div>
                                            <div class="live-dot-bg"></div>
                                        </span>
                                    </div>
                                    <div id="last-stream-subtitle-text" class="subtitle-text">Monitora gli errori che si verificano nel server</div>
                                </div>
                            </div>

                            <div id="last-stream" class="last-stream admin">
                            
                                <a class="seemore" onclick="window.open('https://console.firebase.google.com/u/0/project/spotify-stats-tommaso-moro/firestore/data/~2Flog')">Show more</a>
                            </div>
                        </span>
                    </span>
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
        </main>
        
        <div id="hidden-init-data" class="column" style="color:white;">${JSON.stringify(data)}</div>
        <div id="hidden-access-token" class="column" style="color:white;">${JSON.stringify(access_token)}</div>
        
        <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
        <script src="app-admin.js"></script>

        <div id="fill-top-left"></div>
        <div id="fill-top-right"></div>
        
    </body>
    </html>
    `
}
