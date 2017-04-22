import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    // this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE

    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)

    const char_size = 32;

    var char_grid_vert = 1;
    var char_grid_hor = 1;

    this.load.spritesheet('chars_ss', 'assets/images/lofi_char_4x.png', char_size * char_grid_hor, char_size * char_grid_vert, 1)

    this.load.spritesheet('baddie_1', 'assets/images/baddie_1.png', 62, 69, 16)
    
    var template_tiles = 'assets/tilemaps/template/tiles.json'
    var boss_fight = "assets/tilemaps/boss/tiles.json"

    this.load.tilemap('tilemap', boss_fight, null, Phaser.Tilemap.TILED_JSON)
    this.load.image('tiles', 'assets/images/lofi_environment_4x.png', 32, 32, 16)
  }

  create () {
    this.state.start('Game')
  }
}
