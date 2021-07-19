const express = require('express');
const router = express.Router({ mergeParams: true });
const eateries = require('../controllers/eateries');
const { isLoggedIn, validateEatery, isAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get('/', catchAsync(eateries.index));

router.get('/new', isLoggedIn, eateries.renderNewForm);

router.post('/', isLoggedIn, upload.array('image'), validateEatery, catchAsync(eateries.createEatery));

router.get('/:id', catchAsync(eateries.showEatery));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(eateries.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateEatery, catchAsync(eateries.updateEatery));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(eateries.deleteEatery));

module.exports = router;
