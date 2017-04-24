import Phaser from 'phaser'

import Obstacle from './Obstacle'

export default class extends Obstacle {
  constructor (game, player, x, y, turretSheet, turretFrame, bulletSheet, bulletFrame, options = {
    target: null, burst: false, homing: false
  }) {
    super(game, player, x, y, turretSheet, turretFrame)

    this.weapon = this.game.plugins.add(Phaser.Weapon)
    this.weapon.trackSprite(this)
    this.weapon.bulletSpeed = 600
    this.weapon.bulletAngleVariance = 20

    this.game.sound.shootSound = this.game.sound.shootSound || this.game.add.audio('shoot', 0.5)
    this.game.sound.shootSound.allowMultiple = true

    let bullets = 50
    this.weapon.fireRate = 200
    if (options.burst) {
      bullets = 10
      this.weapon.fireRate = 50
    }
    this.weapon.createBullets(bullets, bulletSheet, bulletFrame)

    this.homing = options.homing
    this.target = options.target
  }

  update () {
    super.update()

    this.game.physics.arcade.overlap(this.player, this.weapon.bullets, this.onCollision, null, this)
    if (this.target != null && this.homing) {
      this.weapon.forEach(this.home, this)
    }

    if (!this.inCamera) {
      return
    }
    let fired
    if (this.target != null) {
      fired = this.weapon.fireAtSprite(this.target)
    } else if (this.weapon.fire()) {
      fired = this.weapon.fireAngle += 30
    }

    if (fired) { this.game.sound.shootSound.play() }
  }

  home (bullet) {
    this.game.physics.arcade.accelerateToObject(bullet, this.target, 1000)
  }

  onCollision () {
    super.onCollision()
    if (this.target != null) {
      const saved = this.target
      this.target = null
      setTimeout(() => { this.target = saved }, 1000)
    }
  }
}
