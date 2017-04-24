import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game, player, x, y) {
    super(game, x, y, 'chars_large', 72)

    this.player = player

    this.anchor.setTo(0.5)

    this.game.sound.textSound = this.game.sound.textSound || this.game.add.audio('step', 0.25)
    this.game.sound.textSound.allowMultiple = true

    this.game.physics.arcade.enable(this)
    this.body.drag.x = this.body.drag.y = 500
  }

  say (text, completed) {
    var style = { font: '20px Press Start 2P', fill: '#ffffff', wordWrap: true, wordWrapWidth: 300, align: 'center' }
    this.text = this.game.add.text(0, 0, '', style)
    this.text.anchor.set(0.5)

    var context = this

    this.renderByLetter(text, () => {
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

      this.renderLetter(current, i, (n) => {
        if (n == split.length - 1) {
          setTimeout(() => {
            completed()
          }, 800)
        }
      })
    }
  }

  renderLetter (text, n, completed) {
    var textField = this.text
    setTimeout(() => {
      textField.setText(text)
      this.game.sound.textSound.play()
      completed(n)
    }, 50 * n)
  }

  update () {
    this.game.physics.arcade.overlap(this.player, this, this.onCollision, null, this)

    if (this.text != undefined) {
      this.text.x = Math.floor(this.x - this.width / 2)
      this.text.y = Math.floor(this.y - this.height)
    }
  }

  onCollision () {
    var velocity = (this.player.body.velocity.x + this.player.body.velocity.y) / 2

    if (velocity > 300) {
      var state = this.game.state
      this.game.sound.impactSound = this.game.sound.impactSound || this.game.add.audio('impact', 0.45)
      this.game.sound.allowMultiple = false
      if (!this.game.sound.impactSound.isPlaying) { this.game.sound.impactSound.play() }
      this.flyAway(this, 0, 20, () => { state.start('Travel', true, false, 'earth_fight') })
    }
  }

  flyAway (context, counter, angle, completed) {
    context.body.velocity.y = -200
    context.body.velocity.x = 100

    var scalex = this.scale.x - 0.01
    var scaley = this.scale.y - 0.01

    this.scale.set(scalex, scaley)

    this.angle = angle

    if (counter < 30) {
      counter++
      angle += 30
      setTimeout(() => { context.flyAway(context, counter, angle, completed) }, 150)
    } else {
      setTimeout(() => {
        completed()
      }, 200)
    }
  }
}
