module.exports = (development) => {
    if (development) return (req, res, next) => {
        next();
    }

    else return (req, res, next) => {
        if (req.headers.host === "partypayit.herokuapp.com")
            return res.redirect("https://www.partypay.it")

        if (!req.secure)
            return res.redirect("https://" + req.headers.host + req.url);
 
        next();
    }
}