"use strict";
// TODO
// siatka pol do poruszania
function rangeRandom (min, max) {
    return Math.random() * (max - min) + min
}
function integerRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Entity {
    render () {ctx.drawImage(Resources.get(this.sprite), this.xp, this.yp);}

    set x(xNew) { this.xp=xNew*stg.gameboard.tile_width; this._x = xNew }
    get x() { return this._x; }
    set y(yNew) {this.yp=yNew*stg.gameboard.tile_height - stg.gameboard.entityOffset; this._y = yNew}
    get y() { return this._y; }
}

class Enemy extends Entity {
    constructor(x, y) {
        super()
        this.x = x
        this.y = y
        this.speed = rangeRandom(stg.enemies.speedMin, stg.enemies.speedMax)
        this.sprite = stg.resrc_map.enemies.bug;
    }
    update(dt) { if (this.x < stg.gameboard.numCols) {
        this.x += this.speed * dt} else {this.x = -1}
    }
}

class Player extends Entity {
    constructor() {
        super()
        this.goToStart()
        this.sprite = stg.resrc_map.characters.boy;
    }

    set x(xNew) {
        if (0 <= xNew && xNew <= stg.gameboard.numCols - 1) {
            this.xp=xNew*stg.gameboard.tile_width; 
            this._x = xNew}
        }
    get x() { return this._x; }

    set y(yNew) {
        if (0 <= yNew && yNew <= stg.gameboard.numRows - 1) {
            this.yp=yNew*stg.gameboard.tile_height - stg.gameboard.entityOffset; 
            this._y = yNew}}
    get y() { return this._y; }

    goToStart () {
        this.x = stg.player.start_pos.x;
        this.y = stg.player.start_pos.y;
    }
    update (dt) {
        if (this.y === 0) {
            this.goToStart()
        }
    }
    handleInput (key) {
        switch (key) {
            case 'left':
                this.x -= 1;
                break;
            case 'right':
                this.x += 1;
                break;
            case 'up':
                this.y -= 1;
                break;
            case 'down':
                this.y += 1;
                break;
        }
    }
}


var allEnemies = []
for (var i = 0; i < 25; i++) {
    allEnemies.push(new Enemy(rangeRandom(0, stg.gameboard.numCols), integerRandom(1, 4))) 
}
// var allEnemies = [new Enemy(rangeRandom(stg.gameboard.numCols), 1),new Enemy(2, 2), new Enemy(0, 3)]
var player = new Player()

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
