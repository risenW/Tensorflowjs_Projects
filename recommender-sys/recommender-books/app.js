const express = require("express");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");
const books = require("../data/web_book_data.json")

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

// const data_json = fs.readFileSync("data/web_book_data.json")

app.get("/", (req, res) => {
    res.render("index", { books: books.slice(0, 10), pg_start: 0, pg_end: 10 })
});


app.get("/get-next", (req, res) => {
    let pg_start = Number(req.query.pg_end)
    let pg_end = Number(pg_start) + 10
    console.log(pg_start)
    console.log(pg_end)
    res.render("index", {
        books: books.slice(pg_start, pg_end),
        pg_start: pg_start,
        pg_end: pg_end
    })
});


app.get("/get-prev", (req, res) => {
    let pg_end = Number(req.query.pg_start)
    let pg_start = Number(pg_end) - 10
    console.log(pg_start)
    console.log(pg_end)

    if (pg_start <= 0) {
        res.render("index", { books: books.slice(0, 10), pg_start: 0, pg_end: 10 })

    } else {
        res.render("index", {
            books: books.slice(pg_start, pg_end),
            pg_start: pg_start,
            pg_end: pg_end
        })

    }
});


module.exports = app;
