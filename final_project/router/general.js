const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!isValid(username)){
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "Registration successful!"});
    }
    else{
        return res.status(404).json({message: "Username already exists, try again"});
    }
  }
  return res.status(404).json({message: "Please provide valid details"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(books);
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let booksbyauthor = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["author"] === req.params.author) {
      booksbyauthor.push({"isbn":isbn,
                          "title":books[isbn]["title"],
                          "reviews":books[isbn]["reviews"]});
    }
  });
  res.send(JSON.stringify({booksbyauthor}, null, 4));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn":isbn,
                            "author":books[isbn]["author"],
                            "reviews":books[isbn]["reviews"]});
      }
    });
    res.send(JSON.stringify({booksbytitle}, null, 4));
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbnParam = req.params.isbn;
    const reviews = books[isbnParam]["reviews"];
    res.send(reviews);
  return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/async-get-books',function (req, res) {

    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 10 resolved"));

  });

  public_users.get('/async-get-books/isbn/:isbn',function (req, res) {
    const get_books_isbn = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        if (req.params.isbn <= 10) {
            resolve(res.send(books[isbn]));
        }
        else {
            reject(res.send('ISBN not found'));
        }
    });

    get_books_isbn.then(function(){
        console.log("Promise for Task 11 is resolved");
    }).catch(function () { 
            console.log('ISBN not found');
        });

});

public_users.get('/async-get-books/author/:author',function (req, res) {

    const get_books_author = new Promise((resolve, reject) => {

        let booksbyauthor = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
        if(books[isbn]["author"] === req.params.author) {
            booksbyauthor.push({"isbn":isbn,
                                "title":books[isbn]["title"],
                                "reviews":books[isbn]["reviews"]});
        resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
        }


        });
        reject(res.send("The mentioned author does not exist "))
        
    });

    get_books_author.then(function(){
            console.log("Promise is resolved");
    }).catch(function () { 
                console.log('The mentioned author does not exist');
    });

});

public_users.get('/async-get-books/title/:title',function (req, res) {

    const get_books_title = new Promise((resolve, reject) => {

        let booksbytitle = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
        if(books[isbn]["title"] === req.params.title) {
            booksbytitle.push({"isbn":isbn,
                                "author":books[isbn]["author"],
                                "reviews":books[isbn]["reviews"]});
        resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
        }


        });
        reject(res.send("The mentioned title does not exist "))
        
    });

    get_books_title.then(function(){
            console.log("Promise is resolved");
    }).catch(function () { 
                console.log('The mentioned title does not exist');
    });

});
module.exports.general = public_users;
