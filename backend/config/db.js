//------------------- BANCO DE DADOS (REGISTRAR E LOGIN) -----------------//
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SUA_SENHA', // troque pela sua senha MySQL
  database: 'auth_demo'
});

db.connect(err => {
  if(err) throw err;
  console.log('Conectado ao MySQL');
});

module.exports = db;