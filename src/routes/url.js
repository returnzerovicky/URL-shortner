const express = require('express');
const router = express.Router();
const controller = require('../controllers/urlController');

// Create short URL
router.post('/api/urls', controller.createShortUrl);

// Get metadata
router.get('/api/urls/:id', controller.getUrlById);

// Redirect
router.get('/:shortId', controller.redirectToLongUrl);

module.exports = router;
