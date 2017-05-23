window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}
Crafty.init(window.innerWidth-23,window.innerHeight-24, document.getElementById('game'));


var player=Crafty.e("2D, DOM, Color, Gravity, Jumper, Collision, Player")
    .attr({x: 100, y: 100,w: 10,h: 20})
    .color('black')
    .gravity('Floor')
    .jumper(300,['W','UP_ARROW'])
    .bind('CheckJumping',function(ground){
        if(!ground&&player.doubleJump){
            player.canJump=true
            player.doubleJump=false
        }
        if(this.isCrouching){
            this.jumpSpeed(400);
            this.isCrouching=false;
        }else{
            this.jumpSpeed(300);
        }
        
    })
    .bind("LandedOnGround",function(ground){
        player.doubleJump=true;
    })
    .bind('KeyDown',function(e){
        if(e.key==Crafty.keys.DOWN_ARROW){
            player.h=5;
            player.w=20;
            player.y+=17;
            player.x-=5;
            player.isCrouching=true;
            player.gravityConst(750);
        }
    })
    .bind('KeyUp',function(e){
        if(e.key==Crafty.keys.DOWN_ARROW){
            player.h=20;
            player.w=10;
            player.y-=20;
            player.x+=5;
            player.isCrouching=false;
            player.gravityConst(500);
        }
    })
    .bind('EnterFrame',function(){
        
        if(this.hit('Wall')){
            Crafty.e("2D, DOM, Text").attr({ x: window.innerWidth/2-150, y: window.innerHeight/2,w:600,h:500}).text("YOU LOSE").textFont({size:'50px'});
            this.destroy();
        }
    })
player.doubleJump=true;
player.isCrouching=false
var floor=Crafty.e("2D, DOM, Color, Floor")
    .attr({x:0,y:window.innerHeight-30,w:window.innerWidth,h:20})
    .color('orange')
    

function makeWall(){
    var temp=Math.floor((Math.random() * 120) + 50);
    var newWall=Crafty.e('2D, Wall, DOM, Color, Collision')
        .attr({x:window.innerWidth+20,y:window.innerHeight-30-temp,w:20,h:temp})
        .color('red')
        .bind('EnterFrame',function(){
            this.x-=4;
        })
}

function GAMELOOP(){
    var temp=Math.floor((Math.random() * 3000) + 750);
    makeWall();
    setTimeout(GAMELOOP,temp);
}
makeWall();
GAMELOOP();
