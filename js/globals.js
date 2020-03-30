'use strict';

// const BEGINNER_SIZE = 4;//Iran
// const BEGINNER_VIRUSES = 2;

// const MEDIUM_SIZE = 8;//Italy
// const MEDIUM_VIRUSES = 12;

// const EXPERT_SIZE = 12;//China
// const _VIRUSES = 30;

//Global variables and Constants
console.log('globals.js access has been preformed');

const VIRUS = '<img class="virus" src="img/virus.png" alt="🦠">';//'🦠';
const EMPTY = ' ';
const COVERED = EMPTY;
const QUARANTINE = '<div class="quarantined">☣</div>';
const NORMAL = '🙂';
const WIN = '😎';
const LOSE = '😷';

const EASY = { SIZE: 4, VIRUSES: 2, key: 'EASY'};
const MEDIUM = { SIZE: 8, VIRUSES: 12, key: 'MEDIUM' };
const EXPERT = { SIZE: 12, VIRUSES: 30, key: 'EXPERT' };

const HINTS = 3;
const LIVES = 3;
const LIFE = '❤';

var audioCough = new Audio('sound/cough.mp3');
var audioSneeze = new Audio('sound/sneeze.mp3');

var LEVELS={}
LEVELS['EASY']=EASY;
LEVELS['MEDIUM']=MEDIUM;
LEVELS['EXPERT']=EXPERT;

var gInterval;
var gBoard = [];
var gGame = { isOn: false, isHintMode: false, shownCount: 0, markedCount: 0, secsPassed: 0, usedHints: 0, livesLeft: LIVES }
var gLevel = EASY;
// gBoard = Matrix contains cell objects: { virusesAroundCount: 4, isShown: true, isVirus: false, isMarked: true, }

//------------------------------------------------------------//



//------------------------------------------------------------//
function buildBoard(size = gLevel.SIZE) {
    /**Builds the board Set viruses at random locations Call 
     * setVirusesNegsCount() Return the created board
     */
    var board = []
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i].push({
                virusesAroundCount: 0,
                isShown: false,
                isVirus: false,
                isMarked: false
            })
        }
    }
    return board
}

function infect(board, idx, jdx) {
    var temp = [];
    for (var i = 0; i < gLevel.VIRUSES; i++) {
        temp.push(true);
    }
    for (var i = 0; i < gLevel.SIZE ** 2 - gLevel.VIRUSES - 1; i++) {
        temp.push(false);
    }

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (i === idx && j == jdx) continue;
            var rnd = temp.splice(getRandomInteger(0, temp.length), 1)[0];
            // var rnd = (Math.random() > 0.2)
            //console.log(rnd);
            board[i][j].isVirus = rnd;
        }
    }
}

function setVirusesNegsCount(board) {
    /**Count viruses around each cell and set the cell's virusesAroundCount. 
     */
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].virusesAroundCount = countNegs({ i: i, j: j });
        }
    }
}
function updateClock() {
    gGame.secsPassed++;
    renderScore();
    renderClock();
}
