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

    this.load.spritesheet('chars_ss', 'assets/images/lofi_char_4x.png', 32, 32, 16)

    this.load.tilemap('tilemap', 'assets/tilemaps/tiles.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.image('tiles', 'assets/images/lofi_environment_4x.png', 32, 32, 16)
  }

  create () {
    this.state.start('Game')
  }
}
