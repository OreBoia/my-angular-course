# Guida ai Selettori di Cypress: `cy.get()`

Il comando `cy.get()` è uno dei più utilizzati in Cypress. Serve per selezionare uno o più elementi del DOM (Document Object Model) su cui poi eseguire azioni (come `.click()`, `.type()`) o asserzioni (come `.should()`).

`cy.get()` utilizza i selettori CSS per trovare gli elementi. Di seguito sono elencate le modalità più comuni per utilizzarlo.

## 1. Selezione tramite Tag HTML

Seleziona tutti gli elementi con un certo tag.

```javascript
// Seleziona tutti i bottoni nella pagina
cy.get('button')

// Seleziona tutti i div
cy.get('div')
```

## 2. Selezione tramite ID

L'ID di un elemento dovrebbe essere unico nella pagina. Si usa il simbolo cancelletto (`#`).

```javascript
// Seleziona l'elemento con id="login-button"
cy.get('#login-button')
```

## 3. Selezione tramite Classe CSS

Seleziona tutti gli elementi che hanno una specifica classe. Si usa il punto (`.`).

```javascript
// Seleziona tutti gli elementi con la classe "btn-primary"
cy.get('.btn-primary')

// Puoi concatenare più classi per essere più specifico
// Seleziona elementi con entrambe le classi "btn" e "primary"
cy.get('.btn.primary')
```

## 4. Selezione tramite Attributo

Puoi selezionare elementi in base ai loro attributi e ai relativi valori.

```javascript
// Seleziona tutti gli input con l'attributo type="password"
cy.get('input[type="password"]')

// Seleziona l'elemento con l'attributo data-cy="login-submit"
// Questa è la pratica consigliata da Cypress per test stabili
cy.get('[data-cy="login-submit"]')
```

## 5. Combinazione di Selettori

Puoi combinare i selettori visti sopra per creare query più precise e robuste.

```javascript
// Tag e classe
// Seleziona i bottoni che hanno la classe "btn-submit"
cy.get('button.btn-submit')

// Tag e ID
// Seleziona il bottone con id="main-submit"
cy.get('button#main-submit')

// ID e classe
// Seleziona l'elemento con id="main-submit" e classe "btn"
cy.get('#main-submit.btn')

// Combinazione di più attributi
// Seleziona il bottone con type="submit" E data-cy="login-button"
cy.get('button[type="submit"][data-cy="login-button"]')

// Combinazione completa
// Seleziona il bottone con id="myButton", classe "btn", type="submit" e data-cy="login-button"
cy.get('button#myButton.btn[type="submit"][data-cy="login-button"]')
```

## 6. Selettori Gerarchici (Discendenti)

Per selezionare un elemento che si trova all'interno di un altro, puoi usare uno spazio tra i selettori.

```javascript
// Seleziona tutti gli input all'interno del form con id="login-form"
cy.get('form#login-form input')

// Seleziona l'elemento con classe "error" dentro un div
cy.get('div .error')
```

## Pratica Migliore: Attributi `data-*`

Per evitare che i test si rompano quando cambi gli stili (classi CSS) o la struttura (ID), la pratica migliore è usare attributi `data-*` dedicati ai test.

**HTML:**

```html
<button data-cy="login-button">Accedi</button>
```

**Test Cypress:**

```javascript
cy.get('[data-cy="login-button"]').click()
```

Questo approccio rende i tuoi test più resilienti ai cambiamenti dell'applicazione.

## 7. Azioni e Asserzioni Comuni (Chaining)

Una volta selezionato un elemento con `cy.get()`, puoi "concatenare" (chain) comandi per eseguire azioni o fare verifiche.

### Azioni

Questi comandi simulano le interazioni dell'utente.

- **`.click()`**: Clicca su un elemento del DOM.

  ```javascript
  cy.get('button').click()
  ```

- **`.type()`**: Scrive del testo in un input, textarea, o elemento contenteditable.

  ```javascript
  cy.get('input[name="username"]').type('testuser')
  ```

- **`.clear()`**: Pulisce il valore di un input o textarea.

  ```javascript
  cy.get('input[name="username"]').clear()
  ```

- **`.check()`**: Seleziona una checkbox o un radio button.

  ```javascript
  cy.get('input[type="checkbox"]').check()
  ```

- **`.uncheck()`**: Deseleziona una checkbox.

  ```javascript
  cy.get('input[type="checkbox"]').uncheck()
  ```

- **`.select()`**: Seleziona un `<option>` all'interno di un `<select>`.

  ```javascript
  // Seleziona per valore
  cy.get('select').select('option-value')
  // Seleziona per testo visibile
  cy.get('select').select('Testo Visibile')
  ```

### Asserzioni (Verifiche)

Le asserzioni verificano che l'applicazione sia nello stato atteso. Si usano principalmente con `.should()`.

- **`.should()`**: Crea un'asserzione. Accetta dei "chainers" (come `be.visible`, `have.text`) per definire la verifica.

  ```javascript
  // Verifica che l'elemento esista
  cy.get('#user-greeting').should('exist')

  // Verifica che l'elemento sia visibile
  cy.get('.error-message').should('be.visible')

  // Verifica che l'elemento contenga un testo specifico
  cy.get('h1').should('have.text', 'Benvenuto!')

  // Verifica che l'elemento abbia una classe CSS
  cy.get('button').should('have.class', 'btn-primary')
  ```

- **`.and()`**: Concatena più asserzioni sullo stesso elemento.

  ```javascript
  cy.get('#submit-button')
    .should('be.visible')
    .and('not.be.disabled')
  ```

### Filtri e Traversing del DOM

Questi comandi ti permettono di navigare e filtrare la selezione corrente.

- **`.first()`**: Seleziona il primo elemento tra quelli trovati.

  ```javascript
  cy.get('li').first() // Seleziona il primo <li>
  ```

- **`.last()`**: Seleziona l'ultimo elemento tra quelli trovati.

  ```javascript
  cy.get('li').last() // Seleziona l'ultimo <li>
  ```

- **`.eq()`**: Seleziona un elemento a un indice specifico (base 0).

  ```javascript
  cy.get('li').eq(2) // Seleziona il terzo <li>
  ```

- **`.find()`**: Trova elementi discendenti che corrispondono a un selettore, partendo dalla selezione corrente.

  ```javascript
  cy.get('form').find('input') // Trova tutti gli input dentro il form
  ```

## 8. Verificare l'URL

Il comando `cy.url()` è specifico per ottenere l'URL della pagina corrente. A differenza di `cy.get()`, non seleziona elementi del DOM, ma restituisce una stringa contenente l'URL.

Viene quasi sempre usato in combinazione con `.should()` per verificare che la navigazione sia avvenuta correttamente.

### Verifiche Comuni sull'URL

- **`.should('include', '...')`**: Verifica che l'URL contenga una stringa specifica (es. un percorso).
  ```javascript
  // Dopo aver cliccato un link per il login
  cy.url().should('include', '/login')
  ```

- **`.should('eq', '...')`**: Verifica che l'URL sia esattamente uguale a una stringa.
  ```javascript
  cy.url().should('eq', 'https://www.miosito.com/dashboard')
  ```

- **`.should('match', /.../)`**: Verifica che l'URL corrisponda a un'espressione regolare. Utile per URL dinamici.
  ```javascript
  // Verifica che l'URL sia nel formato /users/QUALSIASI_NUMERO
  cy.url().should('match', /\/users\/\d+$/)
  ```

### Esempio in un Test
```javascript
it('dovrebbe navigare alla pagina profilo dopo il login', () => {
  cy.visit('/login');
  cy.get('[data-cy="username"]').type('utente');
  cy.get('[data-cy="password"]').type('password123');
  cy.get('[data-cy="login-button"]').click();

  // Verifica che l'URL sia cambiato e includa /profile
  cy.url().should('include', '/profile');
});
```
