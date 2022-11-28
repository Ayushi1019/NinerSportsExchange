const express = require('express');
const controller = require('../controller/userController');
const {isGuest,isLoggedIn} = require('../middleware/auth');
const {validateSignIn, validateSignUp, validateResults} = require('../middleware/validator');
const {logInLimiter, SignUpLimiter} = require('../middleware/rateLimiters');

const router = express.Router();

//POST /users: create a new user account

router.post('/', SignUpLimiter, validateSignUp, validateResults, controller.create);

//POST /users/login: authenticate user's login
router.post('/login', logInLimiter, validateSignIn, validateResults, controller.login);

//GET /users/profile: send user's profile page
router.get('/profile', isLoggedIn, controller.profile);

router.post('/profile', isLoggedIn, controller.exchange);

//POST /users/logout: logout a user
router.get('/logout', isLoggedIn, controller.logout);

router.post('/exchange/:id', isLoggedIn, controller.manageOffer);

router.post('/exchange/reject/:id', isLoggedIn, controller.reject);

router.post('/exchange/accept/:id', isLoggedIn, controller.accept);

module.exports = router;