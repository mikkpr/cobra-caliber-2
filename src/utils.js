import Phaser from 'phaser'

export const centerGameObjects = objects => {
  objects.forEach(
    object => object.anchor.setTo(0.5)
  )
}

export const enableMusicForState = function (trackName) {
  const toggleMusic = () => {
    if (this.music.volume > 0) {
      this.music.volume = 0
    } else {
      this.music.volume = 1
    }
  }

  this.music = this.game.add.audio(trackName, 0, true, true)
  this.music.play()

  this.muteButton = this.game.input.keyboard.addKey(Phaser.Keyboard.M)
  this.muteButton.onDown.add(toggleMusic, this)
}
