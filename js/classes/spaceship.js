import {Bullet} from './bullet.js';
import {gamma} from '../gamma.js';
import {MovingBall} from './movingBall.js';

export class Spaceship{
	constructor({x, y, bulletCoordBox}){
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
		this.bulletCoordBox = bulletCoordBox;
	}

	draw(c){
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
		return new MovingBall({
			x : this.x + this.dx * this.r / this.speed,
			y : this.y + this.dy * this.r / this.speed,
			angle : this.angle,
			coordBox : this.bulletCoordBox
		});
	}
}