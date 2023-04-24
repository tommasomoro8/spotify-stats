module.exports = (access_token, userInfo) => {
    // usa userInfo e leva chiamata da client
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
        <button onclick="window.location.href = '/'"><-- indietro</button>
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
