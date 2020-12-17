import {gamma} from '../gamma.js';
import {MovingBall} from './movingBall.js';

export class Bullet extends MovingBall{
	constructor({x, y, angle, r, speed, coordBox, mode, dx, dy}){
		super({x, y, angle, r, speed, coordBox, mode, dx, dy});
	}
	
	draw(context){
		context.fillStyle = gamma.bullet;
		context.beginPath();
		context.arc(this.x,this.y,this.r,0,2*Math.PI);
		context.fill();
	}
}
