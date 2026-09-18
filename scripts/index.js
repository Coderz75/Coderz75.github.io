"use strict";

class Simulation{

    constructor(){
        this.svg = document.getElementById("sim-svg");
        this.init_events();
    }
    init_events(){
        this.isPointerDown = false;
        this.pointerOrigin = {x:0, y:0};
        this.viewBox = {
            x: 0,
            y: 0,
        };
        this.newViewBox = {
            x: 0,
            y: 0
        };


        this.svg.addEventListener("pointerdown",(event)=>{
            this.isPointerDown = true;
            var pointerPosition = this.getPointFromEvent(event);
            this.pointerOrigin.x = pointerPosition.x;
            this.pointerOrigin.y = pointerPosition.y;
        });
        this.svg.addEventListener("pointerup",(event)=>{
            this.isPointerDown = false;
            this.viewBox.x = this.newViewBox.x;
            this.viewBox.y = this.newViewBox.y;
        });
        this.svg.addEventListener("pointermove",(event) =>{
            if(!this.isPointerDown) return;
            event.preventDefault();
            var pointerPosition = this.getPointFromEvent(event);
            this.newViewBox.x = this.viewBox.x + (this.pointerOrigin.x - pointerPosition.x);
            this.newViewBox.y = this.viewBox.y + (this.pointerOrigin.y - pointerPosition.y);
            let rec = this.svg.getBoundingClientRect();
            this.svg.setAttribute("viewBox", `${this.newViewBox.x} ${this.newViewBox.y} ${rec.width} ${rec.height}`);
        });
        window.addEventListener('resize', (event) => {
            let rec = this.svg.getBoundingClientRect();
            this.svg.setAttribute("viewBox", `${this.newViewBox.x} ${this.newViewBox.y} ${rec.width} ${rec.height}`);
        });
    }
    // This function returns an object with X & Y values from the pointer event
    getPointFromEvent (event) {
        var point = {x:0, y:0};
        // If event is triggered by a touch event, we get the position of the first finger
        if (event.targetTouches) {
            point.x = event.targetTouches[0].clientX;
            point.y = event.targetTouches[0].clientY;
        } else {
            point.x = event.clientX;
            point.y = event.clientY;
        }
        
        return point;
    }

    tick(deltaTime){

    }
    render(){

    }
}

let sim = new Simulation()
let lastTime = performance.now();
function tick(currentTime){
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime; // Updated to measure frame intervals correctly
    sim.tick(deltaTime);
    sim.render();
    requestAnimationFrame(tick);
}
requestAnimationFrame(tick);