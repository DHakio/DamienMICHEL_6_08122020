const { request } = require('express');
const multer = require('multer');

const MIME_TYPES= {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, 'images')
    },
    filename: (request, file, callback) => {
        const name = file.originalname.replace(' ', '_');
        const ext = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + ext);
    }
});

module.exports = multer({storage}).single('image');