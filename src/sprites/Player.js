import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game, x, y) {
    super(game, x, y, 'chars_small', 0)
    
    this.anchor.setTo(0.5)

    this.game.physics.arcade.enable(this)
    this.body.drag.x = this.body.drag.y = 500

    this.cursors = this.game.input.keyboard.createCursorKeys()
  }

  update () {
    const acc_v = 300
    if (this.cursors.up.isDown) {
      this.body.velocity.y = -acc_v
    } else if (this.cursors.down.isDown) {
      this.body.velocity.y = acc_v
    }

    const acc_h = 500
    if (this.cursors.left.isDown) {
      this.body.velocity.x = -acc_h
    } else if (this.cursors.right.isDown) {
      this.body.velocity.x = acc_h
    }
  }
}
