var wordToGuess = '';
var guessedLetters = [];
var theme;
var listMeilleur = localStorage.getItem('topPlayers') ?
              JSON.parse(localStorage.getItem('topPlayers')) : 
              [];
var score = 0;
var debutDuJeu = new Date();
var finDuJeu;
var incorrectGuesses = -1;
var randomIndex;

function createAlphabetButtons() {
    var alphabetContainer = $('#alphabet-buttons-container');
    for (var i = 65; i <= 90; i++) {
        var letter = String.fromCharCode(i);
        var button = $('<button>', {
            text: letter,
            class: 'alphabet-button',
            click: function () {
                checkLetter($(this).text());
				$(this).prop('disabled', true);
            }
        });
        alphabetContainer.append(button);
    }
	var button = $('<button>', {
    text: " ",
    class: 'alphabet-button',
    click: function () {
                checkLetter(" ");
				$(this).prop('disabled', true);
            }
        });
	alphabetContainer.append(button);
}

function updateHangmanSVG() {
	$('#' + incorrectGuesses).css('display', 'block');
	$('#hangman-svg').css('display', 'block');
}




function changeTheWord() {
    wordToGuess = getRandomWord(theme);
    guessedLetters = [];
    updateWordDisplay();
	$('.alphabet-button').prop('disabled', false);
	document.getElementById("message").innerHTML = '';
	document.getElementById("TableBest10").innerHTML = "";
	incorrectGuesses = -1;
	$('.svg').css('display', 'none');
	$('#hangman-svg').css('display', 'none');
	getHintForWordToGeuss();
}

function updateWordDisplay() {
    var wordDisplay = document.getElementById('word-display');
    wordDisplay.innerHTML = wordToGuess.split('').map(function (letter) {
        var isGuessed = guessedLetters.includes(letter);
        return `<span class="${isGuessed ? 'guessed' : ''}">${isGuessed ? letter : '_'}</span>`;
    }).join(' ');
}


function getHintForWordToGeuss() {
    document.getElementById("hint-display").innerHTML = themes[theme][randomIndex].hint; 
	console.log(themes[theme][randomIndex].hint);
}

function checkLetter(letter) {
    if (!guessedLetters.includes(letter)) {
		score++;
        guessedLetters.push(letter);
        updateWordDisplay();
        checkGameStatus();
	}
	if (!wordToGuess.includes(letter)){
		incorrectGuesses++;
		updateHangmanSVG();
	}
		
}

function checkGameStatus() {
    if (wordToGuess.split('').every(function (letter) {
        return guessedLetters.includes(letter);
    })) {
		$('#hangman-svg').css('display', 'none');
		$('.alphabet-button').prop('disabled', true);
        finDuJeu = new Date(); 
        document.getElementById("message").style.color = "green";
        document.getElementById("message").innerHTML = 'Félicitations! Vous avez deviné le mot : ' + wordToGuess;
        pushInListTopPlayers(score, (finDuJeu - debutDuJeu) / 1000);
    }else {
        if (incorrectGuesses < 5) {
			return ;
        } else {
			$('#hangman-svg').css('display', 'none');
			$('.alphabet-button').prop('disabled', true);
            document.getElementById("message").style.color = "red";
            document.getElementById("message").innerHTML = 'Désolé, vous avez perdu. Le pendu est complet. Le mot correct était : ' + wordToGuess + '. Essayez à nouveau !';  
        }
    }
}

function getRandomWord(theme) {
    var wordList = themes[theme];
    if (wordList) {
        randomIndex = Math.floor(Math.random() * wordList.length);
        return wordList[randomIndex].word;
    } else {
        return null;
    }
}

function changeTheme(selectedTheme) {
    theme = selectedTheme;
    changeTheWord();
}

function Load_Game() {
    createAlphabetButtons();
    updateWordDisplay();
    changeTheme(theme);
	changeTheWord();
	updateHangmanSVG();
}




function Joueur(name, score, temps) {
  this.name = name;
  this.score = score;
  this.temps = temps;
}

function ifInferieur(t, x) {
  for (let pos = 0; pos < t.length; pos++)
    if (t[pos].score >= x)
      return true;
  return false;
}

function indexOfobject(t, joueur) {
  for (let pos = 0; pos < t.length; pos++)
    if (t[pos].name == joueur.name && t[pos].score == joueur.score && t[pos].temps == joueur.temps) 
      return pos;
  return -1;
}


function pushInListTopPlayers(score, temps) {
  if (listMeilleur.length < 10 || ifInferieur(listMeilleur, score)) {
    var addName = document.getElementById("AddName");
    messageAddName = document.createElement("h2");
    inputName = document.createElement("input");
    inputName.id = "inputName";
    messageAddName.innerHTML = " Bravo, vous êtes dans les 10 meilleurs, entrez votre nom: ";
    addName.append(messageAddName);
    addName.append(inputName);
    var n2 = document.getElementById("inputName");
    n2.onchange = function() {
      var playerName = n2.value;
      var joueur = new Joueur(playerName, score, temps);
      listMeilleur.push(joueur);
      listMeilleur.sort(function(a, b) {
        if (a.score - b.score == 0)
          return a.temps - b.temps;
        return a.score - b.score;
      });
      var classement = indexOfobject(listMeilleur, joueur);
      addName.innerHTML = "";
      if (listMeilleur.length > 10)
         listMeilleur.splice(10, 1);
      remplirTable(listMeilleur, classement);
    };
  }
  else
    remplirTable(listMeilleur, 10);
}

function remplirTable(t, classement) {
localStorage.setItem('topPlayers', JSON.stringify(listMeilleur));
var ntab = $('<table>');
  var ntr = $('<tr>');
  
  var nth = $('<th>').html("Rang");
  ntr.append(nth);

  nth = $('<th>').html("Nom");
  ntr.append(nth);

  nth = $('<th>').html("Score");
  ntr.append(nth);

  nth = $('<th>').html("Temps");
  ntr.append(nth);

  ntab.append(ntr);

  for (let pos = 0; pos < t.length; pos++) {
    ntr = $('<tr>');
    if (pos == classement)
      ntr.attr('id', 'classement');

    var ntd = $('<td>').html(pos + 1);
    ntr.append(ntd);

    ntd = $('<td>').html(t[pos].name);
    ntr.append(ntd);

    ntd = $('<td>').html(t[pos].score);
    ntr.append(ntd);

    ntd = $('<td>').html(t[pos].temps);
    ntr.append(ntd);

    ntab.append(ntr);
  }

  $('#TableBest10').append(ntab);
}