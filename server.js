
/*
'use strict';
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT || 4000;

//  set the view engine
app.set('view engine', 'ejs');


//app.use(express.static('/public'));
app.use('/public', express.static('public'));


app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {

    res.render('pages/index')


});

app.post('/searches/show',(req, res) => {

    const url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.searchBy}+${req.body.input}`;
    //const url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.input}+in${req.body.searchBy}:${req.body.input}`;
    
    if(req.body.searchBy === 'title'){

      url += "intitle:" + req.body.search;
    }
    else if (req.body.searcBy === 'author') {
        url += "inauthor:" + req.body.search;
        
      }



    superagent.get(url)
        .then(data => {
            let element = data.body.items;
            let book = element.map(data => new Book(data));
            res.render('pages/searches/show', { books: book });
        })
    });

function Book(data) {
    // if statments inside the function 
    this.title = data.volumeInfo.title ? data.volumeInfo.title : "No Title Available";
    this.imgUrl = (data.volumeInfo.imageLinks && data.volumeInfo.imageLinks.thumbnail) ? data.volumeInfo.imageLinks.thumbnail : "https://i.imgur.com/J5LVHEL.jpg";
    this.authors = data.volumeInfo.authors ? data.volumeInfo.authors : "No Authors";
    this.desc = data.volumeInfo.description ? data.volumeInfo.description : "No description available";
}

let message = "ERROR"
app.get('*', (req, res) => {
    res.status(404).render('pages/error', { 'message': message })
});



app.listen(PORT, () => console.log(`up and running on port ${PORT}`));

*/
'use strict';
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const app = express();

const PORT = process.env.PORT || 3000;
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

app.get('/searches/new', searchForm); // function 1
app.post('/searches', getDataFromForm); // function 2
app.get ('/' , getAllBooks); // function 3
app.get('/books/detail' , addBook); // function 4
app.post('/books/detail' , processBook); // function 5
app.get('/books/detail/:allbooks_id' , addBookById) // function 6

function handleError(error, response){
    response.render('pages/error', {error: error});
}
// function 1
function searchForm (req, res) {
    res.render('pages/searches/new');
};

// function 2
function getDataFromForm(req, res) {
    
   
    const url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.searchBy}+${req.body.input}`;
    
    if(req.body.searchBy === 'title'){

      url += "intitle:" + req.body.search;
    }
    else if (req.body.searcBy === 'author') {
        url += "inauthor:" + req.body.search;
        
      }
   
   
   
    return superagent.get(url)
        .then(data => {
            let element = data.body.items;
            let book = element.map(data => {return new Book(data)});
            res.render('pages/searches/show', { books: book });
        })
    };
// function 3
function getAllBooks(req ,res){
    let SQL = `SELECT * FROM books ;`;
    client.query(SQL)
    .then( data => {
        res.render('pages/index.ejs' , {allbooks : data.rows});
    }).catch(err => handleError(err));
}
// function 4
function addBook(req , res){
    res.render('pages/books/detail');
}
// function 5
function processBook (req ,res){
    let {title, author, isbn, image_url, description, bookshelf} =req.body;
    let SQL = `INSERT INTO books (title, author, isbn, image_url, description, bookshelf) VALUES ($1 , $2 , $3 , $4 , $5 ,$6) ;`;
    let values = [title, author, isbn, image_url, description, bookshelf];
    client.query(SQL ,values)
    .then( () => {
        res.redirect('/');
    }).catch( err => handleError(err));
}

// function 6
function addBookById( req ,res){
    // from database books_id_seq
    let id = req.params.allbooks_id;
    let SQL =`SELECT * FROM books WHERE id=$1`;
    let values = [id];
    client.query(SQL ,values)
    .then ( data =>{
        res.render( 'pages/books/detail' , { bookChouse : data.rows[0]})
    }).catch(err => handleError(err));

}

// constractuor function 
function Book(data) {
    // if statements  as one line method
    this.id = data.id;
    this.etag=data.etag;
    this.title = data.volumeInfo.title ? data.volumeInfo.title : "No Title Available";
    this.imgUrl = (data.volumeInfo.imageLinks && data.volumeInfo.imageLinks.thumbnail) ? data.volumeInfo.imageLinks.thumbnail : "https://i.imgur.com/J5LVHEL.jpg";
    this.authors = data.volumeInfo.authors ? data.volumeInfo.authors : "No Authors";
    this.desc = data.volumeInfo.description ? data.volumeInfo.description : "No description available";
}

app.get('*', (req, res) => {
res.status(404).send('not found');
});


client.connect()
.then( () => {
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
});



