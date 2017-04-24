import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game, player, x, y) {
    super(game, x, y, 'scifi_monsters_large', 14)

    this.player = player

    this.anchor.setTo(0.5)

    this.game.physics.arcade.enable(this)
    this.body.drag.x = this.body.drag.y = 500
  }

  say (text, completed) {

    var style = { font: "15px Press Start 2P", fill: "#ffffff", wordWrap: true, wordWrapWidth: 300 , align: "center" };
    this.text = this.game.add.text(0, 0, "", style);
    this.text.anchor.set(0.5);

    this.renderByLetter(text, () => {
      this.text.destroy()
      completed()
    })
  }

  renderByLetter (text, completed) {
    var split = text.split('')
    var current = ''

    for (var i = 0; i < split.length; i++) {
      current += split[i]

      this.renderLetter(current, i, (n) => {
        if (n === split.length - 1) {
          setTimeout(() => {
            completed()
          }, 800)
        }
      })
    }
  }

  renderLetter (text, n, completed) {
    var textField = this.text

    const { textSound } = this.game.sound.repository

    setTimeout(() => {
      textField.setText(text)

      textSound.play()

      completed(n)
    }, 70 * n)
  }

  update () {

    this.game.physics.arcade.overlap(this.player, this, this.onCollision, null, this)

    if (this.text !== undefined) {
      this.text.x = Math.floor(this.x - this.width / 2)
      this.text.y = Math.floor(this.y - this.height)
    }
  }

  onCollision () {
    this.body.checkCollision.none = true

    var velocity = (this.player.body.velocity.x + this.player.body.velocity.y) / 2
    const { impactSound } = this.game.sound.repository

    if (Math.abs(velocity) > 200) {

      var state = this.game.state

      if (!impactSound.isPlaying) { impactSound.play() }

      this.onBossDeath(this, 0, 20, () => {

          if (this.isEarthFight()) {
            this.player.controlsEnabled = false
            this.player.say("What sorcery is this?", () => {
              this.movePlayerOffMap(() => {
                this.game.nextState()
              })
            })
          } else if (this.isMoonFight()) {
            this.player.controlsEnabled = false
            this.player.say("After you, there's only room for one...", () => {
              this.player.say("more!", () => {
                this.game.addTitle()
                this.movePlayerOffMap(() => {
                  setTimeout(() => { // FIXME: Doing this feels dumb
                    this.game.say('The year is 2007.\n The population of the MILKY WAY GALAXY is\n400 eleventy billion', () => {
                      this.game.say('Humanity has mined out the planets for money and now lives in orbit.', () => {
                        this.game.say('But for COBRA CALIBER,\nonly one life matters.', () => {
                          this.game.say('After slaying BARON NEON \nin his previous adventure,', () => {
                            this.game.say('only one man stands in the way of COBRA CALIBER.', () => {
                              this.game.say('COBRA CALIBER now jumps to other planets\nto defeat POWER ARMOR JOE, ', () => {
                                this.game.say('and to become the only IMMORTAL in the Galaxy!', () => {
                                  this.game.nextState()
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  }, 600)
                })
              });
            });
          } else {
            this.game.nextState()
          }

      })

    } else {
      console.log(velocity)
      this.player.say("No, I remember hitting him way harder than this", () => {
        this.body.checkCollision.none = false
      })
    }

  }

  isEarthFight () {
    return this.game.tilemap === "earth_fight"
  }

  isMoonFight () {
    return this.game.tilemap === "moon_fight"
  }

  onBossDeath (context, counter, angle, completed) {

    if (this.isEarthFight()) {

      this.fadeOut(completed)
    } else {
      this.flyAway(context, counter, angle, completed)
    }
  }

  fadeOut(completed) {

    const duration = 2000;

    game.add.tween(this).to( { alpha: 0 }, duration, Phaser.Easing.Linear.None, true);
    setTimeout(() => { completed() }, duration)
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

  movePlayerOffMap (completed) {

    this.game.camera.target = null
    this.player.body.gravity.x = 10000
    this.player.scale.setTo(1, 1)
    this.player.body.collideWorldBounds = false

    setTimeout(() => { completed() }, 3000)
  }
}






