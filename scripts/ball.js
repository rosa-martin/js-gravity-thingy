const canvas = document.getElementById("canvas");

if(canvas == null){
    console.log("Something is wrong...");
}

let ctx = null;

if(canvas.getContext){
    ctx = canvas.getContext("2d");
} else {
    console.log("No context...");
}

let isClicked = false;
let lastBallX, lastBallY = 0;
let notBallDrawn = true;
let ball = null;
let velocity = null;
let doAnim = true;

let speedRatio = -10000;
let g = 0.001;
let overAllTime = 0;

//listeners
document.addEventListener("mousedown", onMouseDown, false);
document.addEventListener("mouseup", onMouseUp, false);
document.addEventListener("mousemove", onMouseMove, false);


//ball class
class Ball {
    constructor(x, y, r){
        this.x = x;
        this.y = y;
        this.r = r;
    }

    draw(){

        ctx.beginPath();
        ctx.arc(this.x-this.r-5, this.y-this.r-5, this.r, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();

    }

    move(time){
        this.x += velocity.x * time;
        this.y += velocity.y * time + 0.5*g*time^2;

    }
};

//vector class
class Vector {
    constructor(x, y, ratio){
        this.x = x / ratio;
        this.y = y / ratio;
    }
}


function onMouseDown(e){
    isClicked = !isClicked;
    lastBallX = e.clientX;
    lastBallY = e.clientY;
    drawBall(e);
    notBallDrawn = !notBallDrawn;
        
};

function onMouseUp(e){
    isClicked = !isClicked;
    notBallDrawn = !notBallDrawn;
    velocity = new Vector(lastBallX - e.clientX, lastBallY - e.clientY, speedRatio);

    moveAll();
    
};

function onMouseMove(e){
    if(isClicked){
       clearAll(e);
       ctx.strokeStyle = "red";
       ctx.lineWidth = 2;
       ctx.beginPath();

       ctx.moveTo(lastBallX - 15, lastBallY - 15);
       ctx.lineTo(e.clientX - 15, e.clientY - 15);
       ctx.stroke();
    }
};


//drawing
function drawBall(e){
    
    ctx.fillStyle = "rgb(0, 0, 200)";

    ball = new Ball(lastBallX, lastBallY, 10);
    ball.draw();
    
};

//advanced clear
function clearAll(e){
    ctx.clearRect(0, 0, canvas.getAttribute("width"), canvas.getAttribute("height"));

    if(!notBallDrawn){
        drawBall(e);
    }
}

//move animation
function moveAll(){
    if(doAnim){
        const time = new Date();
        overAllTime += time.getMilliseconds();
        ball.move(overAllTime);
        ctx.clearRect(0, 0, canvas.getAttribute("width"), canvas.getAttribute("height"));
        ball.draw();
        //console.log(ball.x);
        //console.log(ball.y);
        //console.log(time.getMilliseconds());

        if(ball.x >= canvas.getAttribute("width") || ball.y >= canvas.getAttribute("height") || ball.x <= 0 || ball.y <= 0){
            ctx.clearRect(0, 0, canvas.getAttribute("width"), canvas.getAttribute("height"));
            velocity = null;
            ball.x = null;
            ball.y = null;
            overAllTime = 0;
            ctx = null;
            ctx = canvas.getContext("2d");
            return;
        }
    
        window.requestAnimationFrame(moveAll);
    }
    
}