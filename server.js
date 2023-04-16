const querystring = require("querystring")
const request = require("request")
const cookieParser = require("cookie-parser")

const express = require("express")
const app = express()

const dev = app.get("env") === 'development'

if (dev) require('dotenv').config()

/* views */
const indexpage = require('./views/index')
const landingpage = require('./views/landing')

/* middleware */
const secureHttps = require("./middleware/secureHttps")

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

function generateRandomString(length) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

app.set("trust proxy", true);
app.use(secureHttps(dev))
app.use(cookieParser())

app.use("/", express.static('./static'))

app.get("/", (req, res) => {
    let access_token = req.cookies.access_token
    let refresh_token = req.cookies.refresh_token

    if (!access_token && !refresh_token) {
        res.setHeader("Content-Type", "text/html")
        return res.send(landingpage())
    }

    if (!access_token && refresh_token)
        return res.redirect("/refresh_token")

    res.setHeader("Content-Type", "text/html")
    res.send(indexpage(access_token))
})


app.get('/login', (req, res) => {
    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email user-top-read';
  
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }))
})

app.get('/callback', (req, res) => {
    let code = req.query.code || null;
    let state = req.query.state || null;
  
    if (state === null)
        return res.send('state_mismatch')
    
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    }

    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.cookie("access_token", body.access_token, { maxAge: 60 * 60 * 1 * 1000 /* 1h */, httpOnly: true, secure: true, SameSite: 'strict' })
            res.cookie("refresh_token", body.refresh_token, { maxAge: 60 * 60 * 87600 * 1000 /* 1y */, httpOnly: true, secure: true, SameSite: 'strict' })
            
            return res.redirect("/")
        }
        else {
            console.log(error)
            console.log(response.statusCode)
            // console.log(response)
            return res.send("error")
        }
    })
})


app.get('/refresh_token', (req, res) => {
    let refresh_token = req.query.refresh_token || req.cookies.refresh_token

    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };
  
    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            let access_token = body.access_token;
            res.cookie("access_token", access_token, { maxAge: 60 * 60 * 1 * 1000 /* 1h */, httpOnly: true, secure: true, SameSite: 'strict' })
            
            return res.redirect("/")
        }
        else {
            console.log(error)
            console.log(response.statusCode)
            // console.log(response)
            return res.send("error")
        }
    });
});



app.get("*", (req, res) => {
    res.setHeader("Content-Type", "text/html")
    res.status(404).send("404 page not found")
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`listening on port ${port} in ${app.get("env")} mode...`)
}) //export NODE_ENV=production or development