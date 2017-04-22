import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}

  preload () {

  }

  create () {
    this.game.world.enableBody = true
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    this.map = this.game.add.tilemap('tilemap')
    this.map.addTilesetImage('lofi_environment_4x', 'tiles')
    
    // Add both the background and ground layers. We won't be doing anything with the GroundLayer though
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

  }

  update () {

    // Make the sprite collide with the ground layer
    this.game.physics.arcade.collide(this.sprite, this.groundLayer)
    this.game.physics.arcade.collide(this.baddie_1, this.groundLayer)

    const player = this.sprite.body
    const baddie = this.baddie_1.body

    setArrowMovement(this.cursors, baddie, this.baddie_1)
    setMovement(player, this.sprite, this.upButton, this.leftButton, this.rightButton)
  }

}

function setArrowMovement(cursors, sprite, sprite_body) {

    // Make the sprite jump when the up key is pushed
    if (sprite.onFloor() && cursors.up.isDown) {
      sprite.velocity.y = -400

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

    if (cursors.right.isDown) {
      
      if (cursors.right.shiftKey) {
        sprite.velocity.x = 200
      } else {
        sprite.velocity.x = 100
      }
      
      sprite_body.scale.x = 1

    } else if (cursors.left.isDown) {
      
      if (cursors.left.shiftKey) {
        sprite.velocity.x = -200
      } else {
        sprite.velocity.x = -100
      }
      
      sprite_body.scale.x = -1

    } else {
      sprite.velocity.x = 0
    }
}

function setMovement(sprite, sprite_body, up, left, right) {
    
    // Make the sprite jump when the up key is pushed
    if (sprite.onFloor() && up.isDown) {
      sprite.velocity.y = -400
    }

    if (right.isDown) {
      
      if (right.shiftKey) {
        sprite.velocity.x = 200
      } else {
        sprite.velocity.x = 100
      }
      
      sprite_body.scale.x = 1

    } else if (left.isDown) {
      
      if (left.shiftKey) {
        sprite.velocity.x = -200
      } else {
        sprite.velocity.x = -100
      }
      
      sprite_body.scale.x = -1

    } else {
      sprite.velocity.x = 0
    }

}

function addBasicPhysics(item) {
  item.body.bounce.y = 0.3
  item.body.gravity.y = 1000
  item.body.gravity.x = 0
  item.anchor.setTo(0.5)
}









