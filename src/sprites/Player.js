import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game, x, y) {
    super(game, x, y, 'chars_small', 165)

    this.anchor.setTo(0.5)

    this.game.physics.arcade.enable(this)
    this.body.drag.x = this.body.drag.y = 500

    this.cursors = this.game.input.keyboard.createCursorKeys()

    this.game.input.gamepad.start()
  }

  update () {
    const pad1 = this.game.input.gamepad.pad1

    const accV = 300
    if (this.cursors.up.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
      this.body.velocity.y = -accV
    } else if (this.cursors.down.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) {
      this.body.velocity.y = accV
    }

    const accH = 500
    if (this.cursors.left.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
      this.body.velocity.x = -accH
    } else if (this.cursors.right.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
      this.body.velocity.x = accH
    }
  }
}
