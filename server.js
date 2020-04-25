'use stric';
require('dotenv').config();
const express = require('express');
const pg = require('pg');
const PORT = process.env.PORT || 3030;
const app = express();
const methodOverride = require('method-override');
const superagent = require('superagent');

app.use(express.static('./public'));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

const client = new pg.Client(process.env.DATABASE_URL);


// all ruote 
app.get('/', showdataBase);
app.post('/result', searchBook);
app.post('/add', addBooks)

app.get('/new', (req, res) => {
    res.render('new')
})

function addBooks(req, res) {
    let { title, smallThumbnail, authors, description } = req.body;
    let sql = `INSERT INTO test3(title, smallThumbnail, authors, description) VALUES ($1,$2,$3,$4);`;
    let saveValues = [title, smallThumbnail, authors, description];
    client.query(sql, saveValues)
        .then(() => {
            res.redirect('/');
        });
}

function searchBook(req, res) {
    let url;

    if (req.body.search === 'title') {
        console.log(req.body.searchtype)
        url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.value}&intitle:${req.body.value}`;
        console.log('this is title url :', url);
    } else if (req.body.search === 'author') {
        url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.value}+inauthor:${req.body.value}`;
        console.log('this is author url :', url);
    }
    superagent.get(url)
        .then((data) => {
            let itemes = data.body.items;
            let books = itemes.map((val) => {
                return new Books(val);
            })
            res.render('result', { books: books });
        });
}


function showdataBase(req, res) {
    let sql = `SELECT * FROM test3;`;
    return client.query(sql)
        .then(result => {
            res.render('index', { result: result.rows });
        });
}

function Books(book) {
    this.title = book.volumeInfo.title;
    this.authors = book.volumeInfo.authors;
    this.description = book.volumeInfo.description;
    this.smallThumbnail = book.volumeInfo.imageLinks.smallThumbnail;
}

app.get('*', (req, res) => {
    res.status(404).send('this route dose not exist ');
})
client.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`listing on PORT ${PORT}`);
        })

    })