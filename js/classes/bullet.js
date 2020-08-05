import {gamma} from '../gamma.js';
import {MovingBall} from './movingBall.js';

export class Bullet extends MovingBall{
	constructor({x, y, angle, r, speed, coordBox}){
		super();
		this.x = x;
		this.y = y;
		this.r = r || 5;
		this.speed = speed || 25;
		this.dx = this.speed * Math.sin(angle);
		this.dy = -this.speed * Math.cos(angle);
		this.gone = false;
		this.minX = coordBox.min.x || 0;
		this.minY = coordBox.min.y || 0;
		this.maxX = coordBox.max.x || 0;
		this.maxY = coordBox.max.y || 0;
	}
	
	draw(context){
		context.fillStyle = gamma.bullet;
		context.beginPath();
		context.arc(this.x,this.y,this.r,0,2*Math.PI);
		context.fill();
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
}
