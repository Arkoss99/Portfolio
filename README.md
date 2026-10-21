# Milan Zlámal — portfolio

Moje portfolio ve stylu Studio. Weby, hry a interaktivní projekty.

**Web:** https://arkoss99.github.io/Portfolio/

## Co tu je

- Stylizovaný 3D avatar z Blenderu s otáčením a pozastavením.
- Hydra-4421 — webový projekt inspirovaný Welcome to the Game 2.
- monument.gg — rozpracovaný maturitní projekt pro Rust servery.
- Informace o mně, technologie a kontakty.
- Mobilní rozložení a statický obrázek pro případ nedostupného 3D.

## Spuštění lokálně

Potřebuješ Node.js. V této složce spusť:

```powershell
node serve.mjs
```

Otevři http://127.0.0.1:5189. Přímé otevření `index.html` přes `file://` nestačí pro načtení 3D modelu.

## Soubory

- `index.html` — obsah a struktura stránky.
- `styles.css` — vzhled a mobilní rozložení.
- `app.js` — podrobnosti projektů a spuštění 3D.
- `scene.js` — kamera, světla a ovládání modelu.
- `assets/` — 3D model, jeho render a obrázky projektů.
- `vendor/` — Three.js 0.160.1 a MIT licence.

Web se nasazuje přes GitHub Pages z kořene větve `main`. Není potřeba build ani instalace balíčků. Písma se načítají z Google Fonts.

Avatar je stylizace podle fotografie, nikoliv přesný sken. Náhled Monumentu je skutečný snímek rozpracované aplikace z října 2026; čísla serverů nejsou živá data. V detailu je oddělené, co už funguje a co teprve vznikne.
