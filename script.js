/* ===========================
   Seita English Quiz
   script.js
=========================== */

let currentWords = [];
let quizWords = [];
let wrongWords = [];

let currentQuestion = null;

let correct = 0;
let wrong = 0;
let questionNumber = 0;

const home = document.getElementById("home");
const quiz = document.getElementById("quiz");
const resultScreen = document.getElementById("resultScreen");

const question = document.getElementById("question");
const choices = document.getElementById("choices");
const message = document.getElementById("message");

const count = document.getElementById("questionCount");
const score = document.getElementById("score");

const nextButton = document.getElementById("nextButton");

document.querySelectorAll(".menuButton").forEach(button=>{

    button.addEventListener("click",()=>{

        if(button.disabled) return;

        const range = button.dataset.range;

        startQuiz(range);

    });

});

function startQuiz(range){

    const data = wordLists[range];

    currentWords = [...data.words];

    quizWords = [...currentWords];

    wrongWords = [];

    correct = 0;
    wrong = 0;
    questionNumber = 0;

    home.classList.add("hidden");
    quiz.classList.remove("hidden");
    resultScreen.classList.add("hidden");

    nextQuestion();

}

function nextQuestion(){

    message.innerHTML="";

    nextButton.style.display="none";

    if(quizWords.length===0){

        finishQuiz();

        return;

    }

    questionNumber++;

    count.innerHTML =
        "問題 " +
        questionNumber +
        " / " +
        currentWords.length;

    score.innerHTML =
        "⭕ " +
        correct +
        "　❌ " +
        wrong;

    const index =
        Math.floor(Math.random()*quizWords.length);

    currentQuestion =
        quizWords[index];

    quizWords.splice(index,1);

    question.innerHTML =
        currentQuestion.en;

    createChoices();

}
// ===========================
// 選択肢を作る
// ===========================

function createChoices() {

    choices.innerHTML = "";

    let answer = currentQuestion.jp;
    let list = [answer];

    while (list.length < 4) {

        let random =
            currentWords[Math.floor(Math.random() * currentWords.length)].jp;

        if (!list.includes(random)) {
            list.push(random);
        }

    }

    // シャッフル
    list.sort(() => Math.random() - 0.5);

    list.forEach(text => {

        const btn = document.createElement("button");

        btn.className = "choice";
        btn.textContent = text;

        btn.onclick = () => checkAnswer(btn, text);

        choices.appendChild(btn);

    });

}

// ===========================
// 答え合わせ
// ===========================

function checkAnswer(button, answer) {

    const buttons = document.querySelectorAll(".choice");

    buttons.forEach(btn => btn.disabled = true);

    if (answer === currentQuestion.jp) {

        correct++;

        button.classList.add("correct");

        message.innerHTML = "ふーん、、、高３なら出来て当然ちゃう？";

    } else {

        wrong++;

        wrongWords.push(currentQuestion);

        button.classList.add("wrong");

        buttons.forEach(btn => {

            if (btn.textContent === currentQuestion.jp) {

                btn.classList.add("correct");

            }

        });

        message.innerHTML =
            "あ、、、死んだほうがええよ「" + currentQuestion.jp + "」";

    }

    score.innerHTML =
        "⭕ " + correct +
        "　❌ " + wrong;

    nextButton.style.display = "block";

}

// ===========================
// 終了画面
// ===========================

function finishQuiz() {

    quiz.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    const total = correct + wrong;

    const rate =
        total === 0
            ? 0
            : Math.round(correct / total * 100);

    document.getElementById("finalScore").innerHTML = `
        <h2>${correct} / ${total} 問正解</h2>
        <h3>正答率 ${rate}%</h3>
        <p>間違えた問題：${wrong}問</p>
    `;

    // 学習履歴を保存
    localStorage.setItem("bestScore", Math.max(
        correct,
        Number(localStorage.getItem("bestScore") || 0)
    ));

}

// ===========================
// ボタン
// ===========================

nextButton.onclick = () => {

    nextQuestion();

};

document.getElementById("restartButton").onclick = () => {

    resultScreen.classList.add("hidden");
    home.classList.remove("hidden");

};

document.getElementById("homeButton").onclick = () => {

    resultScreen.classList.add("hidden");
    home.classList.remove("hidden");

};
// クイズ中にホームへ戻る
document.getElementById("homeNowButton").onclick = () => {

    if(confirm("ホームへ戻りますか？\n現在の結果は保存されません。")){

        quiz.classList.add("hidden");

        resultScreen.classList.add("hidden");

        home.classList.remove("hidden");

    }

};