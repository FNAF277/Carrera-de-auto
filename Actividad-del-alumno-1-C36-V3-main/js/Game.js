class Game {
  constructor() {
    this.restartButton=createButton("")
    this.Score=createElement("h2")
    this.Place1=createElement("h2")
    this.Place2=createElement("h2")
  }
  getState(){
    var gameStateRef=database.ref("gameState");
    gameStateRef.on("value",function(data){
      gameState=data.val();
    })
  }
  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount=player.getCount();
    player1=createSprite(width/2-350,height-100);
    player2=createSprite(width/2+300,height-100);
    player1.addImage(player1carImage);
    player2.addImage(player2carImage);
    player1.scale=0.1;
    player2.scale=0.1;
    cars=[player1,player2];
    var obstaclesPositions = [ 
    { x: width / 2 + 250, y: height - 800, image: obstacle2Image }, 
    { x: width / 2 - 150, y: height - 1300, image: obstacle1Image }, 
    { x: width / 2 + 250, y: height - 1800, image: obstacle1Image }, 
    { x: width / 2 - 180, y: height - 2300, image: obstacle2Image }, 
    { x: width / 2, y: height - 2800, image: obstacle2Image }, 
    { x: width / 2 - 180, y: height - 3300, image: obstacle1Image }, 
    { x: width / 2 + 180, y: height - 3300, image: obstacle2Image }, 
    { x: width / 2 + 250, y: height - 3800, image: obstacle2Image }, 
    { x: width / 2 - 150, y: height - 4300, image: obstacle1Image }, 
    { x: width / 2 + 250, y: height - 4800, image: obstacle2Image }, 
    { x: width / 2, y: height - 5300, image: obstacle1Image }, 
    { x: width / 2 - 180, y: height - 5500, image: obstacle2Image } ];
    obstacles=new Group()
    this.addSprites(obstacles,obstaclesPositions.length,obstacle1Image,0.07,obstaclesPositions);
    goldenCoin=new Group();
    this.addSprites(goldenCoin,10,goldenCoinImage,0.1);
    fuel=new Group();
    this.addSprites(fuel,10,fuelImage,0.025);
  }
  update(state){
  database.ref("/").update({
    gameState:state
  })
  }
  play(){
    this.handleElements();
    Player.getPlayersInfo();
    //player.getCars();
    this.RestartButton();
    if(allPlayers!=undefined){
      this.placement();
      image(trackImage,0,-height*5,width,height*6);
      var index=0;
      for(var plr in allPlayers){
        index=index+1;
        var x=allPlayers[plr].positionX;
        var y=height-allPlayers[plr].positionY-70;
        cars[index-1].position.x = x; 
        cars[index-1].position.y = y;
        if(index==player.index){
          stroke(10);
          fill("black");
          ellipse(x,y,100,100);
          this.coins(index);
          this.gasoline(index);
          camera.position.y = cars[index-1].position.y-570;
        }
      }
      this.playerControl();
      var finishLine=height*6-100;
      if (player.positionY>=finishLine){
        gameState=2
        player.Place+=1;
        Player.updateCars(player.Place);
        player.update();
        this.showPlace();
      }
      drawSprites();
    }
  }
  handleElements(){
    form.hide();
    Player.getPlayersInfo();
    form.titleImg.position(40,50);
    form.titleImg.class("gameTitleAfterEffect");
    this.restartButton.class("restartButton");
    this.restartButton.position(width/2+600,height/2);
    this.Score.html("Score: ");
    this.Score.class("score");
    this.Score.position(width/2,height/2-600);
    this.Place1.class("leadersText");
    this.Place1.position(width/2,350);
    this.Place2.class("leadersText");
    this.Place2.position(width/2,300);
    var index=0
    for(var lr in allPlayers){
      index=index+1;
      
    }
   
   
  }
  placement(){
    var placement1;
    var placement2;
    var players=Object.values(allPlayers);
    if(players[0].Place==1 && players[1].Place==1 || players[0].Place==2){
      placement1=players[0].Place+"&emsp;"+players[0].name+"&emsp;"+players[0].Score;
      placement2=players[1].Place+"&emsp;"+players[1].name+"&emsp;"+players[1].Score;
    }
    if(players[1].Place==2){
      placement2=players[0].Place+"&emsp;"+players[0].name+"&emsp;"+players[0].Score;
      placement1=players[1].Place+"&emsp;"+players[1].name+"&emsp;"+players[1].Score;
    }
    this.Place1.html(placement1);
    this.Place2.html(placement2);
  }
  playerControl(){
    if(keyIsDown(87)){
      player.positionY=player.positionY+10;
      player.update();
    }
    if(keyIsDown(83)){
      player.positionY=player.positionY-10;
      player.update();
    }
    if(keyIsDown(68)&&player.positionX<=1500){
      player.positionX=player.positionX+10;
      player.update();
    }
    if(keyIsDown(65)&&player.positionX>=640){
      player.positionX=player.positionX-10;
      player.update();
    }
  }
  RestartButton(){
    this.restartButton.mousePressed(()=>{
      database.ref("/").set({
        gameState:0,
        playerCount:0,
        players:{},
        carsAtEnd:0
      })
      window.location.reload();
    })
  }
  addSprites(spriteGroup,numberOfSprites,spriteImage,scale,position=[]){
    for(var i=0;i<numberOfSprites;i++){
      var x,y;
      if(position.length>0){
        x=position[i].x;
        y=position[i].y;
        spriteImage=position[i].image;
      }else{
        x=random(width/2+400,width/2-400);
        y=random(-height*4.5,height-400);
      }
      var sprite=createSprite(x,y);
        sprite.addImage("sprite",spriteImage);
        sprite.scale=scale;
        spriteGroup.add(sprite);
    }
  }
  coins(index){
    cars[index-1].overlap(goldenCoin,function(collector,collected){
      player.Score=player.Score+1;
      player.update();
      collected.remove();
    })
  }
  gasoline(index){
    cars[index-1].overlap(fuel,function(collector,collected){
      player.Fuel=player.Fuel+50;
      player.update();
      collected.remove();
    })
  }
  showPlace(){
    swal({
      title: `You Win${"\n"}Place${"\n"}Nº${player.Place}`,
      text: "Congratulations on finishing the race. GG",
      imageUrl:
"https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
imageSize: "100x100", confirmButtonText: "Ok"
    })
  }
}
