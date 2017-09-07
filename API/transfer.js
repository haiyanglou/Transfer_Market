var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/transfermarket');

//suppose query parameter can be clubId or playerId
router.get('/', function(req, res) {
    var collection = db.get('transferhistories');
    var queryPlayer={};
    var queryClubFrom={};
    var queryClubTo={};
    var queryAdmin={};
    for (var key in req.query) {
        if(req.query[key]) {
            if (key == "clubId") {
                queryClubFrom.fromId = new ObjectID(req.query[key]);
                queryClubTo.toId = new ObjectID(req.query[key]);
            }
            else if (key == "playerId") queryPlayer.playerId = new ObjectID(req.query[key]);
            else queryAdmin[key] = req.query[key] == "true" ? true:false;
        }
    }
    
    if(queryPlayer.playerId){
        collection.find({$and:[queryPlayer, {approved:true}]},function(err, transferhistories){
        if (err) throw err;
        res.json(transferhistories);
        });
    } else if (queryClubFrom.fromId){
        collection.find({$and:[{$or:[queryClubFrom, queryClubTo]},{approved:true}]}, function(err, transferhistories){
        if (err) throw err;
        res.json(transferhistories);
        });
    } else {
        collection.find(queryAdmin,function(err, transferhistories){
        if (err) throw err;
        res.json(transferhistories);
        });
    }
});

//get transferhistory with id
router.get('/:id', function(req, res) {
    var collection = db.get('transferhistories');
    collection.findOne({ _id: req.params.id }, function(err, transferhistory){
        if (err) throw err;
      	res.json(transferhistory);
    });
});

router.put('/:id', function(req, res){
    var collection = db.get('transferhistories');
    collection.update({
        _id: req.params.id
    },
    {
        $set: {
            approved:req.body.approved,
            readByAdmin:req.body.readByAdmin
        }
    }, function(err, player){
        if (err) throw err;
        res.json(player);
    });
});

//add transferhistory
router.post('/', function(req, res){
    var collection = db.get('transferhistories');
    collection.insert({
        fromId : new ObjectID(req.body.fromId),
        fromClub : req.body.fromClub,
        toId : new ObjectID(req.body.toId),
        toClub : req.body.toClub,
        playerId : new ObjectID(req.body.playerId),
        playerName : req.body.playerName,
        date : req.body.date,
        transfer_fee : req.body.transfer_fee,
        readByAdmin : req.body.readByAdmin
    }, function(err, transferhistory){
        if (err) throw err;
        res.json(transferhistory);
    });
});
module.exports = router;