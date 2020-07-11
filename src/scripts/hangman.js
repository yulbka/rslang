import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../css/hangman.scss';
// import {WordService} from './service/Word.Service';

import '../assets/img'

export function create_hagman_game(){

/* Game */

const youWon = "You Won!";
const youLost = "You Lost!";



const main = document.getElementById('main');

function create_main() {
    const main_area = `
    <h1>Hangman</h1>
    <div id="gallows">
      <img style="padding-left: 70px" id="hangmanImage" src='sdfgsdfgd'>
    </div>
    <div id="word"></div>
    <br>
    <div id="controls">
      <input type="text" id="guessBox">
      <button id="newGameButton" class="button">New Game</button>
      <br>
      <br>
        <button class="button" id='clue'>Clue</button>
    </div>
    <br>
    <div id="guesses"></div>
    `
    main.innerHTML += main_area;
}

// "https://i.ibb.co/rF5mZnD/hangman0.png"
// "https://i.ibb.co/G0Xm6Fv/hangman1.png"
// "https://i.ibb.co/khmvKcB/hangman2.png"
// "https://i.ibb.co/Pjht4dk/hangman3.png"
// "https://i.ibb.co/C068hpy/hangman4.png"
// "https://i.ibb.co/vdVVzbs/hangman5.png"
// "https://i.ibb.co/g75vk9C/hangman6.png"
// "https://i.ibb.co/wc9t00F/hangman7.png"

create_main();
const words = ['wetwrgt', 'wetwrgt','wetwrgt','wetwrgt','wetwrgt'];
// async function test() {
// 	WordService.getNewWords().then(data => {
// 		data.map(element => words.push(element.word));
// 	});
// 	console.log(words)
// 	return words;
// }

function Game() {
    let word = words[Math.floor(Math.random()*words.length)];
	word = word.toUpperCase();
	const guessedLetters = [];
	let maskedWord = "";
	let incorrectGuesses = 0;
	let possibleGuesses = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let won = false;
	let lost = false;
	const maxGuesses = 7;

	for ( let i = 0; i < word.length; i++ ) 
	{
		const space = " ";
		const nextCharacter = word.charAt(i) === space ? space : "_";
		maskedWord += nextCharacter;
	}

	const guessWord = function( guessedWord )
	{
		guessedWord.toUpperCase();
		if( guessedWord === word )
		{
			guessAllLetters();
		}
		else
		{
			handleIncorrectGuess();
		}
	}

	let guessAllLetters = function()
	{
		for ( let i = 0; i < word.length; i++ ) 
		{
			guess( word.charAt( i ) );
		}
	}

	let guess = function( letter ) 
	{
		letter.toUpperCase();
		if( !guessedLetters.includes( letter ))
		{	
			guessedLetters.push(letter);
			possibleGuesses = possibleGuesses.replace(letter,"");
			if( word.includes( letter ) )
			{
				const matchingIndexes = [];
				for ( let i = 0; i < word.length; i++ ) 
				{
					if( word.charAt(i) === letter )
					{
						matchingIndexes.push( i );
					}
				}

				matchingIndexes.forEach( function(index) {
					maskedWord = replace( maskedWord, index, letter );
				});	

				if( !lost )
				{
					won = maskedWord === word;	
				}		
			}
			else
			{
				handleIncorrectGuess();
			}
		}
	}

	let handleIncorrectGuess = function()
	{
		incorrectGuesses++;
		lost = incorrectGuesses >= maxGuesses;
		if( lost )
		{
			guessAllLetters();
		}
	}

	return {
		"getWord": function(){ return word; },
		"getMaskedWord": function(){ return maskedWord; },
		"guess": guess,
		"getPossibleGuesses": function(){ return [... possibleGuesses]; },
		"getIncorrectGuesses": function(){ return incorrectGuesses; },
		"guessWord": guessWord,
		"isWon": function(){ return won; },
		"isLost": function(){ return lost; },
	};
}

Game();

function replace( value, index, replacement ) 
{
    return value.substr(0, index) + replacement + value.substr(index + replacement.length);
}

function listenForInput( game ) 
{
	const guessLetter = function( letter )
	{
		if( letter )
		{
			const gameStillGoing = !game.isWon() && 
								 !game.isLost();
			if( gameStillGoing )
			{
				game.guess( letter );
				render( game );
			}
		}
	};

	const handleClick = function( event )
	{
	    if (event.target.classList.contains('guess') )
	    {
	    	guessLetter( event.target.innerHTML );
	    }
	}

	const handleKeyPress = function( event )
	{
		let letter = null;
		const A = 65;
		const Z = 90;
		const ENTER = 13;
		const isLetter = event.keyCode >= A && event.keyCode <= Z;
		const guessWordButton = document.getElementById("guessWordButton");
		const newGameButton = document.getElementById("newGameButton");
		const guessBox = document.getElementById("guessBox");
		const gameOver = guessBox.value === youWon || guessBox.value === youLost;

		if( event.target.id !== "guessBox" && isLetter )
		{
			letter = String.fromCharCode( event.keyCode );
		}
		else if( event.keyCode === ENTER && gameOver )
		{
			newGameButton.click();
		}
		else if( event.keyCode === ENTER && guessBox.value !== "" )
		{
			guessWordButton.click();
		}
		guessLetter( letter );
	}

	document.addEventListener('keydown', handleKeyPress );
	document.body.addEventListener('click', handleClick );
}

// function guessWord( game )
// {
// 	const gameStillGoing = !game.isWon() && 
// 						 !game.isLost();
// 	const guessedWord = document.getElementById('guessBox').value;
// 	if( gameStillGoing )
// 	{
// 		game.guessWord( guessedWord );
// 		render( game );
// 	}
// }


function render( game )
{
    document.getElementById("word").innerHTML = game.getMaskedWord(); 
	document.getElementById("guesses").innerHTML = "";
	game.getPossibleGuesses().forEach( function(guess) {
		const innerHtml = `<span class='guess'>${guess}"</span>`;
		document.getElementById("guesses").innerHTML += innerHtml;
	});
	document.getElementById("hangmanImage").src = `img/hangman${game.getIncorrectGuesses()}.png`;

	const guessBox = document.getElementById('guessBox');
	if( game.isWon() )
	{
		guessBox.value = youWon;
		guessBox.classList = "win";
	}
	else if( game.isLost() )
	{
		guessBox.value = youLost;
		guessBox.classList = "loss";
	}
	else
	{
		guessBox.value = "";
		guessBox.classList = "";
	}
}

document.getElementById('newGameButton').addEventListener('click', () => {
	newGame();
})

function newGame()
{
	history.go(0)
}

const game = new Game();
render( game );
listenForInput( game );
}