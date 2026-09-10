# archive: routed-SPA portfolio (retired 2026-09-10)

What it was: a vanilla History-API router with a home view (hero, capability
grid, employment history, project cards, notes teaser, contact block), a notes
page rendered from `notes.js`, and an RSS feed generated at build time.

What beat it: a single static page. Ryan, 2026-09-10: "the website copy is
doing too much... Nobody's going to read all that. It's not entertaining.
Nobody cares. It's giving away too much information. It's doxing me."

Measured reason: four sections and three essays of recruiter copy on a site
whose own README said "the repos are the real portfolio." The employment
history, city, email, and resume were the doxing surface. The lamp was the
only part he kept.

Still runnable: `router.js` + `home.js` + `notes-view.js` + `notes.js` are
self-contained ES modules; wire them from `main.js` with
`defineRoute('/', homeView)` and the retired `style.css` to reproduce the old
site. Last live at commit 7f8ed52.
