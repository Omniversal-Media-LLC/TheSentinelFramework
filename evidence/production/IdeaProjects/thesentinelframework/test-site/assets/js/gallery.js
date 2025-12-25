// Evidence Gallery Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    initializeModal();
});

function initializeGallery() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const evidenceItems = document.querySelectorAll('.evidence-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            evidenceItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease-in';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Add click handlers for evidence items
    evidenceItems.forEach(item => {
        item.addEventListener('click', function() {
            openModal(this);
        });
        
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 15px 30px rgba(138, 43, 226, 0.3)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
}

function initializeModal() {
    const modal = document.getElementById('evidence-modal');
    const closeBtn = document.querySelector('.close');
    
    // Close modal when clicking X
    closeBtn.addEventListener('click', function() {
        closeModal();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal(evidenceItem) {
    const modal = document.getElementById('evidence-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalMeta = document.getElementById('modal-meta');
    
    // Get data from evidence item
    const img = evidenceItem.querySelector('img');
    const overlay = evidenceItem.querySelector('.evidence-overlay');
    const title = overlay.querySelector('h3').textContent;
    const description = overlay.querySelector('p').textContent;
    const date = overlay.querySelector('.date').textContent;
    const tag = overlay.querySelector('.tag').textContent;
    
    // Populate modal
    modalImage.src = img.src;
    modalImage.alt = img.alt;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalMeta.innerHTML = `
        <span class="modal-date">${date}</span>
        <span class="modal-tag">${tag}</span>
    `;
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add animation
    modal.style.animation = 'modalFadeIn 0.3s ease-out';
}

function closeModal() {
    const modal = document.getElementById('evidence-modal');
    modal.style.animation = 'modalFadeOut 0.3s ease-out';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('evidence-search');
    const evidenceItems = document.querySelectorAll('.evidence-item');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            evidenceItems.forEach(item => {
                const overlay = item.querySelector('.evidence-overlay');
                const title = overlay.querySelector('h3').textContent.toLowerCase();
                const description = overlay.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes modalFadeIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes modalFadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
    }
    
    .evidence-item {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .filter-btn {
        padding: 0.5rem 1rem;
        margin: 0.25rem;
        border: 1px solid var(--border-color);
        background: transparent;
        color: var(--primary-text);
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .filter-btn:hover {
        background: var(--accent-color);
        color: white;
    }
    
    .filter-btn.active {
        background: var(--accent-color);
        color: white;
    }
    
    .evidence-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin: 2rem 0;
    }
    
    .evidence-item {
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        background: rgba(22, 33, 62, 0.4);
        border: 1px solid var(--border-color);
    }
    
    .evidence-item img {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }
    
    .evidence-overlay {
        padding: 1rem;
    }
    
    .evidence-overlay h3 {
        color: var(--highlight-color);
        margin-bottom: 0.5rem;
    }
    
    .evidence-meta {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
    }
    
    .evidence-meta .date {
        color: var(--gold-accent);
        font-size: 0.8rem;
    }
    
    .evidence-meta .tag {
        background: var(--accent-color);
        color: white;
        padding: 0.2rem 0.5rem;
        border-radius: 3px;
        font-size: 0.7rem;
    }
    
    .modal {
        display: none;
        position: fixed;
        z-index: 2000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
    }
    
    .modal-content {
        position: relative;
        background-color: var(--secondary-bg);
        margin: 5% auto;
        padding: 2rem;
        border-radius: 10px;
        width: 90%;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .close {
        position: absolute;
        top: 1rem;
        right: 1.5rem;
        color: var(--primary-text);
        font-size: 2rem;
        font-weight: bold;
        cursor: pointer;
    }
    
    .close:hover {
        color: var(--accent-color);
    }
    
    #modal-image {
        width: 100%;
        max-height: 400px;
        object-fit: contain;
        border-radius: 5px;
        margin-bottom: 1rem;
    }
    
    #modal-title {
        color: var(--highlight-color);
        margin-bottom: 0.5rem;
    }
    
    #modal-meta {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .modal-date {
        color: var(--gold-accent);
        font-size: 0.9rem;
    }
    
    .modal-tag {
        background: var(--accent-color);
        color: white;
        padding: 0.3rem 0.6rem;
        border-radius: 3px;
        font-size: 0.8rem;
    }
`;
document.head.appendChild(style);