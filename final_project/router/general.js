const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const {username, password} = req.body;
    if(username && password) {
        if(isValid(username)) {
            return res.send("User already exists !");
        }
        users.push({"username":username, "password": password});
        return res.status(200).json({message: `The user ${username} has been correctly registered`});
    }
    else
        return res.status(400).json({message: "User can't be registered. Please check username & password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn],null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksList = Object.entries(books);
    const authorBooks = [];
    for (const [key,book] of booksList) {
        if (book.author == author)
            authorBooks.push(book);        
    }
    return res.send(JSON.stringify(authorBooks,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksList = Object.entries(books);
    for (const [key,book] of booksList) {
        if (book.title == title)
            return res.send(JSON.stringify(book, null, 4));
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
