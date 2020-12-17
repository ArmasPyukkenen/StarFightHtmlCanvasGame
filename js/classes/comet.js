import {gamma} from '../gamma.js';
import {MovingBall} from './movingBall.js';

export class Comet extends MovingBall{
	constructor({x, y, angle, r, speed, coordBox, mode, dx, dy}){
		super({x, y, angle, r, speed, coordBox, mode, dx, dy});
		this.shouldDisappear = false;
		//Create craters
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

	setMode(mode){
		super.setMode(mode);
		if (mode == 'flyAway'){
			this.shouldDisappear = true;
		}
	}
}