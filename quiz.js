console.log("quiz take 2 loaded");

const questionPool = [
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

let correctAnswers = {};

document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
    setupSubmit();
    setupReset();
    setupHowToPlay();
    setupFormValidation();
});

function loadQuestions() {
    const form = document.querySelector('form');
    const questionsContainers = form.querySelectorAll('.question');
    
    const selectedQuestions = shuffleArray([...questionPool]).slice(0, 5);
    correctAnswers = {};
    
    questionsContainers.forEach((container, index) => {
        if (index < selectedQuestions.length) {
            const q = selectedQuestions[index];
            const questionDiv = container.querySelector('div');
            questionDiv.textContent = q.question;
            
            const qName = `q${index + 1}`;
            correctAnswers[qName] = q.correctIndex;
            
            const radioInputs = container.querySelectorAll('input[type="radio"]');
            const spans = container.querySelectorAll('span');
            
            radioInputs.forEach((input, optIndex) => {
                input.value = q.options[optIndex];
                input.id = qName;
                input.name = qName;
                input.dataset.optionIndex = optIndex;
                if (spans[optIndex]) {
                    spans[optIndex].textContent = q.options[optIndex];
                }
            });
        }
    });
    
    shuffleQuestions();
}

// Fisher-Yates shuffle algorithm with descriptive variable names
function shuffleArray(array) {
    const result = [...array];
    for (let currentIndex = result.length - 1; currentIndex > 0; currentIndex--) {
        const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
        [result[currentIndex], result[randomIndex]] = [result[randomIndex], result[currentIndex]];
    }
    return result;
}

function shuffleQuestions() {
    const questions = Array.from(document.querySelectorAll('.question'));
    if (questions.length < 2) return;
    
    const shuffled = shuffleArray(questions);
    const parent = questions[0].parentNode;
    shuffled.forEach(q => parent.appendChild(q));
}

function setupFormValidation() {
    const form = document.querySelector('form');
    const submitBtn = document.getElementById('submit');
    
    const validateForm = () => {
        const allAnswered = [...form.querySelectorAll('input[type="radio"]')]
            .reduce((acc, input) => {
                const questionName = input.name;
                return acc && form.querySelector(`input[name="${questionName}"]:checked`) !== null;
            }, true);
        
        submitBtn.disabled = !allAnswered;
    };
    
    form.addEventListener('change', validateForm);
    validateForm(); // Check initial state
}

function setupSubmit() {
    const submit = document.getElementById('submit');
    if (!submit) return;
    submit.addEventListener('click', () => {
        let score = 0;
        
        for (let i = 1; i <= 5; i++) {
            const qName = `q${i}`;
            const checkedRadio = document.querySelector(`input[name="${qName}"]:checked`);
            
            if (checkedRadio && correctAnswers[qName] !== undefined) {
                const selectedIndex = parseInt(checkedRadio.dataset.optionIndex);
                if (selectedIndex === correctAnswers[qName]) {
                    score++;
                }
            }
        }
        
        showScorePopup(score);
    });
}

function showScorePopup(score) {
    const overlay = document.getElementById('score-modal');
    const scoreEl = overlay.querySelector('#modal-score');
    const ok = overlay.querySelector('#modal-ok');
    
    scoreEl.textContent = `Score: ${score}/5`;
    overlay.style.display = 'flex';
    overlay.classList.add('active');
    ok.focus();
    
    ok.onclick = () => hideModal(overlay);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) hideModal(overlay);
    });
}

function hideModal(overlay) {
    overlay.style.display = 'none';
    overlay.classList.remove('active');
}

function setupReset() {
    const reset = document.getElementById('reset');
    if (!reset) return;
    reset.addEventListener('click', () => location.reload());
}

function setupHowToPlay() {
    const btn = document.getElementById('how-to-play-btn');
    const modal = document.getElementById('how-to-play-modal');
    const closeBtn = document.getElementById('close-how-to-play');
    
    if (!btn || !modal) return;
    
    const toggleModal = (show) => modal.classList.toggle('active', show);
    
    btn.addEventListener('click', () => toggleModal(true));
    closeBtn?.addEventListener('click', () => toggleModal(false));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) toggleModal(false);
    });
}
