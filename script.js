轻而易举 诗人资料 = [
  { 文本: "床前明月光，疑是地上霜。", 空白: [4, 8] },
  { 文本: "举头望明月，低头思故乡。", 空白: [2, 7] },
];
让 currentPoemIndex = 0;
文件.getElementById('开始-btn ').addEventListener(点击, 开始游戏);
文件.getElementById('规则-btn ').addEventListener(点击, 表演规则);
文件.getElementById('结束-规则-btn ').addEventListener(点击, 关闭规则);
文件.getElementById(“check-btn”).使用 addEventListener(“Click”, 关于checkAnswers);

功能 开始游戏() {
  文件.查询选择器(。'游戏开始').风格.显示 = '无';
  文件.查询选择器(。“游戏屏幕”).风格.显示 = '阻止';
  负载诗();
}
功能 表演规则() { 文件.getElementById('规则').风格.显示 = '阻止'; }
功能 关闭规则() { 文件.getElementById('规则').风格.显示 = '无'; }

功能 负载诗() {
  常数 诗意 = 诗歌数据[currentPoemIndex];
  让 文本 = 诗意.文本;
  为 (让 我 = 0; 我 < 诗意.空白.长度; 我++) {
    文本 = 文本.替换(' ', `< input type="text" id="blank-${我}"/>`);
  }
  文件.getElementById(“诗歌”).innerHTML = 文本;
}

功能 检查答案() {
  让 好的 = 真实的;
  常数 诗意 = 诗歌数据[currentPoemIndex];
  为 (让 我 = 0; 我 < 诗意.空白.长度; 我++) {
    如果 (!文件.getElementById(`空白-${我}`).价值) { 好的 = 错误的; 破裂; }
  }
  如果 (好的) {
    文件.getElementById('反馈').文本内容 = "恭喜！你答对了";
    currentPoemIndex++;
    如果 (currentPoemIndex < 诗歌数据.长度) 负载诗();
    其他 文件.getElementById('反馈').文本内容 = "游戏结束！";
  } 其他 {
    文件.getElementById('反馈').文本内容 = "再试一次";
  }
}
