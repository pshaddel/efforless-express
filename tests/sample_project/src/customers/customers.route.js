const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Customers Router - GET Method' })
})

module.exports = router;