import Phaser from 'phaser'

import Player from '../sprites/Player'
import Obstacle from '../sprites/Obstacle'
import Turret from '../sprites/Turret'

import { enableMusicForState } from '../utils.js'

export default class extends Phaser.State {
  init (fightTileMap) {
    this.fightTileMap = fightTileMap
  }

  create () {
    this.disableMusic = enableMusicForState('bigbeat', this)

    this.game.world.enableBody = true
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.curve.setPoints([50, 0, 0, 0, 50])

    this.map = this.game.add.tilemap('earth_travel')
    this.map.addTilesetImage('lofi_environment_4x', 'tiles')

    // Add both the background and ground layers. We won't be doing anything
    // with the GroundLayer though
    this.backgroundLayer = this.map.createLayer('backgroundlayer')
    this.backgroundLayer.resizeWorld()

    this.groundLayer = this.map.createLayer('groundlayer')
    this.map.setCollisionBetween(1, 1000, true, 'groundlayer')

    // Add the sprite to the game and enable arcade physics on it
    this.player = new Player(this.game, 100, 256, { canTurn: false, isFalling: true })
    this.world.add(this.player)
    this.player.body.gravity.x = 1800

    this.obstacle = new Obstacle(this.game, this.player, 300, this.game.world.centerY, 142)
    this.world.add(this.obstacle)

    this.turret = new Turret(this.game, this.player, 600, 100, 80, 179, { target: this.player, burst: true })
    this.world.add(this.turret)

    this.world.add(new Turret(this.game, this.player, 9600, 100, 80, 179, { target: this.player, burst: true }))
    this.world.add(new Turret(this.game, this.player, 7200, 100, 80, 179, { target: this.player, burst: false }))
    this.world.add(new Turret(this.game, this.player, 10560, 300, 80, 179, { target: this.player, burst: true }))
    this.world.add(new Turret(this.game, this.player, 11200, 200, 80, 179, { target: this.player, burst: true }))
    this.world.add(new Turret(this.game, this.player, 11800, 300, 80, 179, { target: this.player, burst: true }))
    this.world.add(new Turret(this.game, this.player, 11904, 100, 80, 179, { target: this.player, burst: true }))
    this.world.add(new Turret(this.game, this.player, 14720, 100, 80, 179))
    this.world.add(new Turret(this.game, this.player, 20384, 256, 80, 179, { target: this.player, burst: true, homing: true }))

    // Make the camera follow the sprite
    // FIXME: replaced with ugly hack to only travel on x-axis for the presenatation.
    //this.game.camera.follow(this.player)
    this.game.camera.setPosition(0, 0)

    this.game.scale.pageAlignHorizontally = true
    this.game.scale.pageAlignVertically = true
    this.game.scale.refresh()

    this.game.time.advancedTiming = true

    this.player.body.collideWorldBounds = true
    this.player.body.onWorldBounds = new Phaser.Signal()
    this.player.body.onWorldBounds.add(this.hitWorldBounds, this)
  }

  render () {
    this.game.debug.text(this.time.fps, 10, 20, '#00ff00')
  }

  update () {
    this.game.camera.x = this.player.x - this.game.width / 2
    this.game.physics.arcade.collide(this.player, this.groundLayer, this.player.resetWithAnimation, null, this.player)
  }

  shutdown () {
    this.disableMusic()
  }

  hitWorldBounds (sprite, up, down, left, right) {
    if (sprite === this.player && right === true) {
      this.game.state.start('Fight', true, false, this.fightTileMap)
    }
  }
}
