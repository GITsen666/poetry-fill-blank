// 诗词数据库（包含50+诗句）
const poetryDB = {
    easy: [
        {
            title: "静夜思",
            lines: [
                "床前明（）光，疑是地上（）",
                "举（）望明月，低头思故（）"
            ],
            answers: ["月", "霜", "头", "乡"],
            hints: ["天体", "结晶", "身体", "家乡"]
        },
        // 更多简单诗句...
    ],
    medium: [
        {
            title: "望庐山瀑布",
            lines: [
                "日照香炉生（）烟，遥看瀑布挂前（）",
                "飞流直下（）千尺，疑是银河落（）天"
            ],
            answers: ["紫", "川", "三", "九"],
            hints: ["颜色", "水流", "数字", "最大数"]
        },
        // 更多中等诗句...
    ],
    hard: [
        {
            title: "蜀道难",
            lines: [
                "噫吁嚱！危乎高哉！蜀道之难，难于（）青天",
                "地崩山摧壮士（），然后天梯石栈相钩连"
            ],
            answers: ["上", "死"],
            hints: ["方位", "终结"]
        },
        // 更多困难诗句...
    ]
};

class GameEngine {
    constructor() {
        this.currentLevel = 'easy';
        this.currentPoem = null;
        this.score = 0;
        this.timeLeft = 60;
        this.hintsLeft = 3;
        this.activeBlank = null;
        
        this.initEventListeners();
        this.loadGame();
    }

    initEventListeners() {
        // 难度选择
        document.querySelectorAll('.difficulty').forEach(btn => {
            btn.addEventListener('click', () => this.selectDifficulty(btn.dataset.level));
        });

        // 开始游戏
        document.querySelector('.start-btn').addEventListener('click', () => this.startGame());

        // 填空点击
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('blank')) {
                this.showInputModal(e.target);
            }
        });

        // 提交答案
        document.getElementById('submit-answer').addEventListener('click', () => this.checkAnswer());
    }

    selectDifficulty(level) {
        this.currentLevel = level;
        document.querySelectorAll('.difficulty').forEach(el => el.classList.remove('active'));
        document.querySelector(`[data-level="${level}"]`).classList.add('active');
    }

    loadGame() {
        const poems = poetryDB[this.currentLevel];
        this.currentPoem = poems[Math.floor(Math.random() * poems.length)];
        this.renderPoem();
    }

    renderPoem() {
        const container = document.getElementById('poem-display');
        container.innerHTML = this.currentPoem.lines.map(line => {
            return `<div class="verse">${line.replace(/（）/g, '<span class="blank"></span>')}</div>`;
        }).join('');
    }

    startGame() {
        document.getElementById('home').classList.remove('active');
        document.getElementById('game').classList.add('active');
        this.startTimer();
    }

    startTimer() {
        const timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('time').textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                clearInterval(timer);
                this.endGame();
            }
        }, 1000);
    }

    showInputModal(blank) {
        this.activeBlank = blank;
        const modal = document.getElementById('input-modal');
        modal.style.display = 'block';
    }

    checkAnswer() {
        const userInput = document.getElementById('poem-input').value.trim();
        const correctAnswer = this.currentPoem.answers[this.getBlankIndex()];
        
        if (userInput === correctAnswer) {
            this.activeBlank.textContent = userInput;
            this.activeBlank.classList.add('filled');
            this.score += this.currentLevel === 'easy' ? 10 : this.currentLevel === 'medium' ? 15 : 20;
            document.getElementById('points').textContent = this.score;
        }
        
        this.closeModal();
    }

    getBlankIndex() {
        return [...document.querySelectorAll('.blank')].indexOf(this.activeBlank);
    }

    closeModal() {
        document.getElementById('input-modal').style.display = 'none';
        document.getElementById('poem-input').value = '';
    }

    endGame() {
        localStorage.setItem('highScore', Math.max(this.score, localStorage.getItem('highScore') || 0));
        alert(`时间到！最终得分：${this.score}`);
        location.reload();
    }
}

// 初始化游戏
new GameEngine();
