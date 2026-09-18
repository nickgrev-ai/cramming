// tasks_animal.js
console.log('=== tasks_animal.js v1.6 ===');

// === БАЗА ЖИВОТНЫХ: 3 группы (в винительном падеже) ===
const ANIMAL_GROUPS = [
    [["медведя","bear.png"],["кабана","boar.png"],["лося","elk.png"],["лису","fox.png"],["белку","squirrel.png"],["зайца", "rabbit.png"],["волка", "wolf.png"]],
    [["верблюда", "camel.png"],["крокодила", "crocodile.png"],["тигра", "tigr.png"],["льва", "lion.png"],["бегемота", "hippo.png"],["носорога", "rhino.png"]],
    [["слона", "elephant.png"],["жирафа", "giraffe.png"],["кенгуру", "kangaroo.png"],["обезьяну", "monkey.png"],["змею", "snake.png"],["зебру", "zebra.png"]]
];

// Путь к папке с картинками
const IMAGES_PATH = 'p0/';

window.startTest = function (container, onExit, savedState) {
    console.log('startTest вызван, savedState:', savedState ? 'есть' : 'нет');

    const styleEl = document.createElement('style');
    styleEl.textContent = [
        /* Основная область делится на 4 части: 1 часть вопрос, 3 части картинки */
        '.an-game-area { display: flex; flex-direction: column; width: 100%; height: 100%; }',
        '.an-question-area { flex: 1; display: flex; align-items: center; justify-content: center; padding: 10px; }',
        '.an-question-text { font-weight: bold; color: #333; text-align: center; word-wrap: break-word; overflow-wrap: break-word; line-height: 1.2; }',
        '.an-options-area { flex: 3; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(3, 1fr); width: 100%; gap: 4px; padding: 4px; box-sizing: border-box; }',
        '.an-opt { background: white; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; overflow: hidden; }',
        '.an-opt:active { background: #e6e9ef; }',
        '.an-opt.correct { background: #2ecc71; border-color: #27ae60; }',
        '.an-opt.wrong { background: #e74c3c; border-color: #c0392b; }',
        '.an-opt:disabled { cursor: default; }',
        '.an-opt img { max-width: 100%; max-height: 100%; object-fit: contain; }',
        
        /* Стили для экрана результатов — сетка картинок 2×5 */
        '.an-results { display: flex; flex-direction: column; width: 100%; height: 100%; }',
        '.an-results-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(5, 1fr); width: 100%; height: 100%; gap: 4px; padding: 4px; box-sizing: border-box; }',
        '.an-result-cell { position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 8px; }',
        '.an-result-cell img { max-width: 100%; max-height: 100%; object-fit: contain; }',
        '.an-result-cell.correct { background: #2ecc71; }',
        '.an-result-cell.wrong { background: #e74c3c; }',
        '.an-result-cell.skip { background: #95a5a6; }',
        '.an-result-badge { position: absolute; top: 5px; right: 5px; width: calc(100vh / 13 * 0.8); height: calc(100vh / 13 * 0.8); background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: calc(100vh / 13 * 0.6); font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }',
        '.an-result-badge.correct { color: #27ae60; }',
        '.an-result-badge.wrong { color: #c0392b; }',
        '.an-result-badge.skip { color: #7f8c8d; }'
    ].join('\n');
    document.head.appendChild(styleEl);

    window.taskCleanup = function () {
        if (timeoutId) clearTimeout(timeoutId);
        if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    };

    let timeoutId = null;
    let questions = [];
    let currentIdx = 0;
    let results = [];
    let pendingExit = false;

    window.taskGetState = function () {
        return {
            questions: questions,
            currentIdx: currentIdx,
            results: results
        };
    };

    window.taskIsInMenu = function () { return true; };

    window.taskShowResultsBeforeExit = function () {
        if (pendingExit) return true;
        if (results.length === 0) return true;
        pendingExit = true;
        showResults();
        return false;
    };

    function findGroupForAnimal(animalName) {
        for (let i = 0; i < ANIMAL_GROUPS.length; i++) {
            const group = ANIMAL_GROUPS[i];
            for (let j = 0; j < group.length; j++) {
                if (group[j][0] === animalName) {
                    return group;
                }
            }
        }
        return null;
    }

    function buildQuestions() {
        questions = [];
        
        const allAnimals = [];
        ANIMAL_GROUPS.forEach(group => {
            group.forEach(animal => {
                allAnimals.push({ name: animal[0], image: animal[1] });
            });
        });
        
        const shuffled = allAnimals.slice().sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 10);
        
        selected.forEach(animal => {
            const group = findGroupForAnimal(animal.name);
            
            const groupAnimals = group
                .filter(a => a[0] !== animal.name)
                .map(a => ({ name: a[0], image: a[1] }));
            
            const shuffledDistractors = groupAnimals.sort(() => Math.random() - 0.5);
            const distractors = shuffledDistractors.slice(0, 5);
            
            const options = [animal, ...distractors].sort(() => Math.random() - 0.5);
            const correctIndex = options.findIndex(o => o.name === animal.name);
            
            questions.push({
                target: animal.name,
                targetImage: animal.image,
                options: options,
                correctIndex: correctIndex
            });
        });
    }

    function startTestLocal() {
        buildQuestions();
        currentIdx = 0;
        results = [];
        pendingExit = false;
        if (typeof saveState === 'function') saveState();
        showQuestion();
    }

    function showQuestion() {
        if (timeoutId) clearTimeout(timeoutId);
        if (currentIdx >= questions.length) { showResults(); return; }

        const q = questions[currentIdx];

        container.innerHTML =
            '<div class="an-game-area">' +
                '<div class="an-question-area"><div class="an-question-text" id="an-question-text">Найди ' + q.target + '</div></div>' +
                '<div class="an-options-area" id="opts"></div>' +
            '</div>';

        const questionTextEl = document.getElementById('an-question-text');
        const questionContainer = questionTextEl.parentElement;
        
        let fontSize = 8; 
        questionTextEl.style.fontSize = fontSize + 'vh';
        
        const maxAttempts = 100;
        let attempts = 0;
        
        while (attempts < maxAttempts && fontSize > 3) {
            const fitsWidth = questionTextEl.scrollWidth <= questionContainer.clientWidth - 20;
            const fitsHeight = questionTextEl.scrollHeight <= questionContainer.clientHeight - 20;
            
            if (fitsWidth && fitsHeight) {
                break;
            }
            
            fontSize -= 0.5;
            questionTextEl.style.fontSize = fontSize + 'vh';
            attempts++;
        }

        const optsDiv = document.getElementById('opts');
        q.options.forEach(function (opt, idx) {
            const btn = document.createElement('button');
            btn.className = 'an-opt';
            btn.innerHTML = '<img src="' + IMAGES_PATH + opt.image + '" alt="' + opt.name + '">';
            btn.onclick = function () { handleAnswer(idx, btn, q); };
            optsDiv.appendChild(btn);
        });
    }

    function handleAnswer(selectedIdx, btn, q) {
        const buttons = document.querySelectorAll('.an-opt');
        buttons.forEach(b => { b.disabled = true; });
        const isCorrect = selectedIdx === q.correctIndex;
        if (isCorrect) btn.classList.add('correct');
        else {
            btn.classList.add('wrong');
            buttons[q.correctIndex].classList.add('correct');
        }
        results.push({
            target: q.target,
            targetImage: q.targetImage,
            userAnswer: q.options[selectedIdx].name,
            correctAnswer: q.target,
            isCorrect: isCorrect,
            skipped: false
        });
        currentIdx++;
        if (typeof saveState === 'function') saveState();
        timeoutId = setTimeout(showQuestion, 700);
    }

    function showResults() {
        if (timeoutId) clearTimeout(timeoutId);

        // Добавляем пропущенные вопросы
        for (let i = results.length; i < questions.length; i++) {
            const q = questions[i];
            results.push({
                target: q.target,
                targetImage: q.targetImage,
                userAnswer: null,
                correctAnswer: q.target,
                isCorrect: false,
                skipped: true
            });
        }

        // Строим сетку 2×5 с картинками правильных ответов
        let html = '<div class="an-results"><div class="an-results-grid">';
        
        results.forEach(r => {
            let cellClass = 'an-result-cell';
            let badgeClass = '';
            let badgeSymbol = '';
            
            if (r.skipped) {
                cellClass += ' skip';
                badgeClass = ' skip';
                badgeSymbol = '—';
            } else if (r.isCorrect) {
                cellClass += ' correct';
                badgeClass = ' correct';
                badgeSymbol = '✓';
            } else {
                cellClass += ' wrong';
                badgeClass = ' wrong';
                badgeSymbol = '✗';
            }
            
            html += '<div class="' + cellClass + '">';
            html += '<img src="' + IMAGES_PATH + r.targetImage + '" alt="' + r.target + '">';
            html += '<div class="an-result-badge' + badgeClass + '">' + badgeSymbol + '</div>';
            html += '</div>';
        });
        
        html += '</div></div>';
        container.innerHTML = html;

        if (typeof saveState === 'function') saveState();
    }

    if (savedState && savedState.questions && savedState.questions.length > 0) {
        questions = savedState.questions || [];
        currentIdx = savedState.currentIdx || 0;
        results = savedState.results || [];
        if (currentIdx < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    } else {
        startTestLocal();
    }
};