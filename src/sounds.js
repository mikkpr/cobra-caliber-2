export default (game) => {
  const textSound = game.add.audio('step', 0.25)
  const explodeSound = game.add.audio('explode', 0.25)
  const shootSound = game.add.audio('shoot', 0.5)
  const clickSound = game.add.audio('click', 0.25)
  const impactSound = game.add.audio('impact', 0.45)
  const bulletMiss = game.add.audio('bulletmiss', 0.05)

  shootSound.allowMultiple = true
  explodeSound.allowMultiple = true

  return {
    textSound,
    explodeSound,
    shootSound,
    clickSound,
    impactSound,
    bulletMiss
  }
}
