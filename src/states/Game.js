import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}

  preload () {}

  create () {
    this.game.world.enableBody = true
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    this.map = this.game.add.tilemap('tilemap')
    this.map.addTilesetImage('lofi_environment_4x', 'tiles')

    // Add both the background and ground layers. We won't be doing anything with the
    // GroundLayer though
    this.backgroundLayer = this.map.createLayer('backgroundlayer')
    this.groundLayer = this.map.createLayer('groundlayer')

    // Before you can use the collide function you need to set what tiles can collide
    this.map.setCollisionBetween(1, 100, true, 'groundlayer')

    // Add the sprite to the game and enable arcade physics on it
    this.sprite = this.game.add.sprite(10, this.game.world.centerY, 'player')
    this.game.physics.arcade.enable(this.sprite)

    // Change the world size to match the size of this layer
    this.groundLayer.resizeWorld()

    console.log(this.groundLayer, this.backgroundLayer)

    // Set some physics on the sprite
    this.sprite.body.bounce.y = 0.2
    this.sprite.body.gravity.y = 3000
    this.sprite.body.gravity.x = 20
    this.sprite.body.velocity.x = 100

    // Make the camera follow the sprite
    this.game.camera.follow(this.sprite)

    // Enable cursor keys so we can create some controls
    this.cursors = this.game.input.keyboard.createCursorKeys()
  }

  update () {
    // Make the sprite collide with the ground layer
    this.game.physics.arcade.collide(this.sprite, this.groundLayer)

    // Make the sprite jump when the up key is pushed
    if (this.cursors.up.isDown) {
      this.sprite.body.velocity.y = -500
    }
  }
}
