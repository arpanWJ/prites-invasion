class Boat {
  constructor(x, y, width, height, boatPos,boatAnimation) {
   
    this.width = width;
    this.height = height;
    this.animation=boatAnimation;
    this.speed=0.05;
    this.body = Bodies.rectangle(x, y, width, height);
   //this.image = loadImage("./assets/boat.png");
    this.boatPosition = boatPos;
    this.isBroken=false;
    World.add(world, this.body);
  }
animate(){
  this.speed += 0.05;
}
remove(index) 
{ 
  this.animation = brokenBoatAnimation; 
  this.speed = 0.05; this.width = 300; 
  this.height = 300; this.isBroken = true; 
  setTimeout(() => { Matter.World.remove(world, boats[index].body); 
    delete boats[index]; }, 2000);
    
  }
  // remove(index){
  //   setTimeout(()=>{
  //   Matter.World.remove(world, boats[index].body);
  //   delete boats[index];},2000)
  // }
  display() {
    var angle = this.body.angle;
    var pos = this.body.position;
    //var index=Math.round(random(0,3))
     var index=floor(this.speed%this.animation.length)
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.animation[index], 0, this.boatPosition, this.width, this.height);
    pop();
  }
}
