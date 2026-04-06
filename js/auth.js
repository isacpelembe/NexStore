/*------------------------ SELETORES ------------------------*/
const loginBtn = document.querySelector('.login-box button');
const registerBtn = document.querySelector('.register-box button:not(.btn-google)');
const googleBtns = document.querySelectorAll('.btn-google');
const userBtn = document.querySelector(".btn-user");

const loginMessage = document.createElement('p');
const registerMessage = document.createElement('p');
document.querySelector('.login-box').appendChild(loginMessage);
document.querySelector('.register-box').appendChild(registerMessage);

/*------------------------ FUNÇÕES ------------------------*/
function showLoggedUser(user) {
  userBtn.textContent = `Olá, ${user.name}`;

  let logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) {
    logoutBtn = document.createElement("button");
    logoutBtn.id = "logoutBtn";
    logoutBtn.textContent = "Sair";
    userBtn.parentElement.appendChild(logoutBtn);

    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem('user');
      window.location.reload();
    });
  }

  // Fecha popup se estiver aberto
  const popup = document.getElementById("popupAuth");
  if (popup.classList.contains("show")) popup.classList.remove("show");
}

// Registro
async function registerUser(name, email, password) {
  const res = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const text = await res.text();
  registerMessage.textContent = text;
}

// Login
async function loginUser(email, password) {
  const res = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const dataText = await res.text();
  try {
    const data = JSON.parse(dataText);
    loginMessage.textContent = `Bem-vindo, ${data.name}!`;
    localStorage.setItem('user', JSON.stringify(data));
    showLoggedUser(data);
  } catch {
    loginMessage.textContent = dataText;
  }
}

/*------------------------ EVENTOS ------------------------*/
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

googleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    window.location.href = 'http://localhost:3000/auth/google';
  });
});

userBtn.addEventListener('click', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    document.getElementById("popupAuth").classList.add("show");
  }
});

/*------------------------ CAPTURA DE USUÁRIO DO GOOGLE ------------------------*/
window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  let user;

  if (params.has('user')) {
    user = JSON.parse(params.get('user'));
    localStorage.setItem('user', JSON.stringify(user));
    alert(`Bem-vindo, ${user.name}!`);
  } else {
    user = JSON.parse(localStorage.getItem('user'));
  }

  if (user) {
    showLoggedUser(user);
  }
};