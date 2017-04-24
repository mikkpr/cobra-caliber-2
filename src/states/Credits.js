import Phaser from 'phaser'

import Boss from '../sprites/Boss'
import Player from '../sprites/Player'

import { enableMusicForState } from '../utils'

export default class extends Phaser.State {
	create() {

	    // this.game.world.enableBody = true
	    // this.game.physics.startSystem(Phaser.Physics.ARCADE)
	    // this.game.curve.setPoints([50, 0, 0, 0, 50])

	    // this.disableMusic = enableMusicForState('ambient', this)

	    // this.map = this.game.add.tilemap(this.tilemap)
	    // this.map.addTilesetImage('lofi_environment_4x', 'tiles_lofi_environment')

	    this.background = this.game.add.tileSprite(0,
	      0,
	      this.game.width,
	      this.game.height,
	      'bg1'
	    )
	    
	    // // Add both the background and ground layers. We won't be doing anything
	    // // with the GroundLayer though
	    // this.backgroundLayer = this.map.createLayer('backgroundlayer').resizeWorld()

	    // // Change the world size to match the size of this layer
	    // this.groundLayer = this.map.createLayer('groundlayer')
	    // this.groundLayer.resizeWorld()

		this.game.say("Thanks for playing", () => {
			this.game.say("Created by:\n Aare Undo\n Juhan Trink\n Mikk Pristavka\n Tiit Pikma", () => {})
		})
	}
}