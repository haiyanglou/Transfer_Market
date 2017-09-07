var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/transfermarket');

//get user's club
router.get('/', function(req, res) {
    var collection = db.get('clubs');
    if(req.user && req.user.type == "manager"){
        collection.find({name : req.user.club}, function(err, clubs){
            if (err) throw err;
            res.json(clubs);
        });
    } else {
        collection.find({}, function(err, clubs){
            if (err) throw err;
            res.json(clubs);
        });
    }
});

//get club with id
router.get('/:id', function(req, res) {
    var collection = db.get('clubs');
    collection.findOne({ _id: req.params.id }, function(err, club){
        if (err) throw err;
      	res.json(club);
    });
});

//edit club
router.put('/:id', function(req, res){
    var collection = db.get('clubs');
    collection.update({
        _id: req.params.id
    },
    {
        $set: {
            favor: req.body.favor
        }
    }, function(err, club){
        if (err) throw err;
        res.json(club);
    });
});

module.exports = router;