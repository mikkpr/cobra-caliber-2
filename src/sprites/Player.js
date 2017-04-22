import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game, x, y) {
    super(game, x, y, 'chars_small', 0)
    
    this.anchor.setTo(0.5)

    this.game.physics.arcade.enable(this)
    this.body.drag.x = this.body.drag.y = 500

    this.cursors = this.game.input.keyboard.createCursorKeys()
	
	// Gamepad support
	game.input.gamepad.start();
	
  }

  update () {
    const acc_v = 300
    if (this.cursors.up.isDown) {
      this.body.velocity.y = -acc_v
    } else if (this.cursors.down.isDown) {
      this.body.velocity.y = acc_v
    }
	
	if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
		this.body.velocity.y = -acc_v;
    }
    else if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) {
		this.body.velocity.y = acc_v;
    }
	
    const acc_h = 500
    if (this.cursors.left.isDown) {
      this.body.velocity.x = -acc_h
    } else if (this.cursors.right.isDown) {
      this.body.velocity.x = acc_h
    }
	
	if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
        this.body.velocity.x = -acc_h;
    }
    else if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
        this.body.velocity.x = acc_h;
    }
  }
}
