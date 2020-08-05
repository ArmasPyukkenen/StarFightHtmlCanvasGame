import {gamma} from '../gamma.js';

export class Comet{
	constructor({x, y, r, dx, dy}){
		this.x = typeof x === 'undefined' ? 100 : x;
		this.y = typeof y === 'undefined' ? 100 : y;
		this.r = r || Math.random()*30 + 10;
		this.dx = dx || (Math.random()*8 + 1) * (Math.random() < 0.5 ? 1 : -1);
		this.dy = dy || (Math.random()*8 + 1) * (Math.random() < 0.5 ? 1 : -1);
		this.minX = 0;
		this.minY = 0;
		this.maxX = canvas.width;
		this.maxY = canvas.height;
		this.shouldDisappear = false;
    this.gone = false;
    this.craters = [];
    for (let i = 0; i < 3; i++){
      let radius = this.r/10 + Math.random() * this.r / 3;
      let offset = radius/2 + Math.random() * (this.r - 3*radius/2);
      let angle = Math.random() * Math.PI * 2;
      let newCrater = {
        x: offset * Math.cos(angle),
        y: offset * Math.sin(angle),
        r: radius
			};
			let findRes = this.craters.find(oldCrater => Math.sqrt((oldCrater.x - newCrater.x)**2+(oldCrater.y - newCrater.y)**2) < oldCrater.r + newCrater.r);
      if (typeof findRes === 'undefined'){
        this.craters.push(newCrater);
      }
    }
	}
	
	draw(c){
		c.fillStyle = gamma.meteor1;
		if (this.shouldDisappear) 
			c.fillStyle = gamma.meteor2;
		c.beginPath();
		c.arc(this.x,this.y,this.r,0,2*Math.PI);
    c.fill();
    this.craters.forEach(crater => {
      c.beginPath();
      c.arc(this.x + crater.x, this.y + crater.y, crater.r, 0, 2 * Math.PI);
      c.stroke();
    })
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