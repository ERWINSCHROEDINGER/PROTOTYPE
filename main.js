// This Code is now retired. Please rever to main.pde

var sketchProc = function(processingInstance) {
    with (processingInstance) {
       size(400, 400); 
       frameRate(60);
       
       // ProgramCodeGoesHere
       
    var KEYS = [];
    var DECAY = 1;
    var DECAYR = 1;
    var ROTATE = 0;
    var DELAY = 15;
    var RROTATE = 0;
    var RDELAY = 15;
    var RELOAD = 150;
    var ACCURACY = 5;
    var RRELOAD = 150;
    var MAGAZINE = 15;
    var MESSAGE = 580;
    var MESSAGER = 580;
    var RMAGAZINE = 15;
    var PAUSED = false;
    var OPPOSITION = [];
    var PROJECTILES = [];
    var TRANSPARENCY = 255;
    var TRANSPARENCYR = 255;
    var COORDINATES = [300, 300];

    keyPressed = function() {
        KEYS[keyCode] = true;
    };

    keyReleased = function() {
        KEYS[keyCode] = false;
    };

    var PROJECTILE = function() {
        this.ROTATE = ROTATE;
        this.x = COORDINATES[0];
        this.y = COORDINATES[1];
        this.ACCURACY = random(-ACCURACY, ACCURACY);
    };

    PROJECTILE.prototype.UPDATE = function() {
        this.x += cos(this.ROTATE + this.ACCURACY) * 15;
        this.y += sin(this.ROTATE + this.ACCURACY) * 15;
    };

    PROJECTILE.prototype.DISPLAY = function() {
        pushMatrix();
        translate(this.x, this.y);
        rotate(this.ROTATE - 90);
        noStroke();
        fill(50, 50, 50);
        rect(0, 0, 2, 8);
        popMatrix();
    };

    PROJECTILE.prototype.DELETE = function() {
        return this.x < 0 || this.x > 600 || this.y < 0 || 
        this.y > 600;
    };

    var ENEMY = function() {
        this.HEALTH = 5;
        this.POSITION = new PVector(random(600), random(600));
        this.VELOCITY = new PVector(0, 0);
        this.ACCELERATION = new PVector(0, 0);
    };

    ENEMY.prototype.UPDATE = function() {
        var AVATAR = new PVector(COORDINATES[0], COORDINATES[1]);
        var DIRECTION = PVector.sub(AVATAR, this.POSITION);
        DIRECTION.normalize();

        this.ACCELERATION = DIRECTION;
        this.VELOCITY.add(this.ACCELERATION);
        this.VELOCITY.limit(1);
        this.POSITION.add(this.VELOCITY);

        for(var i = 0; i < PROJECTILES.length; i ++ ) {
            if(dist(this.POSITION.x, this.POSITION.y, 
            PROJECTILES[i].x, PROJECTILES[i].y) <= 10) {
                this.HEALTH -= 1;
            }
        }
    };

    ENEMY.prototype.DISPLAY = function() {
        pushMatrix();
        translate(this.POSITION.x, this.POSITION.y);
        rotate(atan2(COORDINATES[1] - this.POSITION.y, 
        COORDINATES[0] - this.POSITION.x));
        rectMode(CENTER);
        noStroke();
        fill(150, 15, 15);
        rect(0, 0, 15, 15);
        popMatrix();
    };

    ENEMY.prototype.DELETE = function() {
        if(this.HEALTH <= 0) {
            return true;
        }
    };

    var PLAYER = function() {
        this.ROTATE = ROTATE;
        this.x = COORDINATES[0];
        this.y = COORDINATES[1];
    };

    PLAYER.prototype.UPDATE = function() {
        if(KEYS[UP]) {
            COORDINATES[1] -- ;
        }
        if(KEYS[DOWN]) {
            COORDINATES[1] ++ ;
        }
        if(KEYS[LEFT]) {
            COORDINATES[0] -- ;
        }
        if(KEYS[RIGHT]) {
            COORDINATES[0] ++ ;
        }
    };

    PLAYER.prototype.DISPLAY = function() {
        pushMatrix();
        translate(this.x, this.y);
        if(PAUSED === false) {
            rotate(this.ROTATE);
        }
        if(PAUSED === true) {
            rotate(RROTATE);
        }
        rectMode(CENTER);
        noStroke();
        fill(70, 70, 70);
        rect(0, 0, 20, 20);
        popMatrix();
    };

    PLAYER.prototype.EDGES = function() {
        if(this.x < 10) {
            COORDINATES[0] = 10;
        }
        if(this.x > 550) {
            COORDINATES[0] = 550;
        }
        if(this.y < 10) {
            COORDINATES[1] = 10;
        }
        if(this.y > 550) {
            COORDINATES[1] = 550;
        }
    };

    draw = function() {
        background(255);

        var PLAYERS = new PLAYER();
        if(PAUSED === false) {
            PLAYERS.UPDATE();
        }
        PLAYERS.DISPLAY();
        PLAYERS.EDGES();

        for(var i = 0; i < OPPOSITION.length; i ++ ) {
            var UNDETERMINED = OPPOSITION[i];
            if(PAUSED === false) {
                UNDETERMINED.UPDATE();
            }
            UNDETERMINED.DISPLAY();
            if(UNDETERMINED.DELETE()) {
                OPPOSITION.splice(i, 1);
            }
        }
        if(OPPOSITION.length <= 0) {
            OPPOSITION.push(new ENEMY());
        }

        for(var i = 0; i < PROJECTILES.length; i ++ ) {
            var SHELL = PROJECTILES[i];
            if(PAUSED === false) {
                SHELL.UPDATE();
            }
            SHELL.DISPLAY();
            if(SHELL.DELETE()) {
                PROJECTILES.splice(i, 1);
            }
        }

        DELAY -- ;
        if(mouseIsPressed && DELAY <= 0 && MAGAZINE > 0 && 
        PAUSED === false) {
            MAGAZINE -= 1;
            DELAY = RDELAY;
            PROJECTILES.push(new PROJECTILE());
        }
        if(MAGAZINE <= 0 && PAUSED === false) {
            RELOAD -- ;
        }
        if(MAGAZINE <= 0) {
            fill(70, 70, 70);
            textAlign(LEFT, LEFT);
            textSize(12);
            textFont(createFont("Arial Bold"));
            text("RELOADING", 15, 50);
        }
        if(RELOAD <= 0) {
            RELOAD = RRELOAD;
            MAGAZINE = RMAGAZINE;
        }

        if(KEYS[80]) {
            PAUSED = true;
            RROTATE = ROTATE;
        }
        if(KEYS[82]) {
            PAUSED = false;
        }

        fill(70, 70, 70);
        textAlign(LEFT, LEFT);
        textSize(12);
        textFont(createFont("Arial Bold"));
        text("AMMUNITION: " + MAGAZINE, 15, 20);
        text("RELOAD TIMER: " + RELOAD, 15, 35);
        text(OPPOSITION.HEALTH, 200, 200);

        if(PAUSED === true) {
            fill(255, 255, 255, 150);
            rect(300, 300, 600, 600);
            fill(70, 70, 70);
            textAlign(CENTER, CENTER);
            textSize(100);
            textFont(createFont("Arial Bold"));
            text("PAUSED", 300, 300);
        }
        if(MAGAZINE <= 0 && PAUSED === false) {
            DECAY -= 0.005;
            MESSAGE -= DECAY;
            TRANSPARENCY -= 2;
        }
        if(MAGAZINE <= 0) {
            fill(70, 70, 70, TRANSPARENCY);
            textAlign(CENTER, CENTER);
            textSize(15);
            textFont(createFont("Arial Bold"));
            text("MAGAZINE EMPTY", 300, MESSAGE);
        }
        if(MAGAZINE > 0) {
            DECAY = DECAYR;
            MESSAGE = MESSAGER;
            TRANSPARENCY = TRANSPARENCYR;
        }

        ROTATE = atan2(mouseY - COORDINATES[1], mouseX - 
        COORDINATES[0]);
    };

           }};

   // Get the canvas that Processing-js will use
   var canvas = document.getElementById("mycanvas"); 
   // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
   var processingInstance = new Processing(canvas, sketchProc); 
