/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
simple Game declaration
**/
import DE from '@dreamirl/dreamengine';
var Game = {};

Game.render = null;
Game.scene = null;
Game.ship = null;
Game.obj = null;

// init
Game.init = function() {
  console.log('game init');
   DE.config.DEBUG = false;
   DE.config.DEBUG_LEVEL = 0;

  // Create the renderer before assets start loading
  Game.render = new DE.Render('render', {
    resizeMode: 'stretch-ratio',
    width: 1920,
    height: 1080,
    backgroundColor: '0x00004F',
    roundPixels: false,
    powerPreferences: 'high-performance',
  });
  Game.render.init();

  DE.start();
};

Game.onload = function() {
  console.log('game start');

  // scene
  Game.scene = new DE.Scene();

  // don't do this because DisplayObject bounds is not set to the render size but to the objects inside the scene
  // scene.interactive = true;
  // scene.click = function()
  // {
  //   console.log( "clicked", arguments );
  // }

  // if no Camera, we add the Scene to the render (this can change if I make Camera)

  Game.camera = new DE.Camera(0, 0, 1920, 1080, {
    scene: Game.scene,
    backgroundImage: 'bg',
  });
  Game.render.add(Game.camera);
  // Game.render.add( Game.scene );



  Game.ship;

  // WIP working on a simple "AnimatedSprite" declaration
  // var imgs = ["ship1.png","ship2.png","ship3.png","ship4.png","ship5.png","ship6.png"];
  // var textureArray = [];

  // for (var i=0; i < imgs.length; i++)
  // {
  //   var texture = PIXI.utils.TextureCache[imgs[i]];
  //   textureArray.push(texture);
  // };

  // var mc = new PIXI.extras.AnimatedSprite(textureArray);

  Game.ship = new DE.GameObject({
    x: 960,
    y: 840,
    scale: 1,
    renderers: [
      new DE.SpriteRenderer({ spriteName: 'ayeraShip' }),
      new DE.TextRenderer('', {
        localizationKey: 'player.data.realname',
        y: -100,
        textStyle: {
          fill: 'white',
          fontSize: 35,
          fontFamily: 'Snippet, Monaco, monospace',
          strokeThickness: 1,
          align: 'center',
        },
      }),
      new DE.SpriteRenderer({
        spriteName: 'reactor',
        y: 80,
        scale: 0.3,
        rotation: Math.PI,
      }),
    ],
    axes: { x: 0, y: 0 },
    interactive: true,
    click: function() {
      console.log('click');
    },
    checkInputs: function() {
      this.translate({ x: this.axes.x * 2, y: this.axes.y * 2 });
    },
    automatisms: [['checkInputs', 'checkInputs']],
  });

  Game.ship.fire = function() {
    DE.Save.save('fire', DE.Save.get('fire') + 1 || 1);
    DE.Audio.fx.play('piew');
    var bullet = new DE.GameObject({
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      renderer: new DE.SpriteRenderer({ spriteName: 'player-bullet' }),
    });
    bullet.addAutomatism('translateY', 'translateY', { value1: -10 });

    // bullet.moveTo( { z: 10 }, 2000 );
    // bullet.addAutomatism( "rotate", "rotate", { value1: Math.random() * 0.1 } );
    // bullet.addAutomatism( "inverseAutomatism", "inverseAutomatism", { value1: "rotate", interval: 100 } );
    bullet.addAutomatism('askToKill', 'askToKill', {
      interval: 2000,
      persistent: false,
    });

    console.log('fired in total ' + DE.Save.get('fire') + ' times');
    Game.scene.add(bullet);
  };

  Game.heart1 = new DE.GameObject({
    x: 1600,
    y: 100,
    zindex: 10,
    renderer: new DE.TextureRenderer({ spriteName: 'heart' }),
  });
  Game.heart2 = new DE.GameObject({
    x: 1700,
    y: 100,
    zindex: 10,
    renderer: new DE.TextureRenderer({
      spriteName: 'heart',
      width: 50,
      height: 20,
    }),
  });
  Game.heart3 = new DE.GameObject({
    x: 1800,
    y: 100,
    zindex: 10,
    renderer: new DE.TextureRenderer({ spriteName: 'heart' }),
  });

  Game.Meteor1 = new DE.GameObject({
    x: Math.floor(Math.random() * 1800) + 100,
    y: 10,
    renderer: new DE.SpriteRenderer({
        spriteName: 'meteor',
        rotation: Math.PI,
      }),
  });
  Game.Meteor1.spawn_meteor = function() {
    Game.Meteor1 = new DE.GameObject({
      x: Math.floor(Math.random() * 1800) + 100,
      y: 10,
      renderer: new DE.SpriteRenderer({
        spriteName: 'meteor',
        rotation: Math.PI,
      }),
    });
    Game.scene.add( Game.Meteor1 );
      Game.Meteor1.addAutomatism('translateY', 'translateY', { value1: 3 });
      Game.Meteor1.addAutomatism('askToKill', 'askToKill', {
        interval: 6000,
        persistent: false,
      });
  };
  Game.heart3.destroy_heart = function() {
    Game.heart3.addAutomatism('askToKill', 'askToKill', { persistent: false });
  };
  Game.Meteor1.pos_detect = function() {
    var x = Game.Meteor1.position.y;
    var y = Game.ship.position.y;
    console.log('x =', x);
    console.log('y =', y);
    if (Game.Meteor1.position.y > Game.ship.position.y) {
      Game.heart2.addAutomatism('askToKill', 'askToKill', { persistent: false });
    }
  }
  Game.Meteor1.addAutomatism('pos_detect', 'pos_detect', { interval: 300});
  Game.heart3.addAutomatism('destroy_heart', 'destroy_heart', { persistent: false});
  Game.Meteor1.addAutomatism('translateY', 'translateY', { value1: 3 });
  //Game.Meteor1.addAutomatism('spawn_meteor', 'spawn_meteor', { interval: 350});

  var rectangle = new DE.GameObject({
    x: 70,
    y: 60,
    interactive: true,
    renderers: [
      new DE.RectRenderer(140, 50, '0xFFFFFF', {
        lineStyle: [4, '0xFF3300', 1],
        fill: true,
        x: -20,
        y: -35,
      }),
      new DE.RectRenderer(140, 50, '0xF0F000', {
        lineStyle: [4, '0xFF3300', 1],
        fill: true,
        x: -20,
        y: -35,
        visible: false,
      }),
    ],
    pointerover: function() {
      this.renderers[1].visible = true;
      console.log('mouse over');
    },
    pointerout: function() {
      this.renderers[1].visible = false;
      console.log('mouse out');
    },
  });
  var rectangle2 = new DE.GameObject({
    x: 240,
    y: 60,
    renderer: new DE.RectRenderer(140, 50, '0xDDF0CC', {
      lineStyle: [4, '0x00F30D', 10],
      x: -20,
      y: -35,
    }),
  });

  Game.shapes = {
    rectangle: rectangle,
    rectangle2: rectangle2,
  };

  var button = new DE.GameObject({
    x: 960,
    y: 100,
    zindex: 50,
    interactive: true,
    hitArea: new DE.PIXI.Rectangle(-225, -50, 450, 100),
    cursor: 'pointer',
    renderers: [
      new DE.RectRenderer(400, 80, '0xFFCDCD', {
        lineStyle: [4, '0x000000', 1],
        fill: true,
        x: -200,
        y: -40,
      }),
      new DE.TextRenderer('Camera Move: false', {
        textStyle: {
          fill: 'black',
          fontSize: 35,
          fontFamily: 'Snippet, Monaco, monospace',
          strokeThickness: 1,
          align: 'center',
        },
      }),
    ],
    pointerover: function() {
      this.renderer.updateRender({
        color: Game.moveCamera ? '0xDEFFDE' : '0xFFDEDE',
      });
    },
    pointerout: function() {
      this.renderer.updateRender({
        color: Game.moveCamera ? '0xCDFFCD' : '0xFFCDCD',
      });
    },
    pointerdown: function() {
      this.renderer.updateRender({
        color: Game.moveCamera ? '0x00FF00' : '0xFF0000',
      });
    },
    pointerup: function() {
      Game.moveCamera = !Game.moveCamera;
      this.renderers[1].text = 'Camera Move: ' + Game.moveCamera.toString();
      this.pointerover();

      if (Game.moveCamera) {
        Game.camera.focus(Game.ship, { options: { rotation: true } });
      } else {
        Game.camera.target = undefined;
      }
    },
  });

  var buttonFocusObj = new DE.GameObject({
    x: 500,
    y: 100,
    zindex: 50,
    interactive: true,
    hitArea: new DE.PIXI.Rectangle(-225, -50, 450, 100),
    cursor: 'pointer',
    renderers: [
      new DE.RectRenderer(400, 80, '0xFFCDCD', {
        lineStyle: [4, '0x000000', 1],
        fill: true,
        x: -200,
        y: -40,
      }),
      new DE.TextRenderer('Object focus: false', {
        textStyle: {
          fill: 'black',
          fontSize: 35,
          fontFamily: 'Snippet, Monaco, monospace',
          strokeThickness: 1,
          align: 'center',
        },
      }),
    ],
    pointerover: function() {
      this.renderer.updateRender({
        color: Game.focusObj ? '0xDEFFDE' : '0xFFDEDE',
      });
    },
    pointerout: function() {
      this.renderer.updateRender({
        color: Game.focusObj ? '0xCDFFCD' : '0xFFCDCD',
      });
    },
    pointerdown: function() {
      this.renderer.updateRender({
        color: Game.focusObj ? '0x00FF00' : '0xFF0000',
      });
    },
    pointerup: function() {
      Game.focusObj = !Game.focusObj;
      this.renderers[1].text = 'Object focus: ' + Game.focusObj.toString();
      this.pointerover();
    },
  });


  Game.scene.add(
    Game.ship,
    Game.heart1,
    Game.heart2,
    Game.heart3,
    Game.Meteor1,
  );
  if (Game.ship.translate.y > 500) {
    Game.heart3.addAutomatism('askToKill', 'askToKill', {
      interval: 2000,
      persistent: false,
    });
  }

  DE.Inputs.on('keyDown', 'left', function() {
    Game.ship.axes.x = -2;
  });
  DE.Inputs.on('keyDown', 'right', function() {
    Game.ship.axes.x = 2;
  });
  DE.Inputs.on('keyUp', 'right', function() {
    Game.ship.axes.x = 0;
  });
  DE.Inputs.on('keyUp', 'left', function() {
    Game.ship.axes.x = 0;
  });

  DE.Inputs.on('keyDown', 'up', function() {
    Game.ship.axes.y = -2;
  });
  DE.Inputs.on('keyDown', 'down', function() {
    Game.ship.axes.y = 2;
  });
  DE.Inputs.on('keyUp', 'down', function() {
    Game.ship.axes.y = 0;
  });
  DE.Inputs.on('keyUp', 'up', function() {
    Game.ship.axes.y = 0;
  });

  DE.Inputs.on('keyDown', 'fire', function() {
    Game.ship.addAutomatism('fire', 'fire', { interval: 200 });
  });
  DE.Inputs.on('keyUp', 'fire', function() {
    Game.ship.removeAutomatism('fire');
  });

  DE.Inputs.on('keyDown', 'deep', function() {
    Game.ship.z += 0.1;
  });
  DE.Inputs.on('keyDown', 'undeep', function() {
    Game.ship.z -= 0.1;
  });
};

// just for helping debugging stuff, never do this ;)
window.Game = Game;

export default Game;
