import {Spaceship} from './js/classes/spaceship.js';
import {Comet} from './js/classes/comet.js'
import {gamma} from './js/gamma.js';

let canvas = document.querySelector('canvas');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
let c = canvas.getContext("2d");

//declare functions
class Star{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.r = Math.random() * 4;
		this.backCount = 0;
	}

	draw(context){
		let radius = this.r;
		if (this.backCount > 0){
			radius *= this.backCount / 100;
			this.backCount--;
		}
		c.fillStyle = '#fff';
		c.beginPath();
		c.arc(this.x,this.y,radius,0,2*Math.PI);
		c.fill();
	}

	flicker(){
		if(Math.random()<0.001){
			this.backCount = 200;
		}
	}
}

class Game{
	constructor(context){
		this.spaceship = new Spaceship(500, 300);
		this.comets = [];
		this.disposableComets = [];
		this.bullets = [];
		this.starCount = 20;
		this.stars = [];
		for(let i = 0; i < this.starCount; i++){
			this.stars.push(new Star(Math.random() * canvas.width, Math.random() * canvas.height));
		}
		this.going = true;
		this.score = 0;
		this.context = context;
		canvas.addEventListener('click', (event) => {
			this.bullets.push(this.spaceship.shoot());
		});
	}

	draw(){
		this.drawBackground();
		this.comets.forEach(comet => comet.draw(this.context));
		this.disposableComets.forEach(comet => comet.draw(this.context));
		this.bullets.forEach(bullet => bullet.draw(this.context))
		this.spaceship.draw(this.context);
		c.setTransform(1, 0, 0, 1, 0, 0);
		c.fillStyle = '#fff';
		c.font = '30px Georgia';
		c.fillText(this.score, canvas.width - 80, 50);
	}

	update(){
		if (Math.random() < 0.01){
			this.stars.shift();
			this.stars.push(new Star(Math.random() * canvas.width, Math.random() * canvas.height))
		}
		if (! this.going){
			return;
		}
		this.stars.forEach(star => star.flicker());
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

	drawBackground(){
		c.setTransform(1, 0, 0, 1, 0, 0);
		c.fillStyle = gamma.space;
		c.fillRect(0,0,canvas.width, canvas.height);
		this.stars.forEach(star => star.draw(c));
	}

}

//set state
let game = new Game(c);
//animate
function animate(){
	//clearScreen
	//draw objects
	game.draw();
	//recalculate state
	game.update();
	//nextStep
	requestAnimationFrame(animate);
}
requestAnimationFrame(animate);