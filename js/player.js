// --- FIREBASE CONFIG (same as host.js) ---
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

let playerId = 'p' + Math.floor(Math.random() * 10000);
let playerName = '';

// Join game
document.getElementById('joinBtn').addEventListener('click', () => {
  playerName = document.getElementById('name').value || playerId;
  playersRef.child(playerId).set({ name: playerName, score: 0 });
  document.getElementById('joinInfo').innerText = `Joined as ${playerName}`;
  document.getElementById('joinBtn').style.display = 'none';
  document.getElementById('questionArea').style.display = 'block';
});

// Listen for current question
gameRef.child('state').on('value', snap => {
  const state = snap.val();
  if (!state) return;
  const q = state.question;
  document.getElementById('qText').innerText = q.text;
  const choicesDiv = document.getElementById('choices');
  choicesDiv.innerHTML = '';
  for (const key in q.answers) {
    const btn = document.createElement('button');
    btn.innerText = `${key}: ${q.answers[key]}`;
    btn.onclick = () => {
      answersRef.push({ playerId, choice: key, ts: Date.now() });
      Array.from(choicesDiv.children).forEach(b => b.disabled = true);
    };
    choicesDiv.appendChild(btn);
  }
});
