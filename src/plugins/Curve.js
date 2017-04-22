import Phaser from 'phaser'

export default class extends Phaser.Plugin {
  init (points) {
    this.hasPostRender = true

    // Precompute curve shift amounts for each pixel column.
    this.curveOff = new Uint32Array(this.game.width * 4)
    for (let col = 0; col < this.game.width; col++) {
      const bez = this.game.math.bezierInterpolation(points, col / this.game.width)
      const off = Math.floor(bez) * this.game.width * 4
      this.curveOff[4 * col] = off
      this.curveOff[4 * col + 1] = off
      this.curveOff[4 * col + 2] = off
      this.curveOff[4 * col + 3] = off
    }

    // Preallocate ImageData buffer.
    this.post = new Uint8ClampedArray(this.game.width * this.game.height * 4)
  }

  postRender () {
    // Copy ImageData, shifting each column of pixels down by the curve offset.
    const pre = this.game.context.getImageData(0, 0, this.game.width, this.game.height)
    for (let i = 0; i < pre.data.length; i++) {
      this.post[i] = pre.data[i - this.curveOff[i % (pre.width * 4)]]
    }
    this.game.context.putImageData(new ImageData(this.post, pre.width), 0, 0)
  }
}
