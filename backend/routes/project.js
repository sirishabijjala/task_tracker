const express = require('express');
const { createProject } = require('../controlers/projectcontroller');
const auth = require('../midleware/auth');
const router = express.Router();

router.post('/', auth, createProject);

module.exports = router;
