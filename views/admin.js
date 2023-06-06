module.exports = (data) => {
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
                                <div><span id="userConnectedLen-live"></span> persone online</div>
                                <span style="position: relative;">
                                    <div class="live-dot"></div>
                                    <div class="live-dot-bg"></div>
                                </span>
                            </div>
                            <div id="top-main-email"><span id="totalConnectionsLen-live"></span> client connessi</div>
                            <div id="top-main-friends"><span id="usersCount-live"></span> account registrati</div>
                        </div>
                    </div>
                    <div id="top-left-img-container">
                        <img class="top-left-img img-1" src="https://i.scdn.co/image/ab6775700000ee856f5e2f3ce7eb0b3431099331" alt="img">
                        <img class="top-left-img img-2" src="https://i.scdn.co/image/ab6775700000ee85ba46066631806d8bf362f109" alt="img">
                        <img class="top-left-img img-3" src="https://i.scdn.co/image/ab6775700000ee8540e21a8a6eb76e5fa526a9a9" alt="img">
                        <img class="top-left-img img-4" src="https://i.scdn.co/image/ab6775700000ee856aeb0cf4d3371882dd4fdaf0" alt="img">
                        <img class="top-left-img img-5" src="https://avatars.githubusercontent.com/u/1" alt="img">
                        <img class="top-left-img img-6" src="https://avatars.githubusercontent.com/u/2" alt="img">
                        <img class="top-left-img img-7" src="https://avatars.githubusercontent.com/u/3" alt="img">
                        <img class="top-left-img img-8" src="https://avatars.githubusercontent.com/u/4" alt="img">
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
                                    <img id="right-column-user-info-img" src="https://i.scdn.co/image/ab6775700000ee856aeb0cf4d3371882dd4fdaf0" alt="tom's img"/>
                                    <span id="right-column-user-info-display_name-id" class="column">
                                        <div id="right-column-user-info-display_name" class="last-stream-track-title">tom</div>
                                        <div id="right-column-user-info-id" class="last-stream-track-artist">tommasomoro05</div>
                                        <div id="right-column-user-email" class="last-stream-track-artist">moroxtommaso@gmail.com</div>
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
                                <div class="last-stream-track">
                                    <div class="last-stream-track-left">
                                        <div class="last-stream-track-img admin error-num error-code-500">500</div>
                                        <div class="last-stream-track-txt">
                                            <div class="last-stream-track-title">Internal error</div>
                                            <div class="last-stream-track-artist">/login</div>
                                        </div>
                                    </div>
                                    <span class="last-stream-track-right-admin-span row">
                                        <div class="last-stream-track-right">10 min ago</div>
                                        <div class="last-stream-track-right admin"></div>
                                    </span>
                                </div>

                                <div class="last-stream-track">
                                    <div class="last-stream-track-left">
                                        <div class="last-stream-track-img admin error-num error-code-400">400</div>
                                        <div class="last-stream-track-txt">
                                            <div class="last-stream-track-title">Internal error</div>
                                            <div class="last-stream-track-artist">tommasomoro05</div>
                                        </div>
                                    </div>
                                    <span class="last-stream-track-right-admin-span row">
                                        <div class="last-stream-track-right">10 min ago</div>
                                        <div class="last-stream-track-right admin"></div>
                                    </span>
                                </div>
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
        
        <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
        <script src="app-admin.js"></script>

        <div id="fill-top-left"></div>
        <div id="fill-top-right"></div>
        
    </body>
    </html>
    `
}
