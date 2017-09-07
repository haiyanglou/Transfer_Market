var express = require('express');
var router = express.Router();
var auth = require('./auth');
var User = require("../models/user.js");
var user = new User();

// If the req is needed to be pre-process, do it here.
router.use(function timeLog (req, res, next) {
  next()
});

//07-20 need check whether login
router.get('/', function(req, res) {
    var hasLogin = (req.user)?true:false;
    if(!hasLogin){
    res.render("index",{hasLogin:hasLogin});
    }else{
        res.render("index",{hasLogin:hasLogin, type : req.user.type, user:req.user.username});
    }
});

//07-21
router.get('/login', function(req, res) {
    res.render("login",{hasLogin:false, error:""});
});

// send the input information back server via post. then if it failed, get back to 
// the login page. if succeeded, get back to home page.
// the autentication of it is local.
//07-21
router.post('/login', 
  auth.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

//07-20
router.get('/signup', function(req, res) {
    res.render('login',{hasLogin:false});
});

//07-21
//should take care of register using same username
router.post('/signup', function(req, res) {
    // get data from request.
    // get data enclosed in the json body of the request message from the submit of a web form.
     var username = req.body.username;
     var email = req.body.email;
     var password = req.body.password;
     var club = req.body.club;
     var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
     if (strongRegex.test(password)) {
         auth.generateHash(password,function(error,hash){
            // call signUp method and send the parameter values to the method.
            // res refers to the result from database.
            user.signUp(username, email, club, hash, function(e, r){
                if (e) res.render('login',{hasLogin:false, error:e,errormsgs:[username+" already existed."]});
                else res.render('login',{hasLogin:false, error:""});
            });
        }); 
     }
     else {
        res.render('login',{hasLogin:false, error:"Password is not strong enough",
        errormsgs:["The string must contain at least 1 lowercase alphabetical character",
                "The string must contain at least 1 uppercase alphabetical character",
                "The string must contain at least 1 numeric character",
                "The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict",
                "The string must be eight characters or longer"]});
     }   
});

//07-22
router.get('/logout', auth.ensureLoggedIn(), function(req, res) {
    req.logout();
    res.redirect(req.get('referer'));
});

//07-22
router.get('/search', function(req, res) {
    var name =req.query.name;
    var hasLogin = (req.user)?true:false;
    if(!hasLogin){
        res.render("search",{hasLogin:hasLogin});
    }else{
        res.render("search",{hasLogin:hasLogin, type : req.user.type, user:req.user.username});
    }
});

router.get('/player', function(req, res) {
    var hasLogin = (req.user)?true:false;
    if(!hasLogin){
    res.render("player",{hasLogin:hasLogin});
    }else{
        res.render("player",{hasLogin:hasLogin,type : req.user.type, user:req.user.username});
    }
});

router.get('/club', function(req, res) {
    var hasLogin = (req.user)?true:false;
    if(!hasLogin){
    res.render("club",{hasLogin:hasLogin});
    }else{
        res.render("club",{hasLogin:hasLogin,type : req.user.type, user:req.user.username});
    }
});

module.exports = router;

