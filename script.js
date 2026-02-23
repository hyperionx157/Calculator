let input = "";
const display = document.getElementById("display");
const buttonsContainer = document.getElementById("buttons");

const buttons = [
  "7","8","9","/",
  "4","5","6","*",
  "1","2","3","-",
  "0",".","=","+"
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
  } else {
    input += value;
  }

  display.value = input;

  checkUnlock();
}

function checkUnlock() {

  // 🔐 Method 1: Secret Code
  if (input === "2026") {
    unlockHub();
  }

  // 🔐 Method 2: Long calculation pattern
  if (input.includes("9999*9")) {
    unlockHub();
  }
}

function unlockHub() {
  document.querySelector(".calculator").style.display = "none";
  document.getElementById("hub").classList.remove("hidden");
  fetchRepos();
}

// 🧠 Method 3: Key Combo Unlock
document.addEventListener("keydown", function(e){
  if (e.ctrlKey && e.shiftKey && e.key === "H") {
    unlockHub();
  }
});

// 🧠 Method 4: Hold 0 for 3 seconds
let holdTimer;
document.addEventListener("mousedown", function(e){
  if (e.target.textContent === "0") {
    holdTimer = setTimeout(unlockHub, 3000);
  }
});
document.addEventListener("mouseup", function(){
  clearTimeout(holdTimer);
});
async function fetchRepos() {
  const username = "hyperionx157";
  const response = await fetch(`https://api.github.com/users/${username}/repos`);
  const repos = await response.json();

  const list = document.getElementById("repoList");
  list.innerHTML = "";

  repos.forEach(repo => {
    if (repo.has_pages) {
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
document.addEventListener("keydown", function(e) {

  // Press `
  if (e.key === "`") {
    panic();
  }

  // ESC also panics
  if (e.key === "Escape") {
    panic();
  }
});

function panic() {

  // Option 1: Instant redirect
  window.location.href = "https://www.desmos.com/calculator";

  // Option 2 (stealth): Replace entire page instead
  // document.body.innerHTML = "";
  // window.location.replace("https://www.khanacademy.org");
}
