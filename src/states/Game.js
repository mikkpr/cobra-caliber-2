import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}

  preload () {

  }

  create () {
    this.game.world.enableBody = true
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    this.map = this.game.add.tilemap('tilemap')
    this.map.addTilesetImage('lofi_environment_4x', 'tiles')
    
    // Add both the background and ground layers. We won't be doing anything with the GroundLayer though
    this.backgroundLayer = this.map.createLayer('backgroundlayer')
    this.groundLayer = this.map.createLayer('groundlayer')

    // Before you can use the collide function you need to set what tiles can collide
    this.map.setCollisionBetween(1, 100, true, 'groundlayer')

    // Add the sprite to the game and enable arcade physics on it
    var player_spawn_x = this.game.world.centerX;
    var player_spawn_y = this.game.world.centerY;

    this.sprite = this.game.add.sprite(player_spawn_x, player_spawn_y, 'chars_ss')
    this.game.physics.arcade.enable(this.sprite)

    // Change the world size to match the size of this layer
    this.groundLayer.resizeWorld()

    // Set some physics on the sprite
    this.sprite.body.bounce.y = 0.3
    this.sprite.body.gravity.y = 1000
    this.sprite.body.gravity.x = 0
    this.sprite.anchor.setTo(0.5)

    // Make the camera follow the sprite
    this.game.camera.follow(this.sprite)

    // Enable cursor keys so we can create some controls
    this.cursors = this.game.input.keyboard.createCursorKeys()

    // Enable WASD movement
    this.upButton = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.downButton = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.leftButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightButton = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

    // Game scaling:
    //game.scale.setGameSize(1200, 450); // et voila!
    // game.position.x = 50;

    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.scale.refresh();

  }

  update () {

    // Make the sprite collide with the ground layer
    this.game.physics.arcade.collide(this.sprite, this.groundLayer)

    const player = this.sprite.body

    // Make the sprite jump when the up key is pushed
    if (player.onFloor() && (this.cursors.up.isDown || this.upButton.isDown)) {
      player.velocity.y = -400
    }

    if (this.cursors.right.isDown || this.rightButton.isDown) {
      
      if (this.cursors.right.shiftKey) {
        player.velocity.x = 200
      } else {
        player.velocity.x = 100
      }
      
      this.sprite.scale.x = 1

    } else if (this.cursors.left.isDown || this.leftButton.isDown) {
      
      if (this.cursors.left.shiftKey) {
        player.velocity.x = -200
      } else {
        player.velocity.x = -100
      }
      
      this.sprite.scale.x = -1

    } else {
      player.velocity.x = 0
    }

  }
}









