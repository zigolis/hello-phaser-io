var game = new Phaser.Game(400, 490, Phaser.AUTO, 'stage');

var GameView = {
    preload: function() {
        game.stage.backgroundColor = '#71c5cf';
        game.load.image('lizBird', 'assets/img/LizBird.png');
        game.load.image('pipe', 'assets/img/pipe.png');
    },

    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.lizBird = this.game.add.sprite(100, 245, 'lizBird');

        game.physics.arcade.enable(this.lizBird);
        this.lizBird.body.gravity.y = 1000;

        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(20, 'pipe');

        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
    },

    update: function() {
        if (this.lizBird.inWorld == false) {
            this.restartGame();
        }
    },

    jump: function() {
        this.lizBird.body.velocity.y = -350;
    },

    restartGame: function() {
        game.state.start('main');
    },

    addOnePipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();

        pipe.reset(x, y);
        pipe.body.velocity.x = -200;
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
    }
};

game.state.add('main', GameView);
game.state.start('main');
