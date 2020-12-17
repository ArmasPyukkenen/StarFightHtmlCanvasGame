import {Spaceship} from './js/classes/spaceship.js';
import {Comet} from './js/classes/comet.js';
import {gamma} from './js/gamma.js';
import {Star} from './js/classes/Star.js';
import {SpaceshipAI} from './js/classes/spaceshipAI.js';
import {Menu} from './js/menu/menu.js';

let canvas = document.querySelector('canvas');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
let c = canvas.getContext("2d");

//declare functions
class Game{
	constructor(context){
		//init object state
		this.paused = true;
		this.over = false;
		this.score = 0;
		this.context = context;
		//helper var
		const coordBox = {min : {x : 0, y : 0}, max : {x : canvas.width, y : canvas.height}}
		//init game objects
		this.spaceship = new Spaceship({
			x : 500,
			y : 300,
			coordBox : coordBox
		});
		this.comets = [];
		this.disposableComets = [];
		this.bullets = [];
		this.enemySpaceships = [
			/* new SpaceshipAI({x : 50, y : 50, coordBox : coordBox, speed : 5, skin : gamma.enemy, dataAI : {target : this.spaceship}}),
			new SpaceshipAI({x : 50, y : 500, coordBox : coordBox,speed : 5, skin : gamma.enemy, dataAI : {target : this.spaceship}}) */
		];
		//init player controls
		canvas.addEventListener('click', (event) => {
			const bullet = this.spaceship.shoot();
			this.bullets.push(bullet);
			this.enemySpaceships.forEach(ship => {
				ship.setAIMode('dodge', {threat : bullet})
			})
		});
		canvas.addEventListener('mousemove', (function(e){
			return this.setDestination(e.x, e.y)
		}.bind(this.spaceship)));
		document.addEventListener('keydown', e => {
			if (e.code === "Space"){
				this.spaceship.halt();
			}
		});
		document.addEventListener('keyup', e => {
			if (e.code === "Space"){
				this.spaceship.continueMovement();
			}
		});
		//init stars
		this.starCount = 20;
		this.stars = [];
		for(let i = 0; i < this.starCount; i++){
			this.stars.push(new Star(Math.random() * canvas.width, Math.random() * canvas.height));
		}
		//bind own functions
		this.run = this.run.bind(this);
		this.pause = this.pause.bind(this);
		this.continue = this.continue.bind(this);
	}

	draw(){
		this.drawBackground();
		this.comets.forEach(comet => comet.draw(this.context));
		this.disposableComets.forEach(comet => comet.draw(this.context));
		this.enemySpaceships.forEach(ship => ship.draw(this.context));
		this.bullets.forEach(bullet => bullet.draw(this.context));
		this.spaceship.draw(this.context);
		//display score
		c.setTransform(1, 0, 0, 1, 0, 0);
		c.fillStyle = '#fff';
		c.font = '30px Georgia';
		c.fillText(this.score, canvas.width - 80, 50);
	}

	update(){
		//change background
		if (Math.random() < 0.01){
			this.stars.shift();
			this.stars.push(new Star(Math.random() * canvas.width, Math.random() * canvas.height))
		}
		this.stars.forEach(star => star.flicker());
		//stop non-background updates after gameover
		if (this.over){
			return;
		}
		//move objects
		this.comets.forEach(comet => comet.move());
		this.disposableComets.forEach((comet, index, array) => {
			comet.move();
			if (comet.gone){
				array.splice(index, 1);
			}
		});
		this.enemySpaceships.forEach(ship => ship.move());
		this.spaceship.move();
		this.bullets.forEach((bullet, index, array) => {
			bullet.move();
			if (bullet.gone){
				array.splice(index, 1);
			}
		});
		//change Enemy destination
		this.enemySpaceships.forEach(ship => {
			if(Math.random() < 0.01){
				ship.setDestination(Math.random() * canvas.width, Math.random() * canvas.height);
			}
		})
		//add new comet
		if(Math.random() < 0.03){
			this.comets.push(new Comet(
				{
					x : 40, 
					y : canvas.height/2, 
					dx : (Math.random()*8 + 1) * (Math.random() < 0.5 ? 1 : -1), 
					dy : (Math.random()*8 + 1) * (Math.random() < 0.5 ? 1 : -1),
					r : Math.random()*30 + 10,
					coordBox : {min : {x : 0, y : 0}, max : {x : canvas.width, y : canvas.height}},
					mode : 'bounce'
				}));
			if(this.comets.length > 10){
				let tempComet = this.comets.shift();
				tempComet.setMode('flyAway');
				this.disposableComets.push(tempComet);
			}
		}
		//check collisions between comets and bullets/spaceship
		this.checkCollisions();
		//update score
		if (! this.over){
			this.score += 1;
		}
	}

	checkCollisions(){
		//helper function
		const checkBallsIntercept = (ball1, ball2) => (Math.sqrt((ball1.x - ball2.x)**2 + (ball1.y - ball2.y)**2) < ball1.r + ball2.r);

		this.comets.forEach((comet, cometIndex, cometArray) => {
			//check commet-bullet collision
			this.bullets.forEach((bullet, bulletIndex, bulletArray)=>{
				if (checkBallsIntercept(comet, bullet)){
					cometArray.splice(cometIndex, 1);
					bulletArray.splice(bulletIndex, 1);
				}
			})
			// check commet-spaceship collision
			if (checkBallsIntercept(comet, this.spaceship)){
				this.over = true;
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

	run() {
		//draw objects
		this.draw();
		//recalculate state
		this.update();
		//nextStep
		if( ! this.paused) {
			requestAnimationFrame(this.run);
		}
	}

	pause() {
		this.paused = true;
	}

	continue() {
		this.paused = false;
		this.run();
	}

}



//set state
let game = new Game(c);
game.draw();
//animate
let menu = new Menu();
menu.bindAction(0, () => {
	//TODO: change Game class
	game.continue();
});
menu.bindAction(1, game.continue);
document.addEventListener('keydown', (e)=> {
	if( e.key === 'Escape') {
		menu.show();
		game.pause();
	}
})
//game.run();