var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/transfermarket');

// get players
// always return an array, otherwise it may cause error in AngularApp
router.get('/', function(req, res) {
    var collection = db.get('players');
    var query={};
    for (var key in req.query) {
        if(req.query[key]) {
            if (key == "clubId") query.clubId = new ObjectID(req.query[key]);
            else if (key == "shelf") query.shelf = req.query[key] == "true" ? true:false;
            else query[key] = req.query[key];
        }
    }
    query.delete = false;
    if(query.name){
        collection.createIndex({"name":"text"});
        collection.find({ $text: { $search: req.query.name }, delete:false }, function(err, player){
        if (err) throw err;
            res.json(player);
        });
    } else {
        collection.find(query, function(err, players){
        if (err) throw err;
      	res.json(players);
        });
    }
});

//get player with id
router.get('/:id', function(req, res) {
    var collection = db.get('players');
    collection.findOne({ _id: req.params.id }, function(err, player){
        if (err) throw err;
      	res.json(player);
    });
});

//add player
router.post('/', function(req, res){
    var collection = db.get('players');
    collection.insert({
        name: req.body.name,
        image: req.body.image,
        age: parseInt(req.body.age,10),
        nationality: req.body.nationality,
        position: req.body.position,
        height: req.body.height,
        foot: req.body.foot,
        club: req.body.club,
        clubId: new ObjectID(req.body.clubId),
        market_value: req.body.market_value,
        shelf: req.body.shelf,
        delete: req.body.delete
    }, function(err, player){
        if (err) throw err;
        res.json(player);
    });
});

//edit player
router.put('/:id', function(req, res){
    var collection = db.get('players');
    var set = {};
    if(!req.body.byManager){
        set.club = req.body.club;
        set.clubId = new ObjectID(req.body.clubId);
        set.shelf = req.body.shelf;
        set.delete = req.body.delete;
    } else {
        set.name =req.body.name;
        set.image =req.body.image;
        set.age =parseInt(req.body.age,10);
        set.height =req.body.height;
        set.market_value =req.body.market_value;
        set.shelf =req.body.shelf;
    }
    collection.update({
        _id: req.params.id
    },
    {
        $set: set
    }, function(err, player){
        if (err) throw err;
        res.json(player);
    });
});

//soft delete player
router.delete('/:id', function(req, res){
    var collection = db.get('players');
    collection.update({
        _id: req.params.id
    },
    {
        $set: {
            delete: true
        }
    }, function(err, player){
        if (err) throw err;
        res.json(player);
    });
});

module.exports = router;