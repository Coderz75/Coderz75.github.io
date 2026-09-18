"use strict";

class CelestialObject{
    constructor(name, fill, radius, call, parent, index, distance, angularVelocity, fixed=false){
        this.name = name;        
        this.fill = fill;
        this.radius = radius;
        this.position = {x: 0, y: 0};
        this.call = call;
        this.parent = parent;
        this.index = index;
        this.distance = distance;
        this.angularVelocity = angularVelocity;
        this.fixed = fixed;
        this.svg = document.getElementById("sim-svg");
        this.angle = Math.random() * 2 * Math.PI; // Random initial angle for orbiting
        this.createSVGElement();
    }
    createSVGElement(){
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        circle.setAttribute("id", "svgElement" + this.index); // Unique ID for the circle
        circle.setAttribute("cx", this.position.x);       // Center X position
        circle.setAttribute("cy", this.position.y);       // Center Y position
        circle.setAttribute("r", this.radius);       // Radius
        circle.setAttribute("fill", this.fill);   // Fill color/gradient

        // 4. Append it to the SVG
        this.svg.appendChild(circle);
    }
    tick(deltaTime){
        if(this.fixed) return;
        this.angle += this.angularVelocity * deltaTime;
        let x = this.parent.position.x + this.distance * Math.cos(this.angle);
        let y = this.parent.position.y + this.distance * Math.sin(this.angle);
        this.position = {x:x, y:y};
    }
    render(){
        const el = document.getElementById("svgElement" + this.index);
        if(el){
            el.setAttribute("cx", this.position.x);
            el.setAttribute("cy", this.position.y);
        }
    }
}

class Simulation{
    constructor(){
        this.svg = document.getElementById("sim-svg");
        this.init_events();
        const sun = new CelestialObject(
                "Sun", 
                "url(#sunGlow)", 
                120, 
                "sun",
                null,
                0,
                0,
                0,
                true
            );
        const earth = new CelestialObject(
                "Earth", 
                "blue",
                20, 
                "earth",
                sun,
                1,
                100,
                0.5,
                false
            );
        this.elements = [
            sun,
            earth,
            new CelestialObject(
                "Moon", 
                "gray",
                5,
                "moon",
                earth,
                2,
                20,
                3,
                false
            )
        ];

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
        for(let obj of this.elements){
            obj.tick(deltaTime);
        }
    }
    render(){
        for(let obj of this.elements){
            obj.render();
        }
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