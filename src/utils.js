import Phaser from 'phaser'

export const centerGameObjects = objects => {
  objects.forEach(
    object => object.anchor.setTo(0.5)
  )
}

export const enableMusicForState = (state) => {
  let Idx = 0
  
  const synthwave = state.game.add.audio('synthwave', 0, true, true)
  synthwave.allowMultiple = true
  const bigbeat = state.game.add.audio('bigbeat', 0, true, true)
  bigbeat.allowMultiple = true
  const techno = state.game.add.audio('techno', 0, true, true)
  techno.allowMultiple = true
  const ambient = state.game.add.audio('ambient', 0, true, true)
  ambient.allowMultiple = true

  const tracks = [
    synthwave,
    bigbeat,
    techno,
    ambient
  ]

  tracks[Idx].play()


  const muteButton = state.game.input.keyboard.addKey(Phaser.Keyboard.M)
  muteButton.onDown.add(() => {
    if (tracks[Idx].volume > 0) {
      tracks[Idx].volume = 0
    } else {
      tracks[Idx].volume = 0.35
    }
  }, state)

  const nextSongButton = state.game.input.keyboard.addKey(Phaser.Keyboard.N)
  nextSongButton.onDown.add(() => {
    tracks.map(t => { t.stop(); t.volume = 0.35; } )
    if (Idx === tracks.length - 1) {
      Idx = 0
    } else {
      Idx += 1
    }
    tracks[Idx].play()
  })

  return () => {
    tracks[Idx].stop()
  }
}
