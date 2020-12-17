export class Star{
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
		context.fillStyle = '#fff';
		context.beginPath();
		context.arc(this.x,this.y,radius,0,2*Math.PI);
		context.fill();
	}

	flicker(){
		if(Math.random()<0.001){
			this.backCount = 200;
		}
	}
}