window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}
Crafty.init(window.innerWidth-23,window.innerHeight-24, "#game");

var options={
    maxParticles:20,
    size:3,
    sizeRandom: 2,
    speed: 2,
    speedRandom: 1.2,
    lifeSpan: 20,
    lifeSpanRandom: 7,
    angle: 300,
    angleRandom: 20,
    startColour: [77, 40, 0, 1],
    spread: 0,
    duration: -1,
    fastMode: true,
    gravity: { x: 0, y: 0.1 },
    jitter: .5,
    originOffset: {x: 0, y: 20}
}


var player=Crafty.e("2D, Canvas, Color, Gravity, Jumper, Collision, Player, Particles")
    .attr({x: 100, y: 100,w: 10,h: 20})
    .color('black')
    .gravity('Floor')
    .jumper(300,['W','UP_ARROW'])
    .particles(options)
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
        
//         player.particles(options)
        player.pauseParticles();
    })
    .bind("LandedOnGround",function(ground){
        player.doubleJump=true;
//         player.particles(options)
        player.resumeParticles();
    })
    .bind('KeyDown',function(k){
        if(k.key==Crafty.keys.DOWN_ARROW){
            player.h=5;
            player.w=20;
            player.y+=17;
            player.x-=5;
            player.isCrouching=true;
            player.gravityConst(750);
            options.originOffset.y=5;
        }
        if(k.key==Crafty.keys.SPACE){
            var sword = Crafty.e("2D, Canvas, Collision, Color")
                .attr({x:player.x+10,y:player.y+5,w:70,h:10,counter:3})
                .color("pink")
                .bind("EnterFrame",function(){
                    var temp= this.hit("Enemy");
                    if(temp){
                        player.doubleJump=true;
                        temp[0].obj.destroy();
                    }
                    if(this.counter<0){
                        this.destroy();
                    }else{
                        this.counter--
                    }
                })
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
            options.originOffset.y=20;
        }
    })
    .bind('EnterFrame',function(){
        
        if(this.hit('Wall')||this.hit('Enemy')){
            Crafty.e("2D, Canvas, Text").attr({ x: window.innerWidth/2-150, y: window.innerHeight/2,w:600,h:500}).text("YOU LOSE").textFont({size:'50px'});
            this.destroy();
        }
    })
player.doubleJump=true;
player.isCrouching=false
var floor=Crafty.e("2D, Canvas, Color, Floor")
    .attr({x:0,y:window.innerHeight-30,w:window.innerWidth,h:20})
    .color('brown')
    

function makeWall(){
    var temp=Math.floor((Math.random() * 120) + 50);
    var newWall=Crafty.e('2D, Wall, Canvas, Color, Collision')
        .attr({x:window.innerWidth+20,y:window.innerHeight-30-temp,w:20,h:temp})
        .color('red')
        .bind('EnterFrame',function(){
            this.x-=4;
            if(this.x+20<0){
                this.destroy();
            }
        })
}

function makeEnemy(){
    var maxCoords={topY:(Math.random() * 100) + 20,botY:(Math.random() * 360) + 150}
    var newEnemy=Crafty.e('2D, Enemy, Canvas, Color, Collision, Particles')
        .attr({x:window.innerWidth+20, y:maxCoords.topY, w:10, h:10, goingUp:false, speed:25, topY:maxCoords.topY, botY:maxCoords.botY})
        .color(128,0,0)
        .bind('EnterFrame',function(){
            if(this.goingUp){
                this.y+=(this.topY-this.y)/this.speed
            }else{
                this.y+=(this.botY-this.y)/this.speed
            }
            
            this.x-=2;
            if(this.x+20<0){
                this.destroy;
            }
        })
        .one('EnterFrame',function(){
            if(this.botY-this.topY<20){
                makeEnemy();
                this.destroy();
            }
        })
    }

function GAMELOOP(){
    var temp=Math.floor((Math.random() * 3000) + 750);
    makeWall();
    makeEnemy();
    setTimeout(GAMELOOP,temp);
}
// makeWall();
GAMELOOP();
