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

buttons.forEach(btn => {
  const button = document.createElement("button");
  button.textContent = btn;
  button.onclick = () => handleInput(btn);
  buttonsContainer.appendChild(button);
});

function handleInput(value) {
  if (value === "=") {
    try {
      input = eval(input).toString();
    } catch {
      input = "";
    }
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
  if (input === "1984") {
    unlockHub();
  }
}

function unlockHub() {
  document.querySelector(".calculator").style.display = "none";
  document.getElementById("hub").classList.remove("hidden");
  fetchRepos();
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

// Fetch all GitHub Pages repos
async function fetchRepos() {
  const username = "hyperionx157"; // change this
  let page = 1;
  let repos = [];

  while (true) {
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}`);
    const data = await response.json();
    if (data.length === 0) break;
    repos = repos.concat(data);
    page++;
  }

  const list = document.getElementById("repoList");
  list.innerHTML = "";

  repos.forEach(repo => {
    if (repo.has_pages) { // only repos with GitHub Pages
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = `https://${username}.github.io/${repo.name}`;
      link.textContent = repo.name;
      link.target = "_blank";
      link.style.color = "#00ff88";
      li.appendChild(link);
      list.appendChild(li);
    }
  });
}
