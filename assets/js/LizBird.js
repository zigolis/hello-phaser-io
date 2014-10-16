var game = new Phaser.Game(400, 490, Phaser.AUTO, 'stage');

var GameView = {
    preload: function() {
        game.stage.backgroundColor = '#71c5cf';

        game.load.image('lizBird', 'assets/img/eliz.png');
        game.load.image('pipe', 'assets/img/pipe.png');
        game.load.audio('jump', 'assets/audio/jump.wav');
    },

    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Create a pipe group
        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(20, 'pipe');

        // Call addRowOfPipes each 1500ms
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        // Add lizBird to stage
        this.lizBird = this.game.add.sprite(100, 245, 'lizBird');

        // Enable / set physics system to lizBird
        game.physics.arcade.enable(this.lizBird);

        this.lizBird.body.gravity.y = 1200;

        // Set a central anchor
        this.lizBird.anchor.setTo(-0.2, 0.5);

        this.controls();

        // Add score to game
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });

        // Add a sound
        this.jumpSound = game.add.audio('jump');
    },

    controls: function() {
        // Define game controls
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        this.game.input.onDown.add(this.jump, this);
    },

    update: function() {
        // If lizBird go out the world
        if (this.lizBird.inWorld == false) {
            this.shutdown();
            this.restartGame();
        }

        // Detect collision
        game.physics.arcade.overlap(this.lizBird, this.pipes, this.hitPipe, null, this);

        // Rotate lizBird
        if (this.lizBird.angle < 20) {
            this.lizBird.angle += 1;
        }
    },

    jump: function() {
        // If lizBird is dead it doesn't jump
        if (this.lizBird.alive == false) {
            return;
        }

        // Set velocity
        this.lizBird.body.velocity.y = -400;

        // Create a lizBird animation
        var animation = game.add.tween(this.lizBird);
        animation.to({angle: -40}, 100);
        animation.start();

        // Play sound
        this.jumpSound.play();
    },

    hitPipe: function() {
        // If lizBird is alive
        if (this.lizBird.alive == false)
            return;

        // Set alive property
        this.lizBird.alive = false;

        // Remove new pipes
        this.game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

    restartGame: function() {
        game.state.start('main');
    },

    addOnePipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();

        pipe.reset(x, y);
        pipe.body.velocity.x = -220;
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        var hole = Math.floor(Math.random() * 5) + 1;

        for (var i = 0; i < 8; i++) {
            if (i != hole && i != hole + 1) {
                this.addOnePipe(400, i * 60 + 10);
            }
        }

        // Increase a point
        this.score += 1;
        this.labelScore.text = this.score;
    },

    shutdown: function() {
        // flush / destroy elements
        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        this.lizBird.destroy();
        this.pipes.destroy();
    },
};

game.state.add('main', GameView);
game.state.start('main');
