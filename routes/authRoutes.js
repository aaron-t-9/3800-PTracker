const express = require('express');
const passport = require('passport');

const router = express.Router();

const {forwardIfAuthenticated, ensureAuthenticated} = require('../middleware/checkAuth')

const FAILURE_LOGIN_URL = process.env.APP_URL + '/auth/login/error';

// router.get('/', ensureAuthenticated, (req, res) => {
//     res.render('/auth/login', { email: req.user.email })
// })

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/auth/login');
});

// router.post('/login/email', 
// passport.authenticate('local', {
//     failureRedirect: '/', successRedirect: '/dashboard',
// }));

router.post('/login/email', passport.authenticate('local'), 
function(req, res) {
    console.log("parse", req.user);
});

router.get('/login', function(req, res, next) {
    res.render('auth/login');
});

router.get('/google', passport.authenticate('google', {
    scope: [
        'profile',
        'email',
    ]
}));

router.get('/login/error', (req, res) => {
    res.send('Error logging in');
});

router.get('/google/callback', passport.authenticate('google', {failureRedirect: FAILURE_LOGIN_URL}), (req, res) => {
    res.redirect('/dashboard');
});

module.exports = router;
