console.log("quiz take 2 loaded");
document.addEventListener('DOMContentLoaded', function() {
    shuffleQuestions();
    setupSubmit();
    setupReset();
    setupHowToPlay();
});

function shuffleQuestions() {
    const questions = Array.from(document.querySelectorAll('.question'));
    const parent = questions[0]?.parentNode;
    if (!parent || questions.length < 2) return;
    
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    
    questions.forEach(q => parent.appendChild(q));
}

function setupSubmit() {
    const submit = document.getElementById('submit');
    if (!submit) return;
    submit.addEventListener('click', function() {
        var score = 0;
        // Check q1..q5 safely (guards against missing elements)
        for (let i = 1; i <= 5; i++) {
            const el = document.getElementById('q' + i);
            if (el && el.checked) score++;
        }
        showScorePopup(score);
    });
}

// Create and show a modal popup with the score
function showScorePopup(score) {
    let overlay = document.querySelector('.modal-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal" role="dialog" aria-modal="true">
                <h2>Your Result</h2>
                <p id="modal-score">Score: ${score}/5</p>
                <div class="modal-actions">
                    <button class="btn primary" id="modal-ok">OK</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        // ensure the score text is set (handle any template timing issues)
        const createdScoreEl = overlay.querySelector('#modal-score');
        if (createdScoreEl) createdScoreEl.textContent = `Score: ${score}/5`;
        // close handler
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) hideModal(overlay);
        });
    } else {
        const scoreEl = overlay.querySelector('#modal-score');
        if (scoreEl) scoreEl.textContent = `Score: ${score}/5`;
    }
    overlay.classList.add('active');
    const ok = overlay.querySelector('#modal-ok');
    if (ok) ok.focus();
    if (ok) ok.onclick = () => hideModal(overlay);
}

function hideModal(overlay) {
    overlay.classList.remove('active');
}

function setupReset() {
    const reset = document.getElementById('reset');
    if (!reset) return;
    reset.addEventListener('click', function() {
        location.reload();
    });
}

function setupHowToPlay() {
    const btn = document.getElementById('how-to-play-btn');
    const modal = document.getElementById('how-to-play-modal');
    const closeBtn = document.getElementById('close-how-to-play');
    
    if (!btn || !modal) return;
    
    btn.addEventListener('click', () => {
        modal.classList.add('active');
    });
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}
