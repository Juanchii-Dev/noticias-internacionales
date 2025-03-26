
// Configuración inicial
const defaultSettings = {
    theme: {
        mode: 'light',
        primaryColor: '#2939ff',
        fontSize: 'medium',
        fontFamily: 'Poppins'
    },
    content: {
        categories: {
            internacional: true,
            deportes: true,
            tecnologia: true,
            economia: true,
            cultura: true
        },
        categoryOrder: ['internacional', 'deportes', 'tecnologia', 'economia', 'cultura']
    },
    notifications: {
        enabled: false,
        categories: [],
        frequency: 'daily'
    },
    accessibility: {
        highContrast: false,
        largeText: false,
        reduceMotion: false
    },
    privacy: {
        shareData: true,
        cookies: true,
        newsletter: true
    }
};

// Cargar configuración
let userSettings = JSON.parse(localStorage.getItem('userSettings')) || defaultSettings;

// Inicializar configuración
document.addEventListener('DOMContentLoaded', function() {
    initializeSettings();
    initializeNavigation();
    loadUserSettings();
});

function initializeSettings() {
    // Navegación entre secciones
    const navItems = document.querySelectorAll('.settings-nav-item');
    const sections = document.querySelectorAll('.settings-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-section');
            
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            item.classList.add('active');
            document.querySelector(`.settings-section[data-section="${target}"]`).classList.add('active');
        });
    });

    // Tema
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.checked = userSettings.theme.mode === 'dark';
    themeToggle.addEventListener('change', () => {
        const newMode = themeToggle.checked ? 'dark' : 'light';
        updateTheme('mode', newMode);
    });

    // Colores
    const colorPickers = document.querySelectorAll('.color-option');
    colorPickers.forEach(picker => {
        picker.addEventListener('click', () => {
            const color = picker.getAttribute('data-color');
            updateTheme('primaryColor', color);
            document.documentElement.style.setProperty('--primary', color);
            
            colorPickers.forEach(p => p.classList.remove('active'));
            picker.classList.add('active');
        });
    });

    // Tamaño de fuente
    const fontSizeSelect = document.getElementById('font-size');
    fontSizeSelect.value = userSettings.theme.fontSize;
    fontSizeSelect.addEventListener('change', () => {
        updateTheme('fontSize', fontSizeSelect.value);
        updateFontSize(fontSizeSelect.value);
    });

    // Categorías
    const categoryToggles = document.querySelectorAll('[data-category-toggle]');
    categoryToggles.forEach(toggle => {
        const category = toggle.getAttribute('data-category-toggle');
        toggle.checked = userSettings.content.categories[category];
        toggle.addEventListener('change', () => {
            updateCategories(category, toggle.checked);
        });
    });

    // Notificaciones
    const notificationToggle = document.getElementById('notifications-toggle');
    notificationToggle.checked = userSettings.notifications.enabled;
    notificationToggle.addEventListener('change', () => {
        updateNotifications('enabled', notificationToggle.checked);
    });

    // Accesibilidad
    const accessibilityToggles = {
        highContrast: document.getElementById('high-contrast-toggle'),
        largeText: document.getElementById('large-text-toggle'),
        reduceMotion: document.getElementById('reduce-motion-toggle')
    };

    Object.entries(accessibilityToggles).forEach(([key, toggle]) => {
        toggle.checked = userSettings.accessibility[key];
        toggle.addEventListener('change', () => {
            updateAccessibility(key, toggle.checked);
        });
    });

    // Privacidad
    const privacyToggles = {
        shareData: document.getElementById('share-data-toggle'),
        cookies: document.getElementById('cookies-toggle'),
        newsletter: document.getElementById('newsletter-toggle')
    };

    Object.entries(privacyToggles).forEach(([key, toggle]) => {
        toggle.checked = userSettings.privacy[key];
        toggle.addEventListener('change', () => {
            updatePrivacy(key, toggle.checked);
        });
    });
}

function updateTheme(property, value) {
    userSettings.theme[property] = value;
    saveSettings();

    switch(property) {
        case 'mode':
            document.body.classList.toggle('dark', value === 'dark');
            break;
        case 'primaryColor':
            document.documentElement.style.setProperty('--primary', value);
            document.documentElement.style.setProperty('--primary-light', lightenColor(value, 20));
            break;
        case 'fontSize':
            updateFontSize(value);
            break;
    }
}

function updateFontSize(size) {
    const sizes = {
        small: '14px',
        medium: '16px',
        large: '18px',
        'extra-large': '20px'
    };
    document.documentElement.style.setProperty('--base-font-size', sizes[size]);
}

function updateCategories(category, enabled) {
    userSettings.content.categories[category] = enabled;
    saveSettings();
    // Actualizar visualización de categorías en la página principal
    document.querySelectorAll(`[data-category="${category}"]`).forEach(el => {
        el.style.display = enabled ? 'block' : 'none';
    });
}

function updateNotifications(property, value) {
    userSettings.notifications[property] = value;
    saveSettings();
    
    if (property === 'enabled' && value) {
        requestNotificationPermission();
    }
}

function updateAccessibility(property, value) {
    userSettings.accessibility[property] = value;
    saveSettings();

    switch(property) {
        case 'highContrast':
            document.body.classList.toggle('high-contrast', value);
            break;
        case 'largeText':
            document.body.classList.toggle('large-text', value);
            break;
        case 'reduceMotion':
            document.body.classList.toggle('reduce-motion', value);
            break;
    }
}

function updatePrivacy(property, value) {
    userSettings.privacy[property] = value;
    saveSettings();
}

function saveSettings() {
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
}

function loadUserSettings() {
    // Aplicar configuración guardada
    document.body.classList.toggle('dark', userSettings.theme.mode === 'dark');
    document.documentElement.style.setProperty('--primary', userSettings.theme.primaryColor);
    updateFontSize(userSettings.theme.fontSize);
    
    // Aplicar configuración de accesibilidad
    Object.entries(userSettings.accessibility).forEach(([key, value]) => {
        document.body.classList.toggle(key, value);
    });
}

function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Notificaciones activadas', {
                    body: 'Recibirás notificaciones de las últimas noticias'
                });
            }
        });
    }
}

// Utilidades
function lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16)
        .slice(1);
}

// Configuración de tema por defecto del sistema
function checkSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        updateTheme('mode', 'dark');
    }
}

// Eventos
window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
    updateTheme('mode', e.matches ? 'dark' : 'light');
});
