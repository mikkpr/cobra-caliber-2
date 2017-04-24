
import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game, player, x, y, sheet, frame) {
    super(game, x, y, sheet, frame)

    this.player = player

    this.anchor.setTo(0.5)

    this.game.physics.arcade.enable(this)
    this.body.drag.x = this.body.drag.y = 500
  }

  update () {
    this.game.physics.arcade.overlap(this.player, this, this.onCollision, null, this)
  }

  onCollision () {
    this.player.resetWithAnimation()
  }
}
