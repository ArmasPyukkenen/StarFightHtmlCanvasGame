export class MovingBall{
	constructor({x, y, angle, r, speed, coordBox, mode, dx, dy}){
		this.x = x;
		this.y = y;
		this.r = r || 5;
		//angle and speed have priority over dx and dy
		if(typeof angle === 'undefined' || typeof speed === 'undefined'){
			this.dx = dx || 1;
			this.dy = dy || 1;
			this.speed = Math.sqrt(this.dx**2 + this.dy**2);
			this.angle = undefined;
		} else {
			this.speed = speed;
			//should we calculate the angle change in case of bounce?
			this.angle = angle;
			this.dx = this.speed * Math.sin(angle);
			this.dy = -this.speed * Math.cos(angle);
		}
		
		this.gone = false;
		this.minX = coordBox.min.x || 0;
		this.minY = coordBox.min.y || 0;
		this.maxX = coordBox.max.x || 0;
		this.maxY = coordBox.max.y || 0;
		this.checkModeConditions = (mode ? MovingBallModes[mode] : MovingBallModes['flyAway']).bind(this);
	}
	
	draw(context){
		context.fillStyle = '#888';
		context.beginPath();
		context.arc(this.x,this.y,this.r,0,2*Math.PI);
		context.fill();
	}

	move(){
		this.x += this.dx;
		this.y += this.dy;
		this.checkModeConditions();
		if (this.x < this.minX || this.x > this.maxX || this.y < this.minY || this.y > this.maxY){
			this.dispose();
		}
	}

	dispose(){
		this.gone = true;
	}

	setMode(mode){
		this.checkModeConditions = MovingBallModes[mode].bind(this);
	}
}

const MovingBallModes = {
	'flyAway' : function(){
		if (this.x < this.minX || this.x > this.maxX || this.y < this.minY || this.y > this.maxY){
			this.dispose();
		}
	},

	'bounce' : function(){
		if (this.x - this.r < this.minX || this.x + this.r > this.maxX){
			this.dx *= -1;
			this.x += this.dx;
		}
		if (this.y - this.r < this.minY || this.y + this.r > this.maxY){
			this.dy *= -1;
			this.y += this.dy;
		}
	},

	'stall' : function(){
		if(this.x < this.minX){
			this.x = this.minX;
		}
		if(this.x > this.maxX){
			this.x = this.maxX;
		}
		if(this.y < this.minY){
			this.y = this.minY;
		}
		if(this.y > this.maxY){
			this.y = this.maxY;
		}
	}
}
