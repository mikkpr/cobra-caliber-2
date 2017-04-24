import Phaser from 'phaser'

import Boss from '../sprites/Boss'
import Player from '../sprites/Player'

import { enableMusicForState } from '../utils'

export default class extends Phaser.State {
  init (tilemap) {
    this.tilemap = tilemap
    this.game.tilemap = tilemap

    if (tilemap === 'earth_fight') {
      this.stage.backgroundColor = '#3598db'
    }
  }

  create () {
    this.game.world.enableBody = true
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.curve.setPoints([50, 0, 0, 0, 50])

    this.disableMusic = enableMusicForState('ambient', this)

    this.map = this.game.add.tilemap(this.tilemap)
    this.map.addTilesetImage('lofi_environment_4x', 'tiles_lofi_environment')

    this.background = this.game.add.tileSprite(0,
      0,
      this.game.width,
      this.game.height,
      'bg1'
    )
    
    // Add both the background and ground layers. We won't be doing anything
    // with the GroundLayer though
    this.backgroundLayer = this.map.createLayer('backgroundlayer').resizeWorld()

    // Change the world size to match the size of this layer
    this.groundLayer = this.map.createLayer('groundlayer')
    this.groundLayer.resizeWorld()

    // Before you can use the collide function you need to set what tiles can collide
    this.map.setCollisionBetween(1, 1000, true, 'groundlayer')

    // Add the sprite to the game and enable arcade physics on it
    this.player = new Player(this.game, 16, this.game.world.centerY, { standing: true })
    this.world.add(this.player)

    // Player physics in this state.
    this.player.body.collideWorldBounds = true
    this.player.body.velocity.x = 500 // Player is flying in from orbit.
    this.player.body.maxVelocity.x = 500
    this.player.body.bounce.y = 0.3
    this.player.body.gravity.y = 2000

    var bossSpawnX = this.game.world.centerX + this.game.world.centerX / 2
    this.boss = new Boss(this.game, this.player, bossSpawnX, this.game.world.height - 90)
    this.world.add(this.boss)

    // Make the camera follow the player.
    this.game.camera.follow(this.player)

    this.game.scale.pageAlignHorizontally = true
    this.game.scale.pageAlignVertically = true
    this.game.scale.refresh()

    this.game.time.advancedTiming = true

    if (this.tilemap === 'moon_fight') {
      // Hack for game start.

      this.player.body.velocity.x = 0

      this.player.x = this.game.world.centerX - this.game.world.centerX / 2
      this.player.y = this.game.world.height - 80
    } else if (this.tilemap === 'earth_fight') {

      this.player.controlsEnabled = false

      this.player.say("Mind if I drop in?", () => {
        this.player.say("This world isn't big enough for the both of us!", () => {
          this.player.say("Especially after they mined it all out and made it so small", () => {
            this.boss.say("Ha ha ha!", () => {
              this.boss.say("This is just a THREE-DIMENSIONAL HOLOGRAM",() => {
                this.player.say("I will get you!", () => {
                  this.boss.say("I wouldn't hold my breath.", () => {
                    this.player.say("Then how do you think I got here?", () => {
                      this.player.controlsEnabled = true
                    })
                  })
                })
              })
            })
          })
        })
      })
    } else if (this.tilemap === 'mars_fight') {
      
    }

  }

  onStartClick () {
    const { clickSound } = this.game.sound.repository
    clickSound.play()

    this.startButton.destroy()

    var player = this.player
    var boss = this.boss

    setTimeout(() => {
      this.game.say('The year is 2007. The population of the Milky Way Galaxy is 400 billion', () => {
        this.game.say('But there can only be one...', () => {
          player.say('I have been looking for you for a long time, father', function () {
            boss.say('I left you to die in that pit. How did you survive?', function () {
              player.say('That should be the least of your concerns, old man', function () {
                player.say('Time to die', function () {})
              })
            })
          })
        })
      })
    }, 600)
  }

  update () {
    this.background.position.x = this.game.camera.position.x
    this.background.position.y = this.game.camera.position.y
    this.background.tilePosition.x -= this.player.body.velocity.x / 1000.0

    // Make the sprite collide with the ground layer
    this.game.physics.arcade.collide(this.player, this.groundLayer)
    this.game.physics.arcade.collide(this.boss, this.groundLayer)

    if (this.player.body.onFloor()) {
      this.player.body.velocity.x /= 2 // Break to a halt.
    }
    
    if (!this.player.controlsEnabled) {
      return
    }

    // Jump when on the floor.
    if (this.player.isMovingUp() && this.player.body.onFloor()) {
      this.player.body.velocity.y = -800
    }

    // Horizontal air control is slower than ground.
    const accX = this.player.body.onFloor() ? 450 : 50
    if (this.player.isMovingRight()) {
      this.player.scale.setTo(1, 1)
      this.player.body.velocity.x += accX
    } else if (this.player.isMovingLeft()) {
      this.player.scale.setTo(-1, 1)
      this.player.body.velocity.x -= accX
    } else if (this.player.body.onFloor()) {
      this.player.body.velocity.x /= 2 // Break to a halt.
    }
  }

  render () {
    this.game.debug.text(this.time.fps, 10, 20, '#00ff00')
  }

  shutdown () {
    this.disableMusic()
  }
}
