# ZClean – sito demo

Sito demo per **ZClean**, impresa di pulizie a Romano di Lombardia (BG).
HTML, CSS e JavaScript puri: nessuna installazione, nessun build.

## Come vederlo
Apri `index.html` nel browser (doppio clic).
Per pubblicarlo: GitHub Pages oppure Vercel, cartella principale, nessuna configurazione.

## Cosa c'è
- **Loader**: lo schermo parte sporco e un tergivetro lo pulisce seguendo la percentuale di caricamento
- **Slider prima/dopo** con il tergivetro da trascinare
- **Spruzzini e spugna** che si muovono con lo scroll
- **Bolle di sapone** nelle sezioni blu
- **Stelline** su "30 secondi" quando entra nello schermo
- **Calcolatore case**: tipo di pulizia, camere, bagni, extra → prezzo + prenotazione WhatsApp già compilata
- **Calcolatore aziende**: tipo di locale, m², passaggi a settimana → stima + richiesta sopralluogo su WhatsApp
- Zone servite con mappa, FAQ, footer

## Da sistemare con il cliente
- **Prezzi**: sono di esempio. Si cambiano tutti in cima a `script.js`, nell'oggetto `CONFIG`
- **Testi da confermare**: FAQ (chiavi, pagamenti), elenco dei paesi serviti, servizi
- **Logo**: per ora è una scritta "zClean"
- **Foto**: `assets/prima.jpg` e `assets/dopo.jpg` (stesse dimensioni). Con foto vere di un loro lavoro rende ancora di più
- **Email**: ora è quella Gmail del sito attuale
- Pagine Privacy e Cookie (link nel footer)

## File
```
index.html     struttura della pagina
style.css      grafica
script.js      animazioni e calcolatori (prezzi in CONFIG)
assets/        foto prima/dopo e spruzzino senza sfondo
```
