// features.js - Funcionalidades adicionales para el sitio web

document.addEventListener('DOMContentLoaded', function() {
    // 1. Buscador de Noticias
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        const searchInput = searchForm.querySelector('input');
        
        searchInput.addEventListener('input', function(e) {
            const searchTerm = this.value.toLowerCase();
            const noticias = document.querySelectorAll('.noticia');
            
            noticias.forEach(noticia => {
                const titulo = noticia.querySelector('h3').textContent.toLowerCase();
                const contenido = noticia.querySelector('p').textContent.toLowerCase();
                const categoria = noticia.querySelector('.categoria').textContent.toLowerCase();
                
                const matchesSearch = titulo.includes(searchTerm) || 
                                    contenido.includes(searchTerm) || 
                                    categoria.includes(searchTerm);
                
                noticia.style.display = matchesSearch ? 'block' : 'none';
            });
        });

        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
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
        
        // Actualizar todos los botones de favoritos con el mismo título
        document.querySelectorAll('.noticia').forEach(noticia => {
            const noticiaTitle = noticia.querySelector('h3').textContent;
            if (noticiaTitle === title) {
                const favBtn = noticia.querySelector('.fav-button');
                if (favBtn) {
                    favBtn.classList.remove('active');
                    favBtn.innerHTML = '<i class="bx bx-heart"></i>';
                }
            }
        });
        
        // Remove from favorites section with animation
        const favoritesContainer = document.getElementById('favoritos-container');
        if (favoritesContainer) {
            const articleToRemove = favoritesContainer.querySelector(`[data-title="${title}"]`);
            if (articleToRemove) {
                articleToRemove.style.transition = 'opacity 0.3s, transform 0.3s';
                articleToRemove.style.opacity = '0';
                articleToRemove.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    articleToRemove.remove();
                    if (favoritesContainer.children.length === 0) {
                        favoritesContainer.innerHTML = '<p class="no-favorites">No tienes noticias favoritas guardadas.</p>';
                    }
                }, 300);
            }
        }
    } else {
        favorites.push(title);
        button.classList.add('active');
        button.innerHTML = '<i class="bx bxs-heart"></i>';
        updateFavoritesSection();
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
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
            clone.setAttribute('data-title', title);
            
            // Actualizar el tiempo de lectura
            const content = clone.querySelector('p').textContent;
            const readingTime = calculateReadingTime(content);
            const timeElement = clone.querySelector('.reading-time');
            if (!timeElement) {
                const newTimeElement = document.createElement('div');
                newTimeElement.className = 'reading-time';
                newTimeElement.innerHTML = `<i class='bx bx-time'></i> ${readingTime} min de lectura`;
                clone.querySelector('.contenido').appendChild(newTimeElement);
            }
            
            // Actualizar el botón "Leer más"
            const readMoreBtn = clone.querySelector('.read-more-btn');
            if (!readMoreBtn) {
                const newReadMoreBtn = document.createElement('button');
                newReadMoreBtn.className = 'read-more-btn';
                newReadMoreBtn.innerHTML = 'Leer más';
                newReadMoreBtn.addEventListener('click', () => showFullArticle(clone));
                clone.querySelector('.contenido').appendChild(newReadMoreBtn);
            } else {
                readMoreBtn.addEventListener('click', () => showFullArticle(clone));
            }
            
            // Actualizar el botón de favoritos
            const favButton = clone.querySelector('.fav-button');
            if (favButton) {
                favButton.classList.add('active');
                favButton.innerHTML = '<i class="bx bxs-heart"></i>';
                favButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    toggleFavorite(title, favButton);
                    
                    // Actualizar también el botón original
                    const originalNoticia = document.querySelector(`.noticia:not([data-title]) h3`);
                    if (originalNoticia && originalNoticia.textContent === title) {
                        const originalButton = originalNoticia.closest('.noticia').querySelector('.fav-button');
                        if (originalButton) {
                            originalButton.classList.remove('active');
                            originalButton.innerHTML = '<i class="bx bx-heart"></i>';
                        }
                    }
                });
            }
            
            container.appendChild(clone);
        }
    });
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
            clone.setAttribute('data-title', title);
            
            // Reinicializar los botones y funcionalidades en el clon
            const favButton = clone.querySelector('.fav-button');
            if (favButton) {
                favButton.classList.add('active');
                favButton.innerHTML = '<i class="bx bxs-heart"></i>';
                // Eliminar eventos anteriores
                const newFavButton = favButton.cloneNode(true);
                favButton.parentNode.replaceChild(newFavButton, favButton);
                newFavButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    toggleFavorite(title, newFavButton);
                });
            }
            
            // Reinicializar el botón "Leer más"
            const readMoreBtn = clone.querySelector('.read-more-btn');
            if (readMoreBtn) {
                const newReadMoreBtn = readMoreBtn.cloneNode(true);
                readMoreBtn.parentNode.replaceChild(newReadMoreBtn, readMoreBtn);
                newReadMoreBtn.addEventListener('click', () => showFullArticle(clone));
            }
            
            container.appendChild(clone);
        }
    });
}

function showFullArticle(noticia) {
    const title = noticia.querySelector('h3').textContent;
    let fullContent = '';
    
    // Generar contenido completo basado en el título
    switch(title) {
        case 'Nuevo acuerdo nuclear con Irán':
            fullContent = `
                <h1>${title}</h1>
                <p class="article-meta">Por Mohammed Al-Rashid | Actualizado: 16 de Abril, 2024</p>
                <div class="article-content">
                    <p>En un histórico avance diplomático, las potencias mundiales han alcanzado un nuevo acuerdo nuclear con Irán, marcando un punto de inflexión en las relaciones internacionales. El acuerdo, que se produce después de meses de intensas negociaciones, establece un marco renovado para el programa nuclear iraní.</p>
                    <h2>Puntos Clave del Acuerdo</h2>
                    <p>El nuevo pacto incluye restricciones más estrictas sobre el enriquecimiento de uranio y un régimen de inspecciones más riguroso. A cambio, se contempla un levantamiento gradual de las sanciones económicas que han afectado a la economía iraní.</p>
                    <h2>Reacciones Internacionales</h2>
                    <p>La comunidad internacional ha recibido el acuerdo con cautela. Mientras algunos países lo celebran como un triunfo de la diplomacia, otros expresan preocupaciones sobre su implementación y verificación.</p>
                    <h2>Impacto Económico</h2>
                    <p>Los expertos anticipan que el levantamiento de sanciones podría tener un impacto significativo en el mercado energético global, con posibles fluctuaciones en los precios del petróleo.</p>
                </div>`;
            break;
        case 'Lewis Hamilton renueva con Mercedes':
            fullContent = `
                <h1>${title}</h1>
                <p class="article-meta">Por James Roberts | Actualizado: 14 de Abril, 2024</p>
                <div class="article-content">
                    <p>El siete veces campeón mundial Lewis Hamilton ha firmado una extensión de contrato con Mercedes-AMG Petronas F1 Team, poniendo fin a meses de especulaciones sobre su futuro en la Fórmula 1.</p>
                    <h2>Detalles del Contrato</h2>
                    <p>El nuevo acuerdo, valorado en más de 50 millones de euros por temporada, mantiene a Hamilton en Mercedes hasta finales de 2025. El contrato incluye cláusulas relacionadas con el desarrollo del coche y el papel de Hamilton en el futuro de la escudería.</p>
                    <h2>Objetivos del Equipo</h2>
                    <p>Mercedes y Hamilton han expresado su compromiso de luchar por el octavo título mundial del piloto británico, lo que lo convertiría en el piloto más exitoso en la historia de la F1.</p>
                    <h2>Impacto en el Mercado</h2>
                    <p>La renovación de Hamilton tiene importantes implicaciones para el mercado de pilotos, afectando las opciones disponibles para otros equipos y pilotos de cara a la próxima temporada.</p>
                </div>`;
            break;
        case 'Usain Bolt anuncia su retiro definitivo':
            fullContent = `
                <h1>${title}</h1>
                <p class="article-meta">Por Michael Johnson | Actualizado: 12 de Abril, 2024</p>
                <div class="article-content">
                    <p>El legendario velocista jamaicano Usain Bolt ha anunciado su retiro definitivo del atletismo, cerrando un capítulo extraordinario en la historia del deporte. El múltiple medallista olímpico ha confirmado que no volverá a competir profesionalmente.</p>
                    <h2>Legado Deportivo</h2>
                    <p>Bolt se retira como el hombre más rápido de la historia, manteniendo los récords mundiales en 100m (9.58s) y 200m (19.19s). Su impacto en el atletismo va más allá de las marcas, habiendo revolucionado el deporte con su carisma y personalidad única.</p>
                    <h2>Planes Futuros</h2>
                    <p>El atleta ha anunciado sus planes para dedicarse al desarrollo del atletismo juvenil en Jamaica y continuar con sus diversos proyectos empresariales y filantrópicos.</p>
                    <h2>Reacciones del Mundo del Deporte</h2>
                    <p>La comunidad atlética internacional ha reaccionado con mensajes de admiración y gratitud hacia quien es considerado el mayor velocista de todos los tiempos.</p>
                </div>`;
            break;
        case 'Apple presenta su nuevo iPhone 17':
            fullContent = `
                <h1>${title}</h1>
                <p class="article-meta">Por Tim Stevens | Actualizado: 16 de Abril, 2024</p>
                <div class="article-content">
                    <p>Apple ha presentado oficialmente el iPhone 17, su nuevo buque insignia que promete revolucionar el mercado de los smartphones con innovaciones tecnológicas sin precedentes.</p>
                    <h2>Características Principales</h2>
                    <p>El nuevo dispositivo cuenta con un sistema de cámara cuántica, procesador A19 Bionic con capacidades de IA avanzadas, y una pantalla Retina XDR de cuarta generación. La duración de la batería se ha extendido hasta 48 horas de uso normal.</p>
                    <h2>Innovaciones Tecnológicas</h2>
                    <p>Entre las novedades más destacadas se encuentra un sistema de proyección holográfica y capacidades de realidad aumentada mejoradas que permiten experiencias inmersivas nunca antes vistas en un smartphone.</p>
                    <h2>Disponibilidad y Precio</h2>
                    <p>El iPhone 17 estará disponible en más de 30 países a partir del próximo mes, con un precio base de 1299€ para el modelo estándar.</p>
                </div>`;
            break;
        case 'Nueva generación de procesadores':
            fullContent = `
                <h1>${title}</h1>
                <p class="article-meta">Por David Chang | Actualizado: 16 de Abril, 2024</p>
                <div class="article-content">
                    <p>Intel y AMD han anunciado simultáneamente sus nuevas líneas de procesadores que prometen revolucionar el mercado de la computación. Los nuevos chips utilizan tecnología de 3nm y ofrecen mejoras significativas en rendimiento y eficiencia energética.</p>
                    <h2>Innovaciones Tecnológicas</h2>
                    <p>Los nuevos procesadores incorporan arquitecturas revolucionarias que permiten un incremento del 40% en rendimiento mientras reducen el consumo energético en un 30%. La integración de núcleos especializados en IA promete acelerar significativamente las tareas de machine learning.</p>
                    <h2>Impacto en el Mercado</h2>
                    <p>Analistas predicen que estos avances podrían transformar significativamente el panorama de la computación personal y profesional. Se espera que los primeros dispositivos con estos procesadores lleguen al mercado en el último trimestre del año.</p>
                </div>`;
            break;
        case 'Descubrimiento arqueológico en Egipto':
            fullContent = `
                <h1>${title}</h1>
                <p class="article-meta">Por Ahmed Kamal | Actualizado: 15 de Abril, 2024</p>
                <div class="article-content">
                    <p>Un equipo internacional de arqueólogos ha descubierto una nueva tumba en el Valle de los Reyes que podría pertenecer a un faraón hasta ahora desconocido. El hallazgo incluye numerosos artefactos bien preservados y jeroglíficos que podrían reescribir parte de la historia del Antiguo Egipto.</p>
                    <h2>Detalles del Descubrimiento</h2>
                    <p>La tumba, que permanecía sellada desde hace más de 3,000 años, contiene una colección extraordinaria de joyas, estatuas y papiros. Los jeroglíficos sugieren la existencia de un breve período dinástico no documentado previamente.</p>
                    <h2>Implicaciones Históricas</h2>
                    <p>Este descubrimiento podría llenar importantes vacíos en nuestra comprensión de la historia del Antiguo Egipto, especialmente durante el período de transición entre la XVIII y XIX dinastía.</p>
                </div>`;
            break;
        case 'Avances en medicina regenerativa':
            fullContent = `
                <h1>${title}</h1>
                <p class="article-meta">Por Dr. Elena Rodríguez | Actualizado: 16 de Abril, 2024</p>
                <div class="article-content">
                    <p>Investigadores han logrado un avance significativo en medicina regenerativa al desarrollar un nuevo método para imprimir tejidos orgánicos en 3D que son completamente funcionales y compatibles con el cuerpo humano.</p>
                    <h2>Tecnología Innovadora</h2>
                    <p>La nueva técnica utiliza una combinación de células madre y biomateriales especialmente diseñados que permiten la creación de tejidos complejos con su propia red de vasos sanguíneos.</p>
                    <h2>Aplicaciones Médicas</h2>
                    <p>Este avance podría revolucionar el campo de los trasplantes de órganos y el tratamiento de lesiones graves. Los primeros ensayos clínicos están programados para comenzar el próximo año.</p>
                </div>`;
            break;
        case 'Exploración espacial':
            fullContent = `
                <h1>${title}</h1>
                <p class="article-meta">Por Carlos Vega | Actualizado: 15 de Abril, 2024</p>
                <div class="article-content">
                    <p>La NASA ha anunciado planes ambiciosos para establecer una base permanente en la Luna para 2030, que servirá como punto de partida para futuras misiones tripuladas a Marte.</p>
                    <h2>Detalles del Proyecto</h2>
                    <p>La base lunar, denominada "Artemis Base Camp", será construida utilizando recursos locales y tecnología de impresión 3D. Se diseñará para albergar hasta 8 astronautas por períodos de hasta 6 meses.</p>
                    <h2>Colaboración Internacional</h2>
                    <p>El proyecto cuenta con la participación de múltiples agencias espaciales y empresas privadas, marcando una nueva era en la colaboración espacial internacional.</p>
                </div>`;
            break;
        case 'Descubrimientos en inteligencia artificial':
            fullContent = `
                <h1>${title}</h1>
                <p class="article-meta">Por Sarah Chen | Actualizado: 16 de Abril, 2024</p>
                <div class="article-content">
                    <p>Un equipo de investigadores ha logrado un avance significativo en el campo de la inteligencia artificial, desarrollando un nuevo algoritmo capaz de aprender y adaptarse de manera más eficiente que los sistemas actuales. Este descubrimiento podría revolucionar la forma en que las máquinas aprenden y procesan información.</p>
                    <p>El nuevo sistema, denominado "AdaptiveAI", ha demostrado una capacidad sin precedentes para resolver problemas complejos con un consumo de energía significativamente menor que los sistemas tradicionales. Los resultados han sido publicados en prestigiosas revistas científicas y han llamado la atención de importantes empresas tecnológicas.</p>
                    <h2>Implicaciones para el Futuro</h2>
                    <p>Los expertos sugieren que esta tecnología podría tener aplicaciones revolucionarias en campos como la medicina, la investigación climática y la exploración espacial. La capacidad del sistema para procesar grandes cantidades de datos de manera más eficiente podría acelerar significativamente el progreso en estas áreas.</p>
                    <h2>Consideraciones Éticas</h2>
                    <p>Sin embargo, el desarrollo también ha generado debates sobre las implicaciones éticas y la necesidad de establecer regulaciones adecuadas para el uso de sistemas de IA cada vez más avanzados.</p>
                </div>`;
            break;
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
        case 'Avances en energía renovable':
            fullContent = `
                <h1>${title}</h1>
                <p class="article-meta">Por María González | Actualizado: 16 de Abril, 2024</p>
                <div class="article-content">
                    <p>Un consorcio internacional de científicos ha anunciado un avance revolucionario en la tecnología de paneles solares, logrando una eficiencia récord del 39% en la conversión de luz solar a electricidad. Este desarrollo promete transformar el panorama de la energía renovable a nivel global.</p>
                    <h2>Innovación Tecnológica</h2>
                    <p>Los nuevos paneles utilizan una combinación única de materiales y una estructura de células multicapa que maximiza la captura de energía solar. Este avance podría reducir significativamente los costos de la energía solar y hacerla más accesible para comunidades en todo el mundo.</p>
                    <h2>Impacto Ambiental</h2>
                    <p>Se estima que la implementación masiva de esta tecnología podría reducir las emisiones de carbono en un 40% para 2030, marcando un hito importante en la lucha contra el cambio climático.</p>
                    <p>Varios países ya han mostrado interés en adoptar esta nueva tecnología, con proyectos piloto programados para comenzar en los próximos meses.</p>
                </div>`;
            break;
        case 'Crisis alimentaria global':
            fullContent = `
                <h1>${title}</h1>
                <p class="article-meta">Por John Smith | Actualizado: 15 de Abril, 2024</p>
                <div class="article-content">
                    <p>La Organización de las Naciones Unidas para la Alimentación y la Agricultura (FAO) ha emitido una alerta sobre una creciente crisis alimentaria que afecta a múltiples regiones del mundo. El cambio climático y los conflictos geopolíticos han sido identificados como los principales factores contribuyentes.</p>
                    <h2>Regiones Afectadas</h2>
                    <p>Las áreas más afectadas incluyen el África subsahariana, partes de Asia meridional y algunas regiones de América Latina. Se estima que más de 250 millones de personas están en riesgo de inseguridad alimentaria severa.</p>
                    <h2>Medidas de Respuesta</h2>
                    <p>La comunidad internacional está movilizando recursos para abordar la crisis. Se han prometido más de $5 mil millones en ayuda de emergencia, aunque expertos señalan que se necesitará una respuesta más sostenible a largo plazo.</p>
                    <p>Organizaciones humanitarias están implementando programas innovadores de agricultura resiliente y sistemas de distribución de alimentos más eficientes.</p>
                </div>`;
            break;
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
