import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game, player, x, y) {
    super(game, x, y, 'chars_large', 72)

    this.player = player;

    this.anchor.setTo(0.5)

    this.game.physics.arcade.enable(this)
    this.body.drag.x = this.body.drag.y = 500
  }

  update () {
  	this.game.physics.arcade.overlap(this.player, this, this.onCollision, null, this)
  }

  onCollision () {
  	this.game.state.start('Travel', true, false, "earth_fight")
  }
}
