var events =require('events');
var util =require('util');
//Define the Pulser Object

function Pulser(){
  events.EventEmitter.call(this);
}
util.inherits(Pulser,events.EventEmitter);

Pulser.prototype.start = function(){
  setInterval(()=>{
    util.log('>>>> pulse');
    this.emit('pulse');
    util.log('<<<< pulse');

  }, 1000);
}

//Instantiate a Pulser Object
var pulser=new Pulser();
//Handler function
pulser.on('pulse', () => {
  util.log('pulse received');
});
//Start it pulsing
pulser.start();