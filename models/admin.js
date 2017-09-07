var base = require("./base.js");

var Admin = function(){
    this.table = 'Admin';
}

Admin.prototype = Object.create(base.prototype);
Admin.prototype.findOneWithPassword = function(userIdentity,callback){
    var sql = "SELECT username, password"
                +" FROM transfermarket.Admin"
                +" WHERE username=? LIMIT 1";
    var values = [userIdentity];
    this.execute(sql, values, function(error, res){
        var item = null;
        if(res.length > 0)item = res[0];
        callback && callback(error, item);
    });
};

Admin.prototype.findOneByUsername = function(username,callback){
    this.findOne(null, "`username`=\""+username+"\"",function(error, user){
        callback && callback(error, user);
    });
};

exports = module.exports = Admin;