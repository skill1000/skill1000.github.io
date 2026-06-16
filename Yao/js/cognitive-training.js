/**
 * 脑机接口认知康复训练模块
 * 5大训练子模块：记忆力、注意力、反应速度、空间感知、语言能力
 */

let trainingCharts = {};
let trainingTimerInterval = null;

function initCognitiveTraining() {
    initTrainingModuleButtons();
    initTrainingHistoryChart();
    initGameControlButtons();
}

// ========== 训练模块"开始训练"按钮 ==========
function initTrainingModuleButtons() {
    const startBtns = document.querySelectorAll('.btn-start-training');
    
    startBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const module = this.dataset.module;
            if (module) startTraining(module);
        });
    });
}

// ========== 游戏控制按钮 ==========
function initGameControlButtons() {
    // 退出训练
    const exitBtn = document.getElementById('exitGameBtn');
    if (exitBtn) {
        exitBtn.addEventListener('click', function() {
            stopTrainingTimer();
            hideGameArea();
            showModulesArea();
        });
    }
    
    // 再来一次
    const retryBtn = document.getElementById('retryGameBtn');
    if (retryBtn) {
        retryBtn.addEventListener('click', function() {
            hideResultArea();
            if (AppState.training.currentModule) {
                startTraining(AppState.training.currentModule);
            }
        });
    }
    
    // 返回模块列表
    const backBtn = document.getElementById('backToModulesBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            hideResultArea();
            showModulesArea();
        });
    }
}

// ========== 开始训练 ==========
function startTraining(module) {
    AppState.training = {
        currentModule: module,
        score: 0,
        round: 1,
        totalRounds: 10,
        timer: null,
        startTime: Date.now(),
        correctCount: 0
    };
    
    // 隐藏模块卡片，显示游戏区域
    hideModulesArea();
    showGameArea();
    
    // 更新游戏标题
    const titles = {
        memory: '记忆力训练 - 图形配对',
        attention: '注意力训练 - 目标搜索',
        reaction: '反应速度测试',
        spatial: '空间感知 - 方向判断',
        language: '语言能力 - 成语填空'
    };
    
    const gameTitle = document.getElementById('gameTitle');
    if (gameTitle) gameTitle.textContent = titles[module] || '训练进行中';
    
    // 重置显示
    updateGameScore(0);
    updateGameRound(1);
    
    // 启动计时器
    startTrainingTimer();
    
    // 倒计时后开始具体游戏
    showCountdown(() => {
        switch (module) {
            case 'memory': startMemoryGame(); break;
            case 'attention': startAttentionGame(); break;
            case 'reaction': startReactionGame(); break;
            case 'spatial': startSpatialGame(); break;
            case 'language': startLanguageGame(); break;
        }
    });
}

// ========== 倒计时 ==========
function showCountdown(callback) {
    const gameContent = document.getElementById('gameContent');
    if (!gameContent) return;
    
    let count = 3;
    gameContent.innerHTML = `<div class="game-countdown">${count}</div>`;
    
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            gameContent.innerHTML = `<div class="game-countdown">${count}</div>`;
        } else {
            clearInterval(countdownInterval);
            callback();
        }
    }, 800);
}

// ========== 计时器管理 ==========
function startTrainingTimer() {
    const timerEl = document.getElementById('gameTimer');
    if (!timerEl) return;
    
    AppState.training.startTime = Date.now();
    
    trainingTimerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - AppState.training.startTime) / 1000);
        const min = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const sec = String(elapsed % 60).padStart(2, '0');
        timerEl.textContent = `${min}:${sec}`;
    }, 1000);
}

function stopTrainingTimer() {
    if (trainingTimerInterval) {
        clearInterval(trainingTimerInterval);
        trainingTimerInterval = null;
    }
}

function getElapsedTime() {
    return Math.floor((Date.now() - AppState.training.startTime) / 1000);
}

// ========== UI状态切换 ==========
function hideModulesArea() {
    const modulesGrid = document.querySelector('.training-modules-grid');
    const overview = document.querySelector('.training-overview');
    const historySection = document.querySelector('.training-history-section');
    if (modulesGrid) modulesGrid.style.display = 'none';
    if (overview) overview.style.display = 'none';
    if (historySection) historySection.style.display = 'none';
}

function showModulesArea() {
    const modulesGrid = document.querySelector('.training-modules-grid');
    const overview = document.querySelector('.training-overview');
    const historySection = document.querySelector('.training-history-section');
    if (modulesGrid) modulesGrid.style.display = '';
    if (overview) overview.style.display = '';
    if (historySection) historySection.style.display = '';
}

function showGameArea() {
    const area = document.getElementById('trainingGameArea');
    if (area) area.style.display = 'block';
}

function hideGameArea() {
    const area = document.getElementById('trainingGameArea');
    if (area) area.style.display = 'none';
}

function showResultArea(score, correct, total, timeStr, accuracy) {
    hideGameArea();
    const area = document.getElementById('trainingResultArea');
    if (area) area.style.display = 'flex';
    
    document.getElementById('resultScoreBig').textContent = score;
    document.getElementById('resultCorrect').textContent = `${correct}/${total}`;
    document.getElementById('resultTime').textContent = timeStr;
    document.getElementById('resultAccuracy').textContent = accuracy;
    
    // 评价语
    let evalText = '';
    if (score >= 90) evalText = '太棒了！表现卓越，您的大脑非常灵活！';
    else if (score >= 75) evalText = '表现良好，继续保持规律训练！';
    else if (score >= 60) evalText = '还不错，多加练习会更好！';
    else evalText = '别灰心，坚持训练一定能进步！';
    
    document.getElementById('resultEval').textContent = evalText;
}

function hideResultArea() {
    const area = document.getElementById('trainingResultArea');
    if (area) area.style.display = 'none';
}

function updateGameScore(score) {
    const el = document.getElementById('gameScore');
    if (el) el.textContent = score;
    AppState.training.score = score;
}

function updateGameRound(round) {
    const el = document.getElementById('gameRound');
    if (el) el.textContent = round;
    AppState.training.round = round;
}

// ==================== 训练游戏实现 ====================

// ---------- 1. 记忆力训练：图形配对 ----------
const MEMORY_SYMBOLS = ['🍎', '🌙', '⭐', '🎵', '🌸', '🔑', '💎', '🚀'];
let memoryState = { cards: [], flipped: [], matched: 0, canClick: false };

function startMemoryGame() {
    const content = document.getElementById('gameContent');
    if (!content) return;
    
    // 准备卡牌（每种符号2张）
    const symbols = [...MEMORY_SYMBOLS, ...MEMORY_SYMBOLS];
    shuffleArray(symbols);
    
    memoryState = {
        cards: symbols,
        flipped: [],
        matched: 0,
        canClick: true,
        moves: 0
    };
    
    let html = '<div class="game-instruction">找出所有相同的图形配对</div>';
    html += '<div class="memory-game-grid">';
    
    symbols.forEach((sym, i) => {
        html += `<div class="memory-card" data-index="${i}" data-symbol="${sym}">?</div>`;
    });
    
    html += '</div>';
    content.innerHTML = html;
    
    // 绑定点击事件
    setTimeout(() => {
        document.querySelectorAll('.memory-card').forEach(card => {
            card.addEventListener('click', handleMemoryCardClick);
        });
        
        // 先展示2秒让用户记忆（简化版：直接开始）
        memoryState.canClick = true;
    }, 300);
}

function handleMemoryCardClick(e) {
    if (!memoryState.canClick) return;
    
    const card = e.currentTarget;
    const index = parseInt(card.dataset.index);
    
    // 已翻开的或已匹配的
    if (memoryState.flipped.includes(index) || card.classList.contains('matched')) return;
    
    // 翻开
    card.classList.add('flipped');
    card.textContent = card.dataset.symbol;
    memoryState.flipped.push(index);
    memoryState.moves++;
    
    if (memoryState.flipped.length === 2) {
        memoryState.canClick = false;
        
        const [idx1, idx2] = memoryState.flipped;
        const card1 = document.querySelector(`.memory-card[data-index="${idx1}"]`);
        const card2 = document.querySelector(`.memory-card[data-index="${idx2}"]`);
        
        if (card1.dataset.symbol === card2.dataset.symbol) {
            // 配对成功
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                memoryState.matched++;
                memoryState.flipped = [];
                memoryState.canClick = true;
                
                updateGameScore(AppState.training.score + 10);
                AppState.training.correctCount++;
                
                // 检查是否完成
                if (memoryState.matched === MEMORY_SYMBOLS.length) {
                    finishTraining();
                }
            }, 400);
        } else {
            // 不匹配，翻回去
            setTimeout(() => {
                card1.classList.remove('flipped');
                card1.textContent = '?';
                card2.classList.remove('flipped');
                card2.textContent = '?';
                memoryState.flipped = [];
                memoryState.canClick = true;
            }, 800);
        }
    }
}

// ---------- 2. 注意力训练：目标搜索 ----------
const ATTENTION_TARGETS = ['🎯', '⭕', '🔴', '🟢', '🔵'];
let attentionState = { targetSymbol: '', found: 0, totalTargets: 0, wrong: 0 };

function startAttentionGame() {
    const content = document.getElementById('gameContent');
    if (!content) return;
    
    // 随机选择目标
    const targetIdx = Math.floor(Math.random() * ATTENTION_TARGETS.length);
    attentionState = {
        targetSymbol: ATTENTION_TARGETS[targetIdx],
        found: 0,
        totalTargets: 6,
        wrong: 0,
        grid: []
    };
    
    // 生成6x4网格
    const distractors = ['❤️', '🌟', '🍀', '🌈', '☀️', '🌙', '💫', '🎪', '🎨', '🎭'];
    let grid = [];
    
    // 放置目标位置
    const targetPositions = new Set();
    while (targetPositions.size < attentionState.totalTargets) {
        targetPositions.add(Math.floor(Math.random() * 24));
    }
    
    for (let i = 0; i < 24; i++) {
        if (targetPositions.has(i)) {
            grid.push({ symbol: attentionState.targetSymbol, isTarget: true });
        } else {
            grid.push({
                symbol: distractors[Math.floor(Math.random() * distractors.length)],
                isTarget: false
            });
        }
    }
    
    attentionState.grid = grid;
    
    let html = `<div class="game-instruction">请找出所有的 <strong style="font-size:24px">${attentionState.targetSymbol}</strong> （共${attentionState.totalTargets}个）</div>`;
    html += '<div class="attention-game-board">';
    
    grid.forEach((cell, i) => {
        html += `<div class="attention-cell ${cell.isTarget ? 'target' : ''}" data-index="${i}" data-is-target="${cell.isTarget}">${cell.symbol}</div>`;
    });
    
    html += '</div>';
    content.innerHTML = html;
    
    setTimeout(() => {
        document.querySelectorAll('.attention-cell').forEach(cell => {
            cell.addEventListener('click', handleAttentionCellClick);
        });
    }, 100);
}

function handleAttentionCellClick(e) {
    const cell = e.currentTarget;
    if (cell.classList.contains('found') || cell.classList.contains('wrong')) return;
    
    const isTarget = cell.dataset.isTarget === 'true';
    
    if (isTarget) {
        cell.classList.add('found');
        attentionState.found++;
        updateGameScore(AppState.training.score + 10);
        AppState.training.correctCount++;
        
        if (attentionState.found >= attentionState.totalTargets) {
            setTimeout(finishTraining, 500);
        }
    } else {
        cell.classList.add('wrong');
        attentionState.wrong++;
        updateGameScore(Math.max(0, AppState.training.score - 3));
    }
}

// ---------- 3. 反应速度测试 ----------
let reactionState = { phase: 'waiting', startTime: 0, results: [], currentRound: 0 };

function startReactionGame() {
    const content = document.getElementById('gameContent');
    if (!content) return;
    
    reactionState = {
        phase: 'waiting',
        startTime: 0,
        results: [],
        currentRound: 0,
        totalRounds: 5
    };
    
    updateGameRound(1);
    renderReactionRound(content);
}

function renderReactionRound(content) {
    reactionState.phase = 'waiting';
    
    content.innerHTML = `
        <div class="game-instruction">当圆圈变绿时，尽快点击！</div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:20px;">
            <div class="reaction-target waiting" id="reactionTarget">等待...</div>
            <div id="reactionFeedback" style="font-size:18px;font-weight:600;color:#595959;"></div>
        </div>
    `;
    
    const target = document.getElementById('reactionTarget');
    const feedback = document.getElementById('reactionFeedback');
    
    target.addEventListener('click', handleReactionClick);
    
    // 随机延迟后变色
    const delay = 1500 + Math.random() * 3000; // 1.5-4.5秒
    
    setTimeout(() => {
        if (reactionState.phase === 'waiting') {
            reactionState.phase = 'ready';
            reactionState.startTime = performance.now();
            target.classList.remove('waiting');
            target.style.background = '#52c41a';
            target.style.boxShadow = '0 4px 20px rgba(82,196,26,0.5)';
            target.textContent = '点击！';
        }
    }, delay);
}

function handleReactionClick() {
    const target = document.getElementById('reactionTarget');
    const feedback = document.getElementById('reactionFeedback');
    
    if (reactionState.phase === 'waiting') {
        // 太早点了
        feedback.textContent = '太早了！请等待绿色出现';
        feedback.style.color = '#ff4d4f';
        // 重新开始这轮
        setTimeout(() => renderReactionRound(document.getElementById('gameContent')), 1000);
        return;
    }
    
    if (reactionState.phase === 'ready') {
        const rt = Math.round(performance.now() - reactionState.startTime);
        reactionState.results.push(rt);
        reactionState.currentRound++;
        
        let msg = `反应时间：${rt}ms`;
        let color = '#52c41a';
        if (rt > 500) { msg += ' (较慢)'; color = '#fa8c16'; }
        else if (rt < 250) { msg += ' (很快!)'; }
        
        feedback.textContent = msg;
        feedback.style.color = color;
        updateGameScore(AppState.training.score + Math.max(1, Math.round(100 - rt / 10)));
        AppState.training.correctCount++;
        
        if (reactionState.currentRound >= reactionState.totalRounds) {
            setTimeout(finishTraining, 800);
        } else {
            updateGameRound(reactionState.currentRound + 1);
            setTimeout(() => renderReactionRound(document.getElementById('gameContent')), 1200);
        }
        
        reactionState.phase = 'done';
    }
}

// ---------- 4. 空间感知训练：方向判断 ----------
let spatialState = { score: 0, round: 0, totalRounds: 8 };

function startSpatialGame() {
    const content = document.getElementById('gameContent');
    if (!content) return;
    
    spatialState = { score: 0, round: 0, totalRounds: 8 };
    updateGameRound(1);
    renderSpatialQuestion(content);
}

function renderSpatialQuestion(content) {
    spatialState.round++;
    
    // 生成方向问题
    const directions = ['上', '下', '左', '右', '左上', '右上', '左下', '右下'];
    const questionTypes = [
        () => {
            // 从A到B的方向
            const fromDir = directions[Math.floor(Math.random() * 4)];
            const toDir = directions[Math.floor(Math.random() * 8)];
            return { q: `如果面向"${fromDir}"方，向"${toDir}"转是向哪个方向？`, a: getRelativeDirection(fromDir, toDir), options: shuffleArray([...directions]).slice(0, 4) };
        },
        () => {
            // 简单镜像
            const dir = directions[Math.floor(Math.random() * 4)];
            return { q: `"${dir}"的反方向是什么？`, a: getOpposite(dir), options: shuffleArray([...directions]).slice(0, 4) };
        },
        () => {
            // 时钟方向
            const hours = ['12点', '1点', '2点', '3点', '4点', '5点', '6点', '7点', '8点', '9点', '10点', '11点'];
            const h = hours[Math.floor(Math.random() * 12)];
            const clockDir = clockToDirection(h);
            return { q: `"${h}"钟方向对应的是？`, a: clockDir, options: shuffleArray(['上','下','左','右']).slice(0, 4) };
        }
    ];
    
    const qt = questionTypes[Math.floor(Math.random() * questionTypes.length)]();
    
    // 确保选项包含正确答案
    if (!qt.options.includes(qt.a)) {
        qt.options[0] = qt.a;
    }
    qt.options = shuffleArray(qt.options);
    
    let html = `<div class="game-instruction">${qt.q}</div>`;
    qt.options.forEach(opt => {
        html += `<button class="language-quiz-option" data-answer="${opt}">${opt}</button>`;
    });
    
    content.innerHTML = html;
    
    content.querySelectorAll('.language-quiz-option').forEach(btn => {
        btn.addEventListener('click', function() {
            const selected = this.dataset.answer;
            const allBtns = content.querySelectorAll('.language-quiz-option');
            
            allBtns.forEach(b => b.disabled = true);
            
            if (selected === qt.a) {
                this.classList.add('correct');
                updateGameScore(AppState.training.score + 10);
                AppState.training.correctCount++;
                spatialState.score++;
            } else {
                this.classList.add('wrong');
                allBtns.forEach(b => {
                    if (b.dataset.answer === qt.a) b.classList.add('correct');
                });
            }
            
            setTimeout(() => {
                if (spatialState.round >= spatialState.totalRounds) {
                    finishTraining();
                } else {
                    updateGameRound(spatialState.round + 1);
                    renderSpatialQuestion(content);
                }
            }, 800);
        });
    });
}

function getOpposite(dir) {
    const map = { '上': '下', '下': '上', '左': '右', '右': '左' };
    return map[dir] || dir;
}

function getRelativeDirection(from, to) {
    // 简化处理
    const map = {
        '上-左': '左', '上-右': '右', '上-上': '前', '上-下': '后',
        '下-左': '右', '下-右': '左', '下-下': '前', '下-上': '后',
        '左-上': '右', '左-下': '左', '左-左': '前', '左-右': '后',
        '右-上': '左', '右-下': '右', '右-右': '前', '右-左': '后'
    };
    return map[`${from}-${to}`] || to;
}

function clockToDirection(h) {
    const map = {
        '12点': '上', '1点': '右上', '2点': '右上', '3点': '右',
        '4点': '右下', '5点': '右下', '6点': '下', '7点': '左下',
        '8点': '左下', '9点': '左', '10点': '左上', '11点': '左上'
    };
    return map[h] || '上';
}

// ---------- 5. 语言能力训练：成语填空 ----------
const IDIOM_QUIZZES = [
    { q: '一___千里', a: '泻', options: ['泻', '泄', '歇', '写'], hint: '形容文笔或气势奔放' },
    { q: '画蛇___足', a: '添', options: ['添', '填', '甜', '舔'], hint: '比喻做多余的事' },
    { q: '守株待___', a: '兔', options: ['兔', '图', '突', '途'], hint: '比喻不主动努力' },
    { q: '亡羊补___', a: '牢', options: ['牢', '劳', '老', '捞'], hint: '出了问题及时补救' },
    { q: '对牛弹___', a: '琴', options: ['琴', '情', '勤', '秦'], hint: '比喻说话不看对象' },
    { q: '___羊补牢', a: '亡', options: ['亡', '忘', '旺', '望'], hint: '出了问题及时补救' },
    { q: '刻舟求___', a: '剑', options: ['剑', '见', '建', '健'], hint: '比喻拘泥不知变通' },
    { q: '掩耳盗___', a: '铃', options: ['铃', '灵', '领', '零'], hint: '欺骗自己' },
    { q: '___苗助长', a: '揠', options: ['揠', '偃', '堰', '宴'], hint: '违反事物发展规律' },
    { q: '叶公好___', a: '龙', options: ['龙', '笼', '隆', '聋'], hint: '口头上说爱好' }
];

let languageState = { currentIndex: 0, score: 0, correct: 0 };

function startLanguageGame() {
    const content = document.getElementById('gameContent');
    if (!content) return;
    
    languageState = { currentIndex: 0, score: 0, correct: 0 };
    const shuffledQuizzes = shuffleArray([...IDIOM_QUIZZES]);
    languageState.quizzes = shuffledQuizzes.slice(0, 8);
    
    updateGameRound(1);
    renderLanguageQuestion(content);
}

function renderLanguageQuestion(content) {
    if (languageState.currentIndex >= languageState.quizzes.length) {
        finishTraining();
        return;
    }
    
    const quiz = languageState.quizzes[languageState.currentIndex];
    const opts = shuffleArray([...quiz.options]);
    
    let html = `<div class="game-instruction">请选择正确的字填入成语中</div>`;
    html += `<div style="font-size:32px;font-weight:700;margin-bottom:20px;color:#1890ff;">${quiz.q}</div>`;
    html += `<p style="color:#8c8c8c;margin-bottom:16px;font-size:14px;">提示：${quiz.hint}</p>`;
    
    opts.forEach(opt => {
        html += `<button class="language-quiz-option" data-answer="${opt}">${opt}</button>`;
    }
    );
    
    content.innerHTML = html;
    
    content.querySelectorAll('.language-quiz-option').forEach(btn => {
        btn.addEventListener('click', function() {
            const selected = this.dataset.answer;
            const allBtns = content.querySelectorAll('.language-quiz-option');
            
            allBtns.forEach(b => b.disabled = true);
            
            if (selected === quiz.a) {
                this.classList.add('correct');
                updateGameScore(AppState.training.score + 10);
                AppState.training.correctCount++;
                languageState.correct++;
            } else {
                this.classList.add('wrong');
                allBtns.forEach(b => {
                    if (b.dataset.answer === quiz.a) b.classList.add('correct');
                });
            }
            
            languageState.currentIndex++;
            updateGameRound(languageState.currentIndex + 1);
            
            setTimeout(() => {
                renderLanguageQuestion(content);
            }, 900);
        });
    });
}

// ========== 完成训练 ==========
function finishTraining() {
    stopTrainingTimer();
    
    const elapsed = getElapsedTime();
    const min = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const sec = String(elapsed % 60).padStart(2, '0');
    const timeStr = `${min}:${sec}`;
    
    const totalQuestions = AppState.training.round;
    const correct = AppState.training.correctCount;
    const accuracy = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
    
    showResultArea(
        AppState.training.score,
        correct,
        totalQuestions,
        timeStr,
        `${accuracy}%`
    );
}

// ========== 训练历史图表 ==========
function initTrainingHistoryChart() {
    const canvas = document.getElementById('trainingHistoryChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (trainingCharts.history) trainingCharts.history.destroy();
    
    const labels = [];
    for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        labels.push(`${d.getMonth()+1}/${d.getDate()}`);
    }
    
    // 模拟历史得分数据
    const scores = [65, 68, 72, 70, 75, 73, 78, 76, 80, 79, 82, 81, 85, 83];
    
    trainingCharts.history = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '训练得分',
                data: scores,
                borderColor: '#722ed1',
                backgroundColor: 'rgba(114,46,209,0.1)',
                borderWidth: 2.5,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { min: 50, max: 100, grid: { color: 'rgba(0,0,0,0.04)' } },
                x: { grid: { display: false }, ticks: { maxRotation: 45, font: { size: 10 } } }
            },
            plugins: {
                legend: { position: 'top', align: 'end' }
            }
        }
    });
}

// ========== 工具函数 ==========
function shuffleArray(arr) {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}
