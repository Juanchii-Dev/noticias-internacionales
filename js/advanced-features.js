
// Sistema de traducción
const languages = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch'
};

let currentLanguage = 'es';

// Traducciones
const translations = {
  en: {
    'Noticias Generales': 'General News',
    'Deportes': 'Sports',
    'Tecnologías': 'Technology'
    // Agregar más traducciones según necesidad
  }
};

// Sistema de guardado de noticias
const savedNews = JSON.parse(localStorage.getItem('savedNews') || '[]');

// Sistema de notificaciones
let notificationPermission = false;

// Sistema de puntuación
const newsRatings = JSON.parse(localStorage.getItem('newsRatings') || '{}');

// Historial de lecturas
const readingHistory = JSON.parse(localStorage.getItem('readingHistory') || '[]');

// Configuración de usuario
const defaultSettings = {
  language: 'es',
  notifications: false,
  theme: 'light',
  fontSize: 'normal',
  categories: ['general', 'deportes', 'tecnologia'],
  autoTranslate: false,
  saveHistory: true,
  showRecommendations: true
};

let userSettings = JSON.parse(localStorage.getItem('userSettings') || JSON.stringify(defaultSettings));

// Funciones de traducción
function translatePage() {
  if (currentLanguage === 'es') return; // No traducir si está en español
  
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
      element.textContent = translations[currentLanguage][key];
    }
  });
}

// Guardar noticias
function saveNews(newsId, title, content) {
  const news = {
    id: newsId,
    title,
    content,
    savedAt: new Date().toISOString()
  };
  
  const exists = savedNews.find(n => n.id === newsId);
  if (!exists) {
    savedNews.push(news);
    localStorage.setItem('savedNews', JSON.stringify(savedNews));
    showNotification('Noticia guardada correctamente');
  }
}

// Sistema de notificaciones
async function initNotifications() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    notificationPermission = permission === 'granted';
  }
}

function showNotification(message) {
  if (notificationPermission) {
    new Notification('Noticias Internacionales', { body: message });
  } else {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}

// Sistema de puntuación
function rateNews(newsId, rating) {
  newsRatings[newsId] = rating;
  localStorage.setItem('newsRatings', JSON.stringify(newsRatings));
  updateNewsRating(newsId);
}

function updateNewsRating(newsId) {
  const ratingElement = document.querySelector(`[data-news-id="${newsId}"] .news-rating`);
  if (ratingElement) {
    ratingElement.textContent = `Rating: ${newsRatings[newsId]}/5`;
  }
}

// Historial de lecturas
function addToHistory(newsId, title) {
  if (!userSettings.saveHistory) return;
  
  const entry = {
    id: newsId,
    title,
    readAt: new Date().toISOString()
  };
  
  readingHistory.unshift(entry);
  if (readingHistory.length > 100) readingHistory.pop(); // Mantener solo últimas 100 entradas
  localStorage.setItem('readingHistory', JSON.stringify(readingHistory));
}

// Filtrado avanzado
function filterNews(filters) {
  const news = document.querySelectorAll('.noticia');
  news.forEach(noticia => {
    let visible = true;
    
    if (filters.category && !noticia.classList.contains(filters.category)) {
      visible = false;
    }
    
    if (filters.date) {
      const newsDate = new Date(noticia.dataset.date);
      const filterDate = new Date(filters.date);
      if (newsDate < filterDate) visible = false;
    }
    
    if (filters.rating) {
      const newsRating = newsRatings[noticia.dataset.newsId] || 0;
      if (newsRating < filters.rating) visible = false;
    }
    
    noticia.style.display = visible ? 'block' : 'none';
  });
}

// Configuración avanzada
function updateSettings(newSettings) {
  userSettings = { ...userSettings, ...newSettings };
  localStorage.setItem('userSettings', JSON.stringify(userSettings));
  applySettings();
}

function applySettings() {
  // Aplicar idioma
  if (userSettings.language !== currentLanguage) {
    currentLanguage = userSettings.language;
    translatePage();
  }
  
  // Aplicar tema
  document.body.className = userSettings.theme;
  
  // Aplicar tamaño de fuente
  document.documentElement.style.fontSize = {
    small: '14px',
    normal: '16px',
    large: '18px'
  }[userSettings.fontSize];
  
  // Aplicar categorías
  filterNews({ category: userSettings.categories });
}

// Mostrar panel de configuración
function showSettingsPanel() {
  const panel = document.createElement('div');
  panel.className = 'settings-panel';
  panel.innerHTML = `
    <div class="settings-content">
      <h2>Configuración Avanzada</h2>
      <div class="settings-section">
        <h3>General</h3>
        <label>
          Idioma:
          <select id="language">
            ${Object.entries(languages).map(([code, name]) => 
              `<option value="${code}" ${userSettings.language === code ? 'selected' : ''}>${name}</option>`
            ).join('')}
          </select>
        </label>
        
        <label>
          Tema:
          <select id="theme">
            <option value="light" ${userSettings.theme === 'light' ? 'selected' : ''}>Claro</option>
            <option value="dark" ${userSettings.theme === 'dark' ? 'selected' : ''}>Oscuro</option>
          </select>
        </label>
        
        <label>
          Tamaño de fuente:
          <select id="fontSize">
            <option value="small" ${userSettings.fontSize === 'small' ? 'selected' : ''}>Pequeño</option>
            <option value="normal" ${userSettings.fontSize === 'normal' ? 'selected' : ''}>Normal</option>
            <option value="large" ${userSettings.fontSize === 'large' ? 'selected' : ''}>Grande</option>
          </select>
        </label>
      </div>
      
      <div class="settings-section">
        <h3>Preferencias</h3>
        <label>
          <input type="checkbox" id="notifications" ${userSettings.notifications ? 'checked' : ''}>
          Activar notificaciones
        </label>
        
        <label>
          <input type="checkbox" id="autoTranslate" ${userSettings.autoTranslate ? 'checked' : ''}>
          Traducción automática
        </label>
        
        <label>
          <input type="checkbox" id="saveHistory" ${userSettings.saveHistory ? 'checked' : ''}>
          Guardar historial de lectura
        </label>
        
        <label>
          <input type="checkbox" id="showRecommendations" ${userSettings.showRecommendations ? 'checked' : ''}>
          Mostrar recomendaciones
        </label>
      </div>
      
      <div class="settings-section">
        <h3>Categorías</h3>
        <div class="categories-grid">
          <label>
            <input type="checkbox" value="general" 
              ${userSettings.categories.includes('general') ? 'checked' : ''}>
            Noticias Generales
          </label>
          <label>
            <input type="checkbox" value="deportes" 
              ${userSettings.categories.includes('deportes') ? 'checked' : ''}>
            Deportes
          </label>
          <label>
            <input type="checkbox" value="tecnologia" 
              ${userSettings.categories.includes('tecnologia') ? 'checked' : ''}>
            Tecnología
          </label>
        </div>
      </div>
      
      <div class="settings-actions">
        <button id="saveSettings">Guardar cambios</button>
        <button id="closeSettings">Cerrar</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(panel);
  
  // Event listeners
  panel.querySelector('#saveSettings').addEventListener('click', () => {
    const newSettings = {
      language: panel.querySelector('#language').value,
      theme: panel.querySelector('#theme').value,
      fontSize: panel.querySelector('#fontSize').value,
      notifications: panel.querySelector('#notifications').checked,
      autoTranslate: panel.querySelector('#autoTranslate').checked,
      saveHistory: panel.querySelector('#saveHistory').checked,
      showRecommendations: panel.querySelector('#showRecommendations').checked,
      categories: Array.from(panel.querySelectorAll('.categories-grid input:checked'))
        .map(input => input.value)
    };
    
    updateSettings(newSettings);
    panel.remove();
  });
  
  panel.querySelector('#closeSettings').addEventListener('click', () => {
    panel.remove();
  });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  initNotifications();
  applySettings();
  
  // Agregar botón de configuración al header
  const header = document.querySelector('.header');
  const settingsButton = document.createElement('button');
  settingsButton.className = 'settings-button';
  settingsButton.innerHTML = '<i class="bx bx-cog"></i>';
  settingsButton.addEventListener('click', showSettingsPanel);
  header.appendChild(settingsButton);
});

// Exportar funciones
window.saveNews = saveNews;
window.rateNews = rateNews;
window.addToHistory = addToHistory;
window.filterNews = filterNews;
window.showSettingsPanel = showSettingsPanel;
