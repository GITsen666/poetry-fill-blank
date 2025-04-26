let poetryData = [
  { text: "床前明月光，疑是地上霜。", blanks: [4, 8] },
  { text: "举头望明月，低头思故乡。", blanks: [2, 7] },
];

let currentPoemIndex = 0;

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('rules-btn').addEventListener('click', showRules);
document.getElementById('close-rules-btn').addEventListener('click', closeRules);
document.getElementById('check-btn').addEventListener('click', checkAnswers);

function startGame() {
  document.querySelector('.game-start').style.display = 'none';
  document.querySelector('.game-screen').style.display = 'block';
  loadPoetry();
}

function showRules() {
  document.getElementById('rules').style.display = 'block';
}

function closeRules() {
  document.getElementById('rules').style.display = 'none';
}

function loadPoetry() {
  const poetry = poetryData[currentPoemIndex];
  let poetryText = poetry.text;

  // 将空格位置替换为输入框
  for (let i = 0; i < poetry.blanks.length; i++) {
    poetryText = poetryText.replace(' ', `<input type="text" id="blank-${i}" />`);
  }

  document.getElementById('poetry').innerHTML = poetryText;
}

function checkAnswers() {
  let isCorrect = true;
  let poetry = poetryData[currentPoemIndex];
  
  // 检查每个空白的输入框是否填写了内容
  for (let i = 0; i < poetry.blanks.length; i++) {
    const input = document.getElementById(`blank-${i}`).value;
    if (input === "") {
      isCorrect = false;
      break;
    }
  }
  
  if (isCorrect) {
    document.getElementById('feedback').textContent = "恭喜！你答对了";
    currentPoemIndex++;
    if (currentPoemIndex < poetryData.length) {
      loadPoetry();
    } else {
      document.getElementById('feedback').textContent = "游戏结束！";
    }
  } else {
    document.getElementById('feedback').textContent = "再试一次";
  }
}
