'use strict';
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            strHTML += getCellHTML(i, j, board);
        }
        strHTML += '</td>\n'
    }
    document.querySelector('.mat').innerHTML = strHTML;
}
function printBoard(board = gBoard) {
    var temp = []
    for (var i = 0; i < board.length; i++) {
        temp.push([]);
        for (var j = 0; j < board[0].length; j++) {
            var value;
            if (board[i][j].isVirus) value = '🦠'; //VIRUS;
            else {
                var cnt = board[i][j].virusesAroundCount;
                if (cnt) {
                    value = cnt;
                }
                else {
                    value = EMPTY;
                }
            }
            temp[i].push(value);
        }
    }
    console.table(temp);
}
function getCellHTML(i, j) {
    return `\t<td oncontextmenu="cellMarked(this,event)" onclick="cellClicked(this,${i},${j})"
     class="cell hidden" data-i="${i}" data-j="${j}">${COVERED}</td>\n`;
}
function renderCell(elCell, i, j) {
    var value;
    var selector = '';
    if (gBoard[i][j].isVirus) value = VIRUS;
    else {
        var cnt = gBoard[i][j].virusesAroundCount;
        if (cnt) {
            value = cnt;
            selector = `no${cnt}`
        }
        else {
            value = EMPTY;
        }
    }
    if (gBoard[i][j].isShown) {
        elCell.classList.remove('hidden');
        elCell.innerHTML = value;
        if (selector) elCell.classList.add(selector)
    } else if (gBoard[i][j].isMarked) {
        elCell.innerHTML = QUARANTINE;
    } else {
        elCell.innerHTML = COVERED;
        if (selector) elCell.classList.remove(selector);
        elCell.classList.add('hidden');
    }
}
function renderViruses() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMarked) continue;
            //TODO: if !virus render Xvirus
            if (gBoard[i][j].isVirus) {
                gBoard[i][j].isShown = true;
                var elCell = getElCell(i, j);
                elCell.classList.remove('hidden');

                renderCell(elCell, i, j);

            }
        }
    }
}
function renderInfected(elCell, iClicked, jClicked) {
    elCell.classList.remove('hidden');
    elCell.classList.add('infected');
    renderCell(elCell, iClicked, jClicked);
}
function getElCell(i, j) {
    return document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
}
function renderClock() {
    var ss = gGame.secsPassed % 60;
    ss = (ss < 10) ? '0' + ss : ss;
    var mm = (gGame.secsPassed - ss) % 60;
    mm = (mm < 10) ? '0' + mm : mm;
    var hh = (gGame.secsPassed - mm - ss) % 60;
    hh = (hh < 10) ? '0' + hh : hh;
    document.querySelector('.dashboard').innerHTML = `${hh}:${mm}:${ss}`
}
function renderSmiley(smiley) {
    var elSmiley = document.querySelector('.smiley').innerHTML = smiley;
}
function renderScore() {
    var elScore = document.querySelector('.score').innerHTML = 'current score:' + gGame.secsPassed;
}
function renderHintMode(elBtn) {
    if (gGame.isHintMode) {
        elBtn.classList.add('hidden');
    } else {
        elBtn.classList.remove('hidden');
    }
}
function renderLives() {
    var elLaVida = document.querySelector('.lives');
    var strHTML = '';
    for (var i = 0; i < gGame.livesLeft; i++) {
        strHTML += LIFE;
    }
    elLaVida.innerHTML = strHTML;
}
function renderHint(i, j) {

    for (var idx = i - 1; idx < i + 2; idx++) {
        for (var jdx = j - 1; jdx < j + 2; jdx++) {
            if (idx < 0 || jdx < 0) continue;
            if (idx >= gBoard.length || jdx >= gBoard[0].length) continue;
            var cell = gBoard[idx][jdx];
            var restore = cell.isShown;
            cell.isShown = true;
            renderCell(getElCell(idx, jdx), idx, jdx);
            hideAgainInASec(cell, idx, jdx, restore);
        }
    }
}
function hideAgainInASec(cell, i, j, restore) {
    setTimeout(() => {
        cell.isShown = restore;
        renderCell(getElCell(i, j), i, j);
        console.log('times up');

    }, 1000);
}
function renderHighestScores() {
    var bests = {};
    var strHTML = ''
    for (var i in LEVELS) {
        var best = localStorage.getItem(LEVELS[i].key);
        strHTML += `<tr><td>${LEVELS[i].key}</td><td>${best}</td></tr>`
    }
    document.querySelector('tbody.hall-of-fame').innerHTML = strHTML;
}
function renderHintBtn(elBtn = document.querySelector('.hint')){
    elBtn.style.display = (gGame.usedHints<HINTS)? 'inline':'none';
    renderHintMode(elBtn);
}
function renderModal(){
    var elModal=document.querySelector('.modal');
    var strHTML ='';
    if(gGame.isHintMode){
        strHTML+=`in order to reveal the content of a 9 cells block,`
        +` click on their middle. to cancel, hit the`
        +` hint button again. you have ${HINTS-gGame.usedHints} hints left`;
        elModal.innerHTML=strHTML;
        elModal.style.display='block';
    }else{
        elModal.style.display='none';
    }
}