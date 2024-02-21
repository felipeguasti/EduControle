
const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorization');

// Example protected route
//router.get('/admin', authorize('administrador'), (req, res) => {
//    res.send('Painel administrativo');
//});

module.exports = router;
