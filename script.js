// ─── URL SCRAMBLE ──────────────────────────────────────
// Replaces the visible URL in the address bar with a fake innocent path.
// Change this to whatever you want people to see if they glance at your screen.
const FAKE_TITLE = "Scientific Calculator - Math Tools";
document.title = FAKE_TITLE;
try {
  history.replaceState(null, "", "/apps/calculator/scientific");
} catch (e) {
  // replaceState can fail on file:// or restricted origins — ignore silently
}

let input = "";
const display = document.getElementById("display");
const buttonsContainer = document.getElementById("buttons");

// Calculator buttons
const buttons = [
  "7","8","9","/",
  "4","5","6","*",
  "1","2","3","-",
  "0",".","=","+",
  "C","←" // ← is backspace
];

const operators = ["/", "*", "-", "+"];

buttons.forEach((btn, i) => {
  const button = document.createElement("button");
  button.textContent = btn;
  button.onclick = (e) => {
    createRipple(e, button);
    handleInput(btn);
  };

  // Apply style classes
  if (operators.includes(btn)) {
    button.classList.add("operator");
  } else if (btn === "=") {
    button.classList.add("equals");
  } else if (btn === "C" || btn === "←") {
    button.classList.add("action");
  }

  // C button spans 2 columns
  if (btn === "C") {
    button.classList.add("wide");
  }

  buttonsContainer.appendChild(button);

  // Staggered entrance animation (applied after append so it always fires)
  requestAnimationFrame(() => {
    button.style.animation = `btnAppear 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.03}s both`;
  });
});

// Ripple effect on button press
function createRipple(event, button) {
  const ripple = document.createElement("span");
  ripple.classList.add("ripple");
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = (event.clientX - rect.left - size / 2) + "px";
  ripple.style.top = (event.clientY - rect.top - size / 2) + "px";
  button.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
}

function handleInput(value) {
  if (value === "=") {
    try {
      input = eval(input).toString();
    } catch (e) {
      input = "";
    }
    // Flash display on result
    display.classList.add("active");
    setTimeout(() => display.classList.remove("active"), 300);
  } else if (value === "C") {
    input = "";
  } else if (value === "←") { // backspace
    input = input.slice(0, -1);
  } else {
    input += value;
  }

  display.value = input;
  checkUnlock();
}

// Only 2 unlock methods
function checkUnlock() {
  if (input === "1987") {
    unlockHub();
  }
}

function unlockHub() {
  const calc = document.querySelector(".calculator");
  calc.classList.add("fade-out");
  setTimeout(() => {
    calc.style.display = "none";
    document.getElementById("hub").classList.remove("hidden");
    fetchRepos();
  }, 400);
}

// Key combo unlock: Shift + J
document.addEventListener("keydown", function(e){
  if (e.shiftKey && e.key.toLowerCase() === "j") {
    unlockHub();
  }
});

// Panic key: backtick
document.addEventListener("keydown", function(e){
  if (e.key === "`") {
    window.location.href = "https://www.desmos.com/calculator";
  }
});

// Game icons to pick from for visual variety (fallback when no image is set)
const gameIcons = ["🎮", "🕹️", "🎯", "🎲", "🏆", "⚡", "🔥", "💎", "🚀", "🌟", "🎪", "🃏"];

// ─── CUSTOM GAME IMAGES ────────────────────────────────
// Map repo names to image URLs to show a picture instead of an emoji.
// Just add entries like:  "repo-name": "https://example.com/image.png"
// Supports any image URL (png, jpg, gif, svg, webp).
// Repos not listed here will use a fallback emoji icon.
const gameImages = {
  // "my-cool-game": "images/cool-game.png",
  // "snake":        "https://i.imgur.com/abc123.png",
};

// ─── IFRAME GAMES (about:blank) ────────────────────────
// Any repo name listed here will open in a new about:blank tab with a
// full-screen iframe instead of navigating directly.  The URL bar in
// that tab will just say "about:blank" so nobody can see the real site.
//
// Set the value to true to auto-build the GitHub Pages URL,
// or set it to a custom URL string to load something else entirely.
//
// Examples:
//   "snake": true,                          // → opens https://<user>.github.io/snake in iframe
//   "my-game": "https://example.com/game",  // → opens that custom URL in iframe
const iframeGames = {
  // "snake": true,
  // "my-cool-game": "https://example.com/play",
};

// ─── EXTERNAL GAMES ────────────────────────────────────
// Add any external site / game here. These show up as cards in the hub
// and always open inside an about:blank iframe tab.
//
//   name:  Display name shown on the card
//   url:   The actual game URL (loaded in a hidden iframe)
//   image: (optional) image URL for the card icon — omit to use a fallback emoji
//
// Just uncomment and add as many as you want:
const externalGames = [
  { name: "Slope", url: "https://slope-game.github.io/slope", image: "https://i.imgur.com/3QF6vY9.png" },
  { name: "Test Game", url: "https://google.com" }, // Simple test without image
  // { name: "1v1.LOL",        url: "https://example.com/1v1",          image: "https://i.imgur.com/xyz.png" },
  // { name: "Retro Bowl",     url: "https://example.com/retro-bowl" },
  // { name: "Subway Surfers", url: "https://example.com/subway" },
];

// Opens a URL inside a full-screen iframe in a new about:blank tab
function openInBlank(url, title) {
  const win = window.open("about:blank", "_blank");
  if (!win) return; // popup blocked
  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>*{margin:0;padding:0}html,body{height:100%;overflow:hidden}iframe{width:100%;height:100%;border:none}</style>
</head>
<body>
  <iframe src="${url}" allowfullscreen></iframe>
</body>
</html>`);
  win.document.close();
}

// Format repo name into a readable title
function formatName(name) {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Fetch all GitHub Pages repos
async function fetchRepos() {
  const username = "hyperionx157"; // your GitHub username
  let page = 1;
  let repos = [];

  try {
    while (true) {
      const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}`);
      const data = await response.json();
      if (data.length === 0) break;
      repos = repos.concat(data);
      page++;
    }
  } catch (e) {
    // Silently handle network errors
  }

  // Hide loading spinner
  const loading = document.getElementById("hubLoading");
  if (loading) loading.style.display = "none";

  const list = document.getElementById("repoList");
  list.innerHTML = "";

  let cardIndex = 0;

  // ── Render external games first ──────────────────────
  externalGames.forEach((game) => {
    const li = document.createElement("li");
    li.className = "game-card";
    li.style.animationDelay = `${0.6 + cardIndex * 0.06}s`;

    const link = document.createElement("a");
    link.href = "#";
    link.addEventListener("click", function(e) {
      e.preventDefault();
      openInBlank(game.url, game.name);
    });

    const icon = document.createElement("div");
    icon.className = "card-icon";
    if (game.image) {
      const img = document.createElement("img");
      img.src = game.image;
      img.alt = game.name;
      img.className = "card-img";
      img.draggable = false;
      icon.appendChild(img);
      icon.classList.add("has-img");
    } else {
      icon.textContent = gameIcons[cardIndex % gameIcons.length];
    }

    const name = document.createElement("div");
    name.className = "card-name";
    name.textContent = game.name;

    const url = document.createElement("div");
    url.className = "card-url";
    url.textContent = "opens in about:blank";

    const arrow = document.createElement("span");
    arrow.className = "card-arrow";
    arrow.textContent = "→";

    link.appendChild(icon);
    link.appendChild(name);
    link.appendChild(url);
    link.appendChild(arrow);
    li.appendChild(link);
    list.appendChild(li);
    cardIndex++;
  });

  // ── Render GitHub repos ──────────────────────────────
  const pagesRepos = repos.filter(repo => repo.has_pages);

  if (pagesRepos.length === 0 && externalGames.length === 0) {
    const empty = document.createElement("div");
    empty.className = "hub-empty";
    empty.textContent = "No games found.";
    document.getElementById("hubContent").appendChild(empty);
    return;
  }

  pagesRepos.forEach((repo) => {
    const li = document.createElement("li");
    li.className = "game-card";
    li.style.animationDelay = `${0.6 + cardIndex * 0.06}s`;

    const gameUrl = `https://${username}.github.io/${repo.name}`;
    const link = document.createElement("a");
    link.href = gameUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    // If this game is in iframeGames, hijack the click to open in about:blank
    if (repo.name in iframeGames) {
      link.addEventListener("click", function(e) {
        e.preventDefault();
        const iframeUrl = typeof iframeGames[repo.name] === "string"
          ? iframeGames[repo.name]
          : gameUrl;
        openInBlank(iframeUrl, formatName(repo.name));
      });
    }

    const icon = document.createElement("div");
    icon.className = "card-icon";

    // Use custom image if one is configured, otherwise fall back to emoji
    if (gameImages[repo.name]) {
      const img = document.createElement("img");
      img.src = gameImages[repo.name];
      img.alt = formatName(repo.name);
      img.className = "card-img";
      img.draggable = false;
      icon.appendChild(img);
      icon.classList.add("has-img");
    } else {
      icon.textContent = gameIcons[cardIndex % gameIcons.length];
    }

    const name = document.createElement("div");
    name.className = "card-name";
    name.textContent = formatName(repo.name);

    const url = document.createElement("div");
    url.className = "card-url";
    url.textContent = `${username}.github.io/${repo.name}`;

    const arrow = document.createElement("span");
    arrow.className = "card-arrow";
    arrow.textContent = "→";

    link.appendChild(icon);
    link.appendChild(name);
    link.appendChild(url);
    link.appendChild(arrow);
    li.appendChild(link);
    list.appendChild(li);
    cardIndex++;
  });
}
