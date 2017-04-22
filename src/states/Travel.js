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
    this.player = new Player(this.game, 100, this.game.world.centerY)
    this.world.add(this.player)

    // Make the camera follow the sprite
    this.game.camera.follow(this.player)

    this.game.scale.pageAlignHorizontally = true
    this.game.scale.pageAlignVertically = true
    this.game.scale.refresh()
  }

  update () {
    if (this.player.body.x >= this.world.bounds.width) {
      this.state.start('Fight')
    }
  }
}
