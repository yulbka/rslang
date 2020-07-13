import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../css/hangman2.scss';
import {WordService} from './service/Word.Service';

export function create_hangman2() {

    const main = document.getElementById('main');
    const new_arr = [];

    function create_main() {
        const new_main = 
        `
        <div id="home">
                <div class="title">Hangman</div>
                <div class="button anim" id='startGame'>Play</div>
            </div>
            <div id="result" class="h">
                <div class="title" id="rT"></div>
                <div class="body" id="rM"></div>
                <div class="button anim" id='startGameAgain'>Try Again?</div>
            </div>
            <div id="pGame">
                <div id="letter"></div>
                <div id="game">
                    <div class="player">
                        <div class="playerModel">
                            <div class="head" data="false" id="g4"></div>
                            <div class="body" data="false" l="false" r="false" id="g5"></div>
                            <div class="foot" data="false" l="false" r="false" id="g6"></div>
                        </div>
                    </div>
                    <div class="stang3" data="false" id="g3"></div>
                    <div class="stang2" data="false" id="g2"></div>
                    <div class="stang" data="false" id="g1"></div>
                    <div class="ground" data="false" id="g0"></div>
                    <div class="hintButton" data="false" id="hintButton">?</div>
                </div>
                <div id="tastatur">
                    <div id="moveKeybord"><div class="marg"></div></div>
                    <div id="keybord"></div>
                </div>
                <div class="hint" id="hint">
                    <div class="title">Hint<div class="exit" id='hintExit'>X</div></div>
                    <div class="body" id="hintText"></div>
                </div>
            </div>
        `
        main.innerHTML += new_main;
    }

    create_main();

      
    // Game keyboard
    const tastatur = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    // Game memory
    let select = 0
    let wordLeft = []
    let fail = 0;
    let wincount = 0;
    let losecount = 0;

    ingame_statictic()
    
    window.onload = function() {
        gId("moveKeybord").addEventListener('touchmove', function(e) {
            const wH = window.innerHeight
            const tY = e.touches[0].clientY
            const eL = gId("tastatur")
            let resY = wH - tY - eL.offsetHeight
            if(resY < 0) {
                resY = 0
            } else if(resY > wH / 2) {
                resY = wH / 2
            }
            eL.style.bottom = `${resY}px`
    }, false)
    createTastur()
    }

    createTastur()
    
    // Start game
    function startGame() {
        gId("home").className = "h"
        gId("result").className = "h"
        newGame()
    }

    gId('startGame').addEventListener('click', () => {
        startGame();
    })

    gId('startGameAgain').addEventListener('click', () => {
        startGame();
    })
    
    // New game
    function newGame() {
        clearTastatur()
        clearPlayer()
        createWord();
    }
    
    // Clear keyboard
    function clearTastatur() {
        const e = document.getElementsByClassName("b")
        for(let a = 0; a < e.length; a++) {
            e[a].setAttribute("data", "")
        }
    }
    
    // Clear player
    function clearPlayer() {
        fail = 0
        wordLeft = []
        gId("g0").setAttribute("data", "false")
        gId("g1").setAttribute("data", "false")
        gId("g2").setAttribute("data", "false")
        gId("g3").setAttribute("data", "false")
        gId("g4").setAttribute("data", "false")
        gId("g5").setAttribute("data", "false")
        gId("g5").setAttribute("r", "false")
        gId("g5").setAttribute("l", "false")
        gId("g6").setAttribute("data", "false")
        gId("g6").setAttribute("l", "false")
        gId("g6").setAttribute("r", "false")
        gId("hintButton").setAttribute("data", "false")
        gId("hint").style.display = "none"
    }
    
    // Get new word
    async function createWord() {
        const new_words = await WordService.getWordsByCategory('learned');
        // const new_words = await WordService.getWordsForGames();
        new_words.map(item => new_arr.push([item.word, item.textMeaning, item._id]))
        const d = gId("letter")
        d.innerHTML = ""
        select = Math.floor(Math.random() * new_arr.length)
        for(let a = 0; a < new_arr[select][0].length; a++) {
            const x = new_arr[select][0][a].toUpperCase()
            const b = document.createElement("span")
            b.className = `l${(x === " " ? " ls" : "")}`
            b.innerHTML = "&nbsp"
            b.id = `l${a}`;
            d.appendChild(b)
            
            if(x !== " ") {
                if(wordLeft.indexOf(x) === -1) {
                    wordLeft.push(x)
                }
            }
        }
    }

    function ingame_statictic() {
        const block_for_statictick = `
        <div class='ingame_statictic' id='block_for_statictick'>W : ${wincount} - L : ${losecount} </div>
        `
        main.innerHTML += block_for_statictick;
    }

    // async function createWord() {
    //     const new_words = await WordService.getWordsForGames();
    //     const new_arr = [];
    //     new_words.map(item => new_arr.push([item.word, item.textMeaning]))
    //     const d = gId("letter")
    //     d.innerHTML = ""
    //     select = Math.floor(Math.random() * word.length)
    //     for(let a = 0; a < word[select][0].length; a++) {
    //         const x = word[select][0][a].toUpperCase()
    //         const b = document.createElement("span")
    //         b.className = `l${(x === " " ? " ls" : "")}`
    //         b.innerHTML = "&nbsp"
    //         b.id = `l${a}`;
    //         d.appendChild(b)
            
    //         if(x !== " ") {
    //             if(wordLeft.indexOf(x) === -1) {
    //                 wordLeft.push(x)
    //             }
    //         }
    //     }
    // }
    
    // Create keyboard
    function createTastur() {
        const tas = gId("keybord")
        tas.innerHTML = ""
        for(let a = 0; a < tastatur.length; a++) {
            const b = document.createElement("span")
            b.className = "b"
            b.innerText = tastatur[a]
            b.setAttribute("data", "")
            b.onclick = function() {
                bTas(this)
            }
            tas.appendChild(b)
        }
    }
    
    // Game check, If show next error / game end
    function bTas(a) {
        if(a.getAttribute("data") === "") {
            const x = isExist(a.innerText)
            console.log(x)
            a.setAttribute("data", x)
            if(x) {
                if(wordLeft.length === 0) {
                    gameEnd(true)
                }
            } else {
                showNextFail()
            }
        }
    }
    
    // If letter "X" exist
    function isExist(e) {
        e.toUpperCase()
        const x = wordLeft.indexOf(e)
        if(x !== -1) {
            wordLeft.splice(x, 1)
            typeWord(e)
            return true
        }
        return false
    }
    
    // Show next fail drawing
    function showNextFail() {
        fail++
        switch(fail) {
            case 1:
                gId("g0").setAttribute("data", "true")
                break;
            
            case 2:
                gId("g1").setAttribute("data", "true")
                break;
            
            case 3:
                gId("g2").setAttribute("data", "true")
                break;
            
            case 4:
                gId("g3").setAttribute("data", "true")
                gId("hintButton").setAttribute("data", "true")
                break;
            
            case 5:
                gId("g4").setAttribute("data", "true")
                break;
            
            case 6:
                gId("g5").setAttribute("data", "true")
                break;
            
            case 7:
                gId("g5").setAttribute("l", "true")
                break;
            
            case 8:
                gId("g5").setAttribute("r", "true")
                break;
            
            case 9:
                gId("g6").setAttribute("data", "true")
                gId("g6").setAttribute("l", "true")
                break;
            
            case 10:
                gId("g6").setAttribute("r", "true")
                gameEnd(false)
                break;
            default:
                console.log('default')
        }
    }
    
    function typeWord(e) {
        for(let a = 0; a < new_arr[select][0].length; a++) {
            if(new_arr[select][0][a].toUpperCase() === e) {
                gId(`l${a}`).innerText = e
            }
        }
    }
    
    // Game result
    function gameEnd(e) {
        const d = gId("result")
        d.setAttribute("data", e)
        if(e) {
            gId("rT").innerText = "You Win!";
            gId("rM").innerHTML = "Congratulations, you found the word!<br/><br/>Good Job!";
            wincount += 1;
            WordService.updateUserWord(new_arr[select][2], 'normal' ,{ category: 'learned' })
        } else {
            gId("rT").innerText = "You Lose!"
            gId("rM").innerHTML = `The word was ${new_arr[select][0].toUpperCase()} Better luck next time.`
            losecount += 1;
            WordService.writeMistake(new_arr[select][2])
        }
        d.className = ""
    }
    
    // Show hint
    function hint() {
        const str = `${new_arr[select][1]}`
        const newstr = str.replace(`${new_arr[select][0]}`, 'Needed word');
        gId("hintText").innerText = newstr;
        gId("hint").style.display = "block"
    }
    // function hint() {
    //     gId("hintText").innerText = `${word[select][1]}`
    //     gId("hint").style.display = "block"
    // }
    
    gId('hintButton').addEventListener('click', () => {
        hint()
    })
    
    // Exit hint
    function hintExit() {
        gId("hint").style.display = "none"
    }
    gId('hintExit').addEventListener('click', () => {
        hintExit()
    })
    
    // Get HTML ID element by name
    function gId(a) {
        return document.getElementById(a)
    }
}

