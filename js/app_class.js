"use strict";
// TODO
// siatka pol do poruszania

class Entity {
    render () {ctx.drawImage(Resources.get(this.sprite), this.xp, this.yp);}
    
    set x(xNew) {this.xp=xNew*stg.gameboard.tile_width; this._x = xNew}
    get x() { return this._x; }
    set y(yNew) {this.yp=yNew*stg.gameboard.tile_height; this._y = yNew}
    get y() { return this._y; }
}

class Enemy extends Entity {
    constructor() {
        super()
        this.xp = 0
        this.yp = 60
        this.y = 2    
        console.log(this.y)
        console.log(this.yp) 
        this.sprite = stg.resrc_map.enemies.bug;
    }
    update(dt) { if (this.xp < 400) {this.xp += 100 * dt} }
}

class Player extends Entity {
    constructor() {
        super()
        this.xp = 200
        this.yp = 380
        this.y = 2    
        console.log(this.y)
        console.log(this.yp) 
        this.sprite = stg.resrc_map.characters.boy;
    }
    update (dt) {}
    handleInput (key) {
        var speed_v = stg.gameboard.tile_height
        var speed_h = stg.gameboard.tile_width
        switch (key) {
            case 'left':
                this.xp -= speed_h;
                break;
            case 'right':
                this.xp += speed_h;
                break;
            case 'up':
                this.yp -= speed_v;
                break;
            case 'down':
                this.yp += speed_v;
                break;
        }
    }
}

var allEnemies = [new Enemy()]
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
