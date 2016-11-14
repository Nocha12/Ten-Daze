(function () {
    var game = new Light.Game('game', 1100, 600, '#004A7B', function (asset) {
        asset.loadImage('e1', 'image/enemy1.png');
        asset.loadImage('e2', 'image/enemy2.png');
        asset.loadImage('player', 'image/player.png');
        asset.loadImage('g1', 'image/ground1.png');
        asset.loadImage('g2', 'image/ground2.png');
        asset.loadImage('bullet', 'image/bullet.png');
        asset.loadImage('weapon', 'image/weapon.png');
        asset.loadImage('back', 'image/back.png');
        asset.loadImage('tear', 'image/tear.png');
        asset.loadImage('slave', 'image/slave.png');
        asset.loadAudio('gunfire', 'audio/gun.wav');
    });

    var introState = new Light.State(game);
    var gameState = new Light.State(game);
    var endState = new Light.State(game);
    var life = 100;
    var day = 10;
    var develop = 0;
    var whip = 1;
    var exhaustion = 1;

    introState.onInit = function () {
        this.addChild(new Light.Sprite(game.asset.getImage('back')));
        this.titleText = new Light.TextField();
        this.titleText.font = "126px RixVideoGame";
        this.titleText.fillStyle = "#fff";
        this.titleText.position.set(320, 200);
        this.titleText.text = 'Ten Daze';
        this.addChild(this.titleText);

        this.infoText = new Light.TextField();
        this.infoText.font = "60px RixVideoGame";
        this.infoText.fillStyle = "#fff";
        this.infoText.position.set(400, 400);
        this.infoText.text = 'Click to Start';
        this.addChild(this.infoText);
    };
    introState.onUpdate = function () {
        if (game.input.mouse.isJustPressed(Light.Mouse.LEFT)) game.states.change('mainGame');
    };

    Unit = function (imgSrc) {
        Light.EntityContainer.call(this);
        this.sprite = new Light.Sprite(imgSrc);
        this.addChild(this.sprite);
        this.width = this.sprite.width;
        this.height = this.sprite.height;
        this.rotationCenter.x = this.sprite.width / 2;
        this.rotationCenter.y = this.sprite.height / 2;
    };
    Unit.prototype = Object.create(Light.EntityContainer.prototype);
    Unit.prototype.constructor = Unit;

    Tear = function () {
        Unit.call(this, game.asset.getImage('tear'));
    };
    Tear.prototype = Object.create(Unit.prototype);
    Tear.prototype.constructor = Tear;

    Slave = function () {
        Unit.call(this, game.asset.getImage('slave'));
    };
    Slave.prototype = Object.create(Unit.prototype);
    Slave.prototype.constructor = Slave;

    gameState.onInit = function () {
        game.input.keyboard.keyCapturing = [Light.Mouse.LEFT];
        this.addChild(new Light.Sprite(game.asset.getImage('back')));

        this.unitLayer = new Light.EntityContainer();
        this.addChild(this.unitLayer);

        this.tears = [];

        this.slave = new Slave();
        this.slave.x = 500;
        this.slave.y = 300;
        this.unitLayer.addChild(this.slave);

        this.lightSprite = new Light.Sprite('image/light.png');
        this.addChild(this.lightSprite);

        game.camera.smoothFollow = 7;
        game.camera.smoothZoom = 5;
        game.camera.follow(this.slave, new Light.Point(0, 100));
        this.tearCount = 0;
    };

    gameState.onUpdate = function (elapsed) {
        var localMousePos = game.camera.screenToLocal(game.input.mouse.position);
        var isMousePressed = game.input.mouse.isJustPressed(Light.Mouse.LEFT);

        for (var i = 0; i < this.tears.length; i++) {
            var t = this.tears[i];
            t.position.y += 5;

            if (isMousePressed && localMousePos.x > t.position.x && localMousePos.y > t.position.y && localMousePos.x < t.position.x + t.sprite.width && localMousePos.y < t.position.y + t.sprite.height)
            {
                this.tears.splice(this.tears.indexOf(this.tears), 1);
                this.unitLayer.removeChild(t);
                ++this.tearCount;
                console.log(this.tearCount);
            }
            else if(t.position.y >= 650)
            {
                this.tears.splice(this.tears.indexOf(this.tears), 1);
                this.unitLayer.removeChild(t);
            }
        }

        if (isMousePressed && localMousePos.x > this.slave.position.x && localMousePos.y > this.slave.position.y && localMousePos.x < this.slave.position.x + this.slave.sprite.width && localMousePos.y < this.slave.position.y + this.slave.sprite.height)
        {
            game.camera.shake(0.1, 2, 10, 10);
            var rand = Light.randomIn(1, 30);

            if(rand == 1)
            {
                this.tear = new Tear();
                this.tear.x = Light.randomIn(100, 1000);
                this.tear.y = -100;
                this.unitLayer.addChild(this.tear);
                this.tears.push(this.tear);
            }
        }
    };

    endState.onInit = function ()
    {
        game.backgroundColor = '#071e2e';
        this.scoreText = new Light.TextField();
        this.scoreText.font = "96px Dosis";
        this.scoreText.fillStyle = "#fff";
        this.scoreText.position.set(30, 300);
        this.scoreText.text = score;
        this.addChild(this.scoreText);

        this.infoText = new Light.TextField();
        this.infoText.font = "30px Dosis";
        this.infoText.fillStyle = "#fff";
        this.infoText.position.set(40, 400);
        this.infoText.text = 'Click to Restart';
        this.addChild(this.infoText);

        this.coolTime = 0;
    };
    endState.onUpdate = function (elapsed) {
        this.coolTime += elapsed;
        if (this.coolTime > 1 && game.input.mouse.isJustPressed(Light.Mouse.LEFT)) game.states.change('intro');
    };

    game.states.add('intro', introState);
    game.states.add('mainGame', gameState);
    game.states.add('end', endState);
    game.states.change('intro');
}());
