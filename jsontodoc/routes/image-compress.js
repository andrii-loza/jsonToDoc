const express = require('express');
const router = express.Router();
const path = require('path');
const base64Img = require('base64-img');


const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('index', { title: 'Image Compress' });
    res.sendFile(path.join(__dirname, '../public', 'image-compress.html'));
});

router.post('/compress', async (req, res, next) => {
    const {src} = req.body;
    const filepath = await base64Img.imgSync(src, 'routes', 'sent_photo');

    // const min = parseFloat((+quality - 0.1).toFixed(1));
    // const max = parseFloat((+quality + 0.1).toFixed(1));
    const way = path.join(__dirname, '../' + filepath);
    const files = await imagemin(['./' + filepath], {
        destination: 'public/images',
        plugins: [
            imageminMozjpeg({
                quality: 50
            }),
            imageminPngquant({
                quality: [0.4, 0.6]
            })
        ]
    });
    console.log(files);
    res.send(files);
});

module.exports = router;
