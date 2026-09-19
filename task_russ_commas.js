// task_russ_commas.js
console.log('=== task_russ_commas.js v1.2 ===');

const COMMAS_BASE = [
    "Волчишка вылез, осмотрелся, походил, понюхал, сел, завыл.",
    "На поляне высыхает трава, листья, хвоя, мох.",
    "Частые капли дождя повисали на траве, на кустах, на деревьях.",
    "Вода настигала его, сбивала с крыш, с мокрых брёвен.",
    "С приходом зимы многие птицы покидают наши края.",
    "В сентябре улетают кулики, кряквы, чирики.",
    "Следом за ними тянутся чайки, гуси, лебеди, журавли.",
    "Вода пригнула книзу языки пламени.",
    "Огонь шипел, корчился, прятался в густых клубах дыма.",
    "Сколько рек, речек, речушек, ручьев в огромной, прекрасной нашей стране.",
    "Сколько озёр, прудов, водохранилищ.",
    "То-то раздолье рыболовам!",
    "В реках водятся жирные плоские лещи, золотые язи.",
    "В горных реках водятся форели.",
    "Мы клали их в свои следы, в глубокие ямы, налитые водой.",
    "Только осенью можно оценить красоту ясеня, осины, рябины и клена.",
    "Королевой осеннего леса становится осина.",
    "Летом на ее ствол, листья, ветви мы не обращаем внимания.",
    "Листья осины желтые, малиновые, пурпурные.",
    "Хорошо смотреть на осенние деревья при закате.",
    "Каждую весну возвращаются из теплых краев на родину журавли, дикие гуси, грачи, скворцы, жаворонки.",
    "Они направляются в родные леса, рощи и сады.",
    "Птицы летят на озера, болота.",
    "Они летят туда, где родились, выросли.",
    "Там они построят гнезда, выведут птенцов.",
    "Снежными коврами покрывались и деревья, и кусты, и дороги.",
    "Филин часто и гулко ухал.",
    "Целую неделю движется караван по пескам, а поесть и напиться негде.",
    "Журавли высоко летают, но реки не покидают.",
    "Лес весь лучится, сверкает и светится.",
    "Мы увидели на озере окуней.",
    "Привязали лески к кустам багульника, а сами сидели на поваленных соснах.",
    "Куст багульника начинал рваться и шуметь.",
    "Мы лениво подымались, тащили леску и выволакивали на берег жирных окуней.",
    "Окуни били по воде хвостами, плескались, но уйти никуда не могли.",
    "На лесной поляне росли земляника, черника, брусника и костяника.",
    "Утром туман стелился по лугам, по реке, по низким местам.",
    "Птицы пели, щебетали, перекликались в густых ветвях.",
    "Солнце пробивалось сквозь тучи, сквозь листву, сквозь утреннюю дымку.",
    "Мы шли тихо, осторожно, стараясь не шуметь.",
    "Осенью улетают на юг ласточки, стрижи, дрозды и жаворонки.",
    "В саду поспели яблоки, груши, сливы и вишни.",
    "Ветер гудел в трубах, стучал по крыше, качал старые деревья.",
    "Река блестела, переливалась, играла на солнце.",
    "Тропинка вилась между кустов, между деревьями, между высоких трав.",
    "Мы катались на санках, на коньках, на лыжах.",
    "В лесу водятся зайцы, лисы, волки и медведи.",
    "На берегу росли ивы, осины, берёзы и ольха.",
    "Зимой снег укрыл поля, дороги, крыши и заборы.",
    "Мороз рисовал узоры на стёклах, на ветках, на проводах.",
    "В избушке пахло дровами, хвоей и сушёными грибами.",
    "Весной прилетели грачи, скворцы, зяблики и пеночки.",
    "Почки на деревьях набухли, лопнули, и появились первые листочки.",
    "Ручьи бежали по оврагам, по канавам, по дорогам.",
    "Мы слушали, как журчит вода, как поют птицы, как шумит лес.",
    "На лугу цвели ромашки, колокольчики, васильки и лютики.",
    "Бабочки порхали над цветами, над травой, над кустами шиповника.",
    "На крючок попались окуни, плотва, ерши и пескари.",
    "В горах реки быстрые, холодные и прозрачные.",
    "В них водятся форель, хариус и голец."
];

// === ПАРСЕР ПРЕДЛОЖЕНИЯ ===
function parseSentence(text) {
    const words = [];
    const tokens = text.split(/\s+/);
    
    tokens.forEach(token => {
        const hasComma = token.endsWith(',');
        const cleanWord = token.replace(/[,\.!\?;:]+$/, '');
        
        if (cleanWord.length > 0) {
            words.push({
                text: cleanWord,
                hasComma: hasComma,
                userComma: false
            });
        }
    });
    
    return words;
}

// === ПОСТРОЕНИЕ HTML ПРЕДЛОЖЕНИЯ ===
function buildSentenceHtml(words, clickable) {
    let html = '';
    words.forEach((word, idx) => {
        const comma = word.userComma ? ',' : '';
        if (clickable) {
            html += '<span class="mm-word-clickable" data-idx="' + idx + '">' + word.text + '</span>';
        } else {
            html += '<span>' + word.text + '</span>';
        }
        html += comma;
        if (idx < words.length - 1) {
            html += ' ';
        }
    });
    html += '.';
    return html;
}

// === ПОДБОР ШРИФТА ТОЛЬКО ПО ВЫСОТЕ ===
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

// === ПОДБОР ШРИФТА ПО ШИРИНЕ И ВЫСОТЕ ===
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

window.startTest = function (container, onExit, savedState) {
    console.log('startTest вызван, savedState:', savedState ? 'есть' : 'нет');

    const styleEl = document.createElement('style');
    styleEl.textContent = [
        '.mm-game-area { display: flex; flex-direction: column; width: 100%; height: 100%; overflow: hidden; }',

        '.mm-question-area { flex: 2; display: flex; align-items: center; justify-content: center; padding: 5px 10px; box-sizing: border-box; min-height: 0; overflow: hidden; }',
        '.mm-question-text { font-weight: bold; color: #333; text-align: center; word-wrap: break-word; overflow-wrap: break-word; line-height: 1.1; max-width: 100%; }',

        '.mm-sentence-area { flex: 9; display: flex; align-items: center; justify-content: center; padding: 10px; flex-wrap: wrap; align-content: center; box-sizing: border-box; min-height: 0; overflow: hidden; }',
        '.mm-sentence-display { display: block; text-align: center; word-wrap: break-word; overflow-wrap: break-word; white-space: normal; line-height: 1.3; font-weight: bold; color: #333; }',
        '.mm-word-clickable { cursor: pointer; padding: 2px 4px; border-radius: 3px; transition: background 0.2s; }',
        '.mm-word-clickable:active { background: #e6e9ef; }',

        '.mm-check-btn { flex: 2; background: #4a90e2; color: #fff; border: none; font-weight: bold; cursor: pointer; width: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; }',
        '.mm-check-btn:active { background: #3a7bc8; }',

        '.mm-correct-screen { display: flex; flex-direction: column; width: 100%; height: 100%; background: #2ecc71; overflow: hidden; }',
        '.mm-correct-content { flex: 1; display: block; padding: 20px; text-align: center; word-wrap: break-word; overflow-wrap: break-word; white-space: normal; color: white; font-weight: bold; line-height: 1.3; min-height: 0; overflow: hidden; }',

        '.mm-wrong-screen { display: flex; flex-direction: column; width: 100%; height: 100%; overflow: hidden; }',
        '.mm-wrong-top { flex: 5; display: block; padding: 15px; background: #e74c3c; color: white; font-weight: bold; text-align: center; word-wrap: break-word; overflow-wrap: break-word; white-space: normal; line-height: 1.3; box-sizing: border-box; min-height: 0; overflow: hidden; }',
        '.mm-wrong-bottom { flex: 6; display: block; padding: 15px; background: #2ecc71; color: white; font-weight: bold; text-align: center; word-wrap: break-word; overflow-wrap: break-word; white-space: normal; line-height: 1.3; box-sizing: border-box; min-height: 0; overflow: hidden; }',
        '.mm-next-btn { flex: 2; background: #4a90e2; color: #fff; border: none; font-weight: bold; cursor: pointer; width: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; }',
        '.mm-next-btn:active { background: #3a7bc8; }',

        '.mm-results { display: flex; flex-direction: column; width: 100%; height: 100%; overflow-y: auto; }',
        '.mm-results-grid { display: flex; flex-direction: column; width: 100%; gap: 2px; padding: 4px; box-sizing: border-box; }',
        '.mm-result-cell { position: relative; display: block; padding: 8px 10px; box-sizing: border-box; word-wrap: break-word; overflow-wrap: break-word; white-space: normal; line-height: 1.3; }',
        '.mm-result-cell.correct { background: #2ecc71; color: white; }',
        '.mm-result-cell.wrong-user { background: #e74c3c; color: white; }',
        '.mm-result-cell.wrong-correct { background: #2ecc71; color: white; }',
        '.mm-result-cell.skip { background: #95a5a6; color: white; }',
        '.mm-result-sentence { display: block; text-align: center; }'
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
        const allSentences = COMMAS_BASE
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
        q.words.forEach(w => { w.userComma = false; });

        container.innerHTML =
            '<div class="mm-game-area">' +
                '<div class="mm-question-area"><div class="mm-question-text" id="mm-question-text">Нажми на слово, после которого нужна запятая</div></div>' +
                '<div class="mm-sentence-area"><div class="mm-sentence-display" id="mm-sentence-display"></div></div>' +
                '<button class="mm-check-btn" id="mm-check-btn">Проверить</button>' +
            '</div>';

        renderSentence(q);

        document.getElementById('mm-check-btn').onclick = checkAnswer;

        setTimeout(() => {
            const questionTextEl = document.getElementById('mm-question-text');
            if (questionTextEl) fitText(questionTextEl, 10, 2, 0.3, 'vh');

            const sentenceDisplay = document.getElementById('mm-sentence-display');
            if (sentenceDisplay) fitTextHeight(sentenceDisplay, 6, 2, 0.15, 'vh');

            const checkBtn = document.getElementById('mm-check-btn');
            if (checkBtn) fitText(checkBtn, 10, 2, 0.3, 'vh');
        }, 100);
    }

    function renderSentence(q) {
        const sentenceDisplay = document.getElementById('mm-sentence-display');
        
        if (sentenceDisplay) {
            sentenceDisplay.innerHTML = buildSentenceHtml(q.words, true);
            
            const clickableWords = sentenceDisplay.querySelectorAll('.mm-word-clickable');
            clickableWords.forEach(el => {
                el.onclick = function() {
                    const idx = parseInt(this.getAttribute('data-idx'));
                    q.words[idx].userComma = !q.words[idx].userComma;
                    renderSentence(q);
                };
            });
        }
    }

    function checkAnswer() {
        const q = questions[currentIdx];
        let allCorrect = true;

        q.words.forEach((word, idx) => {
            if (word.userComma !== word.hasComma) {
                allCorrect = false;
            }
        });

        results.push({
            sentence: q.original,
            words: q.words.map(w => ({...w})),
            isCorrect: allCorrect,
            skipped: false
        });

        if (typeof saveState === 'function') saveState();

        if (allCorrect) showCorrectScreen(q);
        else showWrongScreen(q);
    }

    function showCorrectScreen(q) {
        const sentenceHtml = buildSentenceHtml(q.words.map(w => ({...w, userComma: w.hasComma})), false);

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
        const userHtml = buildSentenceHtml(q.words, false);
        const correctWords = q.words.map(w => ({...w, userComma: w.hasComma}));
        const correctHtml = buildSentenceHtml(correctWords, false);

        container.innerHTML =
            '<div class="mm-wrong-screen">' +
                '<div class="mm-wrong-top" id="mm-wrong-top">' + userHtml + '</div>' +
                '<div class="mm-wrong-bottom" id="mm-wrong-bottom">' + correctHtml + '</div>' +
                '<button class="mm-next-btn" id="mm-next-btn">Дальше</button>' +
            '</div>';

        setTimeout(() => {
            const top = document.getElementById('mm-wrong-top');
            const bottom = document.getElementById('mm-wrong-bottom');
            const btn = document.getElementById('mm-next-btn');
            if (top) fitTextHeight(top, 6, 1.5, 0.15, 'vh');
            if (bottom) fitTextHeight(bottom, 6, 1.5, 0.15, 'vh');
            if (btn) fitText(btn, 10, 2, 0.3, 'vh');
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
                words: q.words.map(w => ({...w})),
                isCorrect: false,
                skipped: true
            });
        }

        let html = '<div class="mm-results"><div class="mm-results-grid">';

        results.forEach(r => {
            if (r.skipped) {
                const sentenceHtml = buildSentenceHtml(r.words.map(w => ({...w, userComma: w.hasComma})), false);
                html += '<div class="mm-result-cell skip">';
                html += '<div class="mm-result-sentence">' + sentenceHtml + '</div>';
                html += '</div>';
            } else if (r.isCorrect) {
                const sentenceHtml = buildSentenceHtml(r.words.map(w => ({...w, userComma: w.hasComma})), false);
                html += '<div class="mm-result-cell correct">';
                html += '<div class="mm-result-sentence">' + sentenceHtml + '</div>';
                html += '</div>';
            } else {
                const userHtml = buildSentenceHtml(r.words, false);
                const correctHtml = buildSentenceHtml(r.words.map(w => ({...w, userComma: w.hasComma})), false);
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
        if (currentIdx < questions.length) showQuestion();
        else showResults();
    } else {
        startTestLocal();
    }
};