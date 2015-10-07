var w = window.innerWidth
var h = window.innerHeight

var clouds_array = []
var shields_array = []
var baddies_array = []

var max_vel = 12
var nmulti = 0.5
var dampen_amount = 0.98
var health_reduction = 0.0001

var n_clouds = 8
var n_baddies = 12
var n_shields = 1024

var shield_min = 0.01
var shield_scale = 0.1
var baddie_scale = 0.2


// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x0000FF);

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(w, h);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

requestAnimationFrame(animate);

// create a texture from an image path

var clouds_texture = PIXI.Texture.fromImage("game-images/clouds.png");



for (var i = 0; i < n_clouds; i++) {

  var clouds = new PIXI.Sprite(clouds_texture)

  clouds.anchor.x = clouds.anchor.y = 0.5

  clouds.position.x = Math.random() * w
  clouds.position.y = Math.random() * h

  // clouds.alpha = Math.random() * 0.6 + 0.1
  clouds.velocity = Math.random() + 0.33
  clouds.scale.x = clouds.scale.y = (Math.random() * 0.3) + 0.1

  clouds_array.push(clouds)

  stage.addChild(clouds)

}





var baddie_texture_array = []
baddie_texture_array.push(PIXI.Texture.fromImage("game-images/bandit.png"))
baddie_texture_array.push(PIXI.Texture.fromImage("game-images/miner.png"))
baddie_texture_array.push(PIXI.Texture.fromImage("game-images/pacman.png"))
baddie_texture_array.push(PIXI.Texture.fromImage("game-images/leak.png"))
baddie_texture_array.push(PIXI.Texture.fromImage("game-images/thing.png"))

for (var i = 0; i < n_baddies; i++) {

  // create a new Sprite using the texture
  var texture_to_use = i % baddie_texture_array.length
  var baddie_sprite = new PIXI.Sprite(baddie_texture_array[texture_to_use]);

  baddie_sprite.type = 'baddie'
  baddie_sprite.health = 1

  baddie_sprite.tint = 0xFF0000

  baddie_sprite.scale.x = baddie_sprite.scale.y = baddie_scale

  // center the sprites anchor point
  baddie_sprite.anchor.x = 0.5;
  baddie_sprite.anchor.y = 0.5;

  // move the sprite t the center of the screen
  baddie_sprite.position.x = w * 0.5;
  baddie_sprite.position.y = h * 0.5;

  baddie_sprite.velocity = {
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1
  }

  baddies_array.push(baddie_sprite)

  stage.addChild(baddie_sprite);

}




var shield_texture = PIXI.Texture.fromImage("game-images/shield.png");

for (var i = 0; i < n_shields; i++) {

  // create a new Sprite using the texture
  var evident_logo = new PIXI.Sprite(shield_texture);

  evident_logo.type = 'shield'

  evident_logo.scale.x = evident_logo.scale.y = shield_min + (Math.random() * shield_scale)

  // center the sprites anchor point
  evident_logo.anchor.x = 0.5;
  evident_logo.anchor.y = 0.5;

  // move the sprite t the center of the screen
  evident_logo.position.x = w * 0.5;
  evident_logo.position.y = h * 0.5;

  evident_logo.velocity = {
    x: 0,
    y: 0
  }

  shields_array.push(evident_logo)

  stage.addChild(evident_logo);

}


function animate() {

  var t = Date.now() * 0.001

  requestAnimationFrame(animate);

  clouds_array.forEach(function (c, i) {
    c.position.y += (i + 1) * 0.5 * c.velocity

    if (c.position.x < -200) {
      c.position.x = w + 100
    }
    if (c.position.y > h + 100) {
      c.position.y = -100 * Math.random() - 100
    }

  })


  function attr(source_elements, target_elements, multi, min_distance) {

    if (min_distance === undefined) {
      min_distance = w
    }

    if (multi === undefined) {
      multi = 1
    }

    source_elements.forEach(tick_attract)

    function tick_attract(s, i) {

      // find the closest cloud
      var cloud_index = i % (target_elements.length)
      var c = target_elements[cloud_index]

      // attract to it
      var distance = Math.sqrt(Math.pow(s.position.x - c.position.x, 2) + Math.pow(s.position.y - c.position.y, 2))

      var vector = [s.position.x - c.position.x, s.position.y - c.position.y]
      var n_vector = [Math.abs(vector[0]), Math.abs(vector[1])]
        // normalize the vector
      if (n_vector[0] > n_vector[1]) {
        n_vector[1] /= n_vector[0]
        n_vector[0] = 1
      } else {
        n_vector[0] /= n_vector[1]
        n_vector[1] = 1
      }
      if (vector[0] < 0) {
        n_vector[0] *= -1
      }
      if (vector[1] < 0) {
        n_vector[1] *= -1
      }

      distance = Math.max(distance, 1)
      var dv = Math.max(1,distance / 1000)
      // dv = 20.0 / (distance * distance)
      // dv = Math.max(1, dv)

      if (c.position.y < h && c.position.y > 0 && distance < min_distance) {

        if (s.type === 'shield' && c.type === 'baddie') {
          if (c.health > 0) {
            s.velocity.x += -n_vector[0] * dv * multi
            s.velocity.y += -n_vector[1] * dv * multi
          }
        } else {
          s.velocity.x += -n_vector[0] * dv * multi
          s.velocity.y += -n_vector[1] * dv * multi
        }

      }


      if(s.max_velocity === undefined){
        s.max_velocity = max_vel
      }
      if(s.velocity.x > s.max_velocity){
        s.velocity.x = s.max_velocity
      }
      if(s.velocity.x < -s.max_velocity){
        s.velocity.x = -s.max_velocity
      }
      if(s.velocity.y > s.max_velocity){
        s.velocity.y = s.max_velocity
      }
      if(s.velocity.y < -s.max_velocity){
        s.velocity.y = -s.max_velocity
      }

      // add random
      s.velocity.x += ((Math.random() * nmulti) - (nmulti * 0.5))
      s.velocity.y += ((Math.random() * nmulti) - (nmulti * 0.5))

      // dampen velocity
      s.velocity.x *= dampen_amount
      s.velocity.y *= dampen_amount

      s.position.x += s.velocity.x
      s.position.y += s.velocity.y

      if (s.type === 'shield' && c.type === 'baddie') {

        if (distance < 100) {

          if (c.reset !== true) {
            c.health -= health_reduction
            c.alpha = c.health
          }

          if (c.health <= 0.01) {

            c.reset = true
            c.health = 1
            c.alpha = 0

            setTimeout(function () {

              c.reset = false
              c.position.x = (Math.random() * w)
              c.position.y = (Math.random() * h)

              if (Math.random() < 0.5) {
                c.position.x *= -1
              }
              if (Math.random() < 0.5) {
                c.position.y *= -1
              }

              c.velocity.x = c.velocity.y = 0
              c.health = 1
              c.alpha = 1
              console.log('reset', c.position.x)
            }, 1000)

          }

        }
      }


    }


  }

  attr(shields_array, clouds_array, 0.33)
  attr(shields_array, baddies_array, 0.1)

  attr(baddies_array, shields_array, -0.5, 100)
  attr(baddies_array, clouds_array, 1)

  // attr()


  // shields_array.forEach(tick_attract)
  // baddies_array.forEach(tick_attract)

  // render the stage
  renderer.render(stage);
}
