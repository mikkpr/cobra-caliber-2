import Phaser from 'phaser'

import Boss from '../sprites/Boss'
import Player from '../sprites/Player'

import { enableMusicForState } from '../utils'

export default class extends Phaser.State {
  init (tilemap) {
    this.tilemap = tilemap

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
    this.map.addTilesetImage('lofi_environment_4x', 'tiles')

    // Add both the background and ground layers. We won't be doing anything
    // with the GroundLayer though
    this.backgroundLayer = this.map.createLayer('backgroundlayer')
    this.groundLayer = this.map.createLayer('groundlayer')

    // Change the world size to match the size of this layer
    this.groundLayer.resizeWorld()

    // Before you can use the collide function you need to set what tiles can collide
    this.map.setCollisionBetween(1, 1000, true, 'groundlayer')

    // Add the sprite to the game and enable arcade physics on it
    var playerSpawnX = 0
    var bossSpawnX = this.game.world.centerX + this.game.world.centerX / 2

    this.player = new Player(this.game, playerSpawnX, this.game.world.centerY, { canTurn: true, isFalling: false })
    this.player.body.velocity.x = 500

    this.world.add(this.player)

    this.boss = new Boss(this.game, this.player, bossSpawnX, this.game.world.centerY)
    this.world.add(this.boss)

    // Add gravity to the sprites.
    addGravity(this.player)
    addGravity(this.boss)

    // Make the camera follow the player.
    this.game.camera.follow(this.player)

    this.game.scale.pageAlignHorizontally = true
    this.game.scale.pageAlignVertically = true
    this.game.scale.refresh()

    this.game.time.advancedTiming = true

    this.player.body.collideWorldBounds = true
  }

  update () {
    // Make the sprite collide with the ground layer
    this.game.physics.arcade.collide(this.player, this.groundLayer)
    this.game.physics.arcade.collide(this.boss, this.groundLayer)
  }

  render () {
    this.game.debug.text(this.time.fps, 10, 20, '#00ff00')
  }

  shutdown () {
    this.disableMusic()
  }
}

function addGravity (item) {
  item.body.bounce.y = 0.1
  item.body.gravity.y = 1000
  item.body.drag.x = 1000
}
