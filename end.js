const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
  e.preventDefault();

  const score = {
    score: mostRecentScore,
    name: username.value,
  };
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(5);

  // "end.js" dosyasında

  // Quiz bittiğinde çağırılacak olan fonksiyon
  function showSelectedChoices() {
    // Kaydedilen seçimlerin bulunduğu tabloyu alın
    const table = document.getElementById("selectedChoicesTable");

    // Kaydedilen seçimlerin sayısını alın
    const numOfChoices = clickedChoices.length;

    // Her bir seçimi tabloya ekleyin
    for (let i = 0; i < numOfChoices; i++) {
      const row = table.insertRow(-1); // Yeni bir satır ekle

      const questionCell = row.insertCell(0); // Soru numarası için hücre ekle
      questionCell.innerHTML = i + 1; // Soru numarası, 1'den başlayarak

      const selectedChoiceCell = row.insertCell(1); // Seçilen şık için hücre ekle
      selectedChoiceCell.innerHTML = clickedChoices[i];
    }
  }

  // "showSelectedChoices" fonksiyonunu çağırarak seçilen tüm şıkları "end" sayfasında gösterin
  showSelectedChoices();

  localStorage.setItem("highScores", JSON.stringify(highScores));
  window.location.assign("/");
};
