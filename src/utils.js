import Phaser from 'phaser'

export const centerGameObjects = objects => {
  objects.forEach(
    object => object.anchor.setTo(0.5)
  )
}

export const enableMusicForState = (state, initialIdx = 0) => {
  let Idx = initialIdx !== 0 ? initialIdx : 0

  const synthwave = state.game.add.audio('synthwave', 0.5, true, true)
  synthwave.allowMultiple = true
  synthwave.stop()
  const bigbeat = state.game.add.audio('bigbeat', 0.5, true, true)
  bigbeat.allowMultiple = true
  bigbeat.stop()
  const techno = state.game.add.audio('techno', 0.5, true, true)
  techno.allowMultiple = true
  techno.stop()
  const ambient = state.game.add.audio('ambient', 0.5, true, true)
  ambient.allowMultiple = true
  ambient.stop()

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
    tracks.map(t => {
      t.volume = 0.35
      t.stop()
    })

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
