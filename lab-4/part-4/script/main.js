// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const ballCounter = document.querySelector('p');

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

let ballCount = 0;

function updateBallCounter() {
  ballCounter.textContent = `Ball count: ${ballCount}`;
}

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;

  // gets a number between the min and max and adds to min so you cant get 0.00
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape {
  // constructor class
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

class Ball extends Shape {
  // attributes
  exists;

  // constructor
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true;
  }

  // draw method that draws the path in the ctx (canva object)
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  // update method that checks the movement and if its colliding with a wall, if it is then it moves it back
  update() {
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
    }
    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
    }
    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }
    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }
    // if it isnt touching any walls then update its x/y by adding the velocity to it
    this.x += this.velX;
    this.y += this.velY;
  }

  // this detects if the ball is coliding with another ball
  collisionDetect() {
    // loops through our lowkey poorly named array of balls for each ball
    for (const ball of balls) {
      // checks if this (object) isnt equal to the current ball in the array, and if the ball in the
      // array exists
      if (!(this === ball) && ball.exists) {
        // creates delta x and delta y, calculate by current ball's x or y and subtract the current
        // balls x and y as well
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        // calculates distance from the square root of dx * dx + dy * dy.
        const distance = Math.sqrt(dx * dx + dy * dy);

        // check the if the distance is less than the size of both balls combined
        if (distance < this.size + ball.size) {
          // if it is change the color to something random
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

class EvilCircle extends Shape {
  // evil class inheriting Shape's
  // constructor has x, y, velX, velY, color, and size
  constructor(x, y) {
    // inherits the x,y from the shape class, it also sets the velx and vely to 20
    super(x, y, 20, 20);
    // set the color to white
    this.color = 'white';
    // set the size to ten
    this.size = 10;
    // in this constructor we are adding an eventlistener for a keydown to this object we create,
    // this is tied to the objects creation and we call this lambda method that is a switch case
    // that checks the keyboard event "e" for the wasd keys, and moves the character in that direction
    // (i.e a is left, d is right, etc)
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'a':
          this.x -= this.velX;
          break;
        case 'd':
          this.x += this.velX;
          break;
        case 'w':
          this.y -= this.velY;
          break;
        case 's':
          this.y += this.velY;
          break;
      }
    });
  }

  // inheriting the draw function
  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.lineWidth = 3;
  }

  // mostly the same as the update function but it doesnt update the evil circle position after it checks
  checkBounds() {
    if (this.x + this.size >= width) {
      this.x -= this.size;
    }
    if (this.x - this.size <= 0) {
      this.x += this.size;
    }
    if (this.y + this.size >= height) {
      this.y -= this.size;
    }
    if (this.y - this.size <= 0) {
      this.y += this.size;
    }
  }

  // same collision detection as before but now it doesnt check if this object is the same because it
  // doesnt need to since this isnt in that array of balls, but it does check if the ball exists before
  // being able to colide with it
  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          // sets the ball's existance to false
          ball.exists = false;
          ballCount--;
          updateBallCounter();
        }
      }
    }
  }
}

const balls = [];

// this is just a loop that fills the balls array
while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );
  balls.push(ball);
  ballCount++;
  updateBallCounter();
}

// instantiate the evil circle here, use random values for the x and y
const evilguy = new EvilCircle(random(0, width), random(0, height));

// this is the loop function that runs and updates the screen
function loop() {
  // this is what resets and reprints the screen before the ball movement
  ctx.fillStyle = 'rgb(0 0 0 / 25%)';
  ctx.fillRect(0, 0, width, height);

  // makes each ball move and update (only if they exists)
  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  // this is where it updates the evil circle
  evilguy.draw();
  evilguy.checkBounds();
  evilguy.collisionDetect();

  // i think this is the a built in function that calls this function again.
  requestAnimationFrame(loop);
}

loop();
