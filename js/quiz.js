console.log("quiz take 2 loaded");

// Variables
const quizQuestions = [
    { question: "What is 2 + 2?", options: ["3", "4", "5"], correctIndex: 1 },
    { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris"], correctIndex: 2 },
    { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter"], correctIndex: 1 },
    { question: "What is the largest ocean on Earth?", options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean"], correctIndex: 2 },
    { question: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain"], correctIndex: 1 },
    { question: "What is the capital of Japan?", options: ["Seoul", "Tokyo", "Beijing"], correctIndex: 1 },
    { question: "Which element has the atomic number 1?", options: ["Helium", "Hydrogen", "Oxygen"], correctIndex: 1 },
    { question: "What is the smallest prime number?", options: ["0", "1", "2"], correctIndex: 2 },
    { question: "Who painted the Mona Lisa?", options: ["Michelangelo", "Leonardo da Vinci", "Raphael"], correctIndex: 1 },
    { question: "What is the currency of the UK?", options: ["Euro", "Pound Sterling", "Dollar"], correctIndex: 1 }
];
const TOTAL_QUESTIONS_PER_QUIZ = 5;
let answerKey = {};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    generateQuestionContainers(TOTAL_QUESTIONS_PER_QUIZ);
    loadQuestions();
    setupFormValidation();
    setupSubmit();
    setupReset();
    setupHowToPlay();
});

// Utility Functions
function shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function generateQuestionContainers(count) {
    const form = document.querySelector('form');
    for (let i = 1; i <= count; i++) {
        form.appendChild(createQuestionElement(i));
    }
}

function createQuestionElement(num) {
    const div = document.createElement('div');
    div.className = 'question';
    div.appendChild(document.createElement('div'));
    
    for (let i = 0; i < 3; i++) {
        const label = document.createElement('label');
        label.className = 'option';
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `q${num}`;
        input.value = '';
        label.appendChild(input);
        label.appendChild(document.createElement('span'));
        div.appendChild(label);
    }
    return div;
}

function loadQuestions() {
    const form = document.querySelector('form');
    const containers = form.querySelectorAll('.question');
    const selected = shuffleArray([...quizQuestions]).slice(0, TOTAL_QUESTIONS_PER_QUIZ);
    
    answerKey = {};
    selected.forEach((q, i) => populateQuestionContainer(containers[i], q, i));
    shuffleQuestions();
}

function populateQuestionContainer(container, question, index) {
    const qId = `q${index + 1}`;
    answerKey[qId] = question.correctIndex;
    
    container.querySelector('div').textContent = question.question;
    const inputs = container.querySelectorAll('input[type="radio"]');
    const spans = container.querySelectorAll('span');
    
    inputs.forEach((input, i) => {
        input.value = question.options[i];
        input.id = `${qId}-option-${i}`;
        input.name = qId;
        input.dataset.optionIndex = i;
        spans[i].textContent = question.options[i];
    });
}

function shuffleQuestions() {
    const questions = Array.from(document.querySelectorAll('.question'));
    if (questions.length < 2) return;
    
    const shuffled = shuffleArray(questions);
    const parent = questions[0].parentNode;
    shuffled.forEach(q => parent.appendChild(q));
}

// Form Validation
function setupFormValidation() {
    const form = document.querySelector('form');
    const submit = document.getElementById('submit');
    
    const update = () => submit.disabled = !areAllQuestionsAnswered(form);
    form.addEventListener('change', update);
    update();
}

function areAllQuestionsAnswered(form) {
    const inputs = form.querySelectorAll('input[type="radio"]');
    const names = new Set(Array.from(inputs).map(i => i.name));
    
    for (const name of names) {
        if (!form.querySelector(`input[name="${name}"]:checked`)) return false;
    }
    return true;
}

// Events
function setupSubmit() {
    const btn = document.getElementById('submit');
    if (!btn) return;
    btn.addEventListener('click', () => showScorePopup(calculateScore()));
}

function calculateScore() {
    let correct = 0;
    for (let i = 1; i <= TOTAL_QUESTIONS_PER_QUIZ; i++) {
        const qId = `q${i}`;
        const selected = document.querySelector(`input[name="${qId}"]:checked`);
        if (selected && answerKey[qId] !== undefined) {
            if (parseInt(selected.dataset.optionIndex) === answerKey[qId]) correct++;
        }
    }
    return correct;
}

function showScorePopup(score) {
    const modal = document.getElementById('score-modal');
    const display = modal.querySelector('#modal-score');
    const ok = modal.querySelector('#modal-ok');
    
    display.textContent = `Score: ${score}/${TOTAL_QUESTIONS_PER_QUIZ}`;
    modal.style.display = 'flex';
    modal.classList.add('active');
    ok.focus();
    
    ok.onclick = () => closeModal(modal);
}

function closeModal(modal) {
    modal.style.display = 'none';
    modal.classList.remove('active');
}

document.getElementById('score-modal')?.addEventListener('click', e => {
    if (e.target.id === 'score-modal') closeModal(e.currentTarget);
});

function setupReset() {
    const btn = document.getElementById('reset');
    if (!btn) return;
    btn.addEventListener('click', () => location.reload());
}

function setupHowToPlay() {
    const btn = document.getElementById('how-to-play-btn');
    const modal = document.getElementById('how-to-play-modal');
    const close = document.getElementById('close-how-to-play');
    
    if (!btn || !modal || !close) return;
    
    const toggle = show => modal.classList.toggle('active', show);
    btn.addEventListener('click', () => toggle(true));
    close.addEventListener('click', () => toggle(false));
    modal.addEventListener('click', e => {
        if (e.target === modal) toggle(false);
    });
}
