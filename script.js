// ─── EXCLUDED REPOSITORIES ──────────────────────────────────
// Add any GitHub repo names here that you want to hide from the game hub.
// These will NOT appear in the list, even if they have GitHub Pages enabled.
const excludedRepos = [
  "GameSite",        // hides https://hyperionx157.github.io/GameSite/
  "GameSite-V2"      // hides https://hyperionx157.github.io/GameSite-V2/
  // Add more repo names as needed, e.g., "my-private-repo", "test-game"
];

// ─── URL SCRAMBLE ──────────────────────────────────────
// Replaces the visible URL in the address bar with a fake innocent path.
// Change this to whatever you want people to see if they glance at your screen.
const FAKE_TITLE = "Scientific Calculator - Math Tools";
document.title = FAKE_TITLE;

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

  // Staggered entrance animation
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
  } else if (value === "←") {
    input = input.slice(0, -1);
  } else {
    input += value;
  }

  display.value = input;
  checkUnlock();
}

// Unlock methods: type "1987" or press Shift+J
function checkUnlock() {
  if (input === "12345") {
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
    alert("Sorry guys, I decided to be a nice person and change the password. :) make sure to give thanks to Rylen Baldwin");
  }
});

let keySequence = [];

document.addEventListener("keydown", function(e){
  keySequence.push(e.key);
  if (keySequence.length > 3) keySequence.shift();
  
  if (keySequence.join("") === "456" && e.shiftKey) {
    unlockHub();
  }
});

// Panic key: backtick
document.addEventListener("keydown", function(e){
  if (e.key === "`") {
    window.location.href = "https://www.desmos.com/calculator";
  }
});

// Game icons to pick from for visual variety
const gameIcons = ["🎮", "🕹️", "🎯", "🎲", "🏆", "⚡", "🔥", "💎", "🚀", "🌟", "🎪", "🃏"];

// ─── CUSTOM GAME IMAGES ────────────────────────────────
// Map repo names to image URLs to show a picture instead of an emoji.
const gameImages = {
  // "my-cool-game": "images/cool-game.png",
};

// ─── IFRAME GAMES (about:blank) ────────────────────────
// Any repo name listed here will open in a new about:blank tab.
const iframeGames = {
  // "snake": true,
};

// ─── EXTERNAL GAMES ────────────────────────────────────
// Add any external site / game here.
const externalGames = [
  { name: "Slope", url: "https://slope-game.github.io/slope" },
  // { name: "1v1.LOL", url: "https://example.com/1v1" },
];

// Opens a URL inside a full-screen iframe in a new about:blank tab
function openInBlank(url, title) {
  const win = window.open("about:blank", "_blank");
  if (!win) return;
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

function formatName(name) {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Check if a repo should be excluded
function isRepoExcluded(repoName) {
  return excludedRepos.some(excluded => 
    repoName === excluded || 
    repoName.toLowerCase() === excluded.toLowerCase()
  );
}

// Fetch all GitHub Pages repos (excluding specified ones)
async function fetchRepos() {
  const username = "hyperionx157";
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
    console.error("Failed to fetch repos:", e);
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
      img.onerror = function() {
        icon.textContent = gameIcons[cardIndex % gameIcons.length];
        icon.classList.remove("has-img");
      };
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

  // ── Render GitHub repos (filter out excluded ones) ────
  const pagesRepos = repos.filter(repo => repo.has_pages && !isRepoExcluded(repo.name));

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

    // Use custom image if configured
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
