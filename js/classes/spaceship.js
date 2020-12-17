import {Bullet} from './bullet.js';
import {gamma} from '../gamma.js';
import { MovingBall } from './movingBall.js';

export class Spaceship extends MovingBall{
	constructor({x, y, angle, r, speed, coordBox, mode, dx, dy, skin}){
		super({x, y, angle, r, speed, coordBox, mode, dx, dy});
		this.r = r || 20;
		this.speed = speed || 10;
		this.dx = dx || 0;
		this.dy = dx || 0;
		this.setMode(mode || 'stall');
		this.destination = {x : this.x, y : this.y};
		this.bulletCoordBox = coordBox;
		this.skin = new Image();
		this.skin.src = skin || gamma.spaceshipSrc;
	}

	draw(c){
		c.setTransform(1, 0, 0, 1, this.x, this.y); // sets scales and origin
    c.rotate(this.angle);
		c.drawImage(this.skin, -this.r, -this.r, 2*this.r, 2*this.r);
		c.setTransform(1, 0, 0, 1, 0, 0);
	}

	setDestination(x, y){
		this.destination = {x, y};
		let distance = Math.sqrt((x - this.x)**2 + (y - this.y)**2);
		this.dx = this.speed * (x - this.x) / distance;
		this.dy = this.speed * (y - this.y) / distance;
		this.angle = this.dx > 0 ? Math.acos(-this.dy/this.speed) : -Math.acos(-this.dy/this.speed);
	}

	halt(){
		this.stopped = true;
	}

	continueMovement(){
		this.stopped = false;
	}

	move(){
		if (this.stopped){
			return;
		}
		if (Math.sqrt((this.destination.x - this.x)**2 + (this.destination.y - this.y)**2) < this.r/2 + this.speed){
			this.x = this.destination.x - this.r*this.dx/(2*this.speed);
			this.y = this.destination.y - this.r*this.dy/(2*this.speed);
		} else {
			this.x += this.dx;
			this.y += this.dy;
		}
	}

	shoot(){
		return new Bullet({
			x : this.x + this.dx * this.r / this.speed,
			y : this.y + this.dy * this.r / this.speed,
			angle : this.angle,
			speed : 25,
			coordBox : this.bulletCoordBox
		});
	}
}