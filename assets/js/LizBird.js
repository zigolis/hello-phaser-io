var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

var GameView = {
    preload: function () {
        game.stage.backgroundColor = '#71c5cf';
        game.load.image('lizBird', 'assets/img/LizBird.png');
    },

    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.lizBird = this.game.add.sprite(100, 245, 'lizBird');

        game.physics.arcade.enable(this.lizBird);
        this.lizBird.body.gravity.y = 1000;

        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
    },

    update: function () {
        if (this.lizBird.inWorld == false) {
            this.restartGame();
        }
    },

    jump: function () {
        this.lizBird.body.velocity.y = -350;
    },

    restartGame: function () {
        game.state.start('main');
    }
};

game.state.add('main', GameView);
game.state.start('main');
