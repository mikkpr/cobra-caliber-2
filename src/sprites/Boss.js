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
  	
  	var state = this.game.state;

  	this.flyAway(this, 0, 20, function() { state.start('Travel', true, false, "earth_fight"); } );
  }

  flyAway (context, counter, angle, completed) {

  	context.body.velocity.y = -200
  	context.body.velocity.x = 100
  	
  	console.log(this.scale.x, this.scale.y)
  	var scalex = this.scale.x - 0.01;
  	var scaley = this.scale.y - 0.01;

  	this.scale.set(scalex, scaley)

  	this.angle = angle;

  	if (counter < 30) {
  		counter++;
  		angle += 30;
  		setTimeout(function() { context.flyAway(context, counter, angle, completed) }, 150)
  	} else {
  		setTimeout(function() {
  			completed()
  		}, 200)
  	}
  }

}
