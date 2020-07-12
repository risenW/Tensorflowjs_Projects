const express = require("express");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");
const books = require("./data/web_book_data.json")
const model = require("./model")

const app = express();
app.set("views", "./views");
app.set("view engine", "hbs");

//Body parser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());


app.engine('.hbs', expressHbs({
    defaultLayout: 'layout',
    extname: '.hbs'
}));


app.get("/", (req, res) => {
    res.render("index", { books: books.slice(0, 12), pg_start: 0, pg_end: 12 })
});



app.get("/recommend", (req, res) => {
    let userId = req.query.userId
    if (Number(userId) > 53424 || Number(userId) < 0) {
        res.send("User Id cannot be greater than 53,424 or less than 0!")
    } else {
        recs = model.recommend(userId)
            .then((recs) => {
                res.render("index", { recommendations: recs, forUser: true })
            })
    }



})

app.get("/get-next", (req, res) => {
    let pg_start = Number(req.query.pg_end)
    let pg_end = Number(pg_start) + 12
    res.render("index", {
        books: books.slice(pg_start, pg_end),
        pg_start: pg_start,
        pg_end: pg_end
    })
});


app.get("/get-prev", (req, res) => {
    let pg_end = Number(req.query.pg_start)
    let pg_start = Number(pg_end) - 12

    if (pg_start <= 0) {
        res.render("index", { books: books.slice(0, 12), pg_start: 0, pg_end: 12 })

    } else {
        res.render("index", {
            books: books.slice(pg_start, pg_end),
            pg_start: pg_start,
            pg_end: pg_end
        })

    }
});


module.exports = app;
