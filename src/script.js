const TOTAL_TIME = 45 * 60;

let timeLeft = TOTAL_TIME;
let timerStarted = false;
let timerInterval = null;

let currentStep = -1;
let selectedOption = null;
let discoveredCodes = ["?", "?", "?", "?"];

const app = document.getElementById("app");
const timerEl = document.getElementById("timer");
const codeSlotsEl = document.getElementById("codeSlots");

const steps = [
  {
    room: "Start",
    type: "intro",
    title: "De geheime code van Breendonk",
    text: `
      Jullie zijn een onderzoeksteam. In het lokaal en op deze website
      zitten aanwijzingen verstopt. Door opdrachten op te lossen verzamelen
      jullie 4 cijfers. Met die code openen jullie het eindslot.
    `,
    extra: `
      Werk samen, zoek in het lokaal, voer de opdrachten echt uit en denk goed na.
      Dit is een escape room voor de eerste graad: speels, maar wel met respect voor het onderwerp.
    `
  },

  {
    room: "Kamer 1 — De ingang",
    type: "text",
    title: "Opdracht 1 — Decodeer de naam",
    instruction: "Gebruik A=1, B=2, C=3 ... Z=26.",
    content: "2 – 18 – 5 – 5 – 14 – 4 – 15 – 14 – 11",
    placeholder: "Typ hier het antwoord",
    correctAnswer: "BREENDONK",
    hint: "Denk aan de naam van het fort dat jullie bezoeken.",
    explanationCorrect: "Juist. Jullie hebben de naam van het fort gevonden: Breendonk."
  },

  {
    room: "Kamer 1 — De ingang",
    type: "choice",
    title: "Opdracht 2 — Wat hoort bij bewaking?",
    instruction: "Kies het juiste antwoord.",
    options: [
      "Een wachttoren",
      "Een voetbalgoal",
      "Een gitaar"
    ],
    correctIndex: 0,
    hint: "Kies iets dat hoort bij controleren en bewaken.",
    explanationCorrect: "Juist. Een wachttoren hoort bij controle en bewaking."
  },

  {
    room: "Kamer 1 — De ingang",
    type: "physical",
    title: "Opdracht 3 — Zoekopdracht in de klas",
    instruction: `
      Zoek in het lokaal het kaartje of voorwerp dat hoort bij bewaking.
      Op dat kaartje staat een controlewoord.
    `,
    task: `
      Leg in het lokaal bijvoorbeeld kaartjes zoals:
      voetbal - pizza - wachttoren - gitaar.
      Op de achterkant van 'wachttoren' schrijf je: TOREN.
    `,
    placeholder: "Typ hier het controlewoord",
    acceptedAnswers: ["TOREN"],
    hint: "Zoek het kaartje dat past bij bewaking van een fort of kamp.",
    explanationCorrect: "Goed gedaan. Jullie hebben het juiste kaartje gevonden."
  },

  {
    room: "Kamer 1 — De ingang",
    type: "codeReveal",
    title: "Code gevonden",
    codeIndex: 0,
    codeValue: "4",
    message: "Jullie hebben de eerste code verdiend."
  },

  {
    room: "Kamer 2 — Het leven in het fort",
    type: "choice",
    title: "Opdracht 4 — Hoe was het leven daar?",
    instruction: "Lees de bron en kies het beste antwoord.",
    source: "“Gevangenen moesten zwaar werk doen en kregen weinig eten.”",
    options: [
      "Het leven was zwaar",
      "Het leven was gezellig",
      "Het leven was luxueus"
    ],
    correctIndex: 0,
    hint: "Let op de woorden 'zwaar werk' en 'weinig eten'.",
    explanationCorrect: "Juist. De bron toont dat het leven in het fort erg zwaar was."
  },

  {
    room: "Kamer 2 — Het leven in het fort",
    type: "text",
    title: "Opdracht 5 — Welk woord past niet?",
    instruction: "Typ het woord dat niet past bij het leven in een kamp.",
    content: "honger – geweld – vrijheid – opsluiting",
    placeholder: "Typ hier het woord",
    acceptedAnswers: ["VRIJHEID"],
    hint: "Drie woorden passen bij onvrijheid. Eén woord juist niet.",
    explanationCorrect: "Juist. Vrijheid past niet bij een kamp of gevangenis."
  },

  {
    room: "Kamer 2 — Het leven in het fort",
    type: "physical",
    title: "Opdracht 6 — Doe-opdracht met kaartjes",
    instruction: `
      Ga naar de envelop in de klas.
      Daar zitten losse woorden in.
      Leg samen de woorden in een logische volgorde.
    `,
    task: `
      Voorzie in een envelop woorden zoals:
      oorlog - onvrijheid - mensenrechten - herinneren
      Op de achterkant van het laatste juiste kaartje schrijf je: RECHT.
    `,
    placeholder: "Typ hier het woord dat op de achterkant stond",
    acceptedAnswers: ["RECHT"],
    hint: "Leg de woorden zodat er een logisch verhaal ontstaat van verleden naar les voor vandaag.",
    explanationCorrect: "Goed. Jullie hebben de woorden samen juist gelegd."
  },

  {
    room: "Kamer 2 — Het leven in het fort",
    type: "choice",
    title: "Opdracht 7 — Wat wordt geschonden?",
    instruction: "Kies het beste kernbegrip.",
    options: [
      "Mensenrechten",
      "Speeltijd",
      "Vakantie"
    ],
    correctIndex: 0,
    hint: "Denk aan rechten die elke mens zou moeten hebben.",
    explanationCorrect: "Juist. In zo'n context worden mensenrechten geschonden."
  },

  {
    room: "Kamer 2 — Het leven in het fort",
    type: "codeReveal",
    title: "Code gevonden",
    codeIndex: 1,
    codeValue: "7",
    message: "Jullie hebben de tweede code verdiend."
  },

  {
    room: "Kamer 3 — Bewaking en controle",
    type: "choice",
    title: "Opdracht 8 — Welke plaats past het best?",
    instruction: "Waar past strenge controle het best bij?",
    options: [
      "Een gevangenis of kamp",
      "Een speelplein",
      "Een pretpark"
    ],
    correctIndex: 0,
    hint: "Kies de plaats waar mensen niet vrij zijn.",
    explanationCorrect: "Juist. Strenge controle en bewaking passen bij een kamp of gevangenis."
  },

  {
    room: "Kamer 3 — Bewaking en controle",
    type: "physical",
    title: "Opdracht 9 — Zoek een verborgen kaartje",
    instruction: `
      Zoek in het lokaal een verborgen kaartje met daarop een sleutel.
      Op de achterkant staat een woord.
    `,
    task: `
      Verstop ergens in het lokaal een kaartje met een sleutel-tekening.
      Achteraan schrijf je: SLOT.
    `,
    placeholder: "Typ hier het woord op de achterkant",
    acceptedAnswers: ["SLOT"],
    hint: "Zoek naar iets dat past bij openen of sluiten.",
    explanationCorrect: "Goed. Jullie hebben het verborgen kaartje gevonden."
  },

  {
    room: "Kamer 3 — Bewaking en controle",
    type: "choice",
    title: "Opdracht 10 — Welke vaardigheid gebruik je?",
    instruction: "Je vergelijkt twee bronnen met elkaar. Welke vaardigheid gebruik je dan?",
    options: [
      "Onderzoeken",
      "Gokken",
      "Niets doen"
    ],
    correctIndex: 0,
    hint: "Je bent dan actief bezig met bronnen bekijken en vergelijken.",
    explanationCorrect: "Juist. Dan ben je bronnen aan het onderzoeken."
  },

  {
    room: "Kamer 3 — Bewaking en controle",
    type: "physical",
    title: "Opdracht 11 — Mini doe-opdracht",
    instruction: `
      Ga met je groep rechtstaan.
      Kijk 10 seconden rond in het lokaal.
      Zoek iets dat hoog staat en een beetje aan een toren doet denken.
      Bespreek samen wat jullie kozen.
    `,
    task: `
      Laat leerlingen echt bewegen en overleggen.
      Nadien moeten ze het controlewoord invullen: HOOG.
    `,
    placeholder: "Typ hier het controlewoord",
    acceptedAnswers: ["HOOG"],
    hint: "Voer de opdracht echt uit en denk aan iets dat boven jullie uitkomt.",
    explanationCorrect: "Prima. Jullie hebben de doe-opdracht uitgevoerd."
  },

  {
    room: "Kamer 3 — Bewaking en controle",
    type: "codeReveal",
    title: "Code gevonden",
    codeIndex: 2,
    codeValue: "2",
    message: "Jullie hebben de derde code verdiend."
  },

  {
    room: "Kamer 4 — Herinneren",
    type: "choice",
    title: "Opdracht 12 — Waarom moeten we dit blijven onthouden?",
    instruction: "Kies het beste antwoord.",
    options: [
      "Zodat we leren uit het verleden",
      "Omdat het een grappig verhaal is",
      "Omdat het niets met vandaag te maken heeft"
    ],
    correctIndex: 0,
    hint: "Denk aan wat geschiedenis ons vandaag nog kan leren.",
    explanationCorrect: "Juist. We leren uit het verleden en denken na over vandaag."
  },

  {
    room: "Kamer 4 — Herinneren",
    type: "text",
    title: "Opdracht 13 — Sleutelwoord",
    instruction: "Typ één woord dat past bij: we mogen deze geschiedenis niet laten verdwijnen.",
    placeholder: "Typ hier het woord",
    acceptedAnswers: ["HERINNEREN", "HERDENKEN", "HERINNERING"],
    hint: "Denk aan een woord dat betekent dat je iets blijft bewaren in je hoofd of in de samenleving.",
    explanationCorrect: "Juist. Herinneren en herdenken zijn hier belangrijke woorden."
  },

  {
    room: "Kamer 4 — Herinneren",
    type: "physical",
    title: "Opdracht 14 — Zoek de laatste hint",
    instruction: `
      Zoek in het lokaal een laatste kaartje met een uitroepteken.
      Op de achterkant staat een woord dat je nodig hebt.
    `,
    task: `
      Verstop een kaartje met ! in het lokaal.
      Op de achterkant schrijf je: NOOIT.
    `,
    placeholder: "Typ hier het woord",
    acceptedAnswers: ["NOOIT"],
    hint: "Zoek een klein kaartje dat opvalt en dringend lijkt.",
    explanationCorrect: "Goed. Jullie hebben de laatste klas-hint gevonden."
  },

  {
    room: "Kamer 4 — Herinneren",
    type: "text",
    title: "Opdracht 15 — De boodschap",
    instruction: "Vul de bekende eindboodschap in.",
    content: "NOOIT ________",
    placeholder: "Typ het ontbrekende woord",
    acceptedAnswers: ["VERGETEN"],
    hint: "Denk aan de volledige boodschap die vaak gebruikt wordt bij herdenken.",
    explanationCorrect: "Juist. De boodschap is: Nooit vergeten."
  },

  {
    room: "Kamer 4 — Herinneren",
    type: "codeReveal",
    title: "Code gevonden",
    codeIndex: 3,
    codeValue: "9",
    message: "Jullie hebben de vierde code verdiend."
  },

  {
    room: "Eindslot",
    type: "finalLock",
    title: "Open het eindslot",
    instruction: "Vul de 4 gevonden cijfers in.",
    correctCode: "4729"
  }
];

function updateCodeSlots() {
  codeSlotsEl.innerHTML = discoveredCodes
    .map((digit) => `<div class="slot">${digit}</div>`)
    .join("");
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateTimer() {
  timerEl.textContent = formatTime(timeLeft);
  timerEl.style.color = timeLeft <= 300 ? "#ffb3b3" : "white";
}

function startTimer() {
  if (timerStarted) return;

  timerStarted = true;
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      renderTimeUp();
    }
  }, 1000);
}

function renderStartScreen() {
  app.innerHTML = `
    <section class="card">
      <h1>De geheime code van Breendonk</h1>

      <p>
        Jullie zijn een onderzoeksteam. In het lokaal en op deze website
        zitten aanwijzingen verstopt. Door opdrachten op te lossen verzamelen
        jullie 4 cijfers. Met die code openen jullie het eindslot.
      </p>

      <div class="intro-box">
        <strong>Belangrijk:</strong>
        <p>
          Werk samen, zoek goed in de klas en voer de doe-opdrachten echt uit.
          Dit onderwerp gaat over geschiedenis, onvrijheid en herinneren.
        </p>
      </div>

      <h3>Hoe werkt het?</h3>
      <ul class="list">
        <li>Jullie hebben 45 minuten tijd.</li>
        <li>Na sommige opdrachten moeten jullie echt iets in het lokaal zoeken.</li>
        <li>Bij een fout antwoord krijgen jullie een tip.</li>
        <li>Pas bij een juist antwoord krijgen jullie de uitleg en mogen jullie verder.</li>
        <li>Op het einde openen jullie het slot met 4 cijfers.</li>
      </ul>

      <div class="actions">
        <button id="startBtn">Start de escape room</button>
      </div>
    </section>
  `;

  document.getElementById("startBtn").addEventListener("click", () => {
    currentStep = 0;
    startTimer();
    renderStep();
  });
}

function renderStep() {
  const step = steps[currentStep];
  const progressPercent = (currentStep / steps.length) * 100;

  if (step.type === "intro") {
    app.innerHTML = `
      <section class="card">
        <div class="room-label">${step.room}</div>
        <h2>${step.title}</h2>
        <p>${step.text}</p>
        <div class="intro-box">
          <p>${step.extra}</p>
        </div>

        <div class="progress">
          <div class="progress-bar" style="width:${progressPercent}%"></div>
        </div>
        <div class="meta">Stap ${currentStep + 1} van ${steps.length}</div>

        <div class="actions">
          <button id="nextBtn">Verder</button>
        </div>
      </section>
    `;

    document.getElementById("nextBtn").addEventListener("click", nextStep);
    return;
  }

  if (step.type === "codeReveal") {
    discoveredCodes[step.codeIndex] = step.codeValue;
    updateCodeSlots();

    app.innerHTML = `
      <section class="card center">
        <div class="room-label">${step.room}</div>
        <h2>${step.title}</h2>
        <p>${step.message}</p>

        <div class="code-box" style="max-width:200px;margin-inline:auto;">
          Code: ${step.codeValue}
        </div>

        <div class="actions" style="justify-content:center;">
          <button id="nextBtn">Naar de volgende stap</button>
        </div>
      </section>
    `;

    document.getElementById("nextBtn").addEventListener("click", nextStep);
    return;
  }

  if (step.type === "finalLock") {
    app.innerHTML = `
      <section class="card center">
        <div class="room-label">${step.room}</div>
        <h2>${step.title}</h2>
        <p>${step.instruction}</p>

        <div class="clue-box">
          Gevonden cijfers: ${discoveredCodes.join(" - ")}
        </div>

        <input
          id="finalCodeInput"
          class="final-code-input"
          type="text"
          maxlength="4"
          placeholder="----"
        />

        <div class="actions" style="justify-content:center;">
          <button id="checkLockBtn">Open slot</button>
        </div>

        <p id="lockFeedback" class="meta"></p>
      </section>
    `;

    document.getElementById("checkLockBtn").addEventListener("click", () => {
      const entered = document.getElementById("finalCodeInput").value.trim();
      const feedback = document.getElementById("lockFeedback");

      if (entered === step.correctCode) {
        renderEndScreen();
      } else {
        feedback.textContent = "De code is niet juist. Controleer jullie cijfers opnieuw.";
      }
    });

    return;
  }

  let contentHtml = "";

  if (step.type === "choice") {
    contentHtml = `
      ${step.source ? `<div class="source-box"><em>${step.source}</em></div>` : ""}
      <div class="option-list">
        ${step.options
          .map(
            (option, index) => `
              <button class="option-btn" data-index="${index}">
                ${option}
              </button>
            `
          )
          .join("")}
      </div>
    `;
  }

  if (step.type === "text") {
    contentHtml = `
      ${step.source ? `<div class="source-box"><em>${step.source}</em></div>` : ""}
      ${step.content ? `<div class="code-box">${step.content}</div>` : ""}
      <input id="answerInput" type="text" placeholder="${step.placeholder || ""}" />
    `;
  }

  if (step.type === "physical") {
    contentHtml = `
      <div class="task-box">
        <strong>Doe-opdracht:</strong>
        <p>${step.instruction}</p>
      </div>

      <div class="clue-box">
        <strong>Voor de leerkracht / opsteller:</strong>
        <p>${step.task}</p>
      </div>

      <input id="answerInput" type="text" placeholder="${step.placeholder || ""}" />
    `;
  }

  app.innerHTML = `
    <section class="card">
      <div class="room-label">${step.room}</div>
      <h2>${step.title}</h2>
      ${step.type !== "physical" ? `<p>${step.instruction}</p>` : ""}
      ${contentHtml}

      <div class="progress">
        <div class="progress-bar" style="width:${progressPercent}%"></div>
      </div>
      <div class="meta">Stap ${currentStep + 1} van ${steps.length}</div>

      <div class="actions">
        <button id="submitBtn">Controleer</button>
      </div>
    </section>
  `;

  selectedOption = null;

  if (step.type === "choice") {
    const optionButtons = document.querySelectorAll(".option-btn");
    optionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        optionButtons.forEach((b) => b.classList.remove("selected"));
        button.classList.add("selected");
        selectedOption = Number(button.dataset.index);
      });
    });
  }

  document.getElementById("submitBtn").addEventListener("click", checkCurrentStep);
}

function checkCurrentStep() {
  const step = steps[currentStep];
  let isCorrect = false;
  let learnerAnswer = "";

  if (step.type === "choice") {
    learnerAnswer = selectedOption;
    isCorrect = selectedOption === step.correctIndex;
  }

  if (step.type === "text" || step.type === "physical") {
    const input = document.getElementById("answerInput");
    learnerAnswer = input.value.trim();
    const upper = learnerAnswer.toUpperCase();

    if (step.correctAnswer) {
      isCorrect = upper === step.correctAnswer;
    } else if (step.acceptedAnswers) {
      isCorrect = step.acceptedAnswers.includes(upper);
    }
  }

  if (isCorrect) {
    renderCorrectFeedback(step, learnerAnswer);
  } else {
    renderWrongFeedback(step, learnerAnswer);
  }
}

function renderWrongFeedback(step, learnerAnswer) {
  let shownAnswer = "";

  if (step.type === "choice") {
    shownAnswer =
      learnerAnswer !== null &&
      learnerAnswer !== undefined &&
      step.options[learnerAnswer]
        ? step.options[learnerAnswer]
        : "(geen keuze gemaakt)";
  } else {
    shownAnswer = learnerAnswer || "(geen antwoord)";
  }

  app.innerHTML = `
    <section class="card">
      <div class="room-label">${step.room}</div>
      <h2>${step.title}</h2>

      <p class="feedback-bad">Niet juist beantwoord.</p>

      <div class="hint-box">
        <strong>Tip:</strong>
        <p>${step.hint || "Denk nog eens goed na en probeer opnieuw."}</p>
      </div>

      <h3>Jullie antwoord</h3>
      <div class="source-box">${escapeHtml(shownAnswer)}</div>

      <div class="actions">
        <button id="retryBtn">Probeer opnieuw</button>
      </div>
    </section>
  `;

  document.getElementById("retryBtn").addEventListener("click", renderStep);
}

function renderCorrectFeedback(step, learnerAnswer) {
  let shownAnswer = "";

  if (step.type === "choice") {
    shownAnswer =
      learnerAnswer !== null &&
      learnerAnswer !== undefined &&
      step.options[learnerAnswer]
        ? step.options[learnerAnswer]
        : "(geen keuze gemaakt)";
  } else {
    shownAnswer = learnerAnswer || "(geen antwoord)";
  }

  app.innerHTML = `
    <section class="card">
      <div class="room-label">${step.room}</div>
      <h2>${step.title}</h2>

      <p class="feedback-good">Juist beantwoord.</p>

      <div class="success-box">
        <strong>Uitleg:</strong>
        <p>${step.explanationCorrect}</p>
      </div>

      <h3>Jullie antwoord</h3>
      <div class="source-box">${escapeHtml(shownAnswer)}</div>

      <div class="actions">
        <button id="nextBtn">Ga verder</button>
      </div>
    </section>
  `;

  document.getElementById("nextBtn").addEventListener("click", nextStep);
}

function nextStep() {
  currentStep++;
  renderStep();
}

function renderEndScreen() {
  clearInterval(timerInterval);

  app.innerHTML = `
    <section class="card center">
      <h1>Missie geslaagd</h1>
      <p>
        Jullie hebben het eindslot geopend en de geheime code van Breendonk gevonden.
      </p>

      <div class="code-box" style="max-width:220px;margin-inline:auto;">
        4 - 7 - 2 - 9
      </div>

      <div class="intro-box">
        <p>
          Bespreek nu samen:
          waarom is het belangrijk dat we zulke plaatsen en verhalen blijven herinneren?
        </p>
      </div>

      <p class="meta">Resterende tijd: ${formatTime(timeLeft)}</p>

      <div class="actions" style="justify-content:center;">
        <button id="restartBtn">Opnieuw starten</button>
      </div>
    </section>
  `;

  document.getElementById("restartBtn").addEventListener("click", restartGame);
}

function renderTimeUp() {
  app.innerHTML = `
    <section class="card center">
      <h1>De tijd is om</h1>
      <p>Jullie missie is gestopt.</p>

      <div class="intro-box">
        <p>
          Overloop samen welke codes jullie al vonden en welke opdrachten nog moeilijk waren.
        </p>
      </div>

      <div class="actions" style="justify-content:center;">
        <button id="restartBtn">Opnieuw starten</button>
      </div>
    </section>
  `;

  document.getElementById("restartBtn").addEventListener("click", restartGame);
}

function restartGame() {
  clearInterval(timerInterval);
  timeLeft = TOTAL_TIME;
  timerStarted = false;
  timerInterval = null;
  currentStep = -1;
  selectedOption = null;
  discoveredCodes = ["?", "?", "?", "?"];
  updateTimer();
  updateCodeSlots();
  renderStartScreen();
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

updateTimer();
updateCodeSlots();
renderStartScreen();