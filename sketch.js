var backIm,ground;
var trex,trexIm,trex_collided;
var database
var count=0;
var gameState;
var game,groundImage;
var score=0;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6,gameOverImg,restartImg,gameOver,restart;

function preload(){
backIm=loadImage("background.jpg")
trexIm= loadAnimation("trex1.png","trex3.png","trex4.png");
trex_collided = loadAnimation("trex_collided.png");
groundImage = loadImage("ground2.png");
cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");  

}
function setup(){
var canvas=createCanvas(1200,600)
trex = createSprite(50,480,20,50);
trex.addAnimation("running", trexIm);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.78;
ground=createSprite(500,520,2000,20)
ground.addImage("ground",groundImage);

//ground.x = ground.width /2;
  //ground.velocityX = -(6 + 3*score/100);
gameOver = createSprite(600,200);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(600,300);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  database = firebase.database();
  game=new Game()
  trex.addAnimation("running", trexIm);
cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
}

function draw(){
background("darkgrey")
textSize(30)
text("Score: "+ score, 500,50);
 camera.position.x = displayWidth/2.5;
          camera.position.y = displayHeight/3
if(keyDown("space")){
	count=1
}
if(count===1){

	gameState=0
}

if(gameState===0){
	score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
if(keyDown("space")&& trex.y >=439 ) {
   // game.update(1);
    trex.velocityY = -12;
   
    }
    trex.velocityY = trex.velocityY + 0.8
trex.collide(ground);
    spawnClouds();
    spawnObstacles();
 if(obstaclesGroup.isTouching(trex)){
          count=0;
          gameState=1
          game.update(1)
    }
}
 else if (gameState === 1) {
    gameOver.visible = true;
    restart.visible = true;
   
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  

 
  
    
   
drawSprites()
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth+20;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}


function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,500,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = 0;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trexIm);
  
 game.update(0)
  score = 0;
  
}