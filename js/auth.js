
// Función para manejar el inicio de sesión
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Aquí implementarías la lógica de autenticación
  console.log('Iniciando sesión:', { email, password });
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userEmail', email);
  window.location.href = 'index.html';
}

// Función para manejar el registro
function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }

  // Aquí implementarías la lógica de registro
  console.log('Registrando usuario:', { name, email, password });
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userName', name);
  window.location.href = 'index.html';
}

// Función para autenticación con Google
function handleGoogleAuth() {
  // Aquí implementarías la autenticación con Google
  console.log('Autenticando con Google');
}

// Función para autenticación con Facebook
function handleFacebookAuth() {
  // Aquí implementarías la autenticación con Facebook
  console.log('Autenticando con Facebook');
}

// Función para modo invitado
function handleGuestAuth() {
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userEmail', 'guest@example.com');
  localStorage.setItem('userName', 'Invitado');
  window.location.href = 'index.html';
}

// Inicializar los event listeners
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    document.querySelector('.google').addEventListener('click', handleGoogleAuth);
    document.querySelector('.facebook').addEventListener('click', handleFacebookAuth);
    document.querySelector('.guest').addEventListener('click', handleGuestAuth);
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
    document.querySelector('.google').addEventListener('click', handleGoogleAuth);
    document.querySelector('.facebook').addEventListener('click', handleFacebookAuth);
  }
});

// Verificar estado de autenticación
function checkAuth() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const currentPath = window.location.pathname;
  
  if (isAuthenticated && (currentPath.includes('login.html') || currentPath.includes('register.html'))) {
    window.location.href = 'index.html';
  }
}

checkAuth();
