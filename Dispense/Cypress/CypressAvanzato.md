# Gestione Avanzata dei Dati di Test: Fixtures, Intercept e Mocking

Quando i test diventano più complessi, gestire i dati di test direttamente nel codice può diventare disordinato e difficile da mantenere. Cypress offre strumenti potenti per gestire dati statici, intercettare le chiamate di rete e simulare le risposte delle API (mocking).

## 1. Gestione dei Dati con le Fixtures

Una "fixture" è un file contenente dati di test statici, solitamente in formato JSON. Le fixtures permettono di separare i dati dai test, rendendo il codice più pulito e riutilizzabile.

**Caso d'uso comune**: Popolare un form di login o registrazione senza scrivere i dati direttamente nel test.

### Come creare una Fixture

1. Crea un file JSON nella cartella `cypress/fixtures`. Ad esempio, `user.json`.

    **`cypress/fixtures/user.json`**

    ```json
    {
      "username": "testuser",
      "email": "test@example.com",
      "password": "Password123!"
    }
    ```

### Come usare una Fixture in un Test

Usa il comando `cy.fixture()` per caricare i dati dal file.

```javascript
describe('Form di Registrazione', () => {
  it('dovrebbe compilare il form usando i dati da una fixture', () => {
    cy.visit('/register');

    // Carica la fixture 'user.json'
    cy.fixture('user').then((userData) => {
      // Usa i dati della fixture per compilare il form
      cy.get('input[name="username"]').type(userData.username);
      cy.get('input[name="email"]').type(userData.email);
      cy.get('input[name="password"]').type(userData.password);
    });

    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

## 2. Intercettare le Chiamate di Rete con `cy.intercept()`

`cy.intercept()` è uno dei comandi più potenti di Cypress. Permette di "spiare" e "controllare" le richieste di rete (HTTP/XHR) che la tua applicazione fa.

Puoi usarlo per:

* **Spiare (Spying)**: Verificare che una richiesta sia stata fatta e controllarne i dettagli (URL, metodo, body).
* **Stubbare (Stubbing/Mocking)**: Fornire una risposta falsa (mock) a una richiesta, senza che questa raggiunga mai il server reale.

### Spiare una Richiesta (Spying)

Verifichiamo che, dopo il login, venga fatta una chiamata `POST` a `/api/login`.

```javascript
it('dovrebbe fare una chiamata POST a /api/login', () => {
  // Intercetta le chiamate POST a /api/login e dagli un alias 'loginRequest'
  cy.intercept('POST', '/api/login').as('loginRequest');

  cy.visit('/login');
  cy.get('[data-cy="username"]').type('testuser');
  cy.get('[data-cy="password"]').type('password123');
  cy.get('[data-cy="login-button"]').click();

  // Aspetta che la richiesta 'loginRequest' sia completata
  cy.wait('@loginRequest').then((interception) => {
    // Ora puoi fare asserzioni sulla richiesta
    expect(interception.request.body.username).to.equal('testuser');
    expect(interception.response.statusCode).to.equal(200);
  });
});
```

## 3. Mocking delle API (Stubbing)

Il mocking (o stubbing) è fondamentale per creare test veloci, affidabili e indipendenti dal backend. Invece di dipendere da un server reale (che potrebbe essere lento o non disponibile), puoi simulare le sue risposte.

**Caso d'uso comune**: Testare come l'interfaccia utente reagisce a diverse risposte del server (successo, errore 404, errore 500) senza dover configurare il backend per ogni scenario.

### Come fare il Mock di una Risposta

Combiniamo `cy.intercept()` con una fixture per simulare la risposta di un'API che restituisce una lista di prodotti.

1. Crea una fixture con i dati da restituire.

    **`cypress/fixtures/products.json`**

    ```json
    [
      { "id": 1, "name": "Laptop", "price": 1200 },
      { "id": 2, "name": "Mouse", "price": 25 },
      { "id": 3, "name": "Tastiera", "price": 75 }
    ]
    ```

2. Usa `cy.intercept()` per intercettare la chiamata e restituire la fixture.

    ```javascript
    describe('Pagina Prodotti', () => {
      it('dovrebbe mostrare la lista di prodotti ricevuta dal server mockato', () => {
        // Intercetta le chiamate GET a /api/products e rispondi con la fixture
        cy.intercept('GET', '/api/products', { fixture: 'products.json' }).as('getProducts');

        cy.visit('/products');

        // Aspetta che la chiamata sia completata (opzionale ma buona pratica)
        cy.wait('@getProducts');

        // Verifica che l'UI mostri i dati della fixture
        cy.get('.product-list .product-item').should('have.length', 3);
        cy.contains('Laptop').should('be.visible');
        cy.contains('Mouse').should('be.visible');
      });

      it('dovrebbe mostrare un messaggio di errore se il server fallisce', () => {
        // Simula una risposta di errore 500 dal server
        cy.intercept('GET', '/api/products', {
          statusCode: 500,
          body: { message: 'Errore interno del server!' }
        }).as('getProductsError');

        cy.visit('/products');
        cy.wait('@getProductsError');

        // Verifica che l'UI mostri un messaggio di errore
        cy.get('.error-message').should('be.visible').and('contain', 'Errore');
      });
    });
    ```

### Vantaggi del Mocking

* **Velocità**: I test non aspettano le risposte di un server reale.
* **Affidabilità**: I test non falliscono a causa di problemi di rete o del backend.
* **Test di Edge Case**: Puoi simulare facilmente scenari difficili da riprodurre, come errori 500, risposte vuote o dati malformati.
