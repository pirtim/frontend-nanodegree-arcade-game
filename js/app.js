"use strict";
// TODO
// siatka pol do poruszania

var Entity = function() {
    this.xp = undefined;
    this.yp = undefined;
}
Object.defineProperty(Entity.prototype,"x",{
    set: function(x){this.xp=x*stg.gameboard.tile_width; this._x = x},
    get: function(x){return this._x;}});
Object.defineProperty(Entity.prototype,"y",{
    set:function(y){this.yp=y*stg.gameboard.tile_height; this._y = y},
    get:function(y){return this._y;}
});
Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.xp, this.yp);
};

var Enemy = function() {
    Entity.call(this)
    this.xp = 0
    this.yp = 60
    this.y = 2    
    console.log(this.y)
    console.log(this.yp) 
    this.sprite = stg.resrc_map.enemies.bug;
};
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.update = function(dt) {
    if (this.xp < 400) {
        this.xp += 100 * dt
    }
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

var Player = function() {
    Entity.call(this)
    this.xp = 200
    this.yp = 380
    this.y = 2 
    console.log(this.y)
    console.log(this.yp) 
    this.sprite = stg.resrc_map.characters.boy;
};
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function(dt){
}
Player.prototype.handleInput = function(key) {
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
};

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
