import { Spaceship } from './spaceship.js';

export class SpaceshipAI extends Spaceship {
  constructor(options){
    super(options);
    const {mode, dataAI} = options;
    this.applyAICalculations = (mode ? optionsAI[mode] : optionsAI['follow']).bind(this);
    this.dataAI = dataAI;
  }

  move(){
    this.applyAICalculations();
    Spaceship.prototype.move.call(this);
  }

  setAIMode(mode, dataAI){
    this.applyAICalculations = optionsAI[mode].bind(this);
    this.dataAI = dataAI;
  }
}

const optionsAI = {

  'still' : function (){

  },

  'follow' :  function(){
    this.setDestination(this.dataAI.target.x, this.dataAI.target.y)
  },

  'dodge' : function(){
    const threat = this.dataAI.threat;
    const a = threat.dy / threat.dx;
    let b = threat.y - threat.x * a;
    const sinAlpha = threat.dx / Math.sqrt(threat.dx**2 + threat.dy**2);
    const db = (threat.r + this.r) / sinAlpha;
    if ((this.y < a * this.x + b + db) && (this.y > a * this.x + b - db)){
      console.log('under threat')
      const c = this.y + this.x / a;
      b += this.y < a * this.x + b ? -db : db;
      const x = (c - b) * a / (a**2 + 1);
      const y = a * x + b;
      this.setDestination(x, y);
    }
  }
}