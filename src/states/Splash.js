import Phaser from 'phaser'
import CurvePlugin from '../plugins/Curve'

import WebFont from 'webfontloader'

import { centerGameObjects } from '../utils'
import initSounds from '../sounds'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#F0F0F0'
  }

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')

    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)

    this.load.audio('bigbeat', ['assets/audio/music/bigbeat.mp3', 'assets/audio/music/bigbeat.ogg'])
    this.load.audio('ambient', ['assets/audio/music/ambient.mp3', 'assets/audio/music/ambient.ogg'])
    this.load.audio('techno', ['assets/audio/music/techno.mp3', 'assets/audio/music/techno.ogg'])
    this.load.audio('synthwave', ['assets/audio/music/synthwave.mp3', 'assets/audio/music/synthwave.ogg'])

    this.load.audio('shoot', ['assets/audio/effects/shoot_b.wav'])
    this.load.audio('explode', ['assets/audio/effects/explode_b.wav'])
    this.load.audio('step', ['assets/audio/effects/step.wav'])
    this.load.audio('click', ['assets/audio/effects/click.wav'])
    this.load.audio('impact', ['assets/audio/effects/impact.wav'])
    this.load.audio('bulletmiss', ['assets/audio/effects/bulletmiss.wav'])

    this.load.spritesheet('chars_small', 'assets/images/lofi_char_4x.png', 32, 32)
    this.load.spritesheet('chars_scifi', 'assets/images/lofi_scifi_chars_4x.png', 32, 32)
    this.load.spritesheet('chars_large', 'assets/images/lofi_char_4x.png', 64, 64)
    this.load.spritesheet('scifi_monsters_large', 'assets/images/lofi_scifi_monsters_4x.png', 64, 64)
    this.load.spritesheet('ships_2', 'assets/images/lofi_scifi_ships_2_4x.png', 32, 32)
    this.load.spritesheet('ships_2_large', 'assets/images/lofi_scifi_ships_2_4x.png', 64, 64)
    this.load.spritesheet('environment_sprites', 'assets/images/lofi_environment_4x.png', 32, 32)

    this.load.image('expl1', 'assets/images/expl1.png')
    this.load.image('expl2', 'assets/images/expl2.png')

    this.load.image('bg1', 'assets/images/earth_furthestlayer.png')
    this.load.image('bg2', 'assets/images/mars_furthestlayer.png')

    this.load.tilemap('moon_fight', 'assets/tilemaps/moon_fight.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.tilemap('earth_fight', 'assets/tilemaps/earth_fight.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.tilemap('mars_fight', 'assets/tilemaps/mars_fight.json', null, Phaser.Tilemap.TILED_JSON)

    this.load.tilemap('earth_travel', 'assets/tilemaps/earth_travel.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.tilemap('mars_travel', 'assets/tilemaps/mars_travel.json', null, Phaser.Tilemap.TILED_JSON)

    this.load.tilemap('credits', 'assets/tilemaps/credits.json', null, Phaser.Tilemap.TILED_JSON)

    this.load.image('tiles_lofi_environment', 'assets/images/lofi_environment_4x.png')
    this.load.image('tiles_lofi_stations', 'assets/images/lofi_scifi_stations_4x.png')
    this.load.image('tiles_lofi_stations_2', 'assets/images/lofi_scifi_stations_2_4x.png')
    this.load.image('tiles_lofi_stations_3', 'assets/images/lofi_scifi_stations_3_4x.png')
    this.load.image('tiles_lofi_items', 'assets/images/lofi_scifi_items_4x.png')
    this.load.image('tiles_interface', 'assets/images/lofi_interface_4x.png')
    this.load.image('tiles_ships_2', 'assets/images/lofi_scifi_ships_2_4x.png')

    this.game.curve = this.game.plugins.add(CurvePlugin)

    this.fontsReady = false

    WebFont.load({
      google: {
        families: ['Press Start 2P']
      },
      active: ::this.fontsLoaded
    })
  }

  render () {
    if (this.fontsReady) {
      this.game.sound.repository = initSounds(this.game)
      this.game.nextState()
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
