import Phaser from 'phaser'

import Obstacle from './Obstacle'

export default class extends Obstacle {
  constructor (game, player, x, y, frame, bulletFrame, options = { target: null, burst: false, homing: false }) {
    super(game, player, x, y, frame)

    this.weapon = this.game.plugins.add(Phaser.Weapon)
    this.weapon.trackSprite(this)
    this.weapon.bulletSpeed = 600
    this.weapon.bulletAngleVariance = 20

    let bullets = 50
    this.weapon.fireRate = 200
    if (options.burst) {
      bullets = 10
      this.weapon.fireRate = 50
    }
    this.weapon.createBullets(bullets, 'chars_small', bulletFrame)

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

    if (this.target != null) {
      this.weapon.fireAtSprite(this.target)
    } else if (this.weapon.fire()) {
      this.weapon.fireAngle += 30
    }
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
