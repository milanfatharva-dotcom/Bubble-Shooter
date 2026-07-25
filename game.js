const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

const R = 16;

const colors = [
    "#ff4757",
    "#2ed573",
    "#1e90ff",
    "#ffa502",
    "#e056fd"
];

let bubbles = [];

function randomColor(){
    return colors[Math.floor(Math.random()*colors.length)];
}

// Bubble atas
for(let y=0;y<6;y++){

    for(let x=0;x<10;x++){

        bubbles.push({

            x:35+x*32,

            y:35+y*32,

            color:randomColor(),

            r:R

        });

    }

}

let shooter = {

    x:W/2,

    y:H-40,

    angle:-90

};

let bullet = null;

canvas.addEventListener("pointermove",e=>{

    const rect=canvas.getBoundingClientRect();

    const mx=e.clientX-rect.left;

    const my=e.clientY-rect.top;

    shooter.angle=Math.atan2(my-shooter.y,mx-shooter.x);

});

canvas.addEventListener("pointerdown",()=>{

    if(bullet) return;

    bullet={

        x:shooter.x,

        y:shooter.y,

        vx:Math.cos(shooter.angle)*8,

        vy:Math.sin(shooter.angle)*8,

        color:randomColor(),

        r:R

    };

});

function update(){

    if(bullet){

        bullet.x+=bullet.vx;

        bullet.y+=bullet.vy;

        if(bullet.x<R||bullet.x>W-R){

            bullet.vx*=-1;

        }

        if(bullet.y<R){

            bullet=null;

        }

        for(let i=0;i<bubbles.length;i++){

            const b=bubbles[i];

            const dx=b.x-bullet.x;

            const dy=b.y-bullet.y;

            const d=Math.sqrt(dx*dx+dy*dy);

            if(d<R*2){

                bubbles.splice(i,1);

                bullet=null;

                break;

            }

        }

    }

}

function drawBubble(x,y,c){

    ctx.beginPath();

    ctx.arc(x,y,R,0,Math.PI*2);

    ctx.fillStyle=c;

    ctx.fill();

    ctx.strokeStyle="#fff";

    ctx.stroke();

}

function draw(){

    ctx.clearRect(0,0,W,H);

    bubbles.forEach(b=>drawBubble(b.x,b.y,b.color));

    if(bullet){

        drawBubble(bullet.x,bullet.y,bullet.color);

    }

    ctx.save();

    ctx.translate(shooter.x,shooter.y);

    ctx.rotate(shooter.angle);

    ctx.fillStyle="white";

    ctx.fillRect(0,-4,40,8);

    ctx.restore();

    drawBubble(shooter.x,shooter.y,"white");

}

function gameLoop(){

    update();

    draw();

    requestAnimationFrame(gameLoop);

}

gameLoop();
