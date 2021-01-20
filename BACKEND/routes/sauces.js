const express = require('express');
const router = express.Router();
const saucesCtrl = require('../controllers/sauces');

const authMiddleware = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.post('/', authMiddleware, multer, saucesCtrl.save);
router.post('/:id/like', authMiddleware, saucesCtrl.like);

router.put('/:id', authMiddleware, multer, saucesCtrl.update);

router.delete('/:id', authMiddleware, saucesCtrl.delete);

router.get('/', authMiddleware, saucesCtrl.getAll);
router.get('/:id', authMiddleware, saucesCtrl.getOne);

module.exports = router;