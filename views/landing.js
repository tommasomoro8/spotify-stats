module.exports = () => {
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
            <div id="top" class="error">
                <div id="top-bar">
                    <span id="top-bar-logo-text">
                        <img class="top-bar-img" id="top-bar-logo" src="spotify-logo.png" alt="logo">
                        <div id="top-bar-text">Spotify Stats</div>
                    </span>
                </div>

                <div id="top-main-content-error" class="column">
                    <div id="error-main-text">
                        <span class="login_hover pointer" onclick=" window.location.href = '/login' ">Clicca qui per accedere</span>
                    </div>
                    <div id="error-second-text">Verrai reindirizzato alla pagina di Spotify®</div>
                </div>
            </div>
        </main>
        <div id="last-section" class="section error">
            <div id="last-section-links">
                <a class="last-section-link" onclick="window.open('https://github.com/tommasomoro8')">Visita il mio GitHub</a>
                <div class="last-section-links-separator">&nbsp;&nbsp;|&nbsp;&nbsp;</div>
                <a class="last-section-link" onclick="window.open('https://www.instagram.com/tommaso.moroo/')">Visita il mio Instagram</a>
            </div>
            <div id="last-section-credits">Creato con&nbsp;<div id="last-section-heart">💚</div>&nbsp;da Tommaso Moro</div>
        </div>

        <div id="fill-top-left"></div>
        <div id="fill-top-right"></div>
    </body>
    </html>
    `
}