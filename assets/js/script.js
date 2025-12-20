const SUBJECT_API = "https://openlibrary.org/subjects/";
const BASE_URL = "https://openlibrary.org";

let currentCategory = "";
let offset = 0;
const LIMIT = 50;

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.checked = true;
    }

    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            const body = document.body;
            if (this.checked) {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }
});

window.addEventListener('click', function(event) {
    const modal = document.getElementById('desc-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

async function searchBooks() {
    const input = document.getElementById('category-input').value.trim().toLowerCase();
    
    if (!input) {
        alert("Inserisci una categoria!");
        return;
    }

    currentCategory = input;
    offset = 0; 
    
    document.getElementById('results-area').innerHTML = '';
    document.getElementById('load-more-btn').style.display = 'none';

    await fetchBooks();
}

async function loadMoreBooks() {
    offset += LIMIT;
    await fetchBooks();
}

async function fetchBooks() {
    const resultsArea = document.getElementById('results-area');
    const loader = document.getElementById('loader');
    const loadMoreBtn = document.getElementById('load-more-btn');

    loader.style.display = 'block';
    loadMoreBtn.style.display = 'none';

    try {
        const response = await fetch(`${SUBJECT_API}${currentCategory}.json?limit=${LIMIT}&offset=${offset}`);
        
        if (!response.ok) throw new Error("Errore API");

        const data = await response.json();
        loader.style.display = 'none';

        if (data.work_count === 0 || data.works.length === 0) {
            if (offset === 0) {
                resultsArea.innerHTML = '<p style="text-align:center; width:100%;">Nessun libro trovato.</p>';
            } else {
                alert("Non ci sono altri risultati da mostrare.");
            }
            return;
        }

        displayBooks(data.works);

        if (data.works.length === LIMIT) {
            loadMoreBtn.style.display = 'inline-block';
        } else {
            loadMoreBtn.style.display = 'none';
        }

    } catch (error) {
        console.error(error);
        loader.style.display = 'none';
        if (offset === 0) {
            resultsArea.innerHTML = '<p style="text-align:center;">Errore nella ricerca.</p>';
        } else {
            alert("Errore nel caricamento degli altri libri.");
        }
    }
}

function displayBooks(books) {
    const resultsArea = document.getElementById('results-area');

    books.forEach(book => {
        const title = book.title;
        const authors = book.authors 
            ? book.authors.map(a => a.name).join(', ') 
            : "Autore sconosciuto";
        const key = book.key; 

        const card = document.createElement('div');
        card.className = 'book-card';

        card.innerHTML = `
            <div>
                <div class="book-title">${title}</div>
                <div class="book-authors">di ${authors}</div>
            </div>
        `;

        const btn = document.createElement('button');
        btn.className = 'details-btn';
        btn.textContent = 'Leggi Descrizione';
        btn.onclick = () => getBookDetails(key, title);

        card.appendChild(btn);
        resultsArea.appendChild(card);
    });
}

async function getBookDetails(key, title) {
    const modal = document.getElementById('desc-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modal.style.display = 'flex';
    modalTitle.innerText = title;
    modalBody.innerHTML = '<i>Caricamento dettagli...</i>';

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
        modalBody.innerHTML = `<p>${descriptionText}</p>`;
    } catch (error) {
        modalBody.innerHTML = '<p style="color:red">Errore nel recupero dettagli.</p>';
    }
}

function closeModal() {
    document.getElementById('desc-modal').style.display = 'none';
}