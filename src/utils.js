import Phaser from 'phaser'

export const centerGameObjects = objects => {
  objects.forEach(
    object => object.anchor.setTo(0.5)
  )
}

export const enableMusicForState = (trackName, state) => {
  const music = state.game.add.audio(trackName, 0, true, true)
  music.play()

  const muteButton = state.game.input.keyboard.addKey(Phaser.Keyboard.M)
  muteButton.onDown.add(() => {
    if (music.volume > 0) {
      music.volume = 0
    } else {
      music.volume = 1
    }
  }, state)

  return () => {
    music.stop()
  }
}
