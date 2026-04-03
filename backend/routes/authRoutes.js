const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');

// --- Rotas email/senha ---
router.post('/register', authController.register);
router.post('/login', authController.login);

// --- Rotas Google OAuth ---
router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Redireciona para frontend com dados do usuário
    res.redirect(`http://localhost:5500/?user=${JSON.stringify(req.user)}`);
  }
);

module.exports = router;