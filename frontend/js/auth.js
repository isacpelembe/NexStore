/*------------------------ SELETORES DE POPUP REGISTRO E LOGIN ------------------------*/
const loginBtn = document.querySelector('.login-box button');
const registerBtn = document.querySelector('.register-box button');

async function registerUser(name, email, password){
  const res = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ name, email, password })
  });
  const text = await res.text();
  alert(text);
}

async function loginUser(email, password){
  const res = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if(data.id){
    alert(`Bem-vindo, ${data.name}!`);
   
  } else {
    alert(data);
  }
}

registerBtn.addEventListener('click', () => {
  const name = document.querySelector('.register-box input[type="text"]').value.trim();
  const email = document.querySelector('.register-box input[type="email"]').value.trim();
  const password = document.querySelectorAll('.register-box input[type="password"]')[0].value;
  registerUser(name, email, password);
});

loginBtn.addEventListener('click', () => {
  const email = document.querySelector('.login-box input[type="email"]').value.trim();
  const password = document.querySelector('.login-box input[type="password"]').value;
  loginUser(email, password);
});

/*------------------------ LOGIN COM GOOGLE ------------------------*/
function loginWithGoogle(){
  window.location.href = 'http://localhost:3000/auth/google';
}

/*------------------------ CAPTURA DE USUÁRIO DO GOOGLE ------------------------*/
window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  if(params.has('user')){
    const user = JSON.parse(params.get('user'));
    alert(`Bem-vindo, ${user.name}!`);
  }
};