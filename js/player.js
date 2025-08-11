const firebaseConfig = {
  apiKey: "...", projectId: "...", databaseURL: "https://<your-db>.firebaseio.com"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const gameId = 'demo';
const answersRef = db.ref(`games/${gameId}/answers`);
const playersRef = db.ref(`games/${gameId}/players`);

let playerId = 'p' + Math.floor(Math.random()*10000);
let playerName = '';

document.getElementById('joinBtn').addEventListener('click', () => {
  playerName = document.getElementById('name').value || playerId;
  playersRef.child(playerId).set({name: playerName});
  document.getElementById('joinInfo').innerText = `Joined as ${playerName}`;
  document.getElementById('joinBtn').style.display = 'none';
  document.getElementById('questionArea').style.display = 'block';
});

// simple one-question UI
document.querySelectorAll('.choice').forEach(btn => {
  btn.addEventListener('click', () => {
    const choice = btn.dataset.choice;
    // write answer once (disable buttons after)
    answersRef.push({ playerId, choice, ts: Date.now() });
    document.querySelectorAll('.choice').forEach(b => b.disabled = true);
  });
});
