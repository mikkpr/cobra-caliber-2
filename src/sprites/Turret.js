import Phaser from 'phaser'

import Obstacle from './Obstacle'

export default class extends Obstacle {
  constructor (game, x, y, turretSheet, turretFrame, bulletSheet, bulletFrame, options = {
    target: null, bullets: 50, rate: 200, speed: 600, cone: 20, homing: false
  }) {
    super(game, x, y, turretSheet, turretFrame)

    this.weapon = this.game.plugins.add(Phaser.Weapon)
    this.weapon.trackSprite(this)
    this.weapon.createBullets(options.bullets || 50, bulletSheet, bulletFrame)
    this.weapon.bulletSpeed = options.speed || 600
    this.weapon.bulletAngleVariance = options.cone || 20
    this.weapon.fireRate = options.rate || 200

    this.homing = options.homing
    this.target = options.target

    const { bulletMiss } = this.game.sound.repository
    this.weapon.onKill = new Phaser.Signal()
    this.weapon.onKill.add(() => bulletMiss.play())
  }

  update () {
    return
    super.update()

    const { shootSound } = this.game.sound.repository

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

    if (fired) { shootSound.play() }
  }

  home (bullet) {
    this.game.physics.arcade.accelerateToObject(bullet, this.target, 1000)
  }

  deaggro () {
    if (this.target != null) {
      const saved = this.target
      this.target = null
      setTimeout(() => { this.target = saved }, 1000)
    }
  }
}
