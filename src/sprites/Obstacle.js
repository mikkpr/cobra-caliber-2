
import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game, x, y, sheet, frame) {
    super(game, x, y, sheet, frame)

    this.anchor.setTo(0.5)

    this.game.physics.arcade.enable(this)
    this.body.immovable = true
  }
}
