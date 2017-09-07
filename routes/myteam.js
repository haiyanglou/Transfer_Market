var express = require('express');
var router = express.Router();
var auth = require('./auth');
var User = require("../models/user.js");
var user = new User();

var multer = require('multer');
var upload = multer({ dest: 'public/images/' });
var fs = require('fs');

router.get('/', auth.ensureLoggedIn(), function(req, res) {
    res.render('myTeam_index',{hasLogin:true,type : req.user.type, user:req.user.username});
});

router.post('/playerimage/upload',upload.any(),function(req,res, next) {
    if(req.files) {
        req.files.forEach(function(file){
            fs.rename(file.path,'public/images/'+file.originalname, function(err, res){
               if(err) throw err;
            //    res.send('hhahh');
            });
        }); 
    }
});

module.exports = router;