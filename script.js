// script.js
// const quoteApiUrl = "https://api.quotable.io/random?minLength=85&maxLength=100";
const quoteApiUrl = "https://dummyjson.com/quotes/random?minLength=30&maxLength=50";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById('quote-input');

let quote = "";
let mistakes = 0;
let time = 60;
let timer = "";

const renderNewQuote = async () => {
    try {
        // Fetch content from URL
        const response = await fetch(quoteApiUrl);
        const data = await response.json();

        // Check if data contains the quote
        if (data && data.quote) { // Adjust based on API response
            quote = data.quote; // Update 'quote' based on the actual API response
        } else {
            throw new Error("Quote content not found in the response.");
        }

        // Split quote text into spans
        let arr = quote.split("").map((value) => {
            return "<span class='quote-chars'>" + value + "</span>";
        });

        // Render the quote in the quote section
        quoteSection.innerHTML = arr.join("");
    } catch (error) {
        console.error("Error fetching quote:", error);
        quoteSection.innerHTML = "<p>Could not load a new quote. Please try again later.</p>";
    }
}

//Logic for comparing input words with quote

userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars")

    //Creating an Array name quoteChars from recieved span tags object
    quoteChars = Array.from(quoteChars);
    //User inputs of each character in Textbox
    let userInputChars = userInput.value.split("");

    quoteChars.forEach((char, index) => {
        if (char.innerHTML == userInputChars[index]) {
            char.classList.add("success");
        }
        else if (userInputChars[index] == null) {
            if (char.classList.contains("fail")) {
                char.classList.remove("fail")
            } else {
                char.classList.remove("success")
            }
        }
        else {
            if (!char.classList.contains("fail")) {
                mistakes = mistakes + 1;
                char.classList.add("fail")
            }
            document.getElementById("mistakesID").innerHTML = mistakes;
        }
    });
});

function updateTimer() {
    if (time == 0) {
        displayResult();
    }
    else {
        document.getElementById("timerID").innerHTML = --time + "s";
    }
}
const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
}
const displayResult = () => {
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    document.getElementById("restart-test").style.display = "block";
    userInput.disabled = true;

    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time) / 100;
    }
    document.getElementById('speedID').innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + "wpm";

    document.getElementById('accuracyID').innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%";
}
const startTest = () => {
    timer = "";
    mistakes = 0;
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
}
window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    document.getElementById("restart-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();

}

const restartTest = () => {
    window.onload();


}

// Speed Example:
// Total Keys Pressed = 200
// Time Elapsed in Minutes = 1.5
// WPM = ( (200 / 5) / 1.5 ) = 26

// Accuracy Example:
// Total Keys Pressed = 200
// Correct Keys Pressed = 190
// Accuracy = (190 / 200) * 100 = 95%