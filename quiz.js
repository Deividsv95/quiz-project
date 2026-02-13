console.log("quiz take 2 loaded");
document.getElementById("submit").addEventListener("click", function() {
    var score = 0;
    if (document.getElementById("q1").checked) {
        score++;
    }
    if (document.getElementById("q2").checked) {
        score++;
    }
    if (document.getElementById("q3").checked) {
        score++;
    }
    if (document.getElementById("q4").checked) {
        score++;
    }
    if (document.getElementById("q5").checked) {
        score++;
    }
    alert("Your score is: " + score);
    document.getElementById("score").innerText = "Score: " + score + "/5";
});