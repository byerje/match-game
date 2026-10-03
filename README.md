# Little Match

A cozy, responsive memory game built with plain HTML, CSS, and JavaScript. Choose from 16 themes, including sports, cuddly animals, fantasy, baby objects, fishing, space, horses, Minecraft, dancing, and candy, plus a 4 × 4 or 6 × 6 board. Click **New game** to choose a different theme. Themes use emoji-style symbols; princess and creature themes use generic symbols rather than character artwork. No build step or dependencies required.

## Play locally

Open `index.html` in a web browser.

## Publish with GitHub Pages

1. Push this repository to GitHub on the `main` branch.
2. In the repository, open **Settings → Pages** and set the build and deployment source to **GitHub Actions**. This one-time setup is required before the workflow can deploy.
3. The workflow publishes the game on each push to `main`. Find the published URL in the workflow run or the Pages settings.

Because this repository is named `match-game`, its Pages address will be `https://byerje.github.io/match-game/`. The site uses relative asset paths, so it can also be hosted at a domain root.
