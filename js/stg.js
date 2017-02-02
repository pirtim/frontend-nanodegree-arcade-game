"use strict";
var stg = {
    canvas : {
        width  : undefined, //stg.addComputable
        height : undefined, //stg.addComputable
        img_height : 171,
    },
    time_resolution : 1000.0,
    gameboard : {
        numRows : undefined, //stg.addComputable
        numCols : 18,
        tiles : ["water", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "grass", "grass"], // From top to bottom
        tiles_danger : undefined,
        tile_height : 83,
        tile_width  : 101,
        entityOffset : 25
    },
    player : {
        start_pos : {
            x : undefined, //stg.addComputable
            y : undefined
        }
    },
    enemies : {
        number : 30,
        density : 0.23,
        speedMin : 0.7,
        speedMax : 4.5,
        danger_zone : 0.8,
    },
    resrc_map : {
        tiles : {
            "water" : "images/water-block.png",
            "stone" : "images/stone-block.png",
            "grass" : "images/grass-block.png"
        },
        characters : {
            "boy"   : "images/char-boy.png",
            "cat_girl"  : "images/char-cat-girl.png",
            "horn_girl" : "images/char-horn-girl.png",
            "pink_girl" : "images/char-pink-girl.png",
            "princess_girl" : "images/char-princess-girl.png",
        },
        enemies   : {
            "bug" : "images/enemy-bug.png",
        },
        items      : {
            "star" : "images/Star.png"
        }        
    },
    deployment : {
        production : false,
        test_log   : true,
    }    
}
stg.addComputable = function (global) {
    console.log(global.window.innerHeight)
    console.log(global.window.innerWidth)
    this.gameboard.numRows = this.gameboard.tiles.length
    this.gameboard.tiles_danger = this.gameboard.tiles.map((item, index)=>{
        return (item === "stone") ? index : false;
    }).filter((item)=>{return item})
    console.log(this.gameboard.tiles_danger )
    this.canvas.width = this.gameboard.numCols * this.gameboard.tile_width,
    this.canvas.height = this.gameboard.tile_height * (this.gameboard.numRows-1) + this.canvas.img_height
    this.player.start_pos.x = Math.floor(this.gameboard.numCols / 2) - 1
    this.player.start_pos.y = this.gameboard.numRows - 1
}
stg.addComputable(this)

stg.getTiles = function() { // returns list of links to resources coresponding to tiles
    return this.gameboard.tiles.map(function(key){return this[key]}, this.resrc_map.tiles)
}
stg.getResources = function() { // return list of links to resources
    var resrc = []
    for (var key_i in this.resrc_map) {
        for (var key_j in this.resrc_map[key_i]) {
            resrc.push(this.resrc_map[key_i][key_j])
        }
    }
    return resrc
}
stg.checkStg = function() {
    // #1 test
    if (this.gameboard.tiles.length != this.gameboard.numRows) {
        throw new Error("Numbers of rows is different than defined tiles rows.")} else {
            if (this.deployment.test_log) {console.log("#1 test - Passed")};}
    // #2 test
    if (this.gameboard.tile_height * this.gameboard.numRows > this.canvas.height) {
        throw new Error("Tiles have not enough room on canvas (vertically).")} else {
            if (this.deployment.test_log) {console.log("#2 test - Passed")};}
    
    // OLD WAY
    var calls = Object.keys(this.resrc_map.tiles)
    var ajaxCallsRemaining = calls.length;
    var tilesHeight = [];    
    calls.forEach(function(key){
        var img = new Image();
            self = this
        // below real AJAX call
        img.onload = function() {
            tilesHeight.push(this.height)
            ajaxCallsRemaining--;
            if (ajaxCallsRemaining <= 0) { // #3.1 test
                if (!tilesHeight.reduce(function(a, b){ return (a === b) ? a : NaN; })){
                    throw new Error("Tiles are not the same size (vertically).")
                } else {if (self.deployment.test_log) {console.log("#3.1 test - Passed")};}
                if (self.gameboard.tile_height * (self.gameboard.numRows-1) + tilesHeight[0] > self.canvas.height){ // #4.1 test
                    throw new Error("Tiles have not enough room on canvas (vertically) (exact).")
                } else {if (self.deployment.test_log) {console.log("#4.1 test - Passed")};}
            }
        }
        img.src = this.resrc_map.tiles[key];        
    }, this)
    
    // PROMISES, ES6 required
    var promises = [];
    var calls = Object.keys(this.resrc_map.tiles);
    var self = this
    calls.forEach(function(key) {
        promises.push(new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function() {resolve(this.height);}
            img.src = self.resrc_map.tiles[key];        
        }));
    }, this);
    
    Promise.all(promises).then(function(tilesHeight) {
        if (!tilesHeight.reduce(function(a, b){ return (a === b) ? a : NaN; })){// #3.2 test
            throw new Error("Tiles are not the same size (vertically).")
        } else {if (self.deployment.test_log) {console.log("#3.2 test - Passed")};}
        if (self.gameboard.tile_height * (self.gameboard.numRows-1) + tilesHeight[0] > self.canvas.height){// #4.2 test
            throw new Error("Tiles have not enough room on canvas (vertically) (exact).")
        } else {if (self.deployment.test_log) {console.log("#4.2 test - Passed")};}
    }, function(reason) {
        console.log(reason)
    });
}
if (stg.deployment.production === false){
    stg.checkStg()
}

