const express = require('express');
const AppController = require('../controllers/AppController');
const UserController = require('../controllers/UserController');

const router = express.Router();
router.use(express.json());
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
module.exports = router;
