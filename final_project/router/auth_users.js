const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let duplicatename = users.filter((user)=>{
        return user.username === username
    });
    if (duplicatename.length>0){
        return true;
    }
    else{
        return false;
    }
}

const authenticatedUser = (username,password)=>{ 
    let validity = users.filter((user)=>{
        return(user.username === username && user.password === password)
    });
    if(validity.length>0){
        return true;
    }
    else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password){
    return res.status(404).json({message: "Something went wrong, try again"});
  }
  if(authenticatedUser(username,password)){
    let token = jwt.sign({
        data:password
    }, 'access', { expiresIn: 60*60});
    req.session.authorization = {
        token,username
    }
    return res.status(200).send("Login successful!");
  }
  else{
    return res.status(208).send("Invalid details, please try again");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let bookselect = books[isbn]
  if(bookselect){
        let review = req.query.review;
        let userr = req.session.authorization['username'];
        if(review){
            bookselect['reviews'][userr] = review;
            books[isbn] = bookselect;
        }
        res.send('Review added successfully!');
  }
  else{
    res.send('ISBN falls out of valid range');
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let userr = req.session.authorization['username'];
    let bookselect = books[isbn]['reviews'];
    if (bookselect[userr]){
        delete bookselect[userr];
        res.send(`Review has been deleted!`);
    }
    else{
        res.send("Deletion unsuccessful, this review hasn't been writen by you.");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
