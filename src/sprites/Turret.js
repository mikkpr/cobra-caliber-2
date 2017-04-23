import Obstacle from './Obstacle'

export default class extends Obstacle {
  constructor (game, player, x, y, frame, bulletFrame) {
    super(game, player, x, y, frame)
    this.weapon = this.game.plugins.add(Phaser.Weapon)
    this.weapon.trackSprite(this)
    this.weapon.createBullets(50, 'chars_small', bulletFrame)
    this.weapon.bulletSpeed = 600
    this.weapon.fireRate = 200

    this.target = null
  }

  targetPlayer () {
    this.target = this.player
  }

  update () {
    if (!this.inCamera) {
      return
    }

    if (this.target != null) {
      this.weapon.fireAtSprite(this.target)
    } else if (this.weapon.fire()) {
      this.weapon.fireAngle += 30
    }
  }
}
