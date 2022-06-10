const { parse } = require("csv-parse");
const fs = require('fs');

const habitablePlanets = [];

function isHabitablePlanet(planetDisposition){
    if(planetDisposition['koi_disposition'] === 'CONFIRMED' && planetDisposition['koi_insol'] > 0.36 && planetDisposition['koi_insol'] < 1.11
    && planetDisposition['koi_prad'] < 1.6)
    return true;
};

fs.createReadStream('cumulative_2022.06.08_18.21.13.csv')
//this will give us an event emiiter with which we can react to events from using the on function with data callback function using the data as input
.pipe(parse({
    //treat lines that start with # as comments
    comment: '#',
    columns: true,  //this will return each row in csv file as a js object with key value pairs rather than the values in a row
}))
.on('data', (data) => {
    if(isHabitablePlanet(data)){
        habitablePlanets.push(data);
    }
})
.on('error', (err) => {
    console.log(err);
})
.on('end', () => {
    console.log(habitablePlanets.map((planet) => {
        return planet['kepler_name'];
    }));
    console.log(`done. There are ${habitablePlanets.length} potentially habitable planets`);
});     //note 'end' is the event
//here data is coming in from the stream which wil receive a data callback in this callback function ".on"
//we can call the .on function again which is called chain handling of event hadnlers of our readstream, bc the .on function returns the event 
//emitter it was called on we can call these .on handlers for different events we receive  
