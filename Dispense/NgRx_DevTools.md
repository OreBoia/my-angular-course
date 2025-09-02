# NgRx Store DevTools e Debugging

Il debugging di applicazioni complesse con state management può essere una sfida. Fortunatamente, NgRx offre un potente strumento per semplificare questo processo: **@ngrx/store-devtools**. Questo pacchetto integra la tua applicazione Angular con le Redux DevTools, un'estensione per browser che permette di ispezionare, tracciare e "viaggiare nel tempo" attraverso lo stato della tua applicazione.

## Come funziona?

`@ngrx/store-devtools` ascolta tutte le azioni dispatchate e le mutazioni di stato che avvengono nello store NgRx. Invia queste informazioni all'estensione Redux DevTools installata nel browser, che le visualizza in un'interfaccia utente intuitiva.

Questo ti permette di:
*   Vedere un log di tutte le azioni in tempo reale.
*   Ispezionare il payload di ogni azione.
*   Visualizzare l'intero albero di stato prima e dopo ogni azione.
*   Identificare esattamente quale azione ha causato un determinato cambiamento di stato.
*   Tornare a uno stato precedente per riprodurre bug (Time-Travel Debugging).

## Installazione e Configurazione

Integrare le DevTools è un processo semplice.

### 1. Installazione del pacchetto

Usa `ng add` per installare il pacchetto e configurarlo automaticamente:

```bash
ng add @ngrx/store-devtools
```

In alternativa, puoi installarlo manualmente via npm:

```bash
npm install @ngrx/store-devtools --save
```

### 2. Configurazione (per Standalone API)

Se hai installato manualmente, devi aggiungere `provideStoreDevtools` ai provider della tua applicazione. È una buona pratica abilitare le DevTools solo in ambiente di sviluppo per evitare overhead in produzione.

```typescript
// app.config.ts
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(), // I tuoi reducers qui
    // ... altri provider
    
    // Aggiungi il provider per le DevTools
    provideStoreDevtools({
      maxAge: 25, // Mantiene gli ultimi 25 stati
      logOnly: !isDevMode(), // In produzione, logga solo le azioni senza impattare le performance
      autoPause: true, // Mette in pausa la registrazione quando la DevTools non è aperta
      trace: false, // Logga lo stack trace per ogni azione (utile per debugging avanzato)
      traceLimit: 75, // Limite dello stack trace
    }),
  ],
};
```

## Utilizzo delle DevTools nel Browser

Una volta installata l'estensione [Redux DevTools](https://github.com/reduxjs/redux-devtools) per il tuo browser (Chrome, Firefox, Edge) e avviata l'applicazione, apri gli strumenti per sviluppatori (F12) e vai al tab "Redux".

Troverai un pannello con tre sezioni principali:

1.  **Lista delle Azioni**: Sulla sinistra, vedrai un log di ogni azione dispatchata, a partire da `@ngrx/store/init`. Cliccando su un'azione, puoi ispezionarne il `type` e il `payload` nella sezione "Action".
2.  **Stato Corrente**: Al centro, puoi navigare l'albero dello stato. Puoi visualizzare lo stato come un oggetto (`Tree`), un grafico (`Chart`) o vedere le differenze rispetto allo stato precedente (`Diff`). Questo è estremamente utile per vedere l'impatto di un'azione.
3.  **Time-Travel Debugging**: In basso, c'è una timeline che ti permette di "viaggiare nel tempo". Puoi cliccare su un'azione passata per riportare l'intera applicazione a quello stato, oppure usare i pulsanti di play, step-by-step, undo/redo per analizzare la sequenza di eventi.

## Attività Pratica

1.  **Installa e configura** `@ngrx/store-devtools` nel tuo progetto.
2.  **Installa l'estensione** Redux DevTools nel tuo browser.
3.  **Avvia l'applicazione** e apri il pannello Redux DevTools.
4.  **Interagisci con l'app**: esegui azioni che modificano lo stato (es. login, aggiunta di un prodotto al carrello, ecc.).
5.  **Ispeziona le azioni**: Osserva come ogni interazione genera una nuova azione nel log. Clicca su un'azione e controlla il suo payload.
6.  **Analizza i cambiamenti di stato**: Seleziona un'azione e vai sulla tab `Diff` per vedere esattamente cosa è cambiato nello stato.
7.  **Prova il Time-Travel**: Usa la timeline in basso per tornare a uno stato precedente. Osserva come l'interfaccia utente della tua applicazione si aggiorna per riflettere quello stato. Questo ti aiuta a capire come un bug si è manifestato.

## Tabella dei Termini Chiave

| Termine | Descrizione |
| :--- | :--- |
| **`@ngrx/store-devtools`** | Il pacchetto NgRx che collega lo store alle Redux DevTools. |
| **Redux DevTools** | L'estensione del browser che fornisce l'interfaccia per il debugging dello stato. |
| **Action Inspector** | La sezione delle DevTools dove vengono listate tutte le azioni dispatchate. |
| **State Inspector** | La sezione dove è possibile visualizzare l'albero di stato corrente, in formato `Tree`, `Chart` o `Diff`. |
| **Time-Travel Debugging** | La funzionalità che permette di navigare avanti e indietro nella cronologia degli stati dell'applicazione. |
| **`provideStoreDevtools()`** | La funzione usata nelle applicazioni Standalone per configurare e registrare le DevTools. |
| **`isDevMode()`** | Una funzione di Angular che restituisce `true` se l'applicazione è in modalità sviluppo, utile per abilitare le DevTools solo quando necessario. |
