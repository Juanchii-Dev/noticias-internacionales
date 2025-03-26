// Elementos DOM
const toggleButton = document.getElementById('toggle-button');
const body = document.body;
const irArribaBtn = document.getElementById('boton-ir-arriba');
const subscribeForm = document.getElementById('subscribe-form');
const noticias = document.querySelectorAll('.noticia');
const menuToggle = document.querySelector('.menu-toggle');
const menuLinks = document.querySelectorAll('.menu-item a');

// Crear elemento overlay para el menú móvil
const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

// Tema oscuro
// Verificar si existe una preferencia guardada
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    body.classList.add('dark');
    toggleButton.checked = true;
}

// Toggle para cambiar el tema
toggleButton.addEventListener('change', () => {
    if (toggleButton.checked) {
        body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
});

// Función para toggle del menú
function toggleMenu() {
    document.body.classList.toggle('menu-open');
    document.body.style.overflow = document.body.classList.contains('menu-open') ? 'hidden' : '';
}

// Event listeners para el menú hamburguesa
if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
}

// Cerrar menú al hacer clic en un item
menuLinks.forEach(item => {
    item.addEventListener('click', (e) => {
        // Si es un enlace externo (no empieza con # o es un enlace a otra página), dejamos que el navegador lo maneje
        const isInPageLink = item.getAttribute('href').startsWith('#');
        const isOnSamePage = item.getAttribute('href') === '#' || isInPageLink;
        
        if (document.body.classList.contains('menu-open')) {
            toggleMenu();
            
            // Si es un enlace dentro de la misma página, prevenimos la acción por defecto
            // para que el menú tenga tiempo de cerrarse antes de desplazarse
            if (isOnSamePage) {
                e.preventDefault();
                
                // Esperar a que la animación del menú termine antes de desplazarse
                setTimeout(() => {
                    // Si es un enlace a un ancla, desplazarse a esa sección
                    if (isInPageLink) {
                        const targetId = item.getAttribute('href').substring(1);
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                }, 300);
            }
        }
    });
});

// Cerrar menú al hacer clic en el overlay
overlay.addEventListener('click', () => {
    if (document.body.classList.contains('menu-open')) {
        toggleMenu();
    }
});

// Cerrar menú con la tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
        toggleMenu();
    }
});

// Botón ir arriba
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        irArribaBtn.classList.add('mostrar');
    } else {
        irArribaBtn.classList.remove('mostrar');
    }
});

irArribaBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Formulario de suscripción
if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        alert(`¡Gracias por suscribirte con el email ${email}!`);
        e.target.reset();
    });
}

// Efectos 3D para las tarjetas
noticias.forEach(noticia => {
    noticia.addEventListener('mousemove', (e) => {
        const card = noticia.querySelector('.card-3d-inner');
        const rect = noticia.getBoundingClientRect();
        
        // Calcular la posición relativa del cursor
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calcular rotación basada en la posición del cursor
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = ((x - centerX) / centerX) * 5; // Máximo ±5 grados
        const rotateX = -((y - centerY) / centerY) * 5; // Máximo ±5 grados
        
        // Aplicar transformación
        card.style.transform = `translateZ(20px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    noticia.addEventListener('mouseleave', () => {
        const card = noticia.querySelector('.card-3d-inner');
        card.style.transform = 'translateZ(0) rotateX(0) rotateY(0)';
    });
});

// Animación de entrada
function animateOnScroll() {
    const elements = document.querySelectorAll('.noticias-container');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.8) {
            element.classList.add('fade-in');
        }
    });
}

// Iniciar animación de entrada
window.addEventListener('load', () => {
    animateOnScroll();
});

window.addEventListener('scroll', () => {
    animateOnScroll();
});

// Aplicar retraso a las animaciones para crear efecto escalonado
function applyStaggeredAnimation() {
    noticias.forEach((noticia, index) => {
        noticia.style.animationDelay = `${index * 0.1}s`;
    });
}

applyStaggeredAnimation();