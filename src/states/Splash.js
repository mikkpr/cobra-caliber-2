import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)

    const char_size = 32;

    var char_grid_vert = 1;
    var char_grid_hor = 1;

    this.load.spritesheet('chars_ss', 'assets/images/lofi_char_4x.png', char_size * char_grid_hor, char_size * char_grid_vert, 1)
    this.load.spritesheet('baddie_1', 'assets/images/baddie_1.png', 62, 69, 16)
    
    this.load.tilemap('moon_fight', 'assets/tilemaps/moon_fight.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.tilemap('earth_travel', 'assets/tilemaps/earth_travel.json', null, Phaser.Tilemap.TILED_JSON)

    this.load.image('tiles', 'assets/images/lofi_environment_4x.png', 32, 32, 16)
  }

  create () {
    this.state.start('Fight')
  }
}
