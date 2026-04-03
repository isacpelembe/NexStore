const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Cadastro com email/senha
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if(!name || !email || !password) return res.status(400).send('Preencha todos os campos');

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword], (err, result) => {
      if(err){
        if(err.code === 'ER_DUP_ENTRY') return res.status(400).send('Email já cadastrado');
        return res.status(500).send('Erro no servidor');
      }
      res.status(201).send('Conta criada com sucesso');
    });
};

// Login com email/senha
exports.login = (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).send('Preencha todos os campos');

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if(err) return res.status(500).send('Erro no servidor');
    if(results.length === 0) return res.status(400).send('Email não encontrado');

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).send('Senha incorreta');

    res.status(200).json({ id: user.id, name: user.name, email: user.email });
  });
};