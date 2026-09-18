"use strict";

class Simulation{
    constructor(){
        this.svg = document.getElementById("sim-svg");
        this.init_events();
    }
    init_events(){
        this.isPointerDown = false;
        this.pointerOrigin = {x:0, y:0};
        let rec = this.svg.getBoundingClientRect();
        this.viewBox = {
            x: -rec.width / 2,
            y: -rec.height / 2,
        };
        this.newViewBox = {
            x: -rec.width / 2,
            y: -rec.height / 2,
        };
        this.svg.setAttribute("viewBox", `${this.newViewBox.x} ${this.newViewBox.y} ${rec.width} ${rec.height}`);


        this.svg.addEventListener("pointerdown",(event)=>{
            this.isPointerDown = true;
            var pointerPosition = this.getPointFromEvent(event);
            this.pointerOrigin.x = pointerPosition.x;
            this.pointerOrigin.y = pointerPosition.y;
        });
        this.svg.addEventListener("pointerup",(event)=>{
            this.isPointerDown = false;
            this.svg.releasePointerCapture(event.pointerId); // Releases pointer focus
            this.viewBox.x = this.newViewBox.x;
            this.viewBox.y = this.newViewBox.y;
        });
        this.svg.addEventListener("pointermove",(event) =>{
            if(!this.isPointerDown) return;
            event.preventDefault();
            var pointerPosition = this.getPointFromEvent(event);
            this.svg.setPointerCapture(event.pointerId); // Captures pointer focus
            this.newViewBox.x = this.viewBox.x + (this.pointerOrigin.x - pointerPosition.x);
            this.newViewBox.y = this.viewBox.y + (this.pointerOrigin.y - pointerPosition.y);
            let rec = this.svg.getBoundingClientRect();
            this.svg.setAttribute("viewBox", `${this.newViewBox.x} ${this.newViewBox.y} ${rec.width} ${rec.height}`);
        },{ passive: false });
        window.addEventListener('resize', (event) => {
            let rec = this.svg.getBoundingClientRect();
            this.svg.setAttribute("viewBox", `${this.newViewBox.x} ${this.newViewBox.y} ${rec.width} ${rec.height}`);
        });
    }

    getPointFromEvent(event) {
        return {
            x: event.clientX,
            y: event.clientY
        };
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