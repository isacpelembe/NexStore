/*------------------------ AREA DO SERVIDOR LOCAL ------------------------*/
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authRoutes = require('./routes/authRoutes');
const db = require('./config/db');

const app = express();

app.use(cors({ origin: 'http://localhost:5500', credentials: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'segredo', resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

/*------------------------ AUTENTICAÇÃO COM GOOGLE ------------------------*/
passport.use(new GoogleStrategy({
  clientID: '847555578116-nf66t2i8db373kirk2d8i1h2j6rpc80s.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3000/auth/google/callback'
},
(accessToken, refreshToken, profile, done) => {
  db.query('SELECT * FROM users WHERE email = ?', [profile.emails[0].value], (err, results) => {
    if(err) return done(err);

    if(results.length > 0) return done(null, results[0]);

/*------------------------ CRIAR USUÁRIO NO BANCO DE DADOS ------------------------*/
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
      [profile.displayName, profile.emails[0].value, ''], (err, result) => {
        if(err) return done(err);
        db.query('SELECT * FROM users WHERE id = ?', [result.insertId], (err, newUser) => {
          return done(err, newUser[0]);
        });
      });
  });
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => done(err, results[0]));
});

/*------------------------ ROTAS DE AUTENTICAÇÃO ------------------------*/
app.use('/auth', authRoutes);

/*------------------------ SERVER ------------------------*/
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));