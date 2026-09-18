// task_mult_hard.js
console.log('=== task_mult_hard.js v4.7 ===');

window.startTest = function (container, onExit, savedState) {
    console.log('startTest вызван, savedState:', savedState ? 'есть' : 'нет');

    const styleEl = document.createElement('style');
    styleEl.textContent = [
        '.mh-menu { display: flex; flex-direction: column; width: 100%; height: 100%; }',
        '.mh-menu-btn { height: calc(100vh / 13); background: white; color: #333; border: none; border-bottom: 1px solid #e0e0e0; font-size: calc(100vh / 13 * 0.5); font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; }',
        '.mh-menu-btn:active { background: #e6e9ef; }',
        '.mh-menu-btn:last-child { border-bottom: none; }',
        '.mh-progress { height: calc(100vh / 13 * 0.5); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }',
        '.mh-progress-text { font-size: calc(100vh / 13 * 0.3); color: #666; }',
        '.mh-question { height: calc(100vh / 13 * 1.5); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }',
        '.mh-question-text { font-size: calc(100vh / 13 * 1.5); font-weight: bold; color: #333; white-space: nowrap; }',
        '.mh-display { height: calc(100vh / 13 * 2); display: flex; align-items: center; justify-content: center; font-size: calc(100vh / 13 * 1.2); font-weight: bold; color: #333; flex-shrink: 0; overflow: hidden; padding: 0 10px; }',
        '.mh-display .mh-cursor { display: inline-block; width: 2px; height: calc(100vh / 13 * 1); background: #333; margin-left: 4px; animation: mh-blink 1s infinite; }',
        '.mh-feedback-text { white-space: nowrap; display: inline-block; }',
        '@keyframes mh-blink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }',
        '.mh-time-bar-container { width: 100%; height: calc(100vh / 13 * 0.3); background: #e0e0e0; flex-shrink: 0; }',
        '.mh-time-bar { height: 100%; background: #4a90e2; transition: width 1s linear; }',
        '.mh-time-bar.warning { background: #f39c12; }',
        '.mh-time-bar.danger { background: #e74c3c; }',
        '.mh-keypad { display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: repeat(4, calc(100vh / 13 * 2)); width: 100%; flex-shrink: 0; }',
        '.mh-key { background: #4a90e2; color: #fff; border: 1px solid rgba(255,255,255,0.3); font-size: calc(100vh / 13 * 1.3); font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; }',
        '.mh-key:active { background: #3a7bc8; }',
        '.mh-key.del { background: #f39c12; }',
        '.mh-key.del:active { background: #d68910; }',
        '.mh-key.ok { background: #2ecc71; }',
        '.mh-key.ok:active { background: #27ae60; }',
        '.mh-key:disabled { opacity: 0.5; cursor: default; }',
        '.mh-results { display: flex; flex-direction: column; width: 100%; height: 100%; }',
        '.mh-results-header { height: calc(100vh / 13 * 2); display: flex; flex-direction: column; align-items: center; justify-content: center; background: #4a90e2; color: #fff; flex-shrink: 0; }',
        '.mh-results-title { font-size: calc(100vh / 13 * 0.9); font-weight: bold; }',
        '.mh-results-summary { font-size: calc(100vh / 13 * 0.6); margin-top: calc(100vh / 13 * 0.2); }',
        '.mh-results-list { flex: 1; overflow-y: auto; }',
        '.mh-result-row { display: flex; align-items: center; height: calc(100vh / 13); border-bottom: 1px solid #e0e0e0; padding: 0 15px; font-size: calc(100vh / 13 * 0.55); }',
        '.mh-result-row:last-child { border-bottom: none; }',
        '.mh-result-row.ok { background: #e8f8f0; }',
        '.mh-result-row.fail { background: #fdecea; }',
        '.mh-result-row.skip { background: #f5f5f5; color: #888; }',
        '.mh-result-mark { width: calc(100vh / 13 * 0.8); font-weight: bold; }',
        '.mh-result-expr { flex: 1; font-weight: 500; }',
        '.mh-result-answer { font-weight: bold; white-space: nowrap; }',
        '.mh-strike { text-decoration: line-through; color: #c0392b; margin-right: 6px; }',
        '.mh-correct-val { color: #27ae60; }',
        '.mh-check-word { color: #666; font-size: calc(100vh / 13 * 0.4); margin-left: 6px; }'
    ].join('\n');
    document.head.appendChild(styleEl);

    window.taskCleanup = function () {
        if (timeoutId) clearTimeout(timeoutId);
        if (timerInterval) clearInterval(timerInterval);
        if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
        if (keyHandler) document.removeEventListener('keydown', keyHandler);
    };

    let timeoutId = null;
    let timerInterval = null;
    let timeLeft = 0;
    let mode = 'menu';
    let fixedNumber = null;
    let questions = [];
    let currentIdx = 0;
    let results = [];
    let currentInput = '';
    let inputLocked = false;
    let keyHandler = null;
    let pendingExit = false;

    const hardPairs = [[6,7],[6,8],[6,9],[7,7],[7,8],[7,9],[8,8],[8,9],[9,9]];

    window.taskGetState = function () {
        return {
            mode: mode,
            fixedNumber: fixedNumber,
            questions: questions,
            currentIdx: currentIdx,
            results: results,
            currentInput: currentInput
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

    function buildQuestions() {
        questions = [];
        if (mode === 'number') {
            for (let i = 1; i <= 9; i++) {
                const fixedFirst = Math.random() < 0.5;
                const a = fixedFirst ? fixedNumber : i;
                const b = fixedFirst ? i : fixedNumber;
                questions.push({ a, b, correctAnswer: fixedNumber * i, sortKey: i });
            }
            questions.sort(() => Math.random() - 0.5);
        } else if (mode === 'random' || mode === 'control') {
            const allPairs = [];
            for (let a = 2; a <= 9; a++) {
                for (let b = a; b <= 9; b++) {
                    allPairs.push({ a, b });
                }
            }
            allPairs.sort(() => Math.random() - 0.5);
            for (let i = 0; i < 10; i++) {
                const pair = allPairs[i];
                const showFirst = Math.random() < 0.5;
                const a = showFirst ? pair.a : pair.b;
                const b = showFirst ? pair.b : pair.a;
                questions.push({ a, b, correctAnswer: pair.a * pair.b });
            }
        } else if (mode === 'hard') {
            hardPairs.forEach(p => {
                const showFirst = Math.random() < 0.5;
                const a = showFirst ? p[0] : p[1];
                const b = showFirst ? p[1] : p[0];
                questions.push({ a, b, correctAnswer: p[0] * p[1] });
            });
            questions.sort(() => Math.random() - 0.5);
        }
    }

    function showMenu() {
        if (timeoutId) clearTimeout(timeoutId);
        if (timerInterval) clearInterval(timerInterval);
        if (keyHandler) { document.removeEventListener('keydown', keyHandler); keyHandler = null; }
        mode = 'menu';
        questions = [];
        results = [];
        currentIdx = 0;
        pendingExit = false;

        const items = [2,3,4,5,6,7,8,9,'remember','hard','control'];
        const labels = {2:'× 2',3:'× 3',4:'× 4',5:'× 5',6:'× 6',7:'× 7',8:'× 8',9:'× 9',remember:'Вспомнить',hard:'Сложные',control:'Контроль'};
        container.innerHTML = '<div class="mh-menu" id="mh-menu"></div>';
        const menu = document.getElementById('mh-menu');
        items.forEach(function (item) {
            const btn = document.createElement('button');
            btn.className = 'mh-menu-btn';
            btn.textContent = labels[item];
            btn.onclick = function () {
                if (typeof item === 'number') { mode = 'number'; fixedNumber = item; }
                else if (item === 'remember') mode = 'random';
                else if (item === 'hard') mode = 'hard';
                else if (item === 'control') mode = 'control';
                buildQuestions();
                currentIdx = 0;
                results = [];
                pendingExit = false;
                if (typeof saveState === 'function') saveState();
                showQuestion();
            };
            menu.appendChild(btn);
        });

        if (typeof saveState === 'function') saveState();
    }

    function startTimer() {
        timeLeft = 20;
        updateTimeBar();
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimeBar();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                submitAnswer(questions[currentIdx], true);
            }
        }, 1000);
    }

    function updateTimeBar() {
        const bar = document.getElementById('mh-time-bar');
        if (bar) {
            const percent = (timeLeft / 20) * 100;
            bar.style.width = percent + '%';
            bar.className = 'mh-time-bar';
            if (timeLeft <= 5) bar.classList.add('danger');
            else if (timeLeft <= 10) bar.classList.add('warning');
        }
    }

    function showQuestion() {
        if (timeoutId) clearTimeout(timeoutId);
        if (timerInterval) clearInterval(timerInterval);
        if (currentIdx >= questions.length) { showResults(); return; }

        const q = questions[currentIdx];
        currentInput = '';
        inputLocked = false;

        const showTimeBar = (mode === 'control');

        container.innerHTML =
            '<div class="mh-progress"><div class="mh-progress-text">Вопрос ' + (currentIdx + 1) + ' из ' + questions.length + '</div></div>' +
            '<div class="mh-question"><div class="mh-question-text">' + q.a + ' × ' + q.b + ' = ?</div></div>' +
            '<div class="mh-display" id="mh-display"><span id="mh-val"></span><span class="mh-cursor"></span></div>' +
            (showTimeBar ? '<div class="mh-time-bar-container"><div class="mh-time-bar" id="mh-time-bar"></div></div>' : '') +
            '<div class="mh-keypad" id="mh-keypad"></div>';

        const keypad = document.getElementById('mh-keypad');
        const keys = [
            {label:'1',val:'1'},{label:'2',val:'2'},{label:'3',val:'3'},
            {label:'4',val:'4'},{label:'5',val:'5'},{label:'6',val:'6'},
            {label:'7',val:'7'},{label:'8',val:'8'},{label:'9',val:'9'},
            {label:'⌫',cls:'del',action:'del'},{label:'0',val:'0'},{label:'✓',cls:'ok',action:'ok'}
        ];
        keys.forEach(k => {
            const btn = document.createElement('button');
            btn.className = 'mh-key' + (k.cls ? ' ' + k.cls : '');
            btn.textContent = k.label;
            btn.onclick = function () {
                if (inputLocked) return;
                if (k.action === 'del') {
                    currentInput = currentInput.slice(0, -1);
                    updateDisplay();
                } else if (k.action === 'ok') {
                    submitAnswer(q, false);
                } else {
                    if (currentInput.length < 3) {
                        currentInput += k.val;
                        updateDisplay();
                    }
                }
            };
            keypad.appendChild(btn);
        });

        if (keyHandler) document.removeEventListener('keydown', keyHandler);
        keyHandler = function(e) {
            if (inputLocked) return;
            if (e.key >= '0' && e.key <= '9') {
                if (currentInput.length < 3) {
                    currentInput += e.key;
                    updateDisplay();
                }
            } else if (e.key === 'Backspace') {
                currentInput = currentInput.slice(0, -1);
                updateDisplay();
            } else if (e.key === 'Enter') {
                submitAnswer(q, false);
            }
        };
        document.addEventListener('keydown', keyHandler);

        updateDisplay();

        if (mode === 'control') {
            startTimer();
        }
    }

    function updateDisplay() {
        const valEl = document.getElementById('mh-val');
        if (valEl) {
            valEl.textContent = currentInput || '';
            valEl.className = '';
            valEl.style.fontSize = '';
        }
    }

    function showFeedback(text, isCorrect) {
        const display = document.getElementById('mh-display');
        if (!display) return;

        display.innerHTML = '<span class="mh-feedback-text">' + text + '</span>';
        display.style.color = isCorrect ? '#2ecc71' : '#e74c3c';

        const span = display.querySelector('.mh-feedback-text');

        let fontSize = 2.5;
        span.style.fontSize = 'calc(100vh / 13 * ' + fontSize + ')';

        const maxAttempts = 100;
        let attempts = 0;
        while ((span.scrollWidth > display.clientWidth - 20 || span.scrollHeight > display.clientHeight - 10) && fontSize > 0.5 && attempts < maxAttempts) {
            fontSize -= 0.05;
            span.style.fontSize = 'calc(100vh / 13 * ' + fontSize + ')';
            attempts++;
        }
    }

    function submitAnswer(q, isTimeout) {
        if (timerInterval) clearInterval(timerInterval);
        if (!isTimeout && currentInput === '') return;

        inputLocked = true;
        const userVal = isTimeout ? null : parseInt(currentInput);
        const isCorrect = userVal !== null && userVal === q.correctAnswer;

        const buttons = document.querySelectorAll('.mh-key');
        buttons.forEach(b => { b.disabled = true; });

        if (mode !== 'control') {
            if (isCorrect) {
                showFeedback('✓ ' + userVal, true);
            } else {
                showFeedback(userVal + ' → ' + q.correctAnswer, false);
            }
        }

        results.push({
            a: q.a, b: q.b,
            correctAnswer: q.correctAnswer,
            userAnswer: userVal,
            isCorrect: isCorrect,
            skipped: isTimeout || userVal === null,
            sortKey: q.sortKey
        });
        currentIdx++;
        if (typeof saveState === 'function') saveState();
        timeoutId = setTimeout(showQuestion, mode === 'control' ? 100 : 1000);
    }

    function showResults() {
        if (timeoutId) clearTimeout(timeoutId);
        if (timerInterval) clearInterval(timerInterval);
        if (keyHandler) { document.removeEventListener('keydown', keyHandler); keyHandler = null; }

        for (let i = results.length; i < questions.length; i++) {
            const q = questions[i];
            results.push({
                a: q.a, b: q.b,
                correctAnswer: q.correctAnswer,
                userAnswer: null,
                isCorrect: false,
                skipped: true,
                sortKey: q.sortKey
            });
        }

        let displayResults = results.slice();
        if (mode === 'number') {
            displayResults.sort((r1, r2) => r1.sortKey - r2.sortKey);
        }

        const correctCount = displayResults.filter(r => r.isCorrect).length;
        const totalCount = displayResults.length;

        let html = '<div class="mh-results">';
        html += '<div class="mh-results-header">';
        html += '<div class="mh-results-title">Результаты</div>';
        html += '<div class="mh-results-summary">Правильно: ' + correctCount + ' из ' + totalCount + '</div>';
        html += '</div>';
        html += '<div class="mh-results-list">';
        displayResults.forEach(r => {
            let rowClass = 'mh-result-row';
            let mark = '';
            let answerHtml = '';
            if (r.skipped) {
                rowClass += ' skip';
                mark = '—';
                answerHtml = '<span class="mh-correct-val">' + r.correctAnswer + '</span>';
            } else if (r.isCorrect) {
                rowClass += ' ok';
                mark = '✓';
                answerHtml = '<span class="mh-correct-val">' + r.userAnswer + '</span>';
            } else {
                rowClass += ' fail';
                mark = '✗';
                answerHtml = '<span class="mh-strike">' + r.userAnswer + '</span><span class="mh-correct-val">' + r.correctAnswer + '</span>';
            }
            html += '<div class="' + rowClass + '">';
            html += '<div class="mh-result-mark">' + mark + '</div>';
            html += '<div class="mh-result-expr">' + r.a + ' × ' + r.b + '</div>';
            html += '<div class="mh-result-answer">' + answerHtml + '</div>';
            html += '</div>';
        });
        html += '</div>';
        html += '</div>';
        container.innerHTML = html;

        if (typeof saveState === 'function') saveState();
    }

    if (savedState && savedState.mode && savedState.mode !== 'menu') {
        mode = savedState.mode;
        fixedNumber = savedState.fixedNumber;
        questions = savedState.questions || [];
        currentIdx = savedState.currentIdx || 0;
        results = savedState.results || [];
        if (currentIdx < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    } else {
        showMenu();
    }
};