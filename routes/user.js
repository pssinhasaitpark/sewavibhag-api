const express = require('express');
const { createUser, getUsers } = require('../controllers/user');

const router = express.Router();

// Define routes and link them to controller functions
router.post('/', createUser);
router.get('/', getUsers);

module.exports = router;
