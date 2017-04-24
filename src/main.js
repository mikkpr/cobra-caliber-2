import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import TravelState from './states/Travel'
import FightState from './states/Fight'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    super(width, height, Phaser.CANVAS, 'content', null, false, false)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Travel', TravelState, false)
    this.state.add('Fight', FightState, false)

    this.state.start('Boot')

    this.deathCounter = 0
  }

  say (text, completed) {

    var style = { font: "35px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 700 , align: "center" };
    this.text = this.add.text(this.width / 2, 250, "", style);
    this.text.anchor.set(0.5);

    var context = this;

    this.renderByLetter(text, function() {
      context.text.destroy()
      completed()
    })
  }

  renderByLetter(text, completed) {

    var split = text.split('');
    var current = ""
    
    var textField = this.text;

    for (var i = 0; i < split.length; i++) {
    
      current += split[i]
      
      this.renderLetter(current, i, function(n) {
        
        if (n == split.length - 1) {
          setTimeout(function() {
            completed()
          }, 800)
        }        

      })

    }
  }

  renderLetter(text, n, completed) {
    var textField = this.text;
    setTimeout(function() { 
      textField.setText(text) 
      completed(n)
    }, 50 * n)    
  }

}

window.game = new Game()
