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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
