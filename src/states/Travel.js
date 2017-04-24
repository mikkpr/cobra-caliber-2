import Phaser from 'phaser'

import Player from '../sprites/Player'
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
    this.map.addTilesetImage('lofi_environment_4x', 'tiles_lofi_environment')
    this.map.addTilesetImage('lofi_scifi_stations_4x', 'tiles_lofi_stations')
    this.map.addTilesetImage('lofi_scifi_stations_2_4x', 'tiles_lofi_stations_2')
    this.map.addTilesetImage('lofi_scifi_stations_3_4x', 'tiles_lofi_stations_3')
    this.map.addTilesetImage('lofi_scifi_items_4x', 'tiles_lofi_items')
    this.map.addTilesetImage('lofi_interface_4x', 'tiles_interface')
    this.map.addTilesetImage('lofi_scifi_ships_2_4x', 'tiles_ships_2')

    // Add both the background and ground layers. We won't be doing anything
    // with the GroundLayer though
    this.backgroundLayer = this.map.createLayer('backgroundlayer')
    this.backgroundLayer.resizeWorld()

    this.bg1 = this.game.add.tileSprite(0,
      0,
      this.game.world.width,
      this.game.world.height,
      'bg1'
    )

    this.bg2 = this.game.add.tileSprite(0,
      0,
      this.game.world.width,
      this.game.world.height,
      'bg2'
    )

    this.groundLayer = this.map.createLayer('groundlayer')
    this.map.setCollisionBetween(1, 1000, true, 'groundlayer')

    // Add the sprite to the game and enable arcade physics on it
    this.player = new Player(this.game, 100, 256)
    this.world.add(this.player)

    // Player physics in this state.
    this.maxVelocity = 800 // Default max velocity, can be overridden by dashing.
    this.player.body.maxVelocity.x = this.maxVelocityX
    this.player.body.gravity.x = 1800

    this.player.body.collideWorldBounds = true
    this.player.body.onWorldBounds = new Phaser.Signal()
    this.player.body.onWorldBounds.add(this.hitWorldBounds, this)

    // Add turrets.
    const turretSheet = 'chars_large'
    const bulletSheet = 'chars_small'
    new Array( // Use new Array instead of [] so webpack does not get confused.
      [ 600, 100, 80, 179, {target: this.player, bullets: 10, rate: 50}],
      [ 7200, 100, 80, 179, {target: this.player}],
      [ 9600, 100, 80, 179, {target: this.player, bullets: 10, rate: 50}],
      [10560, 300, 80, 179, {target: this.player, bullets: 10, rate: 50}],
      [11200, 200, 80, 179, {target: this.player, bullets: 10, rate: 50}],
      [11900, 366, 80, 179],
      [11900, 32, 80, 179],
      [14720, 100, 80, 179],
      [20384, 256, 80, 179, {target: this.player, bullets: 10, rate: 50, homing: true}]
    ).forEach(([x, y, turretFrame, bulletFrame, options]) =>
      this.world.add(new Turret(this.game, x, y,
        turretSheet, turretFrame, bulletSheet, bulletFrame, options)))

    // Make the camera follow the sprite
    // FIXME: replaced with ugly hack to only travel on x-axis for the presenatation.
    // this.game.camera.follow(this.player)
    this.game.camera.setPosition(0, 0)

    this.game.scale.pageAlignHorizontally = true
    this.game.scale.pageAlignVertically = true
    this.game.scale.refresh()

    this.game.time.advancedTiming = true
  }

  render () {
    this.game.debug.text(this.time.fps, 10, 20, '#00ff00')
    this.game.debug.text(`Alternate dimensions where you could have died: ${this.game.deathCounter}`, 500, 20, '#00ff00')
  }

  update () {
    this.bg1.tilePosition.x -= this.player.body.velocity.x / 1000.0
    this.bg2.tilePosition.x -= this.player.body.velocity.x / 700.0

    this.game.camera.x = this.player.x - this.game.width / 3 // Possibly go to quarter distance when turrets are fixed
    this.game.physics.arcade.collide(this.player, this.groundLayer, this.player.resetWithAnimation, null, this.player)

    // Vertical movement is instant.
    const accY = 350
    if (this.player.isMovingUp()) {
      this.player.body.velocity.y = -accY
    } else if (this.player.isMovingDown()) {
      this.player.body.velocity.y = accY
    } else {
      this.player.body.velocity.y = 0 // Vertical movement has to be precise
    }

    // Horizontal dashing is almost instant, braking takes time.
    const accX = 360
    if (this.player.isMovingRight()) {
      this.player.body.maxVelocity.x = this.maxVelocity + accX
      this.player.body.velocity.x += accX
    } else if (this.player.isMovingLeft()) {
      this.player.body.maxVelocity.x = this.maxVelocity - accX
      this.player.body.velocity.x -= accX / 6
    } else {
      this.player.body.maxVelocity.x = this.maxVelocity
    }
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
