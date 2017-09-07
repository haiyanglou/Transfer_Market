var base = require("../models/base.js");

var User = function(){
    this.table = 'User';
}

User.prototype = Object.create(base.prototype);
User.prototype.findOneWithPassword = function(userIdentity,callback){
    var sql = "SELECT username, password"
                +" FROM transfermarket.User"
                +" WHERE username=? LIMIT 1";
    var values = [userIdentity];
    this.execute(sql, values, function(error, res){
        var item = null;
        if(res.length > 0)item = res[0];
        callback && callback(error, item);
    });
};

// get current time method: GETDATE().
// callback refers to the function in router.js, 
// when the result is generated, it will callback the function in router.js.
User.prototype.signUp = function(username, email, club, password, callback){
    var sql="INSERT INTO transfermarket.User (username, email, club, password)"
        +" VALUES ( ?, ?, ?, ?)"
    var values=[username, email, club, password];
    this.execute(sql,values,function(error, res){
        if(error && error.code == "ER_DUP_ENTRY") error="Duplicated username.";
         callback && callback(error, res);
    });
}

User.prototype.findOneByUsername = function(username,callback){
    this.findOne(null, "`username`=\""+username+"\"",function(error, user){
        callback && callback(error, user);
    });
};

exports = module.exports = User;