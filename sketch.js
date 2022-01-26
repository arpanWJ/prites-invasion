
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg,boat;
var canvas, angle, tower, ground, cannon;
var balls = [];
var boats = [];
var boatAnimation = [];//1. varible arrya to store sprite sheet from boat.png file
var  boatSpritedata,boatSpritesheet;//varible to load boat.jason and boat.png file
//var boatFrames=[];//varible to store frames from the boatSprites data 
var brokenBoatAnimation = []; 
var brokenBoatSpritedata, brokenBoatSpritesheet;
var waterSplashAnimation = [];
var waterSplashSpritedata, waterSplashSpritesheet;
var backgroundmusic,cannonExplosion,pirateLaugh;
var isgameOver=false;
var isLaughing=false;
var score=0;
function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");

  boatSpritedata = loadJSON("assets/boat/boat.json");
  boatSpritesheet = loadImage("assets/boat/boat.png");;
  brokenBoatSpritedata = loadJSON("assets/boat/brokenBoat.json"); 
  brokenBoatSpritesheet = loadImage("assets/boat/brokenBoat.png");
  waterSplashSpritedata = loadJSON("assets/waterSplash/waterSplash.json");
  waterSplashSpritesheet = loadImage("assets/waterSplash/waterSplash.png");
  backgroundMusic=loadSound("assets/background_music.mp3");
  cannonExplosion=loadSound("assets/cannon_explosion.mp3");
  pirateLaugh=loadSound("assets/pirate_laugh.mp3");
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES)
  angle = 15

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
  World.add(world, tower);

  cannon = new Cannon(180, 110, 130, 100, angle);
  var boatFrames=boatSpritedata.frames;
  //itretating through a array of boat frames
  for(var i=0;i<boatFrames.length;i++)
  {
    var pos=boatFrames[i].position;
    var img=boatSpritesheet.get(pos.x,pos.y,pos.w,pos.h);
    boatAnimation.push(img);
  }
  var brokenBoatFrames = brokenBoatSpritedata.frames; 
  for (var i = 0; i < brokenBoatFrames.length; i++) 
  { var pos = brokenBoatFrames[i].position;
     var img = brokenBoatSpritesheet.get(pos.x, pos.y, pos.w, pos.h); 
     brokenBoatAnimation.push(img); }

     var waterSplashFrames = waterSplashSpritedata.frames; 
  for (var i = 0; i < waterSplashFrames.length; i++) {
    var pos = waterSplashFrames[i].position;
    var img = waterSplashSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    waterSplashAnimation.push(img);
  }
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);

 
  rect(ground.position.x, ground.position.y, width * 2, 1);
  

  push();
  imageMode(CENTER);
  image(towerImage,tower.position.x, tower.position.y, 160, 310);
  pop();

if(!backgroundMusic.isPlaying()){
  backgroundMusic.play();
}

  showBoats();

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    collisionwithBoats(i);//i refers to index of the balls array
  }

  cannon.display();
  textSize(20);
  fill("black");
  text("SCORE: "+score,1000,100);
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

function showCannonBalls(ball, index) {
  if (ball) {
    ball.display();
    if(ball.body.position.x>=width||ball.body.position.y>=height-50){
      if (!ball.isSink) {
      ball.remove(index);
    }
  }
}
}

function showBoats() {
  if (boats.length > 0) {
    if (
      boats[boats.length - 1] === undefined ||
      boats[boats.length - 1].body.position.x < width - 300
    ) {
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      var boat = new Boat(width, height - 100, 170, 170, position,boatAnimation);

      boats.push(boat);
    }

    for (var i = 0; i < boats.length; i++) {
      if (boats[i]) {
        Matter.Body.setVelocity(boats[i].body, {
          x: -0.9,
          y: 0
        });

        boats[i].display();
        boats[i].animate();
      var  collision = Matter.SAT.collides(this.tower, boats[i].body);
      if(collision.collided && !boats[i].isBroken){
       if(!isLaughing && !pirateLaugh.isPlaying() ){
         pirateLaugh.play();
         isLaughing=true;
       }
       isgameOver=true;
       gameOver();
      }
      } 
    }
  } else {
    var boat = new Boat(width, height - 60, 170, 170, -60,boatAnimation);
    boats.push(boat);
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    cannonExplosion.play();
    balls[balls.length - 1].shoot();
  }
}
function collisionwithBoats(index){
  
  for (var i = 0; i < boats.length; i++)
   { 
     if (balls[index] !== undefined && boats[i] !== undefined) //checking whether balls and boats are defined
    {
       var collision = Matter.SAT.collides(balls[index].body, boats[i].body);
    
       if (collision.collided) 
       { 
         boats[i].remove(i); //calling remove function from the class boats 
         Matter.World.remove(world, balls[index].body);//removing the   balls from the world 
         delete balls[index];//deleting ball from the balls array
         score=score+5;
       }
      }
  }
    }
      function gameOver() { swal( { title: `Game Over!!!`, 
      text: "Thanks for playing!!",
       imageUrl: "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
        imageSize: "150x150", confirmButtonText: "Play Again" },
       function(isConfirm) { if (isConfirm) { location.reload(); 
      } } ); }
    