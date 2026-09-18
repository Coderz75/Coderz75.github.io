"use strict";

class CelestialObject{
    constructor(name, fill, radius, call, mass, position, velocity, index, fixed=false){
        this.name = name;        
        this.fill = fill;
        this.radius = radius;
        this.call = call;
        this.mass = mass;
        this.position = position;
        this.velocity = velocity;
        this.index = index;
        this.fixed = fixed;
        this.svg = document.getElementById("sim-svg");
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
    calculateGravitationalAcceleration(otherObject){
        const G = 6.67e-11;
        const dx = otherObject.position.x - this.position.x;
        const dy = otherObject.position.y - this.position.y;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < 1) return { x: 0, y: 0 };
        const accelerationMagnitude = G * otherObject.mass / distanceSquared;
        const distance = Math.sqrt(distanceSquared);
        return {
            x: accelerationMagnitude * (dx / distance),
            y: accelerationMagnitude * (dy / distance)
        };
    }
    updatePosition(deltaTime, otherObjects){
        if(this.fixed) return;
        let totalAcceleration = { x: 0, y: 0 };
        otherObjects.forEach(otherObject => {
            if(otherObject !== this) {
                const acceleration = this.calculateGravitationalAcceleration(otherObject);
                totalAcceleration.x += acceleration.x;
                totalAcceleration.y += acceleration.y;
            }
        });
        this.velocity.x += totalAcceleration.x * deltaTime;
        this.velocity.y += totalAcceleration.y * deltaTime;
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
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
        this.elements = [];
        this.build_system();        
        /*const sunMass = 100;
        const orbitRadius = 180; // Centers are 180px apart

        // Speed needed for a smooth circular orbit
        const orbitSpeed = Math.sqrt((G * sunMass) / orbitRadius); // ~7.45 px/s

        this.elements = [
            // Sun (Radius 120, Index 0)
            new CelestialObject(
                "Sun", 
                "url(#sunGlow)", 
                120, 
                "sun", 
                sunMass, 
                { x: 0, y: 0 }, 
                { x: 0, y: 0 }, 
                0, 
                true
            ),
            // Earth (Radius 35, Index 1)
            new CelestialObject(
                "Earth", 
                "blue", 
                35, 
                "earth", 
                1, 
                { x: orbitRadius, y: 0 }, 
                { x: 0, y: -orbitSpeed }, 
                1, 
                false
            ),
        ];
        */
    }

    build_system(){
        let currentIndex = 0;
        let G = 6.67e-11; // Gravitational constant for simulation purposes

        // 1. Central Sun
        const sun = new CelestialObject(
            "Sun", 
            "url(#sunGlow)", 
            1.99e30, 
            () => console.log("Sun clicked"), 
            500, 
            { x: 0, y: 0 }, 
            { x: 0, y: 0 }, 
            currentIndex++, 
            true
        );
        this.elements.push(sun);
        const systemConfig = [
            {
                name: "Earth",
                fill: "#3498db",
                radius: 30,
                mass: 5.97e24,
                distance: 280,
                call: (obj) => console.log(`Clicked on ${obj.name}`),
                moons: [
                    {
                        name: "Luna",
                        fill: "#ecf0f1",
                        radius: 7,
                        mass: 0.01,
                        distance: 55,
                        call: (obj) => console.log(`Callback for Moon: ${obj.name}`)
                    }
                ]
            },
            {
                name: "Jupiter",
                fill: "#e67e22",
                radius: 45,
                mass: 20,
                distance: 480,
                call: (obj) => console.log(`Clicked on ${obj.name}`),
                moons: [
                    {
                        name: "Io",
                        fill: "#f1c40f",
                        radius: 5,
                        mass: 0.01,
                        distance: 65,
                        call: (obj) => console.log(`Callback for ${obj.name}`)
                    },
                    {
                        name: "Europa",
                        fill: "#aeb6bf",
                        radius: 6,
                        mass: 0.01,
                        distance: 85,
                        call: (obj) => console.log(`Callback for ${obj.name}`)
                    }
                ]
            }
        ];

        for (const planetConfig of systemConfig) {
            const angle = Math.random() * 2 * Math.PI; // Random angle for initial position
            const planetPosition = {
                x: planetConfig.distance * Math.cos(angle),
                y: planetConfig.distance * Math.sin(angle)
            };
            const planetVelocityMagnitude = Math.sqrt((G * sun.mass) / planetConfig.distance);
            const planetVelocity = {
                x: -planetVelocityMagnitude * Math.sin(angle),
                y: planetVelocityMagnitude * Math.cos(angle)
            };
            const planet = new CelestialObject(
                planetConfig.name,
                planetConfig.fill,
                planetConfig.radius,
                planetConfig.call,
                planetConfig.mass,
                planetPosition,
                planetVelocity,
                currentIndex++,
                false
            );
            this.elements.push(planet);
            if (planetConfig.moons) {
                for (const moonConfig of planetConfig.moons) {
                    const moonAngle = Math.random() * 2 * Math.PI; // Random angle for initial position
                    const moonPosition = {
                        x: planetPosition.x + moonConfig.distance * Math.cos(moonAngle),
                        y: planetPosition.y + moonConfig.distance * Math.sin(moonAngle) 
                    };
                    const moonVelocityMagnitude = Math.sqrt((G * planet.mass) / moonConfig.distance);
                    const moonVelocity = {
                        x: planetVelocity.x - moonVelocityMagnitude * Math.sin(moonAngle),
                        y: planetVelocity.y + moonVelocityMagnitude * Math.cos(moonAngle)
                    };
                    const moon = new CelestialObject(
                        moonConfig.name,
                        moonConfig.fill,
                        moonConfig.radius,
                        moonConfig.call,
                        moonConfig.mass,
                        moonPosition,
                        moonVelocity,
                        currentIndex++,
                        false
                    );
                    this.elements.push(moon);
                }
            }
        }
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
        for(let i = 0; i < this.elements.length; i++){
            this.elements[i].updatePosition(deltaTime, this.elements);
        }
    }
    render(){
        for(let i = 0; i < this.elements.length; i++){
            this.elements[i].render();
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