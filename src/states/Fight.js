import Phaser from 'phaser'

import Curve from '../plugins/Curve'

export default class extends Phaser.State {
  init () {}

  preload () {

  }

  create () {
    this.game.world.enableBody = true
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.plugins.add(Curve, [50, 0, 0, 0, 50])

    this.map = this.game.add.tilemap('moon_fight')
    this.map.addTilesetImage('lofi_environment_4x', 'tiles')
    
    // Add both the background and ground layers. We won't be doing anything
    // with the GroundLayer though
    this.backgroundLayer = this.map.createLayer('backgroundlayer')
    this.groundLayer = this.map.createLayer('groundlayer')

    // Before you can use the collide function you need to set what tiles can collide
    this.map.setCollisionBetween(1, 100, true, 'groundlayer')

    // Add the sprite to the game and enable arcade physics on it
    var player_spawn_x = this.game.world.centerX / 2;
    var baddie_spawn_x = this.game.world.centerX + this.game.world.centerX / 2;

    this.sprite = this.game.add.sprite(player_spawn_x, this.game.world.centerY, 'chars_ss')
    this.game.physics.arcade.enable(this.sprite)

    this.baddie_1 = this.game.add.sprite(baddie_spawn_x, this.game.world.centerY, 'baddie_1')
    this.game.physics.arcade.enable(this.baddie_1)

    // Change the world size to match the size of this layer
    this.groundLayer.resizeWorld()

    // Set some physics on the sprite
    addBasicPhysics(this.sprite);
    addBasicPhysics(this.baddie_1);

    // Make the camera follow the sprite
    this.game.camera.follow(this.sprite)

    // Enable cursor keys so we can create some controls
    this.cursors = this.game.input.keyboard.createCursorKeys()

    // Enable WASD movement
    this.upButton = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.downButton = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.leftButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightButton = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

    // Game scaling:
    //game.scale.setGameSize(1200, 450); // et voila!
    // game.position.x = 50;

    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.scale.refresh();

    loadMap(this.game);
  }

  update () {

    // Make the sprite collide with the ground layer
    this.game.physics.arcade.collide(this.sprite, this.groundLayer)
    this.game.physics.arcade.collide(this.baddie_1, this.groundLayer)

    const player = this.sprite.body
    const baddie = this.baddie_1.body

    setMovement(baddie, this.baddie_1, this.cursors.up, this.cursors.left, this.cursors.right)
    setMovement(player, this.sprite, this.upButton, this.leftButton, this.rightButton)
  }

}

function setMovement(sprite, sprite_body, up, left, right) {

    var velocity_jumping = -500;
    var velocity_running = 400;
    var velocity_walking = 200;

    // Make the sprite jump when the up key is pushed
    if (sprite.onFloor() && up.isDown) {
      sprite.velocity.y = velocity_jumping

      // Do a barrel roll
      sprite_body.scale.y = -0.3;
      var time = 100;
      setTimeout(function() { 
        sprite_body.scale.y = -0.6;
        setTimeout(function() { 
          sprite_body.scale.y = 0.1;
          setTimeout(function() { 
            sprite_body.scale.y = 0.3;
            setTimeout(function() { 
              sprite_body.scale.y = 0.6;
              setTimeout(function() { 
                sprite_body.scale.y = 1;
              }, time);
            }, time);
          }, time);
        }, time);
      }, time);

    }

    if (right.isDown) {
      
      if (right.shiftKey) {
        sprite.velocity.x = velocity_running
      } else {
        sprite.velocity.x = velocity_walking
      }
      
      sprite_body.scale.x = 1

    } else if (left.isDown) {
      
      if (left.shiftKey) {
        sprite.velocity.x = -Math.abs(velocity_running)
      } else {
        sprite.velocity.x = -Math.abs(velocity_walking)
      }
      
      sprite_body.scale.x = -1

    } else {
      sprite.velocity.x = 0
    }

}

function addBasicPhysics(item) {
  item.body.bounce.y = 0.3
  item.body.gravity.y = 1000
  // item.body.gravity.x = 20000
  item.anchor.setTo(0.5)
}

function loadMap(game)
{
    var travel_earth = "assets/tilemaps/travel_earth/tiles.json"

    game.load.tilemap('tilemap', travel_earth, null, Phaser.Tilemap.TILED_JSON)
    game.load.image('tiles', 'assets/images/lofi_environment_4x.png', 32, 32, 16)
}







