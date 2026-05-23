# Bitcoin Advanced Unlimited DR12 — static website

This is a small static site that helps users check a Bitcoin transaction's mempool status and opens popular accelerator pages where they can request a speed-up.

Files:
- `index.html` — main page
- `styles.css` — styling
- `script.js` — frontend logic (queries public blockstream API)

Notes:
- This site does not itself modify or rebroadcast transactions. To actually speed up a transaction you must either use your wallet's RBF/CPFP functionality or use a third-party mining-pool accelerator.
- The donations address shown in the Donations tab is: `bc1qlwf32ee3ssjh6p5548ufa6zr36cyzy4jfv3zd6`.
- Footer displays `bitcoinadvancedunlimiteddr12.space` as requested.

To view locally:

```bash
# from workspace root
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

To publish, host the files on any static hosting (GitHub Pages, Netlify, Vercel, etc.).
# Bitcoinunlimited