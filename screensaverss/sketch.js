// All the paths
let paths = [];
// Are we painting?
let painting = false;
// How long until the next circle
let next = 1;
let current;
let previous;
let mysound;

function setup() {
  createCanvas(windowWidth, windowHeight);
  current = createVector(0, 1);
  previous = createVector(1, 0);
  paths.push(new Path());
  noCursor();
};

function draw() {
  background(200);
  
  painting = true;

  // If it's time for a new point
  if (millis() > next && painting) {

    // Grab mouse position      
    current.x = random((windowWidth / 2) - 50, (windowWidth / 2) + 50);
    current.y = random((windowHeight / 2) - 50, (windowHeight / 2) + 50);

    // New particle's force is based on mouse movement
    let force = p5.Vector.sub(current, previous);
    force.mult(0.1);

    // Add new particle
    paths[paths.length - 1].add(current, force);

    // Schedule next circle
    next = millis() + random(7);

    // Store mouse values
    previous.x = current.x;
    previous.y = current.y;

  }

  // Draw all paths
  for (let i = 0; i < paths.length; i++) {
    paths[i].update();
    paths[i].display();
  }
}

// Start it up
function mousePressed() {
	fullscreen();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Path {
  constructor() {
    this.particles = [];
    this.hue = random(100);
  }

  add(position, force) {
    // Add a new particle with a position, force, and hue
    this.particles.push(new Particle(position, force, this.hue));
  }

  // Display plath
  update() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
    }
  }

  // Display plath
  display() {
    // Loop through backwards
    for (let i = this.particles.length - 1; i >= 0; i--) {
      // If we shold remove it
      if (this.particles[i].lifespan <= 0) {
        this.particles.splice(i, 2);
        // Otherwise, display it
      } else {
        this.particles[i].display(this.particles[i + 1]);
      }
    }

  }
}

// Particles along the path
class Particle {
  constructor(position, force, hue) {
    this.position = createVector(position.x, position.y);
    this.velocity = createVector(force.x, force.y);
    this.drag = 1.2;
    this.lifespan = 200;
  }

  update() {
    // Move it
    this.position.add(this.velocity);
    // Slow it down
    this.velocity.mult(this.drag);
    // Fade it out
    this.lifespan--;
  }

  // Draw particle and connect it with a line
  // Draw a line to another
  display(other) {
    stroke(1, this.lifespan);
    fill(3, this.lifespan / 2);
    ellipse(this.position.x, this.position.y, 19, 19);
    // If we need to draw a line
    if (other) {
      line(this.position.x, this.position.y, other.position.x, other.position.y);
    }
  }
}