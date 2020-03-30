'use strict';

console.log('main.js access has been preformed');

//Global variables and Constants


/*insert question*/

//Unit Testing


//------------------------------------------------------------//

//TODO: This is called when page loads
function initGame() {
    renderSmiley(NORMAL);
    renderLives();
    renderHighestScores();
    renderClock();
    renderScore();
    renderHintBtn();
    gBoard = buildBoard();
    renderBoard(gBoard);
}


function countNegs(cell) {
    var neighbours = 0;
    for (var i = cell.i - 1; i < cell.i + 2; i++) {
        for (var j = cell.j - 1; j < cell.j + 2; j++) {
            if (i < 0 || j < 0 || (cell.i === i && cell.j === j)) continue;
            if (i >= gBoard.length || j >= gBoard.length) continue;
            neighbours += gBoard[i][j].isVirus ? 1 : 0;
            //console.log(neighbours)            
        }
    }
    return neighbours;
}

function countMarkedNegs(cell) {
    var neighbours = 0;
    for (var i = cell.i - 1; i < cell.i + 2; i++) {
        for (var j = cell.j - 1; j < cell.j + 2; j++) {
            if (i < 0 || j < 0 || (cell.i === i && cell.j === j)) continue;
            if (i >= gBoard.length || j >= gBoard.length) continue;

            neighbours += gBoard[i][j].isMarked ? 1 : 0;
            //console.log(neighbours)            
        }
    }
    return neighbours;
}
function cellClicked(elCell, i, j) {
    /**Called when a cell (td) is clicked
     */
    if (!gGame.isOn) {
        if (gGame.shownCount === 0) {
            firstClick(i, j);
        } else return;
    } else if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return;

    if (gGame.isHintMode) {
        renderHint(i, j);
        gGame.usedHints++;
        var elBtn = document.querySelector('.hint');
        toggleHintMode(elBtn);
    } else if (gBoard[i][j].isVirus) {
        gBoard[i][j].isShown = true;
        cough(elCell, i, j);
    } else {
        expandShown(gBoard, elCell, i, j)
    }
}
function restart() {
    stopTimer();
    gGame.isOn = false;
    gGame.isHintMode = false;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gGame.usedHints = 0;
    gGame.livesLeft = LIVES;
    initGame();
}
function showCell(elCell, i, j) {
    gBoard[i][j].isShown = true;
    renderCell(elCell, i, j);
    gGame.shownCount++;
    checkGameOver();
}
function cellMarked(elCell, ev) {
    /**TODO: alled on right click to mark a cell (suspected to be a virus )
     * Search the web (and implement) how to hide tChe context menu on right click
     */
    ev.preventDefault();
    var i = elCell.dataset.i;
    var j = elCell.dataset.j;
    if (!gGame.isOn) {
        if (gGame.shownCount === 0) {
            firstClick(i, j)
        } else return;
    }
    console.log(gBoard[i][j].isMarked);
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
    gGame.markedCount += gBoard[i][j].isMarked ? 1 : -1;
    renderCell(elCell, i, j);
    checkGameOver();
}
/**TODO: cellNegsClick(elCell)
 * 
 * 
 */


function expandShown(board, elCell, i, j) {
    /**When user clicks a cell with no viruses around,
     * we need to open not only that cell, but also its neighbors.
     * NOTE: start with a basic implementation that only opens the non-virus
     * 1st degree neighbors BONUS: if you have the time later, try to work more
     *  like the real algorithm (see description at the Bonuses section below)
     */
    var cell = board[i][j];
    if (cell.isShown || cell.isVirus || cell.isMarked) return;
    // if (countNegs({ i: i, j: j }) !== countMarkedNegs({ i: i, j: j })) {
    //     // board[i][j].isShown = true;
    //     // renderCell(elCell, i, j);
    //     showCell(elCell, i, j);
    //     return;
    // }
    showCell(elCell, i, j);
    // board[i][j].isShown = true;
    // renderCell(elCell, i, j);
    for (var idx = i - 1; idx < i + 2; idx++) {
        for (var jdx = j - 1; jdx < j + 2; jdx++) {
            if (idx < 0 || jdx < 0 || (idx === i && jdx === j)) continue;
            if (idx >= board.length || jdx >= board[0].length) continue;
            elCell = getElCell(idx, jdx);
            if (cell.virusesAroundCount === 0) expandShown(board, elCell, idx, jdx);
        }
    }
}
function firstClick(i, j) {
    gGame.isOn = true;
    //console.table(gBoard);
    gInterval = setInterval(updateClock, 1000)
    infect(gBoard, i, j);
    setVirusesNegsCount(gBoard)
    //console.table(gBoard);
    printBoard();
}
function checkGameOver() {
    if (gGame.livesLeft === 0) gameLost();
    else if (gGame.shownCount === gLevel.SIZE ** 2 - (gLevel.VIRUSES)
        && gGame.markedCount === gLevel.VIRUSES) {
        gGame.isOn = false;
        stopTimer();
        renderSmiley(WIN);
        console.log('win');
        setHighScore();
    }
}
function gameLost(i, j) {
    gGame.isOn = false;
    stopTimer();
    renderViruses();
    console.log('you lose')
    renderSmiley(LOSE);
}
function stopTimer() {
    clearInterval(gInterval);
}
function setLevel(level = EASY) {
    gLevel = level;
    restart();

}
function toggleHintMode(elBtn) {
    if (gGame.isOn) {
        if (!gGame.isHintMode && gGame.usedHints < HINTS) {
            gGame.isHintMode = true;
            console.log('hint mode on')
        } else {
            gGame.isHintMode = false;
        }
        renderHintMode(elBtn);
        renderHintBtn(elBtn);
        renderModal();
    }
}
function setHighScore() {
    var newScore = gGame.secsPassed;
    var bestYet = localStorage.getItem(gLevel.key);
    console.log(`best yet: (${bestYet}) new score: ${newScore}`)
    if (bestYet > newScore || bestYet === null) {
        localStorage.setItem(gLevel.key, newScore);
    }
    console.log(`${gLevel.key} new score ${newScore}`)
    renderHighestScores();
}
function cough (elCell, i, j){
    audioCough.play();
    gBoard[i][j].isShown = true;
    gBoard[i][j].isMarked = true;
    gGame.markedCount++
    renderInfected(elCell, i, j);
    // gameLost(i, j);
    gGame.livesLeft--;
    renderLives();
    checkGameOver();
}