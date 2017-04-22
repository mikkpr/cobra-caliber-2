import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game, x, y) {
    super(game, x, y, 'chars_large', 72)

    this.anchor.setTo(0.5)

    this.game.physics.arcade.enable(this)
    this.body.drag.x = this.body.drag.y = 500
  }
}
