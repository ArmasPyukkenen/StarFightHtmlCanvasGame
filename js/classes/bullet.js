import {gamma} from '../gamma.js';

export class Bullet{
	constructor(x, y, angle){
		this.x = x;
		this.y = y;
		this.r = 5;
		this.speed = 25;
		this.dx = this.speed * Math.sin(angle);
		this.dy = -this.speed * Math.cos(angle);
		this.gone = false;
		this.minX = 0;
		this.minY = 0;
		this.maxX = canvas.width;
		this.maxY = canvas.height;
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
