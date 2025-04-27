// 游戏核心逻辑
let currentPoem = [];
let answers = {};
let timeLeft = 60;
let score = 0;
let hintsLeft = 3;
let currentDifficulty = 'easy';
let timerInterval = null;

// 诗词数据库
const poems = {
    easy: [
        {
            title: "静夜思",
            content: [
                { text: "床前明____光", blanks: [{ position: 2, answer: "月", hint: "夜晚发光的天体" }] },
                { text: "疑是地上____", blanks: [{ position: 4, answer: "霜", hint: "寒冷的清晨结晶" }] },
                { text: "举____望明月", blanks: [{ position: 1, answer: "头", hint: "身体部位" }] },
                { text: "低头思故____", blanks: [{ position: 3, answer: "乡", hint: "出生的地方" }] }
            ]
        }
    ],
    medium: [
        {
            title: "望庐山瀑布",
            content: [
                { text: "日照香炉生____烟", blanks: [{ position: 4, answer: "紫", hint: "颜色，红蓝混合" }] },
                { text: "遥看瀑布挂前____", blanks: [{ position: 5, answer: "川", hint: "河流的意思" }] },
                { text: "飞流直下____千尺", blanks: [{ position: 4, answer: "三", hint: "数字" }] },
                { text: "疑是银河落____天", blanks: [{ position: 5, answer: "九", hint: "最大的个位数" }] }
            ]
        }
    ],
    hard: [
        {
            title: "蜀道难",
            content: [
                { text: "噫吁嚱！危乎高哉！蜀道之难，难于____青天", 
                  blanks: [{ position: 7, answer: "上", hint: "方位词，与下相反" }] },
                { text: "地崩山摧壮士____，然后天梯石栈相钩连",
                  blanks: [{ position: 6, answer: "死", hint: "生命终结" }] },
                { text: "黄鹤之飞尚不____，猿猱欲度愁攀援",
                  blanks: [{ position: 5, answer: "过", hint: "通过" }] }
            ]
        }
    ]
};

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    const savedScore = localStorage.getItem('highscore') || 0;
    document.getElementById('highscore').textContent = savedScore;
});

// 核心函数
function toggleRules() {
    document.getElementById('rules').classList.toggle('hidden');
}

function startGame() {
    // 重置游戏状态
    currentDifficulty = document.getElementById('difficulty').value;
    hintsLeft = 3;
    score = 0;
    answers = {};
    clearInterval(timerInterval);
    
    // 设置倒计时
    timeLeft = { easy: 60, medium: 45, hard: 30 }[currentDifficulty];
    
    // 更新界面
    document.getElementById('home').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('timer').textContent = timeLeft;
    document.getElementById('score').textContent = score;
    document.getElementById('hints').textContent = hintsLeft;
    
    // 加载诗词
    loadRandomPoem();
    startTimer();
}

function loadRandomPoem() {
    const poemsList = poems[currentDifficulty];
    const randomIndex = Math.floor(Math.random() * poemsList.length);
    currentPoem = poemsList[randomIndex].content;
    
    const poemDiv = document.getElementById('poem');
    poemDiv.innerHTML = currentPoem.map((line, lineIndex) => {
        let lineHTML = line.text;
        line.blanks.forEach(blank => {
            const uniqueKey = `${lineIndex}-${blank.position}`;
            lineHTML = lineHTML.replace('____', 
                `<span class="blank" 
                      onclick="fillBlank(${blank.position}, ${lineIndex})" 
                      data-key="${uniqueKey}">____</span>`);
        });
        return `<div class="poem-line">${lineHTML}</div>`;
    }).join('');
}

function fillBlank(position, lineIndex) {
    const blank = currentPoem[lineIndex].blanks.find(b => b.position === position);
    const uniqueKey = `${lineIndex}-${position}`;
    
    const userInput = prompt(`请输入正确答案（${blank.answer.length}个字）：\n输入 ? 获取提示`);
    
    if (userInput === '?') {
        handleHintRequest(blank);
        return;
    }
    
    if (userInput && userInput.trim()) {
        answers[uniqueKey] = userInput.trim();
        document.querySelector(`[data-key="${uniqueKey}"]`).textContent = userInput.trim();
    }
}

function handleHintRequest(blank) {
    if (hintsLeft > 0) {
        hintsLeft--;
        score = Math.max(0, score - 5);
        document.getElementById('hints').textContent = hintsLeft;
        document.getElementById('score').textContent = score;
        alert(`💡 提示：${blank.hint}`);
    } else {
        alert("⚠️ 没有剩余提示了！");
    }
}

function checkAnswers() {
    let allCorrect = true;
    const poemLines = document.querySelectorAll('.poem-line');
    
    poemLines.forEach(line => line.classList.remove('wrong', 'correct'));
    
    currentPoem.forEach((line, lineIndex) => {
        line.blanks.forEach(blank => {
            const uniqueKey = `${lineIndex}-${blank.position}`;
            const userAnswer = answers[uniqueKey];
            const isCorrect = userAnswer === blank.answer;
            
            if (!isCorrect) {
                allCorrect = false;
                poemLines[lineIndex].classList.add('wrong');
                setTimeout(() => poemLines[lineIndex].classList.remove('wrong'), 600);
            }
        });
    });

    if (allCorrect) {
        updateScore();
        handleCorrectAnswer();
    } else {
        alert("❌ 还有错误答案，请检查！");
    }
}

function updateScore() {
    score += { easy: 10, medium: 15, hard: 20 }[currentDifficulty];
    document.getElementById('score').textContent = score;
    
    const currentHighscore = parseInt(localStorage.getItem('highscore')) || 0;
    if (score > currentHighscore) {
        localStorage.setItem('highscore', score);
        document.getElementById('highscore').textContent = score;
    }
}

function handleCorrectAnswer() {
    document.getElementById('poem').classList.add('correct');
    setTimeout(() => {
        document.getElementById('poem').classList.remove('correct');
        loadRandomPoem();
        answers = {};
    }, 800);
}

function showHint() {
    if (hintsLeft <= 0) {
        alert("⚠️ 提示次数已用尽！");
        return;
    }
    
    const emptyBlanks = currentPoem
        .flatMap((line, lineIndex) => line.blanks.map(blank => ({
            ...blank,
            uniqueKey: `${lineIndex}-${blank.position}`
        })))
        .filter(blank => !answers[blank.uniqueKey]);
    
    if (emptyBlanks.length === 0) return;
    
    const randomBlank = emptyBlanks[Math.floor(Math.random() * emptyBlanks.length)];
    hintsLeft--;
    score = Math.max(0, score - 5);
    
    document.getElementById('hints').textContent = hintsLeft;
    document.getElementById('score').textContent = score;
    
    alert(`💡 提示：第 ${randomBlank.position} 空的首字是「${randomBlank.answer[0]}」\n（扣除5分，剩余提示：${hintsLeft}次）`);
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert(`⏰ 时间到！最终得分：${score}`);
            backToHome();
        }
    }, 1000);
}

function backToHome() {
    clearInterval(timerInterval);
    document.getElementById('game').classList.add('hidden');
    document.getElementById('home').classList.remove('hidden');
    document.getElementById('poem').innerHTML = '';
}
