const friction = 0;

class ball {
    constructor(radius){
        this.r = radius;
        this.pos = {x:0, y:0};
        this.vel = {x:0, y:0};
        this.mass = radius * radius;
        // Ff = u * FN
        // F = m * a
    }

    updatePos() {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y; 
        var current_vel = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
        if (current_vel == 0) return;
        var new_vel = current_vel - friction; // t = 1?
        if (new_vel < 0)
            new_vel = 0;
        this.vel.x *= new_vel / current_vel;
        this.vel.y *= new_vel / current_vel;
    }

    setPos(x,y){
        this.pos.x = x;
        this.pos.y = y;
    }

    push(x,y){
        this.vel.x += x;
        this.vel.y += y;
    }
}
