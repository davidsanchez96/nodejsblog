var mongo = require('mongodb');
var db = require('monk')('mongodb://david:1234@ds053176.mlab.com:53176/dcsm-nodeblog');
var express = require('express');
var router = express.Router();


/* GET post listing. */
router.post('/addcomment/:id', function(req, res, next) {
    var posts = db.get('posts');
    var postid = req.params.id;

    var name = req.body.name;
    var body = req.body.body;
    var date = new Date();

    // Form validation
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('body', 'Body field is required').notEmpty();

    // Check Errors
    var errors = req.validationErrors();

    if(errors){
        posts.findById(req.params.id, function(e,post){
            if(e) throw e;
            res.render('show', {
                'post': post,
                'errors': errors
            });
        });
    }  else {

        var comment = {
            "name": name,
            "body": body,
            "date": date
        };

        posts.update({
            "_id": postid
        }, 
        {
            $push:{
                "comments": comment
            }
        }, 
        function (err, doc) {
            if(err) {
                throw err;
            } else {
                req.flash('success', 'Comment Submitted');
                res.redirect('/posts/show/' + postid);
            }
        }
        );
    }
});

/* GET post listing. */
router.get('/show/:id', function(req, res, next) {
    var posts = db.get('posts');

    var id = req.params.id;
    console.log("id");
    console.log(id);

    posts.findById(req.params.id, function(e,post){
        if(e) throw e;
        res.render('show', {
            'post': post
        });
    });
});


/* GET post listing. */
router.get('/add', function(req, res, next) {
    var posts = db.get('posts');
    var categories = db.get('categories');
    categories.find({},{},function (err, categories) {
        res.render('addpost', {
            'title': 'Add Post',
            'categories': categories
        });
    })    
});


/* POST post listing. */
router.post('/add', function(req, res, next) {

    // console.log("req.file");
    // console.log(req.file);
    // console.log("req.body");
    // console.log(req.body);


    var title = req.body.title;
    var category = req.body.category;
    var body = req.body.body;
    var author = req.body.author;
    var date = new Date();

    if(req.file){
        // File info
        console.log(req.file);
        var mainImageOriginalName = req.file.originalname;
        var mainImageFieldName = req.file.fieldname;
        var mainImageMime = req.file.mimetype;
        var mainImagePath = req.file.path;
        var mainImageFileName = req.file.filename;
        var mainImageSize = req.file.size;
    } else {
        var mainImageFileName = 'noimage.png';
    }

    // Form validation
    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('body', 'Body field is required').notEmpty();

    // Check Errors
    var errors = req.validationErrors();

    if(errors){
        res.render('addpost', {
            "errors": errors,
            "title": title
        });
    } else {        
        var posts = db.get('posts');

        posts.insert({
            "title": title,
            "mainimage": mainImageFileName,
            "category": category,
            "body": body,
            "date": date,
            "author": author
        }, function (err, posts) {
            if(err) throw err;
            else{
                req.flash('success', 'Post Submitted');
                res.redirect('/');
            }
        });
    }



});

module.exports = router;
