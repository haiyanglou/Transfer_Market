var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/transfermarket');

router.get('/', function(req, res) {
    var collection = db.get('messages');
    var queryClubFrom={};
    var queryClubTo={};
    for (var key in req.query) {
        if(req.query[key]) {
            if (key == "clubId") {
                queryClubFrom.fromId = new ObjectID(req.query[key]);
                queryClubTo.toId = new ObjectID(req.query[key]);
            }
            else query[key] = req.query[key];
        }
    }
    collection.find({$or:[{$and:[queryClubFrom,{readByFrom:false}]},{$and:[queryClubTo, {readByTo:false}]}]},
         function(err, messages){
    if (err) throw err;
    res.json(messages);
    });
});

//get message with id
router.get('/:id', function(req, res) {
    var collection = db.get('messages');
    collection.findOne({ _id: req.params.id }, function(err, message){
        if (err) throw err;
      	res.json(message);
    });
});

router.put('/:id', function(req, res){
    var collection = db.get('messages');
    var set={};
    set[req.query.readBy] = true;
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

//add message
router.post('/', function(req, res){
    var collection = db.get('messages');
    collection.insert({
        fromId : new ObjectID(req.body.fromId),
        fromClub : req.body.fromClub,
        toId : new ObjectID(req.body.toId),
        toClub : req.body.toClub,
        playerId : new ObjectID(req.body.playerId),
        playerName : req.body.playerName,
        transferId : new ObjectID(req.body.transferId),
        approved : req.body.approved,
        transfer_fee : req.body.transfer_fee,
        readByFrom : false,
        readByTo : false
    }, function(err, message){
        if (err) throw err;
        res.json(message);
    });
});
module.exports = router;