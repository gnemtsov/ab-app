"use strict";

//TIMER object
//tracks all timers and prevents memory leaks
//call TIMERS.set(callback, interval, name) to create new timer
//call TIMERS.<name>.destroy() to destroy timer
//call TIMERS.<name>.execute() to execute timer
const TIMER = {
    on: true,    //timers are ON when true
    set: function(callback, interval, name){
        if(['on', 'set', 'execute', 'destroy', 'Timer'].indexOf(name) !== -1){
            throw new Error('Invalid timer name: ' + name); 
        }
        if(this.hasOwnProperty(name) && this[name].id !== 0){  //automatically clears previous timer
            this[name].destroy();
        }
        if(this.on || PRODUCTION){
            this[name] = new this.Timer(callback, interval);
        } else {
            this[name] = {
                id: 0,
                execute: callback,
                destroy: function(){ void(0); }
            }
        }
    },
    Timer: function(callback, interval){ //timer constructor
        this.id = setInterval(callback, interval);
        this.execute = callback;
        this.destroy = function(){ clearInterval(this.id); };
    }
};