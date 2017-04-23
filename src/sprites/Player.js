import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game, x, y, options = { canTurn: false, isFalling: true }) {
    super(game, x, y, 'chars_small', 165)

    this.canTurn = options.canTurn
    this.isFalling = options.isFalling

    this.anchor.setTo(0.5)

    this.game.physics.arcade.enable(this)
    this.body.drag.x = this.body.drag.y = 500

    this.cursors = this.game.input.keyboard.createCursorKeys()

    this.wasd = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
    }

    this.game.input.gamepad.start()

    // Add a bitchin trail because we are going supersonic
    this.playerTrail = this.game.add.emitter(this.x, this.y, 15)
    this.playerTrail.makeParticles('chars_small', 165)
    this.playerTrail.setXSpeed(0, 0)
    this.playerTrail.setYSpeed(0, 0)
    this.playerTrail.setAlpha(0.8, 0.01, 150)
    this.playerTrail.setRotation(0)
    this.playerTrail.start(false, 50, 10)

    this.body.collideWorldBounds = true
    this.body.onWorldBounds = new Phaser.Signal()
    this.body.onWorldBounds.add(this.hitWorldBounds, this)
  }

  hitWorldBounds (sprite, up, down, left, right) {
    if (sprite === this && right === true) {
      this.game.state.start('Fight')
    }
  }

  resetWithAnimation () {
    var duration = 500

    var x = this.x
    var y = this.y

    this.emitter = this.game.add.emitter(x, y, 6)
    this.emitter.makeParticles('chars_small', 200)
    this.emitter.width = 10
    this.emitter.height = 10
    this.emitter.minParticleScale = 0.5
    this.emitter.maxParticleScale = 3
    this.emitter.minParticleSpeed.set(0, 0)
    this.emitter.maxParticleSpeed.set(0, 0)
    this.emitter.gravity = 0
    this.emitter.start(false, duration, 50, 6)

    var player = this
    var world = this.game.world
    player.kill()

    setTimeout(function () {
      player.reset(50, world.centerY)
    }, duration)
  }

  update () {
    this.playerTrail.x = this.x
    this.playerTrail.y = this.y

    const accV = 300

    if (this.isMovingUp()) {
      if (this.isFalling || (!this.isFalling && this.body.onFloor())) {
        this.body.velocity.y = -accV
      }
    } else if (this.isMovingDown()) {
      if (this.isFalling) {
        this.body.velocity.y = accV
      }
    }

    const accH = 500

    if (this.isMovingLeft()) {
      this.body.velocity.x = -accH
      if (this.canTurn) {
        this.scale.setTo(-1, 1)
      }
    } else if (this.isMovingRight()) {
      this.body.velocity.x = accH
      if (this.canTurn) {
        this.scale.setTo(1, 1)
      }
    }
  }

  isMovingUp () {
    const pad1 = this.game.input.gamepad.pad1
    return this.cursors.up.isDown || this.wasd.up.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1
  }

  isMovingDown () {
    const pad1 = this.game.input.gamepad.pad1
    return this.cursors.down.isDown || this.wasd.down.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1
  }

  isMovingLeft () {
    const pad1 = this.game.input.gamepad.pad1
    return this.cursors.left.isDown || this.wasd.left.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1
  }

  isMovingRight () {
    const pad1 = this.game.input.gamepad.pad1
    return this.cursors.right.isDown || this.wasd.right.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1
  }
}
