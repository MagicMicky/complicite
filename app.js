(() => {
  "use strict";

  // --- Settings ---
  const settings = {
    scoreToWin: 5,
    timerDuration: 60,
  };

  // --- Game state ---
  let state = {
    teams: [
      { name: "Équipe 1", players: ["Joueur 1", "Joueur 2"], score: 0 },
      { name: "Équipe 2", players: ["Joueur 1", "Joueur 2"], score: 0 },
    ],
    round: 1,
    currentTeamIndex: 0,    // which team is giving clues
    currentPlayerIndex: [0, 0], // which player in each team gives clues next
    currentWord: "",
    usedWords: new Set(),
    timerId: null,
    timeLeft: 0,
  };

  // --- DOM refs ---
  const $ = (sel) => document.querySelector(sel);
  const screens = {};

  function init() {
    // Cache screens
    document.querySelectorAll(".screen").forEach((el) => {
      screens[el.id.replace("screen-", "")] = el;
    });

    // Settings buttons
    document.querySelectorAll("[data-adjust]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.adjust;
        const delta = parseInt(btn.dataset.delta);
        if (key === "score") {
          settings.scoreToWin = Math.max(1, Math.min(20, settings.scoreToWin + delta));
          $("#setting-score").textContent = settings.scoreToWin;
        } else if (key === "timer") {
          settings.timerDuration = Math.max(20, Math.min(180, settings.timerDuration + delta));
          $("#setting-timer").textContent = settings.timerDuration;
        }
      });
    });

    // Navigation
    $("#btn-new-game").addEventListener("click", () => showScreen("config"));
    $("#btn-settings").addEventListener("click", () => showScreen("settings"));
    $("#btn-settings-back").addEventListener("click", () => showScreen("accueil"));
    $("#btn-config-back").addEventListener("click", () => showScreen("accueil"));
    $("#btn-start-game").addEventListener("click", startGame);
    $("#btn-show-word").addEventListener("click", () => {
      showWord();
      showScreen("mot");
    });
    $("#btn-skip-word").addEventListener("click", () => showWord());
    $("#btn-start-round").addEventListener("click", startTimer);
    $("#btn-team0-found").addEventListener("click", () => resolveRound(0));
    $("#btn-team1-found").addEventListener("click", () => resolveRound(1));
    $("#btn-nobody").addEventListener("click", () => resolveRound(-1));
    $("#btn-next-round").addEventListener("click", nextRound);
    $("#btn-replay").addEventListener("click", replay);
    $("#btn-home").addEventListener("click", () => {
      resetState();
      showScreen("accueil");
    });

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js?v=__CACHE_HASH__", { updateViaCache: "none" }).catch(() => {});
    }
  }

  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove("active"));
    const screen = screens[name];
    screen.classList.add("active");
    // Re-trigger animation
    screen.style.animation = "none";
    screen.offsetHeight; // reflow
    screen.style.animation = "";
  }

  function pickWord() {
    // If we've used all words, reset
    if (state.usedWords.size >= WORDS.length) {
      state.usedWords.clear();
    }
    let word;
    do {
      word = WORDS[Math.floor(Math.random() * WORDS.length)];
    } while (state.usedWords.has(word));
    state.usedWords.add(word);
    state.currentWord = word;
    return word;
  }

  function showWord() {
    const word = pickWord();
    $("#word-display").textContent = word;
  }

  function startGame() {
    // Read team/player names
    for (let t = 0; t < 2; t++) {
      const nameInput = $(`#team${t}-name`);
      state.teams[t].name = nameInput.value.trim() || nameInput.placeholder;
      for (let p = 0; p < 2; p++) {
        const playerInput = $(`#team${t}-player${p}`);
        state.teams[t].players[p] = playerInput.value.trim() || playerInput.placeholder;
      }
      state.teams[t].score = 0;
    }
    state.round = 1;
    state.currentTeamIndex = 0;
    state.currentPlayerIndex = [0, 0];
    state.usedWords.clear();

    showTurnScreen();
  }

  function showTurnScreen() {
    const team = state.teams[state.currentTeamIndex];
    const playerName = team.players[state.currentPlayerIndex[state.currentTeamIndex]];

    $("#round-number").textContent = state.round;
    $("#current-player-name").textContent = playerName;
    $("#current-player-name").style.color =
      state.currentTeamIndex === 0 ? "var(--team0)" : "var(--team1)";

    // Mini scores
    for (let t = 0; t < 2; t++) {
      $(`#mini-score-${t}`).textContent = `${state.teams[t].name} ${state.teams[t].score}`;
      $(`#mini-score-${t}`).style.color = t === 0 ? "var(--team0)" : "var(--team1)";
    }

    showScreen("tour");
  }

  function startTimer() {
    state.timeLeft = settings.timerDuration;

    // Set button labels
    for (let t = 0; t < 2; t++) {
      $(`#btn-team${t}-label`).textContent = state.teams[t].name;
    }
    $("#word-reminder").textContent = state.currentWord;

    updateTimerDisplay();
    showScreen("manche");

    const circumference = 2 * Math.PI * 54; // r=54

    state.timerId = setInterval(() => {
      state.timeLeft--;
      updateTimerDisplay();

      // Update ring
      const progress = 1 - state.timeLeft / settings.timerDuration;
      $("#timer-ring").style.strokeDashoffset = circumference * progress;

      // Color changes
      const ring = $("#timer-ring");
      const text = $("#timer-text");
      ring.classList.remove("warning", "danger");
      text.classList.remove("warning", "danger");
      if (state.timeLeft <= 10) {
        ring.classList.add("danger");
        text.classList.add("danger");
      } else if (state.timeLeft <= 20) {
        ring.classList.add("warning");
        text.classList.add("warning");
      }

      if (state.timeLeft <= 0) {
        clearInterval(state.timerId);
        state.timerId = null;
        resolveRound(-1);
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    $("#timer-text").textContent = state.timeLeft;
  }

  function resolveRound(winningTeamIndex) {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }

    // Reset timer ring
    $("#timer-ring").style.strokeDashoffset = 0;
    $("#timer-ring").classList.remove("warning", "danger");
    $("#timer-text").classList.remove("warning", "danger");

    let resultText;
    if (winningTeamIndex >= 0) {
      state.teams[winningTeamIndex].score++;
      resultText = `${state.teams[winningTeamIndex].name} marque un point !`;
      $("#round-result").style.color =
        winningTeamIndex === 0 ? "var(--team0)" : "var(--team1)";
    } else {
      resultText = "Personne n'a trouvé...";
      $("#round-result").style.color = "var(--text-muted)";
    }
    $("#round-result").textContent = resultText;

    // Update scoreboard
    for (let t = 0; t < 2; t++) {
      $(`#score-name-${t}`).textContent = state.teams[t].name;
      $(`#score-value-${t}`).textContent = state.teams[t].score;
    }

    // Check for winner
    const winner = state.teams.find((t) => t.score >= settings.scoreToWin);
    if (winner) {
      $("#btn-next-round").textContent = "Voir le résultat";
      $("#btn-next-round").onclick = () => showVictory(winner);
    } else {
      $("#btn-next-round").textContent = "Manche suivante";
      $("#btn-next-round").onclick = nextRound;
    }

    showScreen("scores");
  }

  function nextRound() {
    // Advance turn: alternate team, and within team alternate player
    state.currentPlayerIndex[state.currentTeamIndex] =
      1 - state.currentPlayerIndex[state.currentTeamIndex];
    state.currentTeamIndex = 1 - state.currentTeamIndex;
    state.round++;

    showTurnScreen();
  }

  function showVictory(winner) {
    const winnerIndex = state.teams.indexOf(winner);
    $("#victory-team").textContent = winner.name;
    $("#victory-team").style.color =
      winnerIndex === 0 ? "var(--team0)" : "var(--team1)";

    for (let t = 0; t < 2; t++) {
      $(`#final-score-${t}`).textContent = `${state.teams[t].name} ${state.teams[t].score}`;
      $(`#final-score-${t}`).style.color = t === 0 ? "var(--team0)" : "var(--team1)";
    }

    showScreen("victoire");
  }

  function replay() {
    // Keep team names, reset scores
    state.teams.forEach((t) => (t.score = 0));
    state.round = 1;
    state.currentTeamIndex = 0;
    state.currentPlayerIndex = [0, 0];
    state.usedWords.clear();
    showTurnScreen();
  }

  function resetState() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
    state.teams[0].score = 0;
    state.teams[1].score = 0;
    state.round = 1;
    state.currentTeamIndex = 0;
    state.currentPlayerIndex = [0, 0];
    state.usedWords.clear();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
