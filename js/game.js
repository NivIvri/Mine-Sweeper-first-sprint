'use stric'
var MINE_ICON = '💥'
var FLAG = '🚩'
var gBoard;

var gLevel = {
    SIZE: 10,
    MINES: 1
}

var gTime1 = Date.now();
var gMyTime;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function initGame() {
    startTimer()
    gBoard = buildBoard();
    getRandomMine()
    console.table(gBoard)
    renderMat(gBoard, '.board-container')
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.isMine) {
                var neighborsCount = setMinesNegsCount(i, j, gBoard)
                currCell.minesAroundCount = neighborsCount.length;
            }

        }
    }
    renderMat(gBoard, '.board-container')
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isFlag: false,
                isMarked: false,
                location: { i, j }
            }

            //if (i === 0 && j === 1 || i === 0 && j === 2) {
            //    //board[i][j].isShown = true;
            //    board[i][j].isMine = true;
            //}
        }
    }
    return board;
}


function setMinesNegsCount(cellI, cellJ, mat) {
    var neighborsCount = [];
    //debugger;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (gBoard[i][j].isMine) {
                neighborsCount.push({ i, j });
            }
        }
    }
    return neighborsCount;
}


function renderMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell cell' + i + '-' + j;
            var cellValue;

            if (cell.isMine) {
                cellValue = (cell.isFlag) ? FLAG : MINE_ICON
            }
            else if (cell.isFlag) {
                cellValue = FLAG
            }
            else cellValue = cell.minesAroundCount


            if (cell.minesAroundCount === 0) {
                cell.minesAroundCount = '0'
            }
            strHTML += `<td class= "${className} " oncontextmenu="  cellMarked(this, ${i},${j});return false;" onclick= "cellClicked(this, ${i},${j})"><button>${cell.isShown ? cellValue : ''}</button></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

// clicking a cell with “number” reveals the//number of this cell

function cellClicked(elCell, i, j) {
    //if (!gLevel.isOn
    var currCell = gBoard[i][j]
    if (gBoard[i][j].isMine) {
        isALoss(i, j)
    }
    if (gGame.markedCount === gLevel.MINES) {
        isAVictory(i, j)
    }
    //console.log('the cliced cell', i, j);
    if (!currCell.isShown) {
        gGame.shownCount++;
        currCell.isShown = true;
        elCell.classList.add('neg')
        console.log(elCell);
        if (+(currCell.minesAroundCount) === 0 && !currCell.isMine && !currCell.isFlag) {
            expandShown(i, j, gBoard)
            return;
        }
        renderMat(gBoard, '.board-container')
    }
}


function cellMarked(elCell, cellI, cellJ) {
    var currCell = gBoard[cellI][cellJ];
    if ((elCell.innerText === '' && !currCell.isShown) || currCell.isFlag) {
        var btnValue
        if (currCell.isFlag) {
            btnValue = ''
            currCell.isFlag = false;
            currCell.isShown = false;
            gGame.markedCount--;
        }
        else {
            btnValue = FLAG
            currCell.isFlag = true;
            currCell.isShown = true;
            gGame.markedCount++;
            if (gGame.markedCount === gLevel.MINES - 1) {
                isAVictory()
            }
        }
        elCell.innerHTML = `<button>${btnValue}</button>`
    }
}



function isALoss() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isFlag) {
                currCell.isFlag = false;
                currCell.isShown = true;
            }
        }
    } renderMat(gBoard, '.board-container')
    var msg = 'you Loss GAME OVER'
    GameOver(msg)
}


function isAVictory() {

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = gBoard[i][j];
            if (!currCell.isFlag && currCell.isMine) return
            if (gGame.shownCount !== (gLevel.SIZE ** 2) - 2) return
        }
    }
    var msg = 'you win!!'
    GameOver(msg)
}

function GameOver(msg) {
    stopTimer();
    gLevel.isOn = false
    console.log(msg);
}




//When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors. 
function expandShown(i, j, gBoard) {
    var negsWitoutMines = 0;
    negsWitoutMines = countNeighbors(i, j, gBoard)

    for (var idx = 0; idx < negsWitoutMines.length; idx++) {
        currNeg = negsWitoutMines[idx]
        if (!currNeg.isShown) gGame.shownCount++;
        gBoard[currNeg.location.i][currNeg.location.j].isShown = true;
        renderMat(gBoard, '.board-container')
    }
}


function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = [];
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            var currCell = mat[i][j]
            neighborsCount.push(currCell);
        }
    }
    return neighborsCount;
}



function resetCells() {
    var rndCells = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            rndCells.push({ i, j });
        }
    }
    return rndCells
}



function getRandomMine() {
    var rndCells = resetCells();
    for (var i = 0; i < gLevel.MINES; i++) {
        var rndCell = rndCells.splice(getRandomInt(0, rndCells.length), 1)[0]

        gBoard[rndCell.i][rndCell.j].isMine = true;
        console.log([rndCell.i], [rndCell.j]);
    }

}


function startTimer() {
    gTime1 = Date.now();
    gMyTime = setInterval(timeCycle, 1);
}

function timeCycle() {
    var time2 = Date.now();
    var msTimeDiff = time2 - gTime1;
    var timeDiffStr = new Date(msTimeDiff).toISOString().slice(17, -1);
    document.querySelector('.timer').innerHTML = timeDiffStr;
}


function stopTimer() {
    clearInterval(gMyTime);
    document.querySelector('.stop').innerText;
}

