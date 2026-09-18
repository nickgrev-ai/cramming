// task_mult_easy.js
console.log('=== task_mult_easy.js v3.8 ===');

window.startTest = function (container, onExit, savedState) {
    console.log('startTest вызван, savedState:', savedState ? 'есть' : 'нет');

    const styleEl = document.createElement('style');
    styleEl.textContent = [
        '.me-menu { display: flex; flex-direction: column; width: 100%; height: 100%; }',
        '.me-menu-btn { height: calc(100vh / 13); background: white; color: #333; border: none; border-bottom: 1px solid #e0e0e0; font-size: calc(100vh / 13 * 0.5); font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; }',
        '.me-menu-btn:active { background: #e6e9ef; }',
        '.me-menu-btn:last-child { border-bottom: none; }',
        '.me-top { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; }',
        '.me-question { font-size: calc(100vh / 13 * 1.5); font-weight: bold; color: #333; white-space: nowrap; }',
        '.me-progress { font-size: calc(100vh / 13 * 0.6); color: #666; margin-top: calc(100vh / 13 * 0.3); }',
        '.me-options { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(3, calc(100vh / 13 * 2)); width: 100%; flex-shrink: 0; }',
        '.me-opt { background: #4a90e2; color: #fff; border: 1px solid rgba(255,255,255,0.3); font-size: calc(100vh / 13 * 1.3); font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; }',
        '.me-opt:active { background: #3a7bc8; }',
        '.me-opt.correct { background: #2ecc71; }',
        '.me-opt.wrong { background: #e74c3c; }',
        '.me-opt:disabled { cursor: default; }',
        '.me-results { display: flex; flex-direction: column; width: 100%; height: 100%; }',
        '.me-results-header { height: calc(100vh / 13 * 2); display: flex; flex-direction: column; align-items: center; justify-content: center; background: #4a90e2; color: #fff; flex-shrink: 0; }',
        '.me-results-title { font-size: calc(100vh / 13 * 0.9); font-weight: bold; }',
        '.me-results-summary { font-size: calc(100vh / 13 * 0.6); margin-top: calc(100vh / 13 * 0.2); }',
        '.me-results-list { flex: 1; overflow-y: auto; }',
        '.me-result-row { display: flex; align-items: center; height: calc(100vh / 13); border-bottom: 1px solid #e0e0e0; padding: 0 15px; font-size: calc(100vh / 13 * 0.55); }',
        '.me-result-row:last-child { border-bottom: none; }',
        '.me-result-row.ok { background: #e8f8f0; }',
        '.me-result-row.fail { background: #fdecea; }',
        '.me-result-row.skip { background: #f5f5f5; color: #888; }',
        '.me-result-mark { width: calc(100vh / 13 * 0.8); font-weight: bold; }',
        '.me-result-expr { flex: 1; font-weight: 500; }',
        '.me-result-answer { font-weight: bold; white-space: nowrap; }',
        '.me-strike { text-decoration: line-through; color: #c0392b; margin-right: 6px; }',
        '.me-correct-val { color: #27ae60; }'
    ].join('\n');
    document.head.appendChild(styleEl);

    window.taskCleanup = function () {
        if (timeoutId) clearTimeout(timeoutId);
        if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    };

    let timeoutId = null;
    let mode = 'menu';
    let fixedNumber = null;
    let questions = [];
    let currentIdx = 0;
    let results = [];
    let pendingExit = false;

    const hardPairs = [[6,7],[6,8],[6,9],[7,7],[7,8],[7,9],[8,8],[8,9],[9,9]];

    window.taskGetState = function () {
        return {
            mode: mode,
            fixedNumber: fixedNumber,
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

    function buildQuestions() {
        questions = [];
        if (mode === 'number') {
            for (let i = 1; i <= 9; i++) {
                const fixedFirst = Math.random() < 0.5;
                const a = fixedFirst ? fixedNumber : i;
                const b = fixedFirst ? i : fixedNumber;
                questions.push({ a, b, correctAnswer: fixedNumber * i, sortKey: i, options: null });
            }
            questions.sort(() => Math.random() - 0.5);
        } else if (mode === 'random') {
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
                questions.push({ a, b, correctAnswer: pair.a * pair.b, options: null });
            }
        } else if (mode === 'hard') {
            hardPairs.forEach(p => {
                const showFirst = Math.random() < 0.5;
                const a = showFirst ? p[0] : p[1];
                const b = showFirst ? p[1] : p[0];
                questions.push({ a, b, correctAnswer: p[0] * p[1], options: null });
            });
            questions.sort(() => Math.random() - 0.5);
        }
    }

    function showMenu() {
        if (timeoutId) clearTimeout(timeoutId);
        mode = 'menu';
        questions = [];
        results = [];
        currentIdx = 0;
        pendingExit = false;

        const items = [2,3,4,5,6,7,8,9,'remember','hard'];
        const labels = {2:'× 2',3:'× 3',4:'× 4',5:'× 5',6:'× 6',7:'× 7',8:'× 8',9:'× 9',remember:'Вспомнить',hard:'Сложные'};
        container.innerHTML = '<div class="me-menu" id="me-menu"></div>';
        const menu = document.getElementById('me-menu');
        items.forEach(function (item) {
            const btn = document.createElement('button');
            btn.className = 'me-menu-btn';
            btn.textContent = labels[item];
            btn.onclick = function () {
                if (typeof item === 'number') { mode = 'number'; fixedNumber = item; }
                else if (item === 'remember') mode = 'random';
                else if (item === 'hard') mode = 'hard';
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

    function showQuestion() {
        if (timeoutId) clearTimeout(timeoutId);
        if (currentIdx >= questions.length) { showResults(); return; }

        const q = questions[currentIdx];

        if (!q.options || q.options.length === 0) {
            const options = new Set([q.correctAnswer]);
            while (options.size < 6) {
                const fake = q.correctAnswer + Math.floor(Math.random() * 11) - 5;
                if (fake > 0 && fake !== q.correctAnswer) options.add(fake);
            }
            q.options = Array.from(options).sort(() => Math.random() - 0.5);
            if (typeof saveState === 'function') saveState();
        }

        container.innerHTML =
            '<div class="me-top">' +
                '<div class="me-question">' + q.a + ' × ' + q.b + ' = ?</div>' +
                '<div class="me-progress">Вопрос ' + (currentIdx + 1) + ' из ' + questions.length + '</div>' +
            '</div>' +
            '<div class="me-options" id="opts"></div>';

        const optsDiv = document.getElementById('opts');
        q.options.forEach(function (opt) {
            const btn = document.createElement('button');
            btn.className = 'me-opt';
            btn.textContent = opt;
            btn.onclick = function () { handleAnswer(opt, btn, q); };
            optsDiv.appendChild(btn);
        });
    }

    function handleAnswer(selected, btn, q) {
        const buttons = document.querySelectorAll('.me-opt');
        buttons.forEach(b => { b.disabled = true; });
        const isCorrect = selected === q.correctAnswer;
        if (isCorrect) btn.classList.add('correct');
        else {
            btn.classList.add('wrong');
            buttons.forEach(b => { if (parseInt(b.textContent) === q.correctAnswer) b.classList.add('correct'); });
        }
        results.push({
            a: q.a, b: q.b,
            correctAnswer: q.correctAnswer,
            userAnswer: selected,
            isCorrect: isCorrect,
            skipped: false,
            sortKey: q.sortKey
        });
        currentIdx++;
        if (typeof saveState === 'function') saveState();
        timeoutId = setTimeout(showQuestion, 700);
    }

    function showResults() {
        if (timeoutId) clearTimeout(timeoutId);

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

        let html = '<div class="me-results">';
        html += '<div class="me-results-header">';
        html += '<div class="me-results-title">Результаты</div>';
        html += '<div class="me-results-summary">Правильно: ' + correctCount + ' из ' + totalCount + '</div>';
        html += '</div>';
        html += '<div class="me-results-list">';
        displayResults.forEach(r => {
            let rowClass = 'me-result-row';
            let mark = '';
            let answerHtml = '';
            if (r.skipped) {
                rowClass += ' skip';
                mark = '—';
                answerHtml = '<span class="me-correct-val">' + r.correctAnswer + '</span>';
            } else if (r.isCorrect) {
                rowClass += ' ok';
                mark = '✓';
                answerHtml = '<span class="me-correct-val">' + r.userAnswer + '</span>';
            } else {
                rowClass += ' fail';
                mark = '✗';
                answerHtml = '<span class="me-strike">' + r.userAnswer + '</span><span class="me-correct-val">' + r.correctAnswer + '</span>';
            }
            html += '<div class="' + rowClass + '">';
            html += '<div class="me-result-mark">' + mark + '</div>';
            html += '<div class="me-result-expr">' + r.a + ' × ' + r.b + '</div>';
            html += '<div class="me-result-answer">' + answerHtml + '</div>';
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