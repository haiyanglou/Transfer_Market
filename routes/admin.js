var express = require('express');
var router = express.Router();
var auth = require('./auth');

router.get('/', auth.ensureLoggedIn({type:"admin",redirectTo:"/admin/login"}),
    function(req, res) {
        res.render("admin_index",{hasLogin:true,type : req.user.type, user:req.user.username, user:req.user.username});
});

router.get('/login', function(req, res) {
   res.render("admin_login");
});

router.post('/login', 
  auth.authenticate("local.admin", { failureRedirect: '/admin/login' }),
  function(req, res) {
    res.redirect('/admin');
  });

router.get('/logout', auth.ensureLoggedIn({type:"admin",redirectTo:"/admin/login"}), 
    function(req, res) {
        req.logout();
        res.redirect(req.get('referer'));
});

module.exports = router;