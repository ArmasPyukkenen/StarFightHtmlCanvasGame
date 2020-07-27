import {Bullet} from './js/classes/bullet.js';
import {gamma} from './js/gamma.js';

let canvas = document.querySelector('canvas');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
let c = canvas.getContext("2d");



//declare functions
function clearScreen(){
	c.setTransform(1, 0, 0, 1, 0, 0);
	c.fillStyle = gamma.space;
	c.fillRect(0,0,canvas.width, canvas.height);
};

class Comet{
	constructor(x, y){
		this.x = typeof x === 'undefined' ? 100 : x;
		this.y = typeof y === 'undefined' ? 100 : y;
		this.r = Math.random()*30 + 10;
		this.dx = (Math.random()*8 + 1) * (Math.random() < 0.5 ? 1 : -1);
		this.dy = (Math.random()*8 + 1) * (Math.random() < 0.5 ? 1 : -1);
		this.minX = 0;
		this.minY = 0;
		this.maxX = canvas.width;
		this.maxY = canvas.height;
		this.shouldDisappear = false;
		this.gone = false;
	}
	
	draw(){
		c.fillStyle = gamma.meteor1;
		if (this.shouldDisappear) 
			c.fillStyle = gamma.meteor2;
		c.beginPath();
		c.arc(this.x,this.y,this.r,0,2*Math.PI);
		c.fill();
	}

	move(){
		this.x += this.dx;
		this.y += this.dy;
		if (this.x - this.r < this.minX || this.x + this.r > this.maxX){
			if(this.shouldDisappear){
				if(this.x + this.r < this.minX || this.x - this.r > this.maxX){
					this.gone = true;
				}
			} else {
				this.dx *= -1;
				this.x += this.dx;
			}
		}
		if (this.y - this.r < this.minY || this.y + this.r > this.maxY){
			if(this.shouldDisappear){
				if(this.y + this.r < this.minY || this.y - this.r > this.maxY){
					this.gone = true;
				}
			} else {
				this.dy *= -1;
				this.y += this.dy;	
			}
		}
	}

	dispose(){
		this.shouldDisappear = true;
	}
}

class Spaceship{
	constructor(x, y){
		this.x = typeof x === 'undefined' ? 100 : x;
		this.y = typeof y === 'undefined' ? 100 : y;
		this.r = 20;
		this.speed = 10;
		this.dx = 0;
		this.dy = 0;
		this.aimX = this.x;
		this.aimY = this.y;
		canvas.addEventListener('mousemove', this.headToCursor.bind(this));
		document.addEventListener('keydown', e => {
			if (e.code === "Space"){
				this.stopped = true;
			}
		});
		document.addEventListener('keyup', e => {
			if (e.code === "Space"){
				this.stopped = false;
			}
		});
		this.skin = new Image();
		this.skin.src = gamma.spaceshipSrc;
		this.angle = 0;
	}

	draw(){
		c.setTransform(1, 0, 0, 1, this.x, this.y); // sets scales and origin
    c.rotate(this.angle);
		c.drawImage(this.skin, -this.r, -this.r, 2*this.r, 2*this.r);
	}

	headToCursor(event){
		this.aimX = event.x;
		this.aimY = event.y;
		let distance = Math.sqrt((event.x - this.x)**2 + (event.y - this.y)**2);
		this.dx = this.speed * (event.x - this.x) / distance;
		this.dy = this.speed * (event.y - this.y) / distance;
		this.angle = this.dx > 0 ? Math.acos(-this.dy/this.speed) : -Math.acos(-this.dy/this.speed);
	}

	move(){
		if (this.stopped){
			return;
		}
		if (Math.sqrt((this.aimX - this.x)**2 + (this.aimY - this.y)**2) < this.r/2 + this.speed){
			this.x = this.aimX - this.r*this.dx/(2*this.speed);
			this.y = this.aimY - this.r*this.dy/(2*this.speed);
		} else {
			this.x += this.dx;
			this.y += this.dy;
		}
	}

	dispose(){
		canvas.removeEventListener('mousemove', this.headToCursor.bind(this));
	}

	shoot(){
		return new Bullet(this.x + this.dx * this.r / this.speed, this.y + this.dy * this.r / this.speed, this.angle);
	}
}

/* class Bullet{
	constructor(x, y, angle){
		this.x = x;
		this.y = y;
		this.r = 5;
		this.speed = 20;
		this.dx = this.speed * Math.sin(angle);
		this.dy = -this.speed * Math.cos(angle);
		this.gone = false;
		this.minX = 0;
		this.minY = 0;
		this.maxX = canvas.width;
		this.maxY = canvas.height;
	}
	
	draw(){
		c.fillStyle = gamma.bullet;
		c.beginPath();
		c.arc(this.x,this.y,this.r,0,2*Math.PI);
		c.fill();
	}

	move(){
		this.x += this.dx;
		this.y += this.dy;
		if (this.x < this.minX || this.x > this.maxX || this.y < this.minY || this.y > this.maxY){
			this.dispose();
		}
	}

	dispose(){
		this.gone = true;
	}
} */

class Game{
	constructor(){
		this.spaceship = new Spaceship(500, 300);
		this.comets = [new Comet(40, canvas.height/2)];
		this.disposableComets = [];
		this.bullets = [];
		this.going = true;
		this.score = 0;
		canvas.addEventListener('click', (event) => this.bullets.push(this.spaceship.shoot()));
	}

	draw(){
		this.comets.forEach(comet => comet.draw());
		this.disposableComets.forEach(comet => comet.draw());
		this.bullets.forEach(bullet => bullet.draw(c))
		this.spaceship.draw();
		c.setTransform(1, 0, 0, 1, 0, 0);
		c.fillStyle = '#fff';
		c.font = '30px Georgia';
		c.fillText(this.score, canvas.width - 80, 50);
	}

	update(){
		if (! this.going){
			return;
		}
		this.comets.forEach(comet => comet.move());
		this.disposableComets.forEach((comet, index, array) => {
			comet.move();
			if (comet.gone){
				array.splice(index, 1);
			}
		});
		if(Math.random() < 0.03){
			this.comets.push(new Comet(40, canvas.height/2));
			if(this.comets.length > 10){
				let tempComet = this.comets.shift();
				tempComet.dispose();
				this.disposableComets.push(tempComet);
			}
		}
		this.spaceship.move();
		this.bullets.forEach((bullet, index, array) => {
			bullet.move();
			if (bullet.gone){
				array.splice(index, 1);
			}
		});
		this.checkCollisions();
		if (this.going){
			this.score += 1;
		}
	}

	checkCollisions(){
		this.comets.forEach((comet, cometIndex, cometArray) => {
			this.bullets.forEach((bullet, bulletIndex, bulletArray)=>{
				if (Math.sqrt((comet.x - bullet.x)**2 + (comet.y - bullet.y)**2) < comet.r + bullet.r){
					cometArray.splice(cometIndex, 1);
					bulletArray.splice(bulletIndex, 1);
				}
			})
			if (Math.sqrt((comet.x - this.spaceship.x)**2 + (comet.y - this.spaceship.y)**2) < comet.r + this.spaceship.r){
				this.going = false;
				this.spaceship.dispose();
			}
		})
	}

}
//set state

let game = new Game();

//animate
function animate(){
	//clearScreen
	clearScreen();

	//draw objects
	game.draw();

	//recalculate state

	game.update();

	//nextStep
	requestAnimationFrame(animate);
}

requestAnimationFrame(animate);