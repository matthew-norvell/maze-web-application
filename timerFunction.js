var sec = 0;
var timer = 0;
function pad(val) {
    return val > 9 ? val : "0" + val;
}
function start(){
timer = setInterval(function () {
    document.getElementById("seconds").innerHTML = pad(++sec % 60);
    document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60, 10));
}, 1000);
}
function stop(){
let seconds=document.getElementById("seconds").innerHTML
let minutes= document.getElementById("minutes").innerHTML
setTimeout(function () {
    clearInterval(timer);
});
alert("Your score is = "+minutes+":"+seconds)
sec=-1
document.getElementById("seconds").innerHTML = pad(++sec % 60);
    document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60, 10));


}


