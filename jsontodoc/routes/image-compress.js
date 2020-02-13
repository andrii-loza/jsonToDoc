const express = require('express');
const router = express.Router();
const path = require('path');
const base64Img = require('base64-img');


const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public', 'image-compress.html'));
});

router.post('/compress', async (req, res, next) => {
    const {src, quality} = req.body;
    let max;
    let min;
    const filepath = await base64Img.imgSync(src, '', 'img');
    const index=filepath.indexOf('.');
    const ext=filepath.slice(index+1);
    if (ext === 'png') {
        min = parseFloat((+quality - 0.1).toFixed(1));
        max = parseFloat((+quality + 0.1).toFixed(1));
    }
    const files = await imagemin([path.join('./' + filepath)], {
        destination: 'public/images_converted',
        plugins: [
            imageminMozjpeg({
                quality: +quality
            }),
            imageminPngquant({
                quality: [min, max]
            })
        ]
    });
    const converted = await base64Img.base64Sync(files[0].destinationPath);
    res.send(converted);
});

module.exports = router;
