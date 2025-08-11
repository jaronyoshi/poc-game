// Paste your Firebase config here
const firebaseConfig = {
  apiKey: "...", projectId: "...", databaseURL: "https://<your-db>.firebaseio.com"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const gameId = 'demo';
const gameRef = db.ref(`games/${gameId}`);
const answersRef = db.ref(`games/${gameId}/answers`);

// --- init Rive ---
const canvas = document.getElementById('riveCanvas');
const rive = new rive.Rive({
  src: '/assets/quiz-poc.riv',
  canvas,
  autoplay: true,
  stateMachines: 'QuizMachine',
  onLoad: () => {
    inputs = rive.stateMachineInputs('QuizMachine'); // API varies by runtime version
    questionIndexInput = inputs.find(i => i.name === 'questionIndex');
    triggerCorrect = inputs.find(i => i.name === 'triggerCorrect');
    triggerWrong = inputs.find(i => i.name === 'triggerWrong');
  }
});

// --- minimal question text ---
const questionText = document.getElementById('questionText');
const question = {
  index: 1,
  text: "Which Auckland landmark is most vulnerable to coastal flooding?",
  answers: { A: "Britomart", B: "Mt Eden", C: "Sky Tower", D: "Auckland Museum" },
  correct: "A"
};
questionText.innerText = question.text;

// write initial state
gameRef.child('state').set({questionIndex: question.index});

// Listen for answers (first answer wins for POC)
answersRef.on('child_added', snap => {
  const payload = snap.val(); // { playerId, choice }
  const choice = payload.choice;
  if (choice === question.correct) {
    triggerCorrect.fire(); // trigger the Rive correct animation
    gameRef.child('players').child(payload.playerId).update({score: 1});
  } else {
    triggerWrong.fire();
    gameRef.child('players').child(payload.playerId).update({score: 0});
  }
});
