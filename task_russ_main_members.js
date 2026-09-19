// task_russ_main_members.js
console.log('=== task_russ_main_members.js v2.9 ===');

const SENTENCES_BASE = [
    "Зайчик1грызет2капусту0","Пришла2поздняя0осень0","Я1ночевал2на0озере0",
    "В0лесу0звери1готовятся2к0зиме0","Какие0красивые0птицы1",
    "Аня1и0Марина1рвут2ромашки0и0фиалки0","Медленно0гасла2заря1",
    "Ветер1сушит2грибы0","Начались2первые0заморозки1","Саша1решил2стать2врачом0",
    "Они1плавают2в0пруду0","В0воде0отражались2первые0звёзды1","Случай1на0озере0",
    "Миша1и0Глеб1бегают2на0полянке0","В0середине0дрожит2росинка1",
    "Корова1съела2траву0","Умолкнули2ночные0птицы1","Дождь1перестал2шуметь2",
    "Оно1заросло2высоким0камышом0","Осенью0охотник1вышел2к0заливу0",
    "Одуванчик1похож2на0солнышко0","Девочка1сняла2кожуру0с0апельсина0и0увидела2",
    "Впереди0них0шла2старушка1","Пастух1пасёт2стадо0","Кружатся2жёлтые0листья1",
    "Малыши1были2рады2гостям0и0подаркам0","Она1полетела2над0деревней0",
    "На0Жука0напали2овчарки1","На0улице0таяло2",
    "Однажды0коза1и0козел1забрались2в0огород0","На0скале0стоял2маленький0пингвинёнок1",
    "Бабушка1стирает2бельё0","Белеет2пушистый0шарик1","Каждый1хотел2стать2хозяином0Жука0",
    "Однажды0мы1сидели2на0дереве0","На0шарике0рожица1нарисована2",
    "Весело0смотрит2из0зеленого0мха0","Котёнок1широко0раскрыл2рот0и0жалобно0мяукал2",
    "В0Москве0жила2маленькая0девочка1","Мальчик1кинет2мячик0","Полетели2лёгкие0пушинки1",
    "Галка1стала2кидать2в0кувшин0камушки0","Он1испугался2и0залез2на0дерево0",
    "Скоро0глаза1у0котят0откроются2","У0кошки1шесть0котят0",
    "Птицы1спокойно0кормились2и0весело0разговаривали2","У0кошки0Мурки0родились2котята1",
    "Собака1сторожит2дом0","Наступила2золотая0осень1","Дети1начали2собирать2грибы0",
    "Мы1купались2в0реке0","В0саду0яблоки1налились2соком0","Какое0чистое0небо1",
    "Оля1и0Петя1рисуют2красками0и0карандашами0","Ярко0светило2солнце1",
    "Повар1варит2суп0","Зазвенели2голосистые0ручьи1","Кот1решил2поймать2мышку0",
    "Они1гуляли2по0парку0","В0траве0стрекочут2кузнечики1","Прогулка1в0лесу0",
    "Вова1и0Сережа1играют2на0площадке0","В0воздухе0кружились2снежинки1",
    "Маляр1красит2стену0","Зацвели2душистые0ландыши1","Туристы1хотели2развести2костёр0",
    "Оно1покрылось2зеленью0","Зимой0медведь1заснул2в0берлоге0","Ромашка1похожа2на0солнце0",
    "Папа1взял2молоток0и0прибил2полку0","На0горизонте0показался2пароход1",
    "Учитель1объясняет2урок0","Журчат2весёлые0ручейки1","Самолёт1начал2снижаться0",
    "Она1плыла2по0реке0","В0норе0лиса1вывела2детёнышей0","Тишина1в0осеннем0лесу0",
    "Катя1и0Настя1пекут2пироги0и0печенье0","Из0трубы0вился2дымок1"
];

function parseSentence(text) {
    const words = [];
    const regex = /([А-Яа-яЁё]+)([012])/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        words.push({ text: match[1], role: parseInt(match[2]) });
    }
    return words;
}

function buildSentenceHtml(words, states) {
    let html = '';
    words.forEach((word, idx) => {
        const state = states[idx];
        let style = '';
        if (state === 1) style = 'text-decoration: underline;';
        else if (state === 2) style = 'text-decoration: underline double;';
        html += '<span class="mm-sword" style="' + style + '">' + word.text + '</span>';
        if (idx < words.length - 1) {
            html += ' ';
        }
    });
    return html;
}

function fitText(element, startSize, minSize, step, unit) {
    let size = startSize;
    let attempts = 0;
    const maxAttempts = 500;
    const tolerance = 3;

    element.style.fontSize = size + unit;

    const fits = () => {
        return element.scrollWidth <= element.clientWidth + tolerance &&
               element.scrollHeight <= element.clientHeight + tolerance;
    };

    if (fits()) return size;

    while (attempts < maxAttempts && size > minSize) {
        size -= step;
        element.style.fontSize = size + unit;
        attempts++;
        if (fits()) break;
    }

    return size;
}

function fitSentenceWords(container, wordElements, startSize, minSize, step, unit) {
    let size = startSize;
    let attempts = 0;
    const maxAttempts = 500;
    const tolerance = 3;

    wordElements.forEach(w => { w.style.fontSize = size + unit; });

    const fits = () => {
        return container.scrollHeight <= container.clientHeight + tolerance;
    };

    if (fits()) return size;

    while (attempts < maxAttempts && size > minSize) {
        size -= step;
        wordElements.forEach(w => { w.style.fontSize = size + unit; });
        attempts++;
        if (fits()) break;
    }

    return size;
}

function fitTextHeight(element, startSize, minSize, step, unit) {
    let size = startSize;
    let attempts = 0;
    const maxAttempts = 1000;
    const tolerance = 5;

    element.style.fontSize = size + unit;
    void element.offsetHeight;

    const fits = () => {
        void element.offsetHeight;
        return element.scrollHeight <= element.clientHeight + tolerance;
    };

    if (fits()) return size;

    while (attempts < maxAttempts && size > minSize) {
        size -= step;
        element.style.fontSize = size + unit;
        attempts++;
        if (fits()) break;
    }

    return size;
}

window.startTest = function (container, onExit, savedState) {
    console.log('startTest вызван, savedState:', savedState ? 'есть' : 'нет');

    const styleEl = document.createElement('style');
    styleEl.textContent = [
        '.mm-game-area { display: flex; flex-direction: column; width: 100%; height: 100%; overflow: hidden; }',

        '.mm-question-area { flex: 3; display: flex; align-items: center; justify-content: center; padding: 5px 10px; box-sizing: border-box; min-height: 0; overflow: hidden; }',
        '.mm-question-text { font-weight: bold; color: #333; text-align: center; word-wrap: break-word; overflow-wrap: break-word; line-height: 1.1; max-width: 100%; }',

        '.mm-sentence-area { flex: 7; display: flex; align-items: center; justify-content: center; padding: 10px; flex-wrap: wrap; align-content: center; box-sizing: border-box; min-height: 0; overflow: hidden; }',
        '.mm-word { font-weight: bold; color: #333; margin: 3px 6px; cursor: pointer; padding: 3px 6px; border-radius: 5px; transition: all 0.2s; word-wrap: break-word; overflow-wrap: break-word; line-height: 1.2; }',
        '.mm-word:active { background: #e6e9ef; }',
        '.mm-word.subject { text-decoration: underline; }',
        '.mm-word.predicate { text-decoration: underline double; }',

        '.mm-hint-area { flex: 1; display: flex; align-items: center; justify-content: center; padding: 5px 10px; box-sizing: border-box; min-height: 0; overflow: hidden; }',
        '.mm-hint-text { color: #666; text-align: center; word-wrap: break-word; overflow-wrap: break-word; line-height: 1.1; max-width: 100%; }',

        '.mm-check-btn { flex: 2; background: #4a90e2; color: #fff; border: none; font-weight: bold; cursor: pointer; width: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; }',
        '.mm-check-btn:active { background: #3a7bc8; }',

        '.mm-correct-screen { display: flex; flex-direction: column; width: 100%; height: 100%; background: #2ecc71; overflow: hidden; }',
        '.mm-correct-content { flex: 1; display: block; padding: 20px; text-align: center; word-wrap: break-word; overflow-wrap: break-word; white-space: normal; color: white; font-weight: bold; line-height: 1.3; min-height: 0; overflow: hidden; }',
        '.mm-correct-content .mm-sword { color: white; }',

        '.mm-wrong-screen { display: flex; flex-direction: column; width: 100%; height: 100%; overflow: hidden; }',
        '.mm-wrong-top { flex: 5; display: block; padding: 15px; background: #e74c3c; color: white; font-weight: bold; text-align: center; word-wrap: break-word; overflow-wrap: break-word; white-space: normal; line-height: 1.3; box-sizing: border-box; min-height: 0; overflow: hidden; }',
        '.mm-wrong-top .mm-sword { color: white; }',
        '.mm-wrong-bottom { flex: 6; display: block; padding: 15px; background: #2ecc71; color: white; font-weight: bold; text-align: center; word-wrap: break-word; overflow-wrap: break-word; white-space: normal; line-height: 1.3; box-sizing: border-box; min-height: 0; overflow: hidden; }',
        '.mm-wrong-bottom .mm-sword { color: white; }',
        '.mm-next-btn { flex: 2; background: #4a90e2; color: #fff; border: none; font-weight: bold; cursor: pointer; width: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; }',
        '.mm-next-btn:active { background: #3a7bc8; }',

        // === ЭКРАН РЕЗУЛЬТАТОВ: одна колонка с прокруткой, без бейджей ===
        '.mm-results { display: flex; flex-direction: column; width: 100%; height: 100%; overflow-y: auto; }',
        '.mm-results-grid { display: flex; flex-direction: column; width: 100%; gap: 2px; padding: 4px; box-sizing: border-box; }',
        '.mm-result-cell { position: relative; display: block; padding: 8px 10px; box-sizing: border-box; word-wrap: break-word; overflow-wrap: break-word; white-space: normal; line-height: 1.3; }',
        '.mm-result-cell.correct { background: #2ecc71; color: white; }',
        '.mm-result-cell.wrong-user { background: #e74c3c; color: white; }',
        '.mm-result-cell.wrong-correct { background: #2ecc71; color: white; }',
        '.mm-result-cell.skip { background: #95a5a6; color: white; }',
        '.mm-result-sentence { display: block; text-align: center; }',
        '.mm-result-sentence .mm-sword { color: white; }'
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
    let wordStates = [];

    window.taskGetState = function () {
        return {
            questions: questions,
            currentIdx: currentIdx,
            results: results,
            wordStates: wordStates
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
        const allSentences = SENTENCES_BASE
            .map(text => ({ original: text, words: parseSentence(text) }))
            .filter(q => q.words.length > 0);
        const shuffled = allSentences.sort(() => Math.random() - 0.5);
        questions = shuffled.slice(0, 10);
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
        wordStates = new Array(q.words.length).fill(0);

        container.innerHTML =
            '<div class="mm-game-area">' +
                '<div class="mm-question-area"><div class="mm-question-text" id="mm-question-text">Выбери главные члены предложения</div></div>' +
                '<div class="mm-sentence-area" id="mm-sentence"></div>' +
                '<div class="mm-hint-area"><div class="mm-hint-text" id="mm-hint-text">Подлежащее — нажать один раз, сказуемое — два раза</div></div>' +
                '<button class="mm-check-btn" id="mm-check-btn">Проверить</button>' +
            '</div>';

        const sentenceDiv = document.getElementById('mm-sentence');
        q.words.forEach((word, idx) => {
            const wordEl = document.createElement('span');
            wordEl.className = 'mm-word';
            wordEl.textContent = word.text;
            wordEl.onclick = function () { handleWordClick(idx); };
            sentenceDiv.appendChild(wordEl);
        });

        document.getElementById('mm-check-btn').onclick = checkAnswer;

        setTimeout(() => {
            const questionTextEl = document.getElementById('mm-question-text');
            if (questionTextEl) fitText(questionTextEl, 15, 2, 0.3, 'vh');

            const sentenceArea = document.getElementById('mm-sentence');
            if (sentenceArea) {
                const wordEls = sentenceArea.querySelectorAll('.mm-word');
                if (wordEls.length > 0) {
                    fitSentenceWords(sentenceArea, wordEls, 6, 1.5, 0.2, 'vh');
                }
            }

            const hintTextEl = document.getElementById('mm-hint-text');
            if (hintTextEl) fitText(hintTextEl, 8, 1, 0.2, 'vh');

            const checkBtn = document.getElementById('mm-check-btn');
            if (checkBtn) fitText(checkBtn, 12, 2, 0.3, 'vh');
        }, 100);
    }

    function handleWordClick(wordIdx) {
        wordStates[wordIdx] = (wordStates[wordIdx] + 1) % 3;
        const wordEls = document.querySelectorAll('.mm-word');
        const wordEl = wordEls[wordIdx];
        wordEl.classList.remove('subject', 'predicate');
        if (wordStates[wordIdx] === 1) wordEl.classList.add('subject');
        else if (wordStates[wordIdx] === 2) wordEl.classList.add('predicate');
    }

    function checkAnswer() {
        const q = questions[currentIdx];
        let allCorrect = true;
        q.words.forEach((word, idx) => {
            if (wordStates[idx] !== word.role) allCorrect = false;
        });

        results.push({
            sentence: q.original,
            words: q.words,
            userStates: wordStates.slice(),
            isCorrect: allCorrect,
            skipped: false
        });

        if (typeof saveState === 'function') saveState();

        if (allCorrect) showCorrectScreen(q);
        else showWrongScreen(q);
    }

    function showCorrectScreen(q) {
        const correctStates = q.words.map(w => w.role);
        const sentenceHtml = buildSentenceHtml(q.words, correctStates);

        container.innerHTML =
            '<div class="mm-correct-screen">' +
                '<div class="mm-correct-content" id="mm-correct-content">' + sentenceHtml + '</div>' +
            '</div>';

        setTimeout(() => {
            const content = document.getElementById('mm-correct-content');
            if (content) fitTextHeight(content, 6, 2, 0.15, 'vh');
        }, 150);

        timeoutId = setTimeout(() => {
            currentIdx++;
            if (typeof saveState === 'function') saveState();
            showQuestion();
        }, 1500);
    }

    function showWrongScreen(q) {
        const wrongHtml = buildSentenceHtml(q.words, wordStates);
        const correctStates = q.words.map(w => w.role);
        const correctHtml = buildSentenceHtml(q.words, correctStates);

        container.innerHTML =
            '<div class="mm-wrong-screen">' +
                '<div class="mm-wrong-top" id="mm-wrong-top">' + wrongHtml + '</div>' +
                '<div class="mm-wrong-bottom" id="mm-wrong-bottom">' + correctHtml + '</div>' +
                '<button class="mm-next-btn" id="mm-next-btn">Дальше</button>' +
            '</div>';

        setTimeout(() => {
            const top = document.getElementById('mm-wrong-top');
            const bottom = document.getElementById('mm-wrong-bottom');
            const btn = document.getElementById('mm-next-btn');
            if (top) fitTextHeight(top, 6, 1.5, 0.15, 'vh');
            if (bottom) fitTextHeight(bottom, 6, 1.5, 0.15, 'vh');
            if (btn) fitText(btn, 12, 2, 0.3, 'vh');
        }, 150);

        document.getElementById('mm-next-btn').onclick = function () {
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
                sentence: q.original,
                words: q.words,
                userStates: null,
                isCorrect: false,
                skipped: true
            });
        }

        let html = '<div class="mm-results"><div class="mm-results-grid">';

        results.forEach(r => {
            if (r.skipped) {
                // Пропущено — серый фон, правильный ответ
                const sentenceHtml = buildSentenceHtml(r.words, r.words.map(w => w.role));
                html += '<div class="mm-result-cell skip">';
                html += '<div class="mm-result-sentence">' + sentenceHtml + '</div>';
                html += '</div>';
            } else if (r.isCorrect) {
                // Правильно — зелёный фон, одно предложение
                const sentenceHtml = buildSentenceHtml(r.words, r.words.map(w => w.role));
                html += '<div class="mm-result-cell correct">';
                html += '<div class="mm-result-sentence">' + sentenceHtml + '</div>';
                html += '</div>';
            } else {
                // Неправильно — два блока: красный (ответ пользователя) и зелёный (правильный)
                const userHtml = buildSentenceHtml(r.words, r.userStates);
                const correctHtml = buildSentenceHtml(r.words, r.words.map(w => w.role));
                html += '<div class="mm-result-cell wrong-user">';
                html += '<div class="mm-result-sentence">' + userHtml + '</div>';
                html += '</div>';
                html += '<div class="mm-result-cell wrong-correct">';
                html += '<div class="mm-result-sentence">' + correctHtml + '</div>';
                html += '</div>';
            }
        });

        html += '</div></div>';
        container.innerHTML = html;

        // Подбор шрифта для всех ячеек
        setTimeout(() => {
            const cells = document.querySelectorAll('.mm-result-cell');
            cells.forEach(cell => {
                const sentenceEl = cell.querySelector('.mm-result-sentence');
                if (sentenceEl) {
                    let size = 3;
                    const minSize = 1;
                    const step = 0.1;
                    let attempts = 0;
                    while (attempts < 200 && size > minSize) {
                        sentenceEl.style.fontSize = size + 'vh';
                        if (sentenceEl.scrollHeight <= cell.clientHeight - 5 && sentenceEl.scrollWidth <= cell.clientWidth - 5) break;
                        size -= step;
                        attempts++;
                    }
                }
            });
        }, 100);

        if (typeof saveState === 'function') saveState();
    }

    if (savedState && savedState.questions && savedState.questions.length > 0) {
        questions = savedState.questions || [];
        currentIdx = savedState.currentIdx || 0;
        results = savedState.results || [];
        wordStates = savedState.wordStates || [];
        if (currentIdx < questions.length) showQuestion();
        else showResults();
    } else {
        startTestLocal();
    }
};