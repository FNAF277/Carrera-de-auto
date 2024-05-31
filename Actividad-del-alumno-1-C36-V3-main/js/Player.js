class Player {
  constructor() {
    this.name=null;
    this.index=null;
    this.positionX=0;
    this.positionY=0;
    this.Fuel=160;
    this.Score=0;
    this.Place=1;
  }
  getCount(){
    var playerCountRef=database.ref("playerCount");
    playerCountRef.on("value",data=>{
      playerCount=data.val();
    })
  }
  updateCount(count){
    database.ref("/").update({
      playerCount: count
    })
  }
  addPlayer(){
    playerIndex="players/player"+this.index;
    if (this.index==1){
      this.positionX=width/2-150;
    }else{
      this.positionX=width/2+150;
    }
    database.ref(playerIndex).set({
      name: this.name,
      positionX:this.positionX,
      positionY:this.positionY,
      Place: this.Place,
      Score: this.Score,
      Fuel: this.Fuel
    })
  }
  static getPlayersInfo(){
    var playerInfoRef=database.ref("players");
    playerInfoRef.on("value",data=>{
      allPlayers=data.val();
    })
  }
  update(){
    var playerIndex="players/player"+this.index;
    database.ref(playerIndex).update({
      positionX:this.positionX,positionY:this.positionY,
      Place: this.Place,
      Score: this.Score,
      Fuel: this.Fuel
    });
  }
  getDistance(){
    var playerDistanceRef = database.ref("players/player" + this.index);
      playerDistanceRef.on("value",data=>{
      var data = data.val();
      this.positionX = data.positionX;
      this.positionY = data.positionY;
    });
  }
  getCars(){
    database.ref("carsAtEnd").on("value",data=>{
      this.Place=data.val();
    });
  }
  static updateCars(Place){
    database.ref("/").update({
      carsAtEnd: Place
    })
  }
}