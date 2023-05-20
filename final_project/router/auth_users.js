const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let existingUser;
    users.forEach(user => {
        if(user.username == username)
            existingUser = user;
    });
    if(existingUser)
        return true;
    return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    if (isValid(username)){
        for(const user of users){
            if(user.username == username)
                if(user.password == password) 
                    return true;
                else
                    return false;
        }
    }
    else
        return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body;
    if (authenticatedUser(username, password)){
        const token = jwt.sign(password, "theSecretKey");
        req.session.authorization = {token, username};
        return res.status(200).json({message: "User successfully logged in"});
    }
    else
        return res.status(208).json({message: "Invalid Login. Please check username and password."});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const newReview = req.body.review;
  const username = req.username;
  const book = books[req.params.isbn];
  const bookReviews = Object.entries(book.reviews);
  let userfound = false;
  for(const [user,review] in bookReviews) {
      if(user == username){
        userfound = true;
        books[req.params.isbn].reviews[user] = newReview;
      }
  }
  if(!userfound) {
    books[req.params.isbn].reviews[username] = newReview;
  }
  return res.status(200).json({message: `User ${username}' review added with sucess`});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res)=>{
    try {
        delete books[req.params.isbn].reviews[req.username];
    } catch (error) {
        return res.status(404).json({message: "Couldn't delete your review: "+error});
    }
    return res.status(200).json({message: "Review deleted with sucess."});
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
