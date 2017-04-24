import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game, x, y, options = { canTurn: false, isFalling: true }) {
    super(game, x, y, 'chars_scifi', 220)

    this.canTurn = options.canTurn
    this.isFalling = options.isFalling

    this.animations.add('explode', ['expl1, expl2'])

    this.anchor.setTo(0.5)

    this.game.physics.arcade.enable(this)

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
    this.playerTrail.makeParticles('chars_scifi', 220)
    this.playerTrail.setXSpeed(0, 0)
    this.playerTrail.setYSpeed(0, 0)
    this.playerTrail.setAlpha(0.4, 0.01, 150)
    this.playerTrail.setRotation(0)
    this.playerTrail.start(false, 50, 10)
  }

  say (text, completed) {
    var style = { font: '20px Press Start 2P', fill: '#ffffff', wordWrap: true, wordWrapWidth: 300, align: 'center' }
    this.text = this.game.add.text(0, 0, '', style)
    this.text.anchor.set(0.5)
    
    var context = this

    this.renderByLetter(text, function () {
      context.text.destroy()
      completed()
    })
  }

  renderByLetter (text, completed) {
    var split = text.split('')
    var current = ''

    var textField = this.text

    for (var i = 0; i < split.length; i++) {
      current += split[i]

      this.renderLetter(current, i, function (n) {
        if (n == split.length - 1) {
          setTimeout(function () {
            completed()
          }, 800)
        }

      })
    }
  }

  renderLetter (text, n, completed) {
    var textField = this.text
    setTimeout(function () {
      textField.setText(text)
      completed(n)
    }, 50 * n)
  }

  resetWithAnimation () {
    var duration = 500

    var x = this.x
    var y = this.y

    this.emitter = this.game.add.emitter(x, y, 4)
    this.emitter.makeParticles(['expl1', 'expl2'], 2)
    this.emitter.width = 24
    this.emitter.height = 24
    this.emitter.minParticleScale = 1
    this.emitter.maxParticleScale = 4
    this.emitter.minParticleSpeed.set(0, 0)
    this.emitter.maxParticleSpeed.set(0, 0)
    this.emitter.gravity = 0
    this.emitter.start(false, duration, 10, 4)

    var player = this
    player.kill()
    this.game.deathCounter += 1

    setTimeout(function () {
      player.reset(50, 256)
    }, duration)
  }

  update () {
    if (this.text != undefined) {
      this.text.x = Math.floor(this.x - this.width / 2)
      this.text.y = Math.floor(this.y - 1.5 * this.height)
    }

    this.playerTrail.x = this.x
    this.playerTrail.y = this.y
  }

  isMovingUp () {
    const pad1 = this.game.input.gamepad.pad1
    return this.cursors.up.isDown || this.wasd.up.isDown ||
    pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1
  }

  isMovingDown () {
    const pad1 = this.game.input.gamepad.pad1
    return this.cursors.down.isDown || this.wasd.down.isDown ||
    pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1
  }

  isMovingLeft () {
    const pad1 = this.game.input.gamepad.pad1
    return this.cursors.left.isDown || this.wasd.left.isDown ||
    pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1
  }

  isMovingRight () {
    const pad1 = this.game.input.gamepad.pad1
    return this.cursors.right.isDown || this.wasd.right.isDown ||
    pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1
  }
}
