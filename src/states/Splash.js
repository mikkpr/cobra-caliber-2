import Phaser from 'phaser'
import CurvePlugin from '../plugins/Curve'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')

    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)

    this.load.audio('bigbeat', ['assets/audio/music/bigbeat.mp3', 'assets/audio/music/bigbeat.ogg'])
    this.load.audio('ambient', ['assets/audio/music/ambient.mp3', 'assets/audio/music/ambient.ogg'])

    this.load.spritesheet('chars_small', 'assets/images/lofi_char_4x.png', 32, 32)
    this.load.spritesheet('chars_large', 'assets/images/lofi_char_4x.png', 64, 64)

    this.load.tilemap('moon_fight', 'assets/tilemaps/moon_fight.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.tilemap('earth_fight', 'assets/tilemaps/earth_fight.json', null, Phaser.Tilemap.TILED_JSON)

    this.load.tilemap('earth_travel', 'assets/tilemaps/earth_travel.json', null, Phaser.Tilemap.TILED_JSON)

    this.load.image('tiles', 'assets/images/lofi_environment_4x.png')

    this.game.curve = this.game.plugins.add(CurvePlugin)
  }

  create () {
    this.state.start('Fight', true, false, "moon_fight")
  }
}
