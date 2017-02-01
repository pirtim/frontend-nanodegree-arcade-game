var stg = {
    canvas : {
        width : 505,
        height : 586
    },
    time_resolution : 1000.0,
    gameboard : {
        numRows : 6,
        numCols : 5,
        tiles : ["water", "stone", "stone", "stone", "grass", "grass"], // From top to bottom
        tile_height : 83,
        tile_width  : 101
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
        entities   : {
            "bug" : "images/enemy-bug.png",
        },
        items      : {
        }        
    }
}
stg.getTiles = function() {
    return this.gameboard.tiles.map(function(key){return this[key]}, this.resrc_map.tiles)
}
stg.getResources = function() {
    var resrc = []
    for (var key_i in this.resrc_map) {
        for (var key_j in this.resrc_map[key_i]) {
            resrc.push(this.resrc_map[key_i][key_j])
        }
    }
    return resrc
}
stg.checkStg = function() {
    if (this.gameboard.tiles.length != this.gameboard.numRows) {
        throw new Error("Numbers of rows is different than defined tiles rows.")}
    if (this.gameboard.tile_height * this.gameboard.numRows > this.canvas.height) {
        throw new Error("Tiles have not enough room on canvas (vertically).")}
    
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
            if (ajaxCallsRemaining <= 0) {
                if (!tilesHeight.reduce(function(a, b){ return (a === b) ? a : NaN; })){
                    throw new Error("Tiles are not the same size (vertically).")
                }
                if (self.gameboard.tile_height * (self.gameboard.numRows-1) + tilesHeight[0] > self.canvas.height){
                    throw new Error("Tiles have not enough room on canvas (vertically) (exact).")
                }
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
        if (!tilesHeight.reduce(function(a, b){ return (a === b) ? a : NaN; })){
            throw new Error("Tiles are not the same size (vertically).")
        }
        if (self.gameboard.tile_height * (self.gameboard.numRows-1) + tilesHeight[0] > self.canvas.height){
            throw new Error("Tiles have not enough room on canvas (vertically) (exact).")
        }
    }, function(reason) {
        console.log(reason)
    });
}
stg.checkStg()
