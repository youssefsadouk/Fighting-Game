const canvas = document.querySelector("canvas")
const c = canvas.getContext('2d')

canvas.width = 1024     
canvas.height = 576

c.fillRect(0,0,canvas.width, canvas.height)
const gravity = 0.7

class Sprite{
    constructor({position, imageSrc, scale=1, frames =1, offset2={ x:0, y:0}}){
        this.position = position
        this.width = 50
        this.height = 120
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.frames = frames
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset2 = offset2
    }
    draw(){
        c.drawImage(this.image,
            this.framesCurrent*(this.image.width/this.frames),
            0,
            this.image.width/this.frames,
            this.image.height,
            this.position.x - this.offset2.x, 
            this.position.y - this.offset2.y, 
            (this.image.width/this.frames)*this.scale, 
            this.image.height*this.scale)
    }
    animateFrames(){
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0){
            if (this.framesCurrent < this.frames-1){
                this.framesCurrent++
            } else {
                this.framesCurrent=0
            }
        }
    }
    update(){
        this.draw()
        this.animateFrames()
        
    }

}

class Player extends Sprite{
    constructor({position, velocity, imageSrc, scale=1, frames =1, offset2={ x:0, y:0}, sprites, attackBox = { ofsset:{}, width: undefined, height: undefined}}){
        super({
            position, imageSrc, scale, frames, offset2
        })
        this.velocity = velocity
        this.height = 120
        this.width = 50
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
            
        }
        
        this.isAttacking
        this.health=100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.sprites = sprites

        for (const sprite in this.sprites ){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }
    
    update(){
        this.draw()
        this.animateFrames()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y
        c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 97){
            this.velocity.y = 0
            this.position.y = 359
        } else this.velocity.y += gravity

        
        
    }
    attack(){
        this.switchSprite('Attack1')
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100);
    }
    switchSprite(sprite){
        if ( this.image === this.sprites.Attack1.image &&
            this.framesCurrent < this.sprites.Attack1.frames - 1 )
            return
        switch(sprite){
            case 'Idle':
                if (this.image !== this.sprites.Idle.image){
                    this.image = this.sprites.Idle.image
                    this.frames = this.sprites.Idle.frames
                    this.framesCurrent = 0
                }
                break
            case 'Run':
                if (this.image !== this.sprites.Run.image){
                    this.image = this.sprites.Run.image
                    this.frames = this.sprites.Run.frames
                    this.framesCurrent = 0
                }
                break
            case 'Jump':
                if (this.image !== this.sprites.Jump.image){
                    this.image = this.sprites.Jump.image
                    this.frames = this.sprites.Jump.frames
                    this.framesCurrent = 0
                }
                break
            case 'Fall':
                if (this.image !== this.sprites.Fall.image){
                    this.image = this.sprites.Fall.image
                    this.frames = this.sprites.Fall.frames
                    this.framesCurrent = 0
                }
                break
            case 'Attack1':
                if (this.image !== this.sprites.Attack1.image){
                    this.image = this.sprites.Attack1.image
                    this.frames = this.sprites.Attack1.frames
                    this.framesCurrent = 0
                }
                break              
        }
    }
}


const background = new Sprite({
    position: {
       x: 0,
       y: 0 
    },
    imageSrc: "./img/background2.png"
})
const shop = new Sprite({
    position:{
        x:650,
        y:126
    },
    imageSrc: "./img/shop.png",
    scale: 2.75,
    frames: 6
})
const player = new Player({
    position: {
        x: 0,
        y: 0 },
    velocity : {
        x: 0,
        y: 10
    },
    
    imageSrc: "./samuraiMack/samuraiMack/Idle.png",
    frames: 8,
    scale: 2.75,
    offset2:{
        x:0,
        y:215
    },
    sprites: {
        Idle:{
            imageSrc: "./samuraiMack/samuraiMack/Idle.png",
            frames: 8
        },
        Run: {
            imageSrc: "./samuraiMack/samuraiMack/Run.png",
            frames: 8
        },
        Jump: {
            imageSrc: "./samuraiMack/samuraiMack/Jump.png",
            frames: 2
        },
        Fall: {
            imageSrc: "./samuraiMack/samuraiMack/Fall.png",
            frames: 2
        },
        Attack1: {
            imageSrc: "./samuraiMack/samuraiMack/Attack1.png",
            frames: 6
        }

    },
    attackBox: {
        offset:{
            x:300,
            y:0 
        },
        width:160,
        height: 50
    }
    
})

const enemy = new Player({
    position: {
        x :400,
        y :100 },
    velocity : {
        x: 0,
        y: 0
    },
    color: 'blue',
    imageSrc: "./Kenji/Kenji/Idle.png",
    frames: 8,
    scale: 2.75,
    offset2:{
        x:0,
        y:230
    },
    sprites: {
        Idle:{
            imageSrc: "./Kenji/Kenji/Idle.png",
            frames: 4
        },
        Run: {
            imageSrc: "./Kenji/Kenji/Run.png",
            frames: 8
        },
        Jump: {
            imageSrc: "./Kenji/Kenji/Jump.png",
            frames: 2
        },
        Fall: {
            imageSrc: "./Kenji/Kenji/Fall.png",
            frames: 2
        },
        Attack1: {
            imageSrc: "./Kenji/Kenji/Attack1.png",
            frames: 4
        }

    },
    attackBox: {
        offset:{
            x:250,
            y:0 
        },
        width:90,
        height: 50
    }
    
})
console.log(player.attackBox.position.x)
console.log(player.attackBox.width)
console.log(enemy.position.x)
const keys = {
    a : { 
        pressed: false
    },
    d: {
        pressed: false
    }
    ,ArrowRight: {
        pressed: false
    },ArrowLeft: {
        pressed: false
    }
}
function collision({ rectangle1, rectangle2 }) {
    return (
      rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
      && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width 
      && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y 
      && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
}

function whoIsWinner({player, enemy, timerId}){
    clearTimeout(timerId)
    document.querySelector('#result').style.display='flex'
    if (player.health === enemy.health){
        document.querySelector('#result').innerHTML='Tie'
    } else if (player.health > enemy.health){
        document.querySelector('#result').innerHTML='Player 1 wins'
       
    } else {
        document.querySelector('#result').innerHTML='Player 2 wins'
    }
}
let timer = 60
let timerId
function decreaseTimer(){
    if (timer >0){
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML= timer
    }
    if (timer === 0){
        whoIsWinner({player, enemy})
    }
    
}
decreaseTimer()
function animate(){ 
    window.requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0,0,canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()
    player.velocity.x = 0
    enemy.velocity.x = 0
    //Player's movement
    
    if (keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
        player.switchSprite('Run')
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('Run')
    } else {
        player.switchSprite('Idle')
    }
    //jump:
    if (player.velocity.y < 0 ){
        player.switchSprite('Jump')
    } else if (player.velocity.y > 0 ){
        player.switchSprite('Fall')
    }
    //enemy's movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprite('Run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('Run')
    } else {
        enemy.switchSprite('Idle')
    }
    //jump:
    if (enemy.velocity.y < 0 ){
        enemy.switchSprite('Jump')
    } else if (enemy.velocity.y > 0 ){
        enemy.switchSprite('Fall')
    }
    // detect for collision
    if  (collision({rectangle1 : player, rectangle2 : enemy}) && player.isAttacking ) {
        console.log(collision({rectangle1 : player, rectangle2 : enemy}))
        player.isAttacking = false
        enemy.health-=20
        document.querySelector("#enemyHealth").style.width= enemy.health + "%"
    }
    if  (collision({rectangle1 : enemy, rectangle2 : player}) && enemy.isAttacking) {
            enemy.isAttacking = false
            player.health-=20
            document.querySelector("#playerHealth").style.width= player.health + "%" 
        }  
    if (player.health<=0 || enemy.health<=0){
        whoIsWinner({player, enemy, timerId})
    }         
}

animate()


window.addEventListener('keydown', (event) => {
   switch(event.key){
    case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
    case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
    case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
    case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
    case 'w':
        player.velocity.y=-15
        break
    case 'ArrowUp':
        enemy.velocity.y=-15
        break
    case ' ':
        player.attack()
        break
    case 'ArrowDown':
        enemy.attack()
        break    
    }

})
window.addEventListener('keyup', (event) => {
    switch (event.key) {
     case 'd':
        keys.d.pressed = false
        break
     case 'a':
        keys.a.pressed = false
        break
   
    case 'ArrowRight':
        keys.ArrowRight.pressed = false
        break
    case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
        break
   
    }
 })
 
