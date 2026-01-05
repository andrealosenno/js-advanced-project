'use strict';

const SUBJECT_API = "https://openlibrary.org/subjects/";
const BASE_URL = "https://openlibrary.org";

let currentCategory = "";
let offset = 0;
const LIMIT = 50;

const elements = {
    themeToggle: document.getElementById('theme-toggle'),
    searchInput: document.getElementById('category-input'),
    searchBtn: document.getElementById('search-btn'),
    resultsArea: document.getElementById('results-area'),
    loader: document.getElementById('loader'),
    loadMoreBtn: document.getElementById('load-more-btn'),
    modal: document.getElementById('desc-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalBody: document.getElementById('modal-body'),
    closeBtn: document.querySelector('.close-btn')
};

document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (elements.themeToggle) elements.themeToggle.checked = true;
    }

    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    if (elements.searchBtn) elements.searchBtn.addEventListener('click', searchBooks);
    
    if (elements.searchInput) {
        elements.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') searchBooks();
        });
    }

    if (elements.loadMoreBtn) elements.loadMoreBtn.addEventListener('click', loadMoreBooks);
    
    if (elements.closeBtn) elements.closeBtn.addEventListener('click', closeModal);

    if (elements.resultsArea) {
        elements.resultsArea.addEventListener('click', (e) => {
            if (e.target.classList.contains('details-btn')) {
                const key = e.target.dataset.key;
                const title = e.target.dataset.title;
                getBookDetails(key, title);
            }
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target == elements.modal) {
            closeModal();
        }
    });
});

async function searchBooks() {
    const input = elements.searchInput.value.trim().toLowerCase();
    
    if (!input) {
        alert("Inserisci una categoria!");
        return;
    }

    currentCategory = input;
    offset = 0; 
    
    elements.resultsArea.innerHTML = '';
    elements.loadMoreBtn.style.display = 'none';

    await fetchBooks();
}

async function loadMoreBooks() {
    offset += LIMIT;
    await fetchBooks();
}

async function fetchBooks() {
    elements.loader.style.display = 'block';
    elements.loadMoreBtn.style.display = 'none';

    try {
        const url = new URL(`${SUBJECT_API}${currentCategory}.json`);
        url.searchParams.append('limit', LIMIT);
        url.searchParams.append('offset', offset);

        const response = await fetch(url);
        
        if (!response.ok) throw new Error("Errore API");

        const data = await response.json();
        elements.loader.style.display = 'none';

        if (data.work_count === 0 || data.works.length === 0) {
            if (offset === 0) {
                elements.resultsArea.innerHTML = '<p style="text-align:center; width:100%;">Nessun libro trovato.</p>';
            } else {
                alert("Non ci sono altri risultati da mostrare.");
            }
            return;
        }

        displayBooks(data.works);

        if (data.works.length === LIMIT) {
            elements.loadMoreBtn.style.display = 'inline-block';
        }

    } catch (error) {
        console.error(error);
        elements.loader.style.display = 'none';
        if (offset === 0) {
            elements.resultsArea.innerHTML = '<p style="text-align:center;">Errore nella ricerca.</p>';
        } else {
            alert("Errore nel caricamento degli altri libri.");
        }
    }
}

function displayBooks(books) {
    const fragment = document.createDocumentFragment();

    books.forEach(book => {
        const title = book.title;
        const authors = book.authors 
            ? book.authors.map(a => a.name).join(', ') 
            : "Autore sconosciuto";
        const key = book.key; 

        const card = document.createElement('div');
        card.className = 'book-card';

        const infoDiv = document.createElement('div');
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'book-title';
        titleDiv.textContent = title;

        const authorDiv = document.createElement('div');
        authorDiv.className = 'book-authors';
        authorDiv.textContent = `di ${authors}`;

        infoDiv.appendChild(titleDiv);
        infoDiv.appendChild(authorDiv);

        const btn = document.createElement('button');
        btn.className = 'details-btn';
        btn.textContent = 'Leggi Descrizione';
        btn.dataset.key = key;
        btn.dataset.title = title;

        card.appendChild(infoDiv);
        card.appendChild(btn);
        fragment.appendChild(card);
    });

    elements.resultsArea.appendChild(fragment);
}

async function getBookDetails(key, title) {
    elements.modal.style.display = 'flex';
    elements.modalTitle.textContent = title;
    elements.modalBody.innerHTML = '<i>Caricamento dettagli...</i>';

    try {
        const response = await fetch(`${BASE_URL}${key}.json`);
        const data = await response.json();
        let descriptionText = "Nessuna descrizione disponibile.";

        if (data.description) {
            if (typeof data.description === 'string') {
                descriptionText = data.description;
            } else if (data.description.value) {
                descriptionText = data.description.value;
            }
        }
        
        elements.modalBody.innerHTML = '';
        const p = document.createElement('p');
        p.textContent = descriptionText;
        elements.modalBody.appendChild(p);

    } catch (error) {
        elements.modalBody.innerHTML = '<p style="color:red">Errore nel recupero dettagli.</p>';
    }
}

function closeModal() {
    elements.modal.style.display = 'none';
}
