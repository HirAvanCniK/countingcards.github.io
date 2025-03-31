SPEED_MIN = 100;
SPEED_MAX = 5000;
NUMBER_MIN = 5;
NUMBER_MAX = 52;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('speed').min = SPEED_MIN;
    document.getElementById('speed').max = SPEED_MAX;
    document.getElementById('number').min = NUMBER_MIN;
    document.getElementById('number').max = NUMBER_MAX;
    let startForm = document.getElementById('startForm');
    startForm.addEventListener('submit', (e) => {
        let speed = parseInt(document.getElementById('speed').value);
        let number = parseInt(document.getElementById('number').value);
        if(speed === NaN || number === NaN || speed < SPEED_MIN || speed > SPEED_MAX || number < NUMBER_MIN || number > NUMBER_MAX){
            e.preventDefault();
            alert("Please enter valid parameters");
        }
    });

    const startGame = async (speed, numberOfCards) => {
        const APIURL = "https://www.deckofcardsapi.com/api";
        const deckId = (await fetch(APIURL+"/deck/new/shuffle").then(res=>res.json())).deck_id;
        const cards = (await fetch(APIURL+`/deck/${deckId}/draw/?count=${numberOfCards}`).then(res=>res.json())).cards;
    
        if(deckId && cards){
            cardsLeft = document.getElementById("cardsLeft");
            document.getElementById("speedLabel").textContent = speed;
    
            countDownContainer = document.getElementById("countDown");
            cardContainer = document.getElementById("cardContainer");
            pauseBtn = document.getElementById("pauseBtn");
    
            countDown = 3;
            const count = () => {
                countDownContainer.textContent = countDown;
                if(countDown>0){
                    countDown--;
                    setTimeout(count, 1000);
                } else {
                    countDownContainer.textContent = "Go!";
                    setTimeout(() => {
                        countDownContainer.style.display = "none";
                        cardContainer.style.display = "block";
                        pauseBtn.disabled = false;
                        showCard();
                    }, 500);
                }
            }
    
            finalCounting = 0;
    
            const calculateValue = (code) => {
                switch(code[0]){
                    case "4": case '5': case '6':
                        return 2;
                    case "2": case "3": case "7":
                        return 1;
                    case "8": case '9':
                        return 0;
                    case 'A':
                        return -1;
                    case '0': case 'J': case 'Q': case 'K':
                        return -2;
                    default:
                        return 1337;
                }
            }
    
            const showCard = () => {
                if(cards.length > 0) {
                    var currentCard = cards.pop();
                    finalCounting += calculateValue(currentCard.code);
                    
                    cardContainer.src = currentCard.image;
                    cardsLeft.textContent = cards.length;
                    
                    if(cards.length > 0) {
                        setTimeout(showCard, speed);
                    } else {
                        setTimeout(() => {
                            document.getElementById("game").style.display = "none";
                            document.getElementById("result").style.display = "block";
                        }, speed);
                    }
                }
            }
    
            document.getElementById("result").addEventListener("submit", (e) => {
                e.preventDefault();
                if (parseInt(document.getElementById("finalCount").value) != finalCounting) {
                    msg = "The count was: " + finalCounting + ". Try harder!";
                } else {
                    msg = "Congratulations you calculated the count correctly!";
                }
                alert(msg);
            });
    
            
            count();
        }
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const speed = parseInt(urlParams.get('speed'));
    const number = parseInt(urlParams.get('number'));

    if(speed && number){
        if(speed < SPEED_MIN || speed > SPEED_MAX || number < NUMBER_MIN || number > NUMBER_MAX){
            alert("Please enter valid parameters");
        } else {
            startForm.style.display = "none";
            document.getElementById("game").style.display = "grid";
            startGame(speed, number);
        }
    }
});
