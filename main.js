canvas = document.getElementById("cnvs");
ctx = canvas.getContext("2d");

width = window.innerWidth;
height = window.innerHeight;
function clear(){
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#000000';
    ctx.fillRect(0,0,width,height);
}

function draw_ball(b){
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(b.pos.x, b.pos.y, b.r, 0, 2 * Math.PI);
    ctx.stroke();
}

function RandomRange(min, max){
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

N = 7
Balls = [];
for (i = 0; i < N; i++){
    Balls.push(new ball(RandomRange(height/20,height/10)));
    Balls[i].pos = {x:RandomRange(100,900), y:RandomRange(100,700)};
    Balls[i].vel = {x:RandomRange(-8,8), y:RandomRange(-8,8)};
}

foundC = true;
while (foundC){
    foundC =false;
    for (i = 0; i < N - 1; i++)
        for (j = i + 1; j < N; j++) {
            dx = Balls[i].pos.x - Balls[j].pos.x;
            dy = Balls[i].pos.y - Balls[j].pos.y;
            sr = Balls[i].r + Balls[j].r;
            if (dx*dx+dy*dy <= sr*sr) {
                foundC = true;
                Balls[j].pos = {x:RandomRange(100,900), y:RandomRange(100,700)};
            }
        }
}

function Collide(i, j){
    //collisionX = (Balls[i].pos.x * Balls[j].r + Balls[j].pos.x * Balls[i].r) / (Balls[i].r + Balls[j].r);
    //collisionY = (Balls[i].pos.y * Balls[j].r + Balls[j].pos.y * Balls[i].r) / (Balls[i].r + Balls[j].r);

    distance = Math.sqrt((Balls[i].pos.x - Balls[j].pos.x) * (Balls[i].pos.x - Balls[j].pos.x) + (Balls[i].pos.y - Balls[j].pos.y) * (Balls[i].pos.y - Balls[j].pos.y));

    nx = (Balls[j].pos.x - Balls[i].pos.x) / distance;
    ny = (Balls[j].pos.y - Balls[i].pos.y) / distance;

    tx = -ny;
    ty = nx;

    dptan1 = Balls[i].vel.x * tx + Balls[i].vel.y * ty;
    dptan2 = Balls[j].vel.x * tx + Balls[j].vel.y * ty;

    dpnorm1 = Balls[i].vel.x * nx + Balls[i].vel.y * ny;
    dpnorm2 = Balls[j].vel.x * nx + Balls[j].vel.y * ny;

    m1 = (dpnorm1 * (Balls[i].mass - Balls[j].mass) + (2 * Balls[j].mass * dpnorm2)) / (Balls[i].mass + Balls[j].mass);
    m2 = (dpnorm2 * (Balls[j].mass - Balls[i].mass) + (2 * Balls[i].mass * dpnorm1)) / (Balls[j].mass + Balls[i].mass);

    Balls[i].vel.x = tx * dptan1 + nx * m1;
    Balls[i].vel.y = ty * dptan1 + ny * m1;
    Balls[j].vel.x = tx * dptan2 + nx * m2;
    Balls[j].vel.y = ty * dptan2 + ny * m2;

    Balls[i].pos.x += Balls[i].vel.x;
    Balls[i].pos.y += Balls[i].vel.y;
    Balls[j].pos.x += Balls[j].vel.x;
    Balls[j].pos.y += Balls[j].vel.y;
}

function loop(){
    if (width != window.innerWidth){
        width = window.innerWidth;
        canvas.width = width;
    }
    if (height != window.innerHeight){
        height = window.innerHeight;
        canvas.height = height;
    }
    canvas.height = height;
    for (i = 0; i < N; i++)
        Balls[i].updatePos();

    for (i = 0; i < N; i++){
        // deal with bounces against walls.
        if (Balls[i].pos.y - Balls[i].r <= 0 && Balls[i].vel.y <= 0){
            Balls[i].vel.y *= -1; 
            Balls[i].pos.y = Balls[i].r;
        }
        if (Balls[i].pos.x - Balls[i].r <= 0 && Balls[i].vel.x <= 0){
            Balls[i].vel.x *= -1; 
            Balls[i].pos.x = Balls[i].r;
        }
        if (Balls[i].pos.y + Balls[i].r >= height && Balls[i].vel.y >= 0){
            Balls[i].vel.y *= -1; 
            Balls[i].pos.y = height - Balls[i].r;
        }
        if (Balls[i].pos.x + Balls[i].r >= width && Balls[i].vel.x >= 0){
            Balls[i].vel.x *= -1; 
            Balls[i].pos.x = width - Balls[i].r;
        }
    }

    for (i = 0; i < N - 1; i++)
        for (j = i + 1; j < N; j++)
        {
            dx = Balls[i].pos.x - Balls[j].pos.x;
            dy = Balls[i].pos.y - Balls[j].pos.y;
            sr = Balls[i].r + Balls[j].r;
            if (dx*dx+dy*dy <= sr*sr){
                Collide(i,j);
            }
        }
    clear();
    for (i = 0; i < N; i++)
        draw_ball(Balls[i]);
}


setInterval(loop,20);
