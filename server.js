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
/*
app.get('/', (req, res) => {

    res.render('pages/searches/show')


});
*/


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

/*
  if (req.body.searchtype === 'title') {
    url = url+"intitle:" + req.body.search;
  }
  else if (req.body.searchtype === 'author') {
    url = url+"inauthor:" + req.body.search;
    // console.log(url)
  }


    */



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





