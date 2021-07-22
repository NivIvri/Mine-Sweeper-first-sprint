'use stric'
var MINE_ICON = '💥'
var FLAG = '🚩'
var gBoard;

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gTime1 = Date.now();
var gMyTime;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    minesCount: 0,
    secsPassed: 0
}
var gFirstClick = true
var gLives = 3;

function initGame(gameLevel) {
    gGame.minesCount = 0;
    gLives = (gameLevel.size === 4) ? 2 : 3
    stopTimer()
    document.querySelector('.timer span').innerHTML = 0;
    document.querySelector('.icon').innerText = '😊';
    document.querySelector('.lives button').innerText = gLives
    gFirstClick = true;
    gLevel.SIZE = gameLevel.size;
    gLevel.MINES = gameLevel.mines;
    gGame.isOn = true
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gBoard = buildBoard();
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
        }
    }
    return board;
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

            strHTML += `<td class= "${className} " oncontextmenu="  cellMarked(this, ${i},${j});return false;" onclick= "cellClicked(${i},${j})"><button>${cell.isShown ? cellValue : ''}</button></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}


function cellClicked(i, j) {
    var currCell = gBoard[i][j]
    if (!gGame.isOn) return;
    if (currCell.isShown) return;

    if (gFirstClick) {
        startTimer()
        gBoard[i][j].isShown = true;
        gFirstClick = false;
        gGame.shownCount = 1;
        getNegAndMines()
        return;
    }

    gGame.shownCount++;
    if (currCell.isMine) {
        gLives--;
        gGame.minesCount++;
        document.querySelector('.lives button').innerText = gLives
    }

    CheckGameStatus()

    currCell.isShown = true;
    if (+(currCell.minesAroundCount) === 0 && !currCell.isMine && !currCell.isFlag) {
        expandShown(i, j, gBoard)
        return;
    }
    renderMat(gBoard, '.board-container')
}



function getNegAndMines() {
    getRandomMine()
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.isMine) {
                var neighborsCount = setMinesNegsCount(i, j, gBoard)
                currCell.minesAroundCount = neighborsCount;
            }
        }
    }
    renderMat(gBoard, '.board-container')
}


function setMinesNegsCount(cellI, cellJ, mat) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (gBoard[i][j].isMine) {
                neighborsCount++
            }
        }
    }
    return neighborsCount;
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
            //debugger;
            if (currCell.isMine) CheckGameStatus()
        }
        elCell.innerHTML = `<button>${btnValue}</button>`
    }
}

//When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors. 
function expandShown(i, j, gBoard) {
    var negsWitoutMines = 0;
    negsWitoutMines = countNeighbors(i, j, gBoard)
    for (var idx = 0; idx < negsWitoutMines.length; idx++) {
        currNeg = negsWitoutMines[idx]
        if (!currNeg.isShown) {
            gBoard[currNeg.location.i][currNeg.location.j].isShown = true;
            gGame.shownCount++;
        }
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

function CheckGameStatus() {

    if (gLives === 0) {
        document.querySelector('.lives button').innerHTML = '0';
        for (var i = 0; i < gLevel.SIZE; i++) {
            for (var j = 0; j < gLevel.SIZE; j++) {
                var currCell = gBoard[i][j];
                if (currCell.isFlag) {
                    currCell.isFlag = false;
                    currCell.isShown = true;
                }
                if (currCell.isMine) {
                    currCell.isShown = true;
                }
            }
        }
        renderMat(gBoard, '.board-container')
        GameOver(false)
    }

    else {
        if (gGame.markedCount + gGame.minesCount === +gLevel.MINES && (gGame.shownCount + gGame.markedCount) >= (gLevel.SIZE ** 2)) {
            GameOver(true)
        }
    }
}


function GameOver(isEndGame) {
    stopTimer();
    var elIcon = document.querySelector('.icon')

    if (!isEndGame) {
        elIcon.innerText = '😭';
    }
    else {
        elIcon.innerText = '😎';
    }
    gLevel.isOn = false

}

function getRandomMine() {
    var rndCells = resetCells();
    for (var i = 0; i < gLevel.MINES; i++) {
        var rndCell = rndCells.splice(getRandomInt(0, rndCells.length), 1)[0]
        gBoard[rndCell.i][rndCell.j].isMine = true;
    }

}


function resetCells() {
    var rndCells = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (!gBoard[i][j].isShown) {
                rndCells.push({ i, j })
            }
        }
    }
    return rndCells
}


