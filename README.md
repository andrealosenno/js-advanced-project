# 🦉 Owly Library

Owly Library è una web application moderna e reattiva che permette agli utenti di esplorare libri basandosi su categorie e soggetti. L'applicazione si interfaccia con l'API pubblica di Open Library per fornire un catalogo vasto e dettagliato.

## ✨ Funzionalità Principali

*   **Ricerca per Categoria**: Cerca libri inserendo un soggetto (es. "fantasy", "science", "history").
*   **Dettagli Approfonditi**: Visualizza la descrizione completa di un libro tramite una modale interattiva.
*   **Tema Chiaro/Scuro**: Include uno switch personalizzato con icone animate per passare dalla modalità Light alla Dark. La preferenza viene salvata automaticamente nel browser.
*   **Paginazione**: Sistema "Load More" per caricare ulteriori risultati senza ricaricare la pagina.
*   **Design Responsivo**: Layout fluido realizzato con CSS Grid e Flexbox, ottimizzato per desktop e mobile.
*   **Performance**: Manipolazione del DOM ottimizzata e gestione asincrona delle chiamate API.

## 🛠️ Tecnologie Utilizzate

*   **HTML5**: Struttura semantica e accessibile.
*   **CSS3**:
    *   Utilizzo di **CSS Variables** per la gestione dinamica dei temi.
    *   Transizioni fluide per un'esperienza utente gradevole.
    *   Layout responsive.
*   **JavaScript (Vanilla)**:
    *   ES6+ syntax.
    *   `async/await` e `Fetch API` per le richieste di rete.
    *   `localStorage` per la persistenza delle preferenze utente.

## 🚀 Utilizzo

Per utilizzare l'app visita il sito https://andrealosenno.github.io/js-advanced-project/

## 🔌 API Reference

Questo progetto utilizza l'API gratuita di Open Library.

*   Endpoint Soggetti: `https://openlibrary.org/subjects/{subject}.json`
*   Endpoint Dettagli: `https://openlibrary.org{key}.json`
