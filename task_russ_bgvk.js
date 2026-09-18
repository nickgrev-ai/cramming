// task_russ_bgvk.js
console.log('=== task_russ_bgvk.js v3.16 ===');

// === БАЗА СЛОВ ===
const RUSS_BASE = [
    "гр[о~а~грОзы]за", "гр[а~о~грач]чи", "н[о~а~нОс]сы", "тр[а~о~трАвы]ва", "р[е~и~рЕки]ка", "л[е~и~лЕщ]щи", "л[и~е~лИца]цо", "с[а~о~сАд]ды", "в[о~а~вОлны]лна", "хв[о~а~хвОст]сты",
    "р[о~а~рОг]га", "вр[а~о~врАч]чи", "к[о~а~кОт]ты", "гл[а~о~глАз]зной", "п[я~е~и~пЯть]так", "б[е~и~я~бЕды]да", "дл[и~е~я~длИнный]на", "м[я~е~и~мЯсо]сной", "л[и~е~лИст]ства",
    "т[е~и~тЁмный]мнота", "н[о~а~нОги]га", "с[е~и~сЁстры]стра", "кр[и~е~крИк]чать", "тр[о~а~трОпы]па", "стр[и~е~стрИж]жи", "пл[е~и~я~плЕчи]чо", "сп[и~е~спИны]на", "бр[е~и~брЁвна]вно", "к[о~а~кОт]тёнок",
    "л[е~и~я~лЕс]сок", "зв[е~и~я~звЕрь]рёк", "ст[о~а~стОл]ловая", "р[о~а~рОг]гатый", "д[о~а~дОждь]ждливый", "цв[е~и~я~цвЕт]тёт", "скр[и~е~я~скрИп]пит", "к[о~а~кОзы]за", "[о~а~Овцы]вца", "гл[а~о~глАз]за",
    "ч[а~я~чАс]сы", "д[о~а~дОждь]жди", "хл[е~и~хлЕб]ба", "ст[е~и~стЕны]на", "бл[и~е~блИн]ны", "острая п[и~е~пИлка]ла", "гр[и~е~грИб]бы", "с[о~а~сОсны]сна", "гн[е~и~гнЁзда]здо", "в[е~и~вЕрх]рхушка", "ч[е~и~чЕрвь]рвивый",
    "кр[и~е~я~крИво]вой", "в[и~е~вИзг]зжит", "зв[о~а~звОн]нит", "л[и~е~лИния]нейка", "в[е~и~я~вЕлит]лел", "б[е~и~бЕг]жит", "г[о~а~гОры]ра", "ск[а~о~скАлы]ла", "з[е~и~зЁрна]рно", "вр[е~и~врЕд]дитель",
    "л[е~и~лЕпит]пил", "пл[я~е~и~плЯска]сал", "др[о~а~дрОжь]жал", "ст[о~а~стОн]нал", "н[о~а~нОчь]чной", "т[е~и~тЁплый]пло", "с[е~и~сЁстры]стра", "н[о~а~нОры]ра", "тр[а~о~трАвы]ва", "к[о~а~кОнь]нюшня",
    "д[а~о~дАль]лекий", "зап[я~е~и~пЯтна]тнать", "л[е~и~лЁт]тать", "гл[я~е~и~взглЯд]деть", "м[о~а~мОре]рской", "стр[а~о~стрАны]на", "св[и~е~я~свИст]стулька", "ж[а~о~я~жАль]леть", "ст[а~о~стАль]льной", "п[я~е~и~пЯть]так",
    "п[я~е~и~пЯтна]тно", "пол[е~и~полЁт]тел", "пт[е~и~я~птЕнчик]нец", "к[о~а~кОврик]вёр", "лош[о~а~я~лОшадь]дь", "зв[е~и~звЁзды]зда", "к[о~а~кОрм]рмил", "к[о~а~кОт]тёнка", "в[а~о~вАрит]рили", "в[а~о~вАрит]ренье",
    "з[и~е~зИмы]ма", "ч[и~е~чИсто]стота", "к[о~а~кОрм]рмил", "г[о~а~гОлубь]лубей", "цв[е~и~цвЕт]тной", "вр[е~и~врЕд]дители", "д[е~и~дЕрево]ревьев", "тр[е~и~трЕск]скучий", "бр[о~а~брОсить]сок", "д[о~а~дОчь]чурка",
    "з[и~е~я~зИмы]мовка", "зм[е~и~я~змЕй]я", "кр[о~а~крОвь]винка", "ст[о~а~стОл]ляр", "дв[о~а~двОр]рняжка", "с[а~о~сАд]довник", "х[о~а~хОдит]дить", "х[и~е~хИтрый]трец", "уч[е~и~учЁба]ник", "учит[е~и~учИть]ль",
    "х[о~а~ЗАПОМНИТЬ]рошо", "хор[о~а~хорОший]шо", "кр[а~о~крАсота]сивый", "р[е~и~рЕки]ка", "оз[е~и~озЁра]ро", "п[о~а~пОле]ля", "х[о~а~хОлм]лмы", "р[е~и~рЕки]чной", "см[о~а~смОтрит]трел",
    "ст[о~а~стОроны]рона", "стор[о~а~сторОнка]на", "г[о~а~гОлос]лоса", "гол[о~а~отголОсок]са", "з[о~а~зОлото]лотой", "зол[о~а~позолОта]той", "к[о~а~кОрень]решок", "кор[е~и~корЕнья]шок", "г[о~а~гОловы]лова", "гол[о~а~голОвка]ва",
    "б[о~а~бОроды]рода", "бор[о~а~борОдка]да", "кр[и~е~я~крИк]чал", "др[о~а~дрОжь]жал", "тр[е~и~я~трЕск]щал", "п[и~е~я~пИск]щал", "ст[а~о~стАрый]рик", "з[е~и~зЕлень]ленела", "сосновые д[е~и~дЕрево]ревья",
    "зел[е~и~зелЁный]нела", "б[е~и~бЕг]жал", "б[о~а~бОй]ец", "сн[е~и~я~снЕг]говик", "т[я~е~и~тЯга]гач", "х[о~а~хОлм]лмы", "ч[и~е~чИж]жи", "др[о~а~дрОзд]зды", "кл[е~и~клЁст]сты", "н[о~а~нОж]жи",
    "эт[а~о~этАж]жи", "стр[е~и~стрЕлы]ла", "п[е~и~пЕрья]ро", "пр[я~е~и~прЯмо]мой", "т[я~е~и~тЯжесть]желый", "гл[о~а~глОтка]тать", "кл[е~и~я~клЁв]вать", "кр[а~о~крАй]я", "р[я~е~и~рЯд]ды", "ств[о~а~ствОл]лы",
    "к[о~а~кОт]ты", "в[о~а~вОрон]рона", "д[о~а~дОждь]жди", "св[и~е~свИст]сток", "л[и~е~лИст]сты", "к[о~а~кОльца]льцо", "м[е~и~мЕх]ха", "пл[е~и~плЕчи]чо", "т[е~и~ЗАПОМНИТЬ]традь", "уч[е~и~учЁба]ник",
    "с[о~а~сОль]лонка", "р[а~о~рАд]ды подарку", "острая п[и~е~пИлы]ла", "вкусная сл[и~е~слИвы]ва", "важные сл[о~а~слОво]ва", "гр[и~е~грИб]бной суп", "гр[е~и~грЕбля]бной канал", "круглые м[я~е~и~мЯч]чи",
    "хорошо в л[е~и~лЕс]су", "п[о~а~пОй]ют чижи", "поют ч[и~е~чИж]жи", "г[о~а~гОсть]стил у друга", "т[е~и~тЕнь]нистый парк", "под з[е~и~я~зЕмли]млёй", "в к[о~а~кОрм]рмушке", "в с[о~а~сОль]лонку",
    "из к[о~а~кОнь]нюшни", "на л[е~и~лЕс]сной поляне", "на лесной п[о~а~пОле]ляне", "ж[и~е~жИть]вёт лесник", "живёт л[е~и~лЕс]сник", "вд[а~о~дАль]ли виднелись", "вдали в[и~е~вИд]днелись", "в[е~и~вЕрх]рхушки тополей",
    "верхушки т[о~а~тОполь]полей", "х[о~а~хОлод]лодною порою", "Во дв[о~а~двОр]ре кошка", "кошка [и~е~Игры]грала", "на ст[о~а~стОл]ле", "ст[о~а~стОй]яла банка", "банка с в[а~о~вАрит]реньем", "пришла з[и~е~зИмы]ма",
    "тр[е~и~трЕск]щат морозы", "трещат м[о~а~ЗАПОМНИТЬ]розы", "белым к[о~а~кОврик]вром", "ст[о~а~стОрож]рожил дом", "стор[о~а~сторОжка]жил дом", "св[и~е~свИст]стит иволга", "лесные тр[о~а~трОпы]пинки", "болото зат[я~е~и~тЯнет]нуло ряской",
    "м[о~а~мОре]рская волна", "морская в[о~а~вОлны]лна", "з[е~и~зЕлень]лёная трава", "зелёная тр[а~о~трАвы]ва", "в[о~а~вОздух]здушные шары", "воздушные ш[а~о~шАр]ры", "ст[а~о~стАль]льная линейка", "стальная л[и~е~лИния]нейка"
];

// === ПАРСЕР КОМПАКТНОГО ФОРМАТА ===
function parseWordEntry(entry) {
    const match = entry.match(/^([^\[]*)\[([^\]]+)\](.*)$/);
    if (!match) return null;
    const prefix = match[1];
    const suffix = match[3];
    const parts = match[2].split('~');
    if (parts.length < 2) return null;
    const correct = parts[0];
    const check = parts[parts.length - 1];
    const options = parts.slice(0, -1);
    return {
        word: prefix + '_' + suffix,
        options: options,
        correct: correct,
        check: check
    };
}

// === ПОСТРОЕНИЕ СЛОВА С ЦВЕТНОЙ БУКВОЙ ===
function buildWordHtml(word, letter, color) {
    const idx = word.indexOf('_');
    if (idx === -1) return word;
    return word.substring(0, idx) + '<span style="color:' + color + '">' + letter + '</span>' + word.substring(idx + 1);
}

// === ПОСТРОЕНИЕ СЛОВА С ЗАЧЁРКИВАНИЕМ НЕВЕРНОЙ И ВЕРНОЙ БУКВОЙ ===
function buildWordHtmlWithCorrection(word, wrongLetter, correctLetter) {
    const idx = word.indexOf('_');
    if (idx === -1) return word;
    const before = word.substring(0, idx);
    const after = word.substring(idx + 1);
    return before +
        '<span style="text-decoration:line-through;color:#e74c3c">' + wrongLetter + '</span>' +
        '<span style="color:#2ecc71">' + correctLetter + '</span>' +
        after;
}

window.startTest = function (container, onExit, savedState) {
    console.log('startTest вызван, savedState:', savedState ? 'есть' : 'нет');

    const styleEl = document.createElement('style');
    styleEl.textContent = [
        '.rb-progress { height: calc(100vh / 13 * 0.5); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }',
        '.rb-progress-text { font-size: calc(100vh / 13 * 0.3); color: #666; }',
        '.rb-word { height: calc(100vh / 13 * 2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }',
        '.rb-word-text { font-weight: bold; color: #333; text-align: center; padding: 0 10px; word-wrap: break-word; overflow-wrap: break-word; line-height: 1.2; }',
        '.rb-options { flex: 1; display: flex; flex-direction: column; width: 100%; min-height: 0; }',
        '.rb-opt { flex: 1; background: #4a90e2; color: #fff; border: none; border-bottom: 1px solid rgba(255,255,255,0.3); font-size: calc(100vh / 13 * 1.5); font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 5px; word-wrap: break-word; overflow-wrap: break-word; line-height: 1.2; text-align: center; }',
        '.rb-opt:active { background: #3a7bc8; }',
        '.rb-opt.correct { background: #2ecc71; }',
        '.rb-opt.wrong { background: #e74c3c; }',
        '.rb-opt:disabled { cursor: default; }',
        '.rb-opt:last-child { border-bottom: none; }',
        '.rb-results { display: flex; flex-direction: column; width: 100%; height: 100%; }',
        '.rb-results-header { height: calc(100vh / 13 * 2); display: flex; flex-direction: column; align-items: center; justify-content: center; background: #4a90e2; color: #fff; flex-shrink: 0; }',
        '.rb-results-title { font-size: calc(100vh / 13 * 0.9); font-weight: bold; }',
        '.rb-results-summary { font-size: calc(100vh / 13 * 0.6); margin-top: calc(100vh / 13 * 0.2); }',
        '.rb-results-list { flex: 1; overflow-y: auto; }',
        '.rb-result-row { display: flex; align-items: center; height: calc(100vh / 13); border-bottom: 1px solid #e0e0e0; padding: 0 15px; font-size: calc(100vh / 13 * 0.55); line-height: 1.3; }',
        '.rb-result-row:last-child { border-bottom: none; }',
        '.rb-result-row.ok { background: #e8f8f0; }',
        '.rb-result-row.fail { background: #fdecea; }',
        '.rb-result-row.skip { background: #f5f5f5; color: #888; }',
        '.rb-result-mark { width: calc(100vh / 13 * 0.8); font-weight: bold; font-size: calc(100vh / 13 * 0.7); flex-shrink: 0; }',
        '.rb-result-word { flex: 1; font-weight: 500; word-wrap: break-word; overflow-wrap: break-word; min-width: 0; }',
        '.rb-result-check { color: #666; font-size: calc(100vh / 13 * 0.45); margin-left: 10px; white-space: nowrap; flex-shrink: 0; }'
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

    function buildQuestions() {
        const parsed = RUSS_BASE.map(parseWordEntry).filter(e => e !== null);
        const shuffled = parsed.sort(() => Math.random() - 0.5);
        questions = shuffled.slice(0, 10).map(q => ({...q}));
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

        const fullWords = q.options.map(opt => {
            return {
                text: q.word.replace('_', opt),
                isCorrect: (opt === q.correct)
            };
        });

        fullWords.sort((a, b) => a.text.localeCompare(b.text, 'ru'));

        container.innerHTML =
            '<div class="rb-progress"><div class="rb-progress-text">Вопрос ' + (currentIdx + 1) + ' из ' + questions.length + '</div></div>' +
            '<div class="rb-word"><div class="rb-word-text" id="rb-word-text">Выберите правильное написание</div></div>' +
            '<div class="rb-options" id="opts"></div>';

        // Подбор шрифта для заголовка
        const wordTextEl = document.getElementById('rb-word-text');
        const wordContainer = wordTextEl.parentElement;
        
        let fontSize = 2.5;
        wordTextEl.style.fontSize = 'calc(100vh / 13 * ' + fontSize + ')';
        
        const maxAttempts = 100;
        let attempts = 0;
        while (wordTextEl.scrollHeight > wordContainer.clientHeight - 10 && fontSize > 0.5 && attempts < maxAttempts) {
            fontSize -= 0.05;
            wordTextEl.style.fontSize = 'calc(100vh / 13 * ' + fontSize + ')';
            attempts++;
        }

        const optsDiv = document.getElementById('opts');
        fullWords.forEach(function (item) {
            const btn = document.createElement('button');
            btn.className = 'rb-opt';
            btn.textContent = item.text;
            btn.onclick = function () { handleAnswer(item.text, btn, q, item.isCorrect); };
            optsDiv.appendChild(btn);
        });

        // === ПОДБОР ШРИФТА ДЛЯ КНОПОК ===
        // Разрешаем перенос строк, поэтому проверяем только высоту
        setTimeout(() => {
            const buttons = document.querySelectorAll('.rb-opt');
            if (buttons.length === 0) return;
            
            let btnFontSize = 1.5; // начальный размер (совпадает с CSS)
            const minFontSize = 0.4;
            const maxAttempts = 300;
            let attempts = 0;
            
            while (btnFontSize > minFontSize && attempts < maxAttempts) {
                let allFit = true;
                
                buttons.forEach(btn => {
                    btn.style.fontSize = 'calc(100vh / 13 * ' + btnFontSize + ')';
                    // Проверяем только высоту — ширина с переносом всегда влезет
                    if (btn.scrollHeight > btn.clientHeight + 2) {
                        allFit = false;
                    }
                });
                
                if (allFit) break;
                
                btnFontSize -= 0.05;
                attempts++;
            }
        }, 50);
    }

    function handleAnswer(selectedText, btn, q, isCorrect) {
        const buttons = document.querySelectorAll('.rb-opt');
        buttons.forEach(b => { b.disabled = true; });

        const blankIndex = q.word.indexOf('_');
        const selectedLetter = selectedText[blankIndex];

        results.push({
            word: q.word,
            options: q.options,
            correct: q.correct,
            check: q.check,
            userAnswer: selectedLetter,
            isCorrect: isCorrect,
            skipped: false
        });

        if (isCorrect) {
            btn.classList.add('correct');
            currentIdx++;
            if (typeof saveState === 'function') saveState();
            timeoutId = setTimeout(showQuestion, 600);
        } else {
            btn.classList.add('wrong');
            if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
            setTimeout(() => showFeedback(q, selectedText), 300);
        }
    }

    function showFeedback(q, wrongWord) {
        if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }

        const correctWord = q.word.replace('_', q.correct);
        
        console.log('showFeedback вызван:', wrongWord, '/', correctWord);

        container.innerHTML =
            '<div style="display: flex; flex-direction: column; width: 100%; height: 100%;">' +
                '<div style="height: calc(100vh / 13 * 0.5); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">' +
                    '<span style="font-size: calc(100vh / 13 * 0.3); color: #666;">Вопрос ' + (currentIdx + 1) + ' из ' + questions.length + '</span>' +
                '</div>' +
                '<div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 0 20px; min-height: 0;">' +
                    '<div id="fb-wrong" style="font-weight: bold; color: #e74c3c; text-align: center; font-size: calc(100vh / 13 * 1.5);">' + wrongWord + '</div>' +
                    '<div id="fb-correct" style="font-weight: bold; color: #2ecc71; text-align: center; font-size: calc(100vh / 13 * 1.5);">' + correctWord + '</div>' +
                    '<div id="fb-check" style="font-weight: bold; color: #666; text-align: center; font-size: calc(100vh / 13 * 1);">(' + q.check + ')</div>' +
                '</div>' +
                '<button id="continue-btn" style="height: calc(100vh / 13 * 2); background: #4a90e2; color: #fff; border: none; font-weight: bold; font-size: calc(100vh / 13 * 1); cursor: pointer; width: 100%; flex-shrink: 0;">Продолжить</button>' +
            '</div>';

        document.getElementById('continue-btn').onclick = function () {
            currentIdx++;
            if (typeof saveState === 'function') saveState();
            showQuestion();
        };
    }

    function showResults() {
        if (timeoutId) clearTimeout(timeoutId);

        for (let i = results.length; i < questions.length; i++) {
            const q = questions[i];
            results.push({
                word: q.word,
                options: q.options,
                correct: q.correct,
                check: q.check,
                userAnswer: null,
                isCorrect: false,
                skipped: true
            });
        }

        const correctCount = results.filter(r => r.isCorrect).length;
        const totalCount = results.length;

        let html = '<div class="rb-results">';
        html += '<div class="rb-results-header">';
        html += '<div class="rb-results-title">Результаты</div>';
        html += '<div class="rb-results-summary">Правильно: ' + correctCount + ' из ' + totalCount + '</div>';
        html += '</div>';
        html += '<div class="rb-results-list">';
        results.forEach(r => {
            let rowClass = 'rb-result-row';
            let mark = '';
            let wordHtml = '';
            let checkHtml = '';
            
            if (r.skipped) {
                rowClass += ' skip';
                mark = '—';
                wordHtml = buildWordHtml(r.word, r.correct, '#2ecc71');
                checkHtml = '<span class="rb-result-check">(' + r.check + ')</span>';
            } else if (r.isCorrect) {
                rowClass += ' ok';
                mark = '✓';
                wordHtml = buildWordHtml(r.word, r.correct, '#2ecc71');
                checkHtml = '';
            } else {
                rowClass += ' fail';
                mark = '✗';
                wordHtml = buildWordHtmlWithCorrection(r.word, r.userAnswer, r.correct);
                checkHtml = '<span class="rb-result-check">(' + r.check + ')</span>';
            }
            
            html += '<div class="' + rowClass + '">';
            html += '<div class="rb-result-mark">' + mark + '</div>';
            html += '<div class="rb-result-word">' + wordHtml + '</div>';
            html += checkHtml;
            html += '</div>';
        });
        html += '</div>';
        html += '</div>';
        container.innerHTML = html;

        // === ПОДБОР ШРИФТА ДЛЯ СЛОВ В РЕЗУЛЬТАТАХ ===
        setTimeout(() => {
            const rows = document.querySelectorAll('.rb-result-row');
            const listEl = document.querySelector('.rb-results-list');
            if (!listEl || rows.length === 0) return;
            
            const containerWidth = listEl.clientWidth - 30;
            
            let fontSize = 0.55;
            const minFontSize = 0.3;
            
            while (fontSize > minFontSize) {
                let allFit = true;
                
                rows.forEach(row => {
                    const wordEl = row.querySelector('.rb-result-word');
                    if (wordEl && wordEl.scrollWidth > containerWidth) {
                        allFit = false;
                    }
                });
                
                if (allFit) break;
                
                fontSize -= 0.02;
                rows.forEach(row => {
                    row.style.fontSize = 'calc(100vh / 13 * ' + fontSize + ')';
                });
            }
        }, 50);

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