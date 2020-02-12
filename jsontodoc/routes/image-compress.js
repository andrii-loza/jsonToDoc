var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.render('index', { title: 'Image Compress' });
    res.sendFile(path.join(__dirname, '../public', 'image-compress.html'));
});

module.exports = router;
