//------------------- BANCO DE DADOS (REGISTRAR E LOGIN) -----------------//
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',          
  password: 'unisced@2026', 
  database: 'auth_demo', 
  port: 3306             
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err.message);
    return;
  }
  console.log('Conectado ao MySQL com sucesso!');
});

module.exports = db;