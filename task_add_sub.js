// task_add_sub.js
console.log('=== task_add_sub.js v1.9 ===');

window.startTest = function (container, onExit, savedState) {
    console.log('startTest вызван, savedState:', savedState ? 'есть' : 'нет');

    const styleEl = document.createElement('style');
    styleEl.textContent = [
        '.as-menu { display: flex; flex-direction: column; width: 100%; height: 100%; }',
        '.as-menu-btn { height: calc(100vh / 13); background: white; color: #333; border: none; border-bottom: 1px solid #e0e0e0; font-size: calc(100vh / 13 * 0.6); font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; word-wrap: break-word; overflow-wrap: break-word; line-height: 1.1; }',
        '.as-menu-btn:active { background: #e6e9ef; }',
        '.as-menu-btn:last-child { border-bottom: none; }',
        '.as-progress { height: calc(100vh / 13 * 0.5); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }',
        '.as-progress-text { font-size: calc(100vh / 13 * 0.3); color: #666; }',
        '.as-question { height: calc(100vh / 13 * 2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; padding: 0 10px; }',
        '.as-question-text { font-weight: bold; color: #333; text-align: center; word-wrap: break-word; overflow-wrap: break-word; line-height: 1.2; }',
        '.as-options { flex: 1; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(4, 1fr); width: 100%; min-height: 0; gap: 4px; padding: 4px; box-sizing: border-box; }',
        '.as-opt { background: #4a90e2; color: #fff; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 5px; word-wrap: break-word; overflow-wrap: break-word; line-height: 1; text-align: center; overflow: hidden; font-size: 0; }',
        '.as-opt:active { background: #3a7bc8; }',
        '.as-opt.correct { background: #2ecc71; }',
        '.as-opt.wrong { background: #e74c3c; }',
        '.as-opt:disabled { cursor: default; }',
        '.as-results { display: flex; flex-direction: column; width: 100%; height: 100%; overflow: hidden; }',
        '.as-results-grid { display: flex; flex-direction: column; width: 100%; flex: 1; gap: 4px; padding: 8px; box-sizing: border-box; overflow: hidden; }',
        '.as-result-cell { flex: 1; display: flex; align-items: center; justify-content: center; padding: 8px 12px; box-sizing: border-box; white-space: nowrap; text-align: center; font-weight: bold; border-radius: 8px; min-height: 0; overflow: hidden; }',
        '.as-result-cell.correct { background: #2ecc71; color: white; }',
        '.as-result-cell.wrong { background: #e74c3c; color: white; }',
        '.as-result-cell.skip { background: #95a5a6; color: white; }'
    ].join('\n');
    document.head.appendChild(styleEl);

    window.taskCleanup = function () {
        if (timeoutId) clearTimeout(timeoutId);
        if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    };

    let timeoutId = null;
    let mode = 'menu';
    let modeValue = null;
    let questions = [];
    let currentIdx = 0;
    let results = [];
    let pendingExit = false;

    window.taskGetState = function () {
        return {
            mode: mode,
            modeValue: modeValue,
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

    function generateQuestions(mode, value) {
        const qs = [];
        
        if (mode === 'remember') {
            for (let i = 0; i < 5; i++) {
                const a = Math.floor(Math.random() * 10) + 1;
                const b = Math.floor(Math.random() * 10) + 1;
                qs.push({ a: a, b: b, op: '+', answer: a + b });
            }
            for (let i = 0; i < 5; i++) {
                const a = Math.floor(Math.random() * 10) + 1;
                const b = Math.floor(Math.random() * a) + 1;
                qs.push({ a: a, b: b, op: '-', answer: a - b });
            }
            qs.sort(() => Math.random() - 0.5);
        } else {
            const n = value;
            for (let i = 0; i < 5; i++) {
                const x = Math.floor(Math.random() * 10) + 1;
                if (Math.random() < 0.5) {
                    qs.push({ a: n, b: x, op: '+', answer: n + x });
                } else {
                    qs.push({ a: x, b: n, op: '+', answer: x + n });
                }
            }
            for (let i = 0; i < 5; i++) {
                if (Math.random() < 0.5) {
                    const x = Math.floor(Math.random() * n) + 1;
                    qs.push({ a: n, b: x, op: '-', answer: n - x });
                } else {
                    const x = n + Math.floor(Math.random() * 10) + 1;
                    qs.push({ a: x, b: n, op: '-', answer: x - n });
                }
            }
            qs.sort(() => Math.random() - 0.5);
        }
        
        return qs;
    }

    function generateOptions(question) {
        const correct = question.answer;
        const options = [];
        
        let start = correct - 1;
        if (start < 0) start = 0;
        
        for (let i = 0; i < 8; i++) {
            options.push(start + i);
        }
        
        if (!options.includes(correct)) {
            options[7] = correct;
        }
        
        const unique = [...new Set(options)];
        while (unique.length < 8) {
            unique.push(unique[unique.length - 1] + 1);
        }
        
        unique.sort(() => Math.random() - 0.5);
        
        return unique;
    }

    function showMenu() {
        if (timeoutId) clearTimeout(timeoutId);
        mode = 'menu';
        modeValue = null;
        questions = [];
        results = [];
        currentIdx = 0;
        pendingExit = false;

        container.innerHTML = '<div class="as-menu" id="as-menu"></div>';
        const menu = document.getElementById('as-menu');
        
        for (let i = 1; i <= 10; i++) {
            const btn = document.createElement('button');
            btn.className = 'as-menu-btn';
            btn.textContent = i;
            btn.onclick = function () {
                mode = 'number';
                modeValue = i;
                questions = generateQuestions('number', i);
                currentIdx = 0;
                results = [];
                pendingExit = false;
                if (typeof saveState === 'function') saveState();
                showQuestion();
            };
            menu.appendChild(btn);
        }
        
        const btn = document.createElement('button');
        btn.className = 'as-menu-btn';
        btn.textContent = 'Вспомнить';
        btn.onclick = function () {
            mode = 'remember';
            modeValue = null;
            questions = generateQuestions('remember', null);
            currentIdx = 0;
            results = [];
            pendingExit = false;
            if (typeof saveState === 'function') saveState();
            showQuestion();
        };
        menu.appendChild(btn);

        if (typeof saveState === 'function') saveState();
    }

    function showQuestion() {
        if (timeoutId) clearTimeout(timeoutId);
        if (currentIdx >= questions.length) { showResults(); return; }

        const q = questions[currentIdx];
        const options = generateOptions(q);

        container.innerHTML =
            '<div class="as-progress"><div class="as-progress-text">Пример ' + (currentIdx + 1) + ' из ' + questions.length + '</div></div>' +
            '<div class="as-question"><div class="as-question-text" id="as-question-text">' + q.a + ' ' + q.op + ' ' + q.b + ' = ?</div></div>' +
            '<div class="as-options" id="opts"></div>';

        const optsDiv = document.getElementById('opts');
        options.forEach(function (opt) {
            const btn = document.createElement('button');
            btn.className = 'as-opt';
            btn.textContent = opt;
            btn.onclick = function () { handleAnswer(opt, btn, q); };
            optsDiv.appendChild(btn);
        });

        setTimeout(() => {
            const questionTextEl = document.getElementById('as-question-text');
            if (questionTextEl) {
                let fontSize = 8;
                questionTextEl.style.fontSize = fontSize + 'vh';
                let attempts = 0;
                while (attempts < 100 && fontSize > 3) {
                    if (questionTextEl.scrollWidth <= questionTextEl.parentElement.clientWidth - 20 &&
                        questionTextEl.scrollHeight <= questionTextEl.parentElement.clientHeight - 10) {
                        break;
                    }
                    fontSize -= 0.5;
                    questionTextEl.style.fontSize = fontSize + 'vh';
                    attempts++;
                }
            }

            const buttons = document.querySelectorAll('.as-opt');
            if (buttons.length > 0 && buttons[0].clientHeight > 0) {
                let btnFontSize = buttons[0].clientHeight * 0.6;
                let attempts = 0;
                
                while (attempts < 100 && btnFontSize > 10) {
                    let allFit = true;
                    buttons.forEach(btn => {
                        btn.style.fontSize = btnFontSize + 'px';
                        if (btn.scrollWidth > btn.clientWidth + 2) {
                            allFit = false;
                        }
                    });
                    if (allFit) break;
                    btnFontSize -= 2;
                    attempts++;
                }
            }
        }, 50);
    }

    function handleAnswer(selected, btn, q) {
        const buttons = document.querySelectorAll('.as-opt');
        buttons.forEach(b => { b.disabled = true; });
        const isCorrect = selected === q.answer;
        if (isCorrect) btn.classList.add('correct');
        else {
            btn.classList.add('wrong');
            buttons.forEach(b => {
                if (parseInt(b.textContent) === q.answer) {
                    b.classList.add('correct');
                }
            });
        }
        results.push({
            question: q.a + ' ' + q.op + ' ' + q.b,
            correctAnswer: q.answer,
            userAnswer: selected,
            isCorrect: isCorrect,
            skipped: false
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
                question: q.a + ' ' + q.op + ' ' + q.b,
                correctAnswer: q.answer,
                userAnswer: null,
                isCorrect: false,
                skipped: true
            });
        }

        let html = '<div class="as-results"><div class="as-results-grid">';
        
        results.forEach(r => {
            let cellClass = 'as-result-cell';
            let text = '';
            
            if (r.skipped) {
                cellClass += ' skip';
                text = r.question + ' = ' + r.correctAnswer + ' (пропущено)';
            } else if (r.isCorrect) {
                cellClass += ' correct';
                text = r.question + ' = ' + r.userAnswer;
            } else {
                cellClass += ' wrong';
                text = r.question + ' = ' + r.userAnswer + ' (правильно: ' + r.correctAnswer + ')';
            }
            
            html += '<div class="' + cellClass + '">' + text + '</div>';
        });
        
        html += '</div></div>';
        container.innerHTML = html;

        // Подбор максимального шрифта с корректным измерением ширины
        setTimeout(() => {
            const cells = document.querySelectorAll('.as-result-cell');
            const grid = document.querySelector('.as-results-grid');
            if (cells.length === 0 || !grid) return;
            
            const maxWidth = grid.clientWidth - 24;
            
            // Создаём скрытый измерительный элемент
            const measurer = document.createElement('div');
            measurer.style.cssText = 'position: absolute; top: -9999px; left: -9999px; white-space: nowrap; visibility: hidden; font-weight: bold;';
            document.body.appendChild(measurer);
            
            // Находим самую длинную строку
            let longestText = '';
            cells.forEach(cell => {
                if (cell.textContent.length > longestText.length) {
                    longestText = cell.textContent;
                }
            });
            measurer.textContent = longestText;
            
            // Начинаем с крупного шрифта
            let size = 15;
            const minSize = 0.2;
            const step = 0.2;
            let attempts = 0;
            
            while (attempts < 500 && size > minSize) {
                measurer.style.fontSize = size + 'vh';
                
                // Измеряем реальную ширину текста
                const textWidth = measurer.offsetWidth;
                
                if (textWidth <= maxWidth) {
                    break;
                }
                
                size -= step;
                attempts++;
            }
            
            // Применяем найденный размер ко всем ячейкам
            cells.forEach(cell => {
                cell.style.fontSize = size + 'vh';
            });
            
            // Удаляем измеритель
            document.body.removeChild(measurer);
        }, 100);

        if (typeof saveState === 'function') saveState();
    }

    if (savedState && savedState.mode && savedState.mode !== 'menu') {
        mode = savedState.mode;
        modeValue = savedState.modeValue;
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