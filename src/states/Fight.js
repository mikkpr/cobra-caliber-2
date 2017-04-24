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
    this.map.addTilesetImage('lofi_environment_4x', 'tiles_lofi_environment')

    // Add both the background and ground layers. We won't be doing anything
    // with the GroundLayer though
    this.backgroundLayer = this.map.createLayer('backgroundlayer')
    this.groundLayer = this.map.createLayer('groundlayer')

    // Change the world size to match the size of this layer
    this.groundLayer.resizeWorld()

    // Before you can use the collide function you need to set what tiles can collide
    this.map.setCollisionBetween(1, 1000, true, 'groundlayer')

    // Add the sprite to the game and enable arcade physics on it
    this.player = new Player(this.game, 16, this.game.world.centerY)
    this.world.add(this.player)

    // Player physics in this state.
    this.player.body.collideWorldBounds = true
    this.player.body.velocity.x = 500 // Player is flying in from orbit.
    this.player.body.maxVelocity.x = 500
    this.player.body.bounce.y = 0.3
    this.player.body.gravity.y = 2000

    var bossSpawnX = this.game.world.centerX + this.game.world.centerX / 2
    this.boss = new Boss(this.game, this.player, bossSpawnX, this.game.world.height - 90)
    this.world.add(this.boss)

    // Make the camera follow the player.
    this.game.camera.follow(this.player)

    this.game.scale.pageAlignHorizontally = true
    this.game.scale.pageAlignVertically = true
    this.game.scale.refresh()

    this.game.time.advancedTiming = true

    if (this.tilemap === 'moon_fight') {
      
      // Hack for game start.

      var style = { 
        font: "50px Arial", 
        fill: "#F5DEB3", 
        backgroundColor: '#8B4513', 
      };

      this.title = this.game.add.text(0, -100, "  COBRA CALIBER 2  ", style);
      this.title.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
      this.title.strokeThickness = 5;
  
      this.title.y = 50;
      this.title.x = this.game.width / 2 - this.title.width / 2;

      style = { 
        font: "20px Arial", 
        fill: "#F5DEB3", 
        backgroundColor: '#8B4513', 
      };
      
      this.subtitle = this.game.add.text(0, -100, "  THERE CAN ONLY BE ONE MORE  ", style);
      this.subtitle.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
      this.subtitle.strokeThickness = 5;
  
      this.subtitle.y = this.title.y + 90;
      this.subtitle.x = this.game.width / 2 - this.subtitle.width / 2;

      this.player.body.velocity.x = 0

      this.player.x = this.game.world.centerX - this.game.world.centerX / 2
      this.player.y = this.game.world.height - 80

      var LabelButton = function(game, x, y, key, label, callback, callbackContext, overFrame, outFrame, downFrame, upFrame) {
        Phaser.Button.call(this, game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);    
        // Style how you wish...    
        this.style = { 'font': '40px Arial', 'fill': 'white', 'backgroundColor': 'magenta' };    
        this.anchor.setTo( 0.5, 0.5 );    
        this.label = new Phaser.Text(game, 0, 0, label, this.style);    
        // Puts the label in the center of the button    
        this.label.anchor.setTo( 0.5, 0.5 );
        this.addChild(this.label);
        this.setLabel( label );    
        // Adds button to game
        game.add.existing(this); 
      };
      
      LabelButton.prototype = Object.create(Phaser.Button.prototype);LabelButton.prototype.constructor = LabelButton;
      LabelButton.prototype.setLabel = function(label) {
          this.label.setText(label);
      };

      let y = this.subtitle.y + 150;
      
      this.startButton = new LabelButton(this.game, 0, y, null, " START GAME ", this.onStartClick, this, 1, 0, 2);
      this.startButton.x = this.game.width / 2 - this.startButton.width / 2 + 10;
      this.startButton.strokeThickness = 3;

    }
  }

  onStartClick () {

    this.startButton.destroy();

    var player = this.player
    var boss = this.boss

    setTimeout(function() {
      player.say('I have been looking for you for a long time, father', function () {
        boss.say('I left you to die in that pit. How did you survive?', function () {
          player.say('That should be the least of your concerns, old man', function () {
            player.say('Time to die', function () {})
          })
        })
      })
    }, 600)
    
  }

  update () {
    // Make the sprite collide with the ground layer
    this.game.physics.arcade.collide(this.player, this.groundLayer)
    this.game.physics.arcade.collide(this.boss, this.groundLayer)

    // Jump when on the floor.
    if (this.player.isMovingUp() && this.player.body.onFloor()) {
      this.player.body.velocity.y = -800
    }

    // Horizontal air control is slower than ground.
    const accX = this.player.body.onFloor() ? 450 : 50
    if (this.player.isMovingRight()) {
      this.player.scale.setTo(1, 1)
      this.player.body.velocity.x += accX
    } else if (this.player.isMovingLeft()) {
      this.player.scale.setTo(-1, 1)
      this.player.body.velocity.x -= accX
    } else if (this.player.body.onFloor()) {
      this.player.body.velocity.x /= 2 // Break to a halt.
    }
  }

  render () {
    this.game.debug.text(this.time.fps, 10, 20, '#00ff00')
    this.game.debug.text(this.game.deathCounter, 980, 20, '#00ff00')
  }

  shutdown () {
    this.disableMusic()
  }
}
