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