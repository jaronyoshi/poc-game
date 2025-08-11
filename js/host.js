// --- FIREBASE CONFIG (paste yours here) ---
const firebaseConfig = {
  apiKey: "AIzaSyAEXEYn_voj_WqaPfuTPio2qm9Qr62UpXg",
  authDomain: "our-poc-a999b.firebaseapp.com",
  databaseURL: "https://our-poc-a999b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "our-poc-a999b",
  storageBucket: "our-poc-a999b.firebasestorage.app",
  messagingSenderId: "116449409203",
  appId: "1:116449409203:web:60d62bed37577906b258c6"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const gameId = 'demo';
const gameRef = db.ref(`games/${gameId}`);
const answersRef = gameRef.child('answers');
const playersRef = gameRef.child('players');

// --- RIVE SETUP ---
const canvas = document.getElementById('riveCanvas');
const riveAnim = new rive.Rive({
  src: '/assets/quiz-poc.riv',
  canvas,
  autoplay: true,
  stateMachines: 'QuizMachine',
  onLoad: () => console.log("Rive loaded")
});

// --- QUESTIONS ---
const questions = [
  {
    text: "Which Auckland landmark is most at risk of coastal flooding?",
    answers: { A: "Britomart", B: "Mt Eden", C: "Sky Tower", D: "One Tree Hill" },
    correct: "A"
  }
];

// Set current question
let currentQuestionIndex = 0;
function sendQuestion() {
  gameRef.child('state').set({
    questionIndex: currentQuestionIndex,
    question: questions[currentQuestionIndex]
  });
  answersRef.remove(); // clear old answers
}
sendQuestion();

// --- Listen for answers ---
answersRef.on('child_added', snap => {
  const { playerId, choice } = snap.val();
  if (choice === questions[currentQuestionIndex].correct) {
    playersRef.child(playerId).transaction(p => {
      if (!p) return { name: 'Unknown', score: 1 };
      return { ...p, score: (p.score || 0) + 1 };
    });
    console.log("Correct from", playerId);
  } else {
    console.log("Wrong from", playerId);
  }
  updateScoreboard();
});

// --- Scoreboard ---
function updateScoreboard() {
  playersRef.once('value').then(snap => {
    const scores = snap.val() || {};
    const board = Object.values(scores).map(p => `${p.name}: ${p.score || 0}`).join('<br>');
    document.getElementById('scoreboard').innerHTML = `<h3>Scores</h3>${board}`;
  });
}
