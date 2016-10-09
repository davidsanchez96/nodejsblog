var mongo = require('mongodb');
var db = require('monk')('mongodb://david:1234@ds053176.mlab.com:53176/dcsm-nodeblog');
var express = require('express');
var router = express.Router();

/* GET categories listing. */
router.get('/show/:category', function(req, res, next) {
    var posts = db.get('posts');
    posts.find({category: req.params.category},{}, function (err, posts) {
        if(err) throw err;
        res.render('index', {
            "title": req.params.category,
            "posts": posts
        });
    });
       
});

/* GET categories listing. */
router.get('/add', function(req, res, next) {
    res.render('addcategory', {
        'title': 'Add Category'
    });   
});

/* GET categories listing. */
router.post('/add', function(req, res, next) {

    var title = req.body.title;
    var categories = db.get('categories');    

    req.checkBody('title', 'Title field is required').notEmpty();

    var errors = req.validationErrors();

    if(errors) {
        res.render('addcategory', {
            "errors": errors
        });
    } else {
        categories.insert({
            "title": title
        }, function (err, categories) {
            if(err) throw err;
            else{
                req.flash('success', 'Category Submitted');
                res.redirect('/');
            }
        });  
    }


});

module.exports = router;
