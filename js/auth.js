
// Base de datos simulada para usuarios (en producción usarías una base de datos real)
let users = JSON.parse(localStorage.getItem('users')) || [];

// Función para manejar el registro
function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Validaciones
  if (!name || !email || !password || !confirmPassword) {
    alert('Por favor, complete todos los campos');
    return;
  }

  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }

  // Verificar si el usuario ya existe
  if (users.find(user => user.email === email)) {
    alert('Este correo electrónico ya está registrado');
    return;
  }

  // Crear nuevo usuario
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password, // En producción deberías hashear la contraseña
  };

  // Guardar usuario
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  localStorage.setItem('isAuthenticated', 'true');

  alert('¡Registro exitoso!');
  window.location.href = 'index.html';
}

// Función para manejar el inicio de sesión
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Validaciones
  if (!email || !password) {
    alert('Por favor, complete todos los campos');
    return;
  }

  // Buscar usuario
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    alert('Credenciales incorrectas');
    return;
  }

  // Guardar sesión
  localStorage.setItem('currentUser', JSON.stringify(user));
  localStorage.setItem('isAuthenticated', 'true');

  alert('¡Inicio de sesión exitoso!');
  window.location.href = 'index.html';
}

// Función para autenticación con Google
function handleGoogleAuth() {
  alert('Función de autenticación con Google en desarrollo');
}

// Función para autenticación con Facebook 
function handleFacebookAuth() {
  alert('Función de autenticación con Facebook en desarrollo');
}

// Función para modo invitado
function handleGuestAuth() {
  const guestUser = {
    id: 'guest',
    name: 'Invitado',
    email: 'guest@example.com'
  };
  
  localStorage.setItem('currentUser', JSON.stringify(guestUser));
  localStorage.setItem('isAuthenticated', 'true');
  window.location.href = 'index.html';
}

// Función para cerrar sesión
function handleLogout() {
  localStorage.removeItem('currentUser');
  localStorage.setItem('isAuthenticated', 'false');
  window.location.href = 'index.html';
}

// Verificar estado de autenticación
function checkAuth() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (isAuthenticated && currentUser) {
    // Actualizar interfaz para usuario autenticado
    const authLinks = document.querySelectorAll('.auth-link');
    authLinks.forEach(link => {
      if (link.textContent.includes('Iniciar Sesión') || link.textContent.includes('Registrarse')) {
        link.style.display = 'none';
      }
    });
    
    // Agregar botón de cerrar sesión si no existe
    if (!document.querySelector('.logout-button')) {
      const menuLista = document.querySelector('.menu-lista');
      if (menuLista) {
        const logoutItem = document.createElement('li');
        logoutItem.className = 'menu-item';
        logoutItem.innerHTML = `
          <a href="#" class="logout-button">Cerrar Sesión (${currentUser.name})</a>
        `;
        logoutItem.querySelector('a').addEventListener('click', handleLogout);
        menuLista.appendChild(logoutItem);
      }
    }
  }
}

// Inicializar los event listeners
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    document.querySelector('.google')?.addEventListener('click', handleGoogleAuth);
    document.querySelector('.facebook')?.addEventListener('click', handleFacebookAuth);
    document.querySelector('.guest')?.addEventListener('click', handleGuestAuth);
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
    document.querySelector('.google')?.addEventListener('click', handleGoogleAuth);
    document.querySelector('.facebook')?.addEventListener('click', handleFacebookAuth);
  }

  // Verificar autenticación en cada página
  checkAuth();
});
