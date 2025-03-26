// features.js - Funcionalidades adicionales para el sitio web

document.addEventListener('DOMContentLoaded', function() {
    // 1. Buscador de Noticias
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = this.querySelector('input').value.toLowerCase();
            alert(`Búsqueda de: ${searchTerm}`);
            // Aquí iría la lógica real de búsqueda
        });
    }

    // 2. Sistema de Comentarios
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('input').value;
            const comment = this.querySelector('textarea').value;
            
            // Crear nuevo comentario
            const newComment = document.createElement('div');
            newComment.className = 'comment';
            newComment.innerHTML = `
                <div class="comment-avatar">
                    <img src="https://randomuser.me/api/portraits/lego/1.jpg" alt="Avatar">
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <h4>${name}</h4>
                        <span>Hace un momento</span>
                    </div>
                    <p>${comment}</p>
                    <div class="comment-actions">
                        <button><i class="bx bx-like"></i> Me gusta (0)</button>
                        <button><i class="bx bx-reply"></i> Responder</button>
                    </div>
                </div>
            `;
            
            // Insertar antes del formulario
            const commentsSection = document.querySelector('.comments-section');
            commentsSection.insertBefore(newComment, commentForm.parentNode);
            
            // Actualizar contador de comentarios
            const commentsTitle = commentsSection.querySelector('h3');
            const commentCount = commentsSection.querySelectorAll('.comment').length;
            commentsTitle.textContent = `Comentarios (${commentCount})`;
            
            // Limpiar formulario
            this.reset();
        });
    }


    // 4. Botones para Compartir
    const shareButtons = document.querySelectorAll('.share-buttons a');
    if (shareButtons.length > 0) {
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);
                let shareUrl;
                
                if (this.classList.contains('facebook')) {
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                } else if (this.classList.contains('twitter')) {
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                } else if (this.classList.contains('whatsapp')) {
                    shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
                } else if (this.classList.contains('telegram')) {
                    shareUrl = `https://t.me/share/url?url=${url}&text=${title}`;
                } else if (this.classList.contains('email')) {
                    shareUrl = `mailto:?subject=${title}&body=${url}`;
                }
                
                window.open(shareUrl, '_blank');
            });
        });
    }


    // 9. Encuestas Interactivas
    const pollForm = document.getElementById('poll-form');
    if (pollForm) {
        pollForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const selectedOption = this.querySelector('input[name="poll"]:checked');
            
            if (selectedOption) {
                alert(`Has votado por: ${selectedOption.nextElementSibling.textContent}`);
                
                // Actualizar los porcentajes (simulación)
                const pollOptions = this.querySelectorAll('.poll-option');
                const totalVotes = parseInt(document.querySelector('.poll-info').textContent.match(/\d+/)[0]) + 1;
                
                document.querySelector('.poll-info').textContent = `Total de votos: ${totalVotes}`;
                
                // Simular nuevos porcentajes
                const newPercentages = [65, 25, 10]; // Porcentajes originales
                
                if (selectedOption.id === 'option1') newPercentages[0]++;
                if (selectedOption.id === 'option2') newPercentages[1]++;
                if (selectedOption.id === 'option3') newPercentages[2]++;
                
                // Normalizar para que sumen 100%
                const sum = newPercentages.reduce((a, b) => a + b, 0);
                const normalized = newPercentages.map(p => Math.round((p / sum) * 100));
                
                // Actualizar las barras
                pollOptions.forEach((option, i) => {
                    const bar = option.querySelector('.poll-bar');
                    const percent = normalized[i];
                    bar.style.width = `${percent}%`;
                    bar.querySelector('span').textContent = `${percent}%`;
                });
                
                // Deshabilitar el formulario
                const options = this.querySelectorAll('input[type="radio"]');
                options.forEach(opt => opt.disabled = true);
                this.querySelector('button').disabled = true;
                this.querySelector('button').textContent = 'Gracias por votar';
            } else {
                alert('Por favor, selecciona una opción antes de votar.');
            }
        });
    }

})

// Sistema de Favoritos y Tiempo de Lectura
function initFavoriteSystem() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    document.querySelectorAll('.noticia').forEach(noticia => {
        const title = noticia.querySelector('h3').textContent;
        const isFavorite = favorites.includes(title);
        
        // Agregar botón de favoritos
        const favButton = document.createElement('button');
        favButton.className = `fav-button ${isFavorite ? 'active' : ''}`;
        favButton.innerHTML = `<i class="bx ${isFavorite ? 'bxs-heart' : 'bx-heart'}"></i>`;
        
        favButton.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFavorite(title, favButton);
        });
        
        // Agregar tiempo de lectura
        const content = noticia.querySelector('p').textContent;
        const readingTime = calculateReadingTime(content);
        const timeElement = document.createElement('div');
        timeElement.className = 'reading-time';
        timeElement.innerHTML = `<i class='bx bx-time'></i> ${readingTime} min de lectura`;
        
        // Agregar botón "Leer más"
        const readMoreBtn = document.createElement('button');
        readMoreBtn.className = 'read-more-btn';
        readMoreBtn.innerHTML = 'Leer más';
        readMoreBtn.addEventListener('click', () => showFullArticle(noticia));
        
        const contenido = noticia.querySelector('.contenido');
        contenido.appendChild(favButton);
        contenido.appendChild(timeElement);
        contenido.appendChild(readMoreBtn);
    });
    
    // Agregar sección de favoritos
    addFavoritesSection();
}

function toggleFavorite(title, button) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.includes(title)) {
        favorites = favorites.filter(fav => fav !== title);
        button.classList.remove('active');
        button.innerHTML = '<i class="bx bx-heart"></i>';
    } else {
        favorites.push(title);
        button.classList.add('active');
        button.innerHTML = '<i class="bx bxs-heart"></i>';
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesSection();
}

function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

function addFavoritesSection() {
    const main = document.querySelector('main');
    const favSection = document.createElement('section');
    favSection.id = 'favoritos';
    favSection.className = 'noticias';
    favSection.innerHTML = `
        <h2>Mis Favoritos</h2>
        <div class="noticias-container" id="favoritos-container"></div>
    `;
    main.insertBefore(favSection, main.firstChild);
    updateFavoritesSection();
}

function updateFavoritesSection() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const container = document.getElementById('favoritos-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (favorites.length === 0) {
        container.innerHTML = '<p class="no-favorites">No tienes noticias favoritas guardadas.</p>';
        return;
    }
    
    document.querySelectorAll('.noticia').forEach(noticia => {
        const title = noticia.querySelector('h3').textContent;
        if (favorites.includes(title)) {
            const clone = noticia.cloneNode(true);
            container.appendChild(clone);
        }
    });
}

function showFullArticle(noticia) {
    const title = noticia.querySelector('h3').textContent;
    let fullContent = '';
    
    // Generar contenido completo basado en el título
    switch(title) {
        case 'Protestas en Francia por reforma de pensiones':
            fullContent = `
                <h1>${title}</h1>
                <p class="article-meta">Por Jean Dupont | Actualizado: 15 de Abril, 2024</p>
                <div class="article-content">
                    <p>Las calles de París y otras ciudades importantes de Francia se han convertido en el escenario de masivas protestas contra la controversial reforma de pensiones propuesta por el gobierno de Emmanuel Macron. La reforma, que busca aumentar la edad de jubilación de 62 a 64 años, ha generado una ola de descontento social sin precedentes.</p>
                    <p>Los sindicatos estiman que más de 2 millones de personas han participado en las manifestaciones a nivel nacional. Los sectores más afectados incluyen el transporte público, la educación y los servicios públicos. La CGT, uno de los principales sindicatos del país, ha advertido que las protestas continuarán hasta que el gobierno retire la propuesta.</p>
                    <p>El impacto económico de las protestas ya se hace sentir en la economía francesa, con pérdidas estimadas en varios millones de euros diarios. Los pequeños comerciantes y el sector turístico son los más afectados por las continuas manifestaciones.</p>
                    <h2>Reacciones del Gobierno</h2>
                    <p>El gobierno mantiene su postura, argumentando que la reforma es necesaria para garantizar la sostenibilidad del sistema de pensiones francés. Sin embargo, ha mostrado apertura al diálogo con los sindicatos para discutir posibles ajustes a la propuesta.</p>
                    <h2>Perspectivas de Resolución</h2>
                    <p>Analistas políticos sugieren que la crisis podría prolongarse durante varias semanas más, aunque se espera que ambas partes lleguen eventualmente a un compromiso. La presión internacional y el impacto en la economía podrían acelerar la búsqueda de una solución negociada.</p>
                </div>`;
            break;
        case 'Tensión en la frontera entre Ucrania y Rusia':
            fullContent = `
                <h1>${title}</h1>
                <p class="article-meta">Por Viktor Petrov | Actualizado: 16 de Abril, 2024</p>
                <div class="article-content">
                    <p>La situación en la frontera entre Ucrania y Rusia continúa deteriorándose mientras aumenta la presencia militar rusa en la región. Observadores internacionales han reportado un incremento significativo en el número de tropas y equipamiento militar en las últimas semanas.</p>
                    <p>Las autoridades ucranianas han expresado su preocupación ante lo que consideran una clara amenaza a su soberanía territorial. La OTAN ha manifestado su apoyo a Ucrania y ha advertido sobre las posibles consecuencias de una escalada militar en la región.</p>
                    <h2>Impacto Internacional</h2>
                    <p>La comunidad internacional observa con preocupación el desarrollo de los acontecimientos. Estados Unidos y la Unión Europea han amenazado con imponer nuevas sanciones económicas a Rusia si la situación continúa escalando.</p>
                    <h2>Esfuerzos Diplomáticos</h2>
                    <p>Los esfuerzos diplomáticos para reducir las tensiones continúan, con varias reuniones de alto nivel programadas para las próximas semanas. Sin embargo, la desconfianza entre las partes complica la búsqueda de una solución pacífica.</p>
                    <p>La crisis ha generado preocupación sobre la estabilidad regional y el futuro de las relaciones entre Rusia y Occidente. Analistas sugieren que la situación podría tener importantes consecuencias para el orden geopolítico global.</p>
                </div>`;
            break;
        // Agregar más casos según sea necesario
        default:
            fullContent = `<h1>${title}</h1><p>Contenido completo no disponible.</p>`;
    }
    
    const modal = document.createElement('div');
    modal.className = 'article-modal';
    modal.innerHTML = `
        <div class="article-modal-content">
            <button class="close-modal"><i class='bx bx-x'></i></button>
            <div class="article-full-content">
                ${fullContent}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Inicializar sistema de favoritos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initFavoriteSystem);
