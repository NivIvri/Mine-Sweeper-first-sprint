
function startTimer() {
    gTime1 = Date.now();
    gMyTime = setInterval(timeCycle, 1);
}

function timeCycle() {
    var time2 = Date.now();
    var msTimeDiff = time2 - gTime1;
    var timeDiffStr = new Date(msTimeDiff).toISOString().slice(17, -1);
    document.querySelector('.timer span').innerHTML = timeDiffStr;
}


function stopTimer() {
    clearInterval(gMyTime);
    //document.querySelector('.stop').innerText;
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
