var w = window.innerWidth
var h = window.innerHeight

var clouds_array = []
var shields_array = []
var baddies_array = []


// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x0000FF);

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(w, h);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

requestAnimationFrame(animate);

// create a texture from an image path

var clouds_texture = PIXI.Texture.fromImage("game-images/clouds.png");

var n_clouds = 8

for (var i = 0; i < n_clouds; i++) {

  var clouds = new PIXI.Sprite(clouds_texture)

  clouds.anchor.x = clouds.anchor.y = 0.5

  clouds.position.x = Math.random() * w
  clouds.position.y = Math.random() * h

  clouds.alpha = Math.random()*0.6 + 0.1
  clouds.velocity = Math.random() + 0.1
  clouds.scale.x = clouds.scale.y = (Math.random() * 0.3) + 0.1

  clouds_array.push(clouds)

  stage.addChild(clouds)

}

var n_shields = 32

var shield_texture = PIXI.Texture.fromImage("game-images/shield.png");

for (var i = 0; i < n_shields; i++) {

  // create a new Sprite using the texture
  var evident_logo = new PIXI.Sprite(shield_texture);

  evident_logo.scale.x = evident_logo.scale.y = 0.1

  // center the sprites anchor point
  evident_logo.anchor.x = 0.5;
  evident_logo.anchor.y = 0.5;

  // move the sprite t the center of the screen
  evident_logo.position.x = w * 0.5;
  evident_logo.position.y = h * 0.5;

  evident_logo.velocity = { x: 0 , y: 0}

  shields_array.push(evident_logo)

  stage.addChild(evident_logo);

}

function animate() {

  var t = Date.now() * 0.001

  requestAnimationFrame(animate);

  clouds_array.forEach(function (c, i) {
    // c.position.x -= (i+1)*0.1
    c.position.y += (i + 1) * 0.5 * c.velocity

    if (c.position.x < -200) {
      c.position.x = w + 100
    }
    if (c.position.y > h + 100) {
      c.position.y = -100 * Math.random() - 100
    }

  })

  shields_array.forEach(function (s, i) {

    // find the closest cloud
    var cloud_index = i % (clouds_array.length)
    var c = clouds_array[cloud_index]



    // attract to it
    var distance = Math.sqrt(Math.pow(s.position.x-c.position.x,2) + Math.pow(s.position.y-c.position.y,2))
    var vector = [ s.position.x - c.position.x, s.position.y - c.position.y ]
    var n_vector = [ Math.abs(vector[0]), Math.abs(vector[1]) ]
    // normalize the vector
    if(n_vector[0] > n_vector[1]){
      n_vector[1] /= n_vector[0]
      n_vector[0] = 1
    } else {
      n_vector[0] /= n_vector[1]
      n_vector[1] = 1
    }
    if(vector[0] < 0){
      n_vector[0] *= -1
    }
    if(vector[1] < 0){
      n_vector[1] *= -1
    }

    distance = Math.max(distance,1)
    var dv = distance/500
    dv = Math.max(1,dv)

    if(c.position.y < h && c.position.y > 0){
      s.velocity.x += -n_vector[0] * dv
      s.velocity.y += -n_vector[1] * dv
    }

    var nmulti = 4
    s.velocity.x += (Math.random()*nmulti-(nmulti*0.5))
    s.velocity.y += (Math.random()*nmulti-(nmulti*0.5))

    s.velocity.x *= 0.96
    s.velocity.y *= 0.96

    s.position.x += s.velocity.x
    s.position.y += s.velocity.y


  })

  // render the stage
  renderer.render(stage);
}
