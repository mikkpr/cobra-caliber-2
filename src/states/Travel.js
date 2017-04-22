import Phaser from 'phaser'

import Player from '../sprites/Player'

import Curve from '../plugins/Curve'

export default class extends Phaser.State {
  create () {
    this.game.world.enableBody = true
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.plugins.add(Curve, [50, 0, 0, 0, 50])

    this.map = this.game.add.tilemap('earth_travel')
    this.map.addTilesetImage('lofi_environment_4x', 'tiles')

    // Add both the background and ground layers. We won't be doing anything
    // with the GroundLayer though
    this.backgroundLayer = this.map.createLayer('backgroundlayer')
    this.backgroundLayer.resizeWorld()

    // Add the sprite to the game and enable arcade physics on it
    var playerSpawnX = this.game.world.centerX / 2

    this.player = new Player(this.game, playerSpawnX, this.game.world.centerY)
    this.world.add(this.player)

    // Make the camera follow the sprite
    this.game.camera.follow(this.player)

    // Enable cursor keys so we can create some controls
    this.cursors = this.game.input.keyboard.createCursorKeys()

    // Enable WASD movement
    this.upButton = this.game.input.keyboard.addKey(Phaser.Keyboard.UP)
    this.downButton = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN)

    this.game.scale.pageAlignHorizontally = true
    this.game.scale.pageAlignVertically = true
    this.game.scale.refresh()

    loadMap(this.game)
  }

  update () {
    setMovement(this.player.body, this.upButton, this.downButton)

    if (this.player.body.x >= this.world.bounds.width) {
      this.state.start('Fight')
    }
  }
}

function setMovement (sprite, up, down) {
  if (up.isDown) {
    sprite.velocity.y = 300
  } else if (down.isDown) {
    sprite.velocity.y = -300
  } else {
    sprite.velocity.y = 0
  }
}

function loadMap (game) {
  var travelEarth = 'assets/tilemaps/travel_earth/tiles.json'

  game.load.tilemap('tilemap', travelEarth, null, Phaser.Tilemap.TILED_JSON)
  game.load.image('tiles', 'assets/images/lofi_environment_4x.png', 32, 32, 16)
}
