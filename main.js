
   var w = window.innerWidth
   var h = window.innerHeight

   var clouds_array = []

    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x0000FF);

    // create a renderer instance.
    var renderer = PIXI.autoDetectRenderer(w, h);

    // add the renderer view element to the DOM
    document.body.appendChild(renderer.view);

    requestAnimationFrame( animate );

    // create a texture from an image path
    var texture = PIXI.Texture.fromImage("img/evident_logo.png");
    var clouds_texture = PIXI.Texture.fromImage("img/clouds.png");
    // create a new Sprite using the texture
    var evident_logo = new PIXI.Sprite(texture);

    var n_clouds = 12

    for(var i = 0; i < n_clouds; i++){

      var clouds = new PIXI.Sprite(clouds_texture)

      clouds.anchor.x = clouds.anchor.y = 0.5

      clouds.position.x = Math.random() * w
      clouds.position.y = Math.random() * h

      clouds.alpha = 0.1
      clouds.scale.x = clouds.scale.y = (Math.random()*3) + 1

      clouds_array.push(clouds)

      stage.addChild(clouds)

    }

    evident_logo.scale.x = evident_logo.scale.y = 1

    // center the sprites anchor point
    evident_logo.anchor.x = 0.5;
    evident_logo.anchor.y = 0.5;

    // move the sprite t the center of the screen
    evident_logo.position.x = w*0.5;
    evident_logo.position.y = h*0.5;

    stage.addChild(evident_logo);

    function animate() {

      var t = Date.now() * 0.001

        requestAnimationFrame( animate );

        // just for fun, lets rotate mr rabbit a little
        evident_logo.rotation += 0.1;
        evident_logo.scale.x = evident_logo.scale.y = Math.sin(evident_logo.rotation * 0.5)

        clouds_array.forEach(function(c,i){
          c.position.x -= (i+1)*0.1
          c.position.y += 0.1

          if(c.position.x < -200){
            c.position.x = w+300
          }
          if(c.position.y > h+100){
            c.position.y = 0
          }

        })

        // render the stage
        renderer.render(stage);
    }
