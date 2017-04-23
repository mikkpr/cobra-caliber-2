import Phaser from 'phaser'

import Player from '../sprites/Player'
import Obstacle from '../sprites/Obstacle'

import Curve from '../plugins/Curve'

export default class extends Phaser.State {
  create () {
    this.game.world.enableBody = true
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    this.curve = this.game.plugins.add(Curve, [50, 0, 0, 0, 50])

    this.music = this.game.add.audio('bigbeat', 1, true, true)
    this.music.play()

    this.map = this.game.add.tilemap('earth_travel')
    this.map.addTilesetImage('lofi_environment_4x', 'tiles')

    // Add both the background and ground layers. We won't be doing anything
    // with the GroundLayer though
    this.backgroundLayer = this.map.createLayer('backgroundlayer')
    this.backgroundLayer.resizeWorld()

    // Add the sprite to the game and enable arcade physics on it
    this.player = new Player(this.game, 100, this.game.world.centerY)
    this.world.add(this.player)

    this.player.body.collideWorldBounds = true;
    this.player.body.onWorldBounds = new Phaser.Signal();
    this.player.body.onWorldBounds.add(this.hitWorldBounds, this);

    this.obstacle = new Obstacle(this.game, 300, this.game.world.centerY)
    this.world.add(this.obstacle)

    // Make the camera follow the sprite
    this.game.camera.follow(this.player)

    this.game.scale.pageAlignHorizontally = true
    this.game.scale.pageAlignVertically = true
    this.game.scale.refresh()

    this.game.time.advancedTiming = true

    this.muteButton = this.game.input.keyboard.addKey(Phaser.Keyboard.M)
    this.muteButton.onDown.add(this.toggleMusic, this)
  }

  toggleMusic () {
    if (this.music.isPlaying) {
      this.music.pause()
    } else {
      this.music.resume()
    }
  }

  update () {

    this.game.physics.arcade.overlap(this.player, this.obstacle, this.onCollision, null, this);
  }

  render () {
    this.game.debug.text(this.time.fps, 10, 20, '#00ff00')
  }

  shutdown () {
    this.game.plugins.remove(this.curve)
    this.music.stop()
  }
  
  restartGame () {
    // Start the 'main' state, which restarts the game
    game.state.start('Travel');
  }

  onCollision () {
  	// TODO: Check player lives, if lives > 1 then move to some offset location, if lives = 0 then restartGame
    this.player.resetWithAnimation()
  }

  hitWorldBounds (sprite, up, down, left, right) {
  	if (sprite == this.player && right == true) {
  		this.state.start('Fight');
  	}
  }

}






