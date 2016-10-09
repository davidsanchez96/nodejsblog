var mongo = require('mongodb');
var db = require('monk')('mongodb://david:1234@ds053176.mlab.com:53176/dcsm-nodeblog');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var posts = db.get('posts');

    posts.find({},{}, function (err, posts) {
        res.render('index', {
            "title": "Index",
            "posts": posts
        });
    });
});

module.exports = router;
