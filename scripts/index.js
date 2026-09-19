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
        if(this.parent){
            document.getElementById(this.call+"-title").addEventListener("click", (event) => {
                const isOpening = sim.cameraTarget != this;
                if (isOpening) {
                    sim.cameraTarget = this;
                    sim.animateToObject(this, 4, 1500);
                }else{
                    sim.cameraTarget = null;
                }
            })
        }
        this.createSVGElement();
    }
    createSVGElement(){
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        circle.setAttribute("id", "svgElement" + this.index); // Unique ID for the circle
        circle.setAttribute("cx", this.position.x);       // Center X position
        circle.setAttribute("cy", this.position.y);       // Center Y position
        circle.setAttribute("r", this.radius);       // Radius
        circle.setAttribute("fill", this.fill);   // Fill color/gradient
        circle.addEventListener("click", () => {
            const isOpening = sim.cameraTarget !== this; // Determine if we are opening or closing
            const targetEl = document.getElementById(this.call);

            if (isOpening) {
                sim.animateToObject(this, 4, 1500);
            }else{
                sim.cameraTarget = null;
            }
        });
        this.svg.appendChild(circle);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("id", "svgText" + this.index);
        text.setAttribute("fill", "white");
        if (this.parent == null || this.parent.name == "Sun") {
            text.setAttribute("font-size", "12");
        }else{
            text.setAttribute("font-size", "5");
        }
        text.setAttribute("text-anchor", "middle"); // Center text horizontally over coordinates
        text.setAttribute("display", "none");       // Hidden by default
        text.textContent = this.name;
        this.svg.appendChild(text);
    }
    tick(deltaTime){
        if(this.fixed) return;
        this.angle += this.angularVelocity * deltaTime;
        let x = this.parent.position.x + this.distance * Math.cos(this.angle);
        let y = this.parent.position.y + this.distance * Math.sin(this.angle);
        this.position = {x:x, y:y};

        if(sim.cameraTarget && (sim.cameraTarget.name == this.name || sim.cameraTarget.parent.name == this.name)){
            document.getElementById(this.call).open = true;
        }else{
            document.getElementById(this.call).open = false;
        }
    }
    render(){
        const el = document.getElementById("svgElement" + this.index);
        if(el){
            el.setAttribute("cx", this.position.x);
            el.setAttribute("cy", this.position.y);
        }
        const textEl = document.getElementById("svgText" + this.index);
        if (textEl) {
            textEl.setAttribute("x", this.position.x);
            if (this.parent == null || this.parent.name == "Sun") {
                textEl.setAttribute("y", this.position.y + this.radius + 15);
            }else{
                textEl.setAttribute("y", this.position.y + this.radius + 5);
            }
            if(this.parent){
                if(this.parent.name == "Sun" && (sim.cameraTarget == null||sim.cameraTarget.name == this.name)){
                    textEl.setAttribute("display", "block");
                }else if(sim.cameraTarget && this.parent.name == sim.cameraTarget.name){
                    textEl.setAttribute("display", "block");
                }else if(sim.cameraTarget && this.name == sim.cameraTarget.name){
                    textEl.setAttribute("display", "block");
                }else if(sim.cameraTarget && this.name == sim.cameraTarget.parent.name){
                    textEl.setAttribute("display", "block");
                }else{
                    textEl.setAttribute("display", "none");
                }
            }
        }
    }
}

class Simulation{
    constructor(){
        this.svg = document.getElementById("sim-svg");
        this.init_events();
        let ids = 0;
        const sun = new CelestialObject(
                "Sun", 
                "url(#sunGlow)", 
                80, 
                "sun",
                null,
                ids++,
                0,
                0,
                true
            );
        const education = new CelestialObject(
                "Education", 
                "blue",
                10, 
                "education-dropdown",
                sun,
                ids++,
                150,
                0.01,
                false
            );
        this.elements = [
            sun,
            education,
            new CelestialObject(
                "UW", 
                "purple",
                5,
                "uw-dropdown",
                education,
                ids++,
                30,
                0.1,
                false
            )
        ];

    }
    animateToObject(obj, targetZoom = 4, duration = 1000) {
        this.cameraTarget = obj;
        this.cameraAnimating = true;

        const startZoom = this.zoom;
        const startTime = performance.now();

        const ease = t => t * t * (3 - 2 * t);

        const animate = (now) => {
            const t = Math.min((now - startTime) / duration, 1);
            const e = ease(t);

            this.zoom = startZoom + (targetZoom - startZoom) * e;

            // Follow the planet at the current zoom
            this.updateCamera();

            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                this.cameraAnimating = false;
            }
        };

        requestAnimationFrame(animate);
    }
    updateCamera() {
        if (!this.cameraTarget) return;

        let rec = this.svg.getBoundingClientRect();

        // Keep the target in the center of the screen
        this.newViewBox.x =
            this.cameraTarget.position.x - (rec.width / this.zoom) / 2;

        this.newViewBox.y =
            this.cameraTarget.position.y - (rec.height / this.zoom) / 2;

        this.viewBox.x = this.newViewBox.x;
        this.viewBox.y = this.newViewBox.y;

        this.svg.setAttribute(
            "viewBox",
            `${this.newViewBox.x} ${this.newViewBox.y} ` +
            `${rec.width / this.zoom} ${rec.height / this.zoom}`
        );
    }
    init_events(){
        this.cameraTarget = null;
        this.cameraAnimating = false;
        this.isPointerDown = false;
        this.pointerOrigin = {x:0, y:0};
        this.zoom = 1; // 1 = default, >1 zoomed in, <1 zoomed out
        this.pointers = new Map(); 
        this.pinchLast = {x: 0, y: 0, distance: 0};
        this.svg.style.touchAction = "none";
        let rec = this.svg.getBoundingClientRect();
        this.viewBox = {
            x: -rec.width / 2,
            y: -rec.height / 2,
        };
        this.newViewBox = {
            x: -rec.width / 2,
            y: -rec.height / 2,
        };
        this.svg.setAttribute("viewBox", `${this.newViewBox.x} ${this.newViewBox.y} ${rec.width / this.zoom} ${rec.height / this.zoom}`);


        this.svg.addEventListener("pointerdown",(event)=>{
            this.isPointerDown = true;
            var pointerPosition = this.getPointFromEvent(event);
            this.pointerOrigin.x = pointerPosition.x;
            this.pointerOrigin.y = pointerPosition.y;
            this.pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
            if(this.pointers.size >= 2){
                this.viewBox.x = this.newViewBox.x;
                this.viewBox.y = this.newViewBox.y;
                this.startPinch();
            }
        });
        this.svg.addEventListener("pointerup",(event)=>{
            this.isPointerDown = false;
            this.svg.releasePointerCapture(event.pointerId); // Releases pointer focus
            this.viewBox.x = this.newViewBox.x;
            this.viewBox.y = this.newViewBox.y;
            this.pointers.delete(event.pointerId);
            if(this.pointers.size === 1){
                const [p] = [...this.pointers.values()];
                this.isPointerDown = true;
                this.pointerOrigin.x = p.x;
                this.pointerOrigin.y = p.y;
            } else if(this.pointers.size >= 2){
                this.startPinch();
            }
        });
        this.svg.addEventListener("pointercancel",(event)=>{
            this.pointers.delete(event.pointerId);
            if(this.pointers.size === 0) this.isPointerDown = false;
            this.viewBox.x = this.newViewBox.x;
            this.viewBox.y = this.newViewBox.y;
        });
        this.svg.addEventListener("pointermove",(event) =>{
            if(this.pointers.has(event.pointerId)){ // ADDED: keep finger positions current
                this.pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
            }
            if(this.pointers.size >= 2){ // ADDED: two fingers -> pinch zoom + two-finger pan
                event.preventDefault();
                const [a, b] = [...this.pointers.values()];
                const distance = Math.hypot(a.x - b.x, a.y - b.y);
                const midX = (a.x + b.x) / 2;
                const midY = (a.y + b.y) / 2;
                let rec = this.svg.getBoundingClientRect();
                // Pan by how far the midpoint moved, then zoom around the midpoint
                this.newViewBox.x -= (midX - this.pinchLast.x) / this.zoom;
                this.newViewBox.y -= (midY - this.pinchLast.y) / this.zoom;
                const factor = this.pinchLast.distance > 0 ? distance / this.pinchLast.distance : 1;
                this.zoomAt(midX - rec.left, midY - rec.top, factor);
                this.pinchLast = {x: midX, y: midY, distance: distance};
                return;
            }
            if(!this.isPointerDown) return;
            event.preventDefault();
            this.cameraTarget = null; // Stop following any planet if the user is dragging
            var pointerPosition = this.getPointFromEvent(event);
            this.svg.setPointerCapture(event.pointerId); // Captures pointer focus
            this.newViewBox.x = this.viewBox.x + (this.pointerOrigin.x - pointerPosition.x) / this.zoom; // CHANGED: divide by zoom
            this.newViewBox.y = this.viewBox.y + (this.pointerOrigin.y - pointerPosition.y) / this.zoom; // CHANGED: divide by zoom
            let rec = this.svg.getBoundingClientRect();
            this.svg.setAttribute("viewBox", `${this.newViewBox.x} ${this.newViewBox.y} ${rec.width / this.zoom} ${rec.height / this.zoom}`);
        },{ passive: false });
        this.svg.addEventListener("wheel",(event) =>{
            event.preventDefault(); // Stop the page from scrolling
            let rec = this.svg.getBoundingClientRect();
            this.zoomAt(event.clientX - rec.left, event.clientY - rec.top, Math.exp(-event.deltaY * 0.001));
            if(this.isPointerDown){
                this.pointerOrigin.x = event.clientX; // Re-anchor an in-progress drag
                this.pointerOrigin.y = event.clientY;
            }
        },{ passive: false });
        window.addEventListener('resize', (event) => {
            let rec = this.svg.getBoundingClientRect();
            this.svg.setAttribute("viewBox", `${this.newViewBox.x} ${this.newViewBox.y} ${rec.width / this.zoom} ${rec.height / this.zoom}`);
        });
    }

    zoomAt(screenX, screenY, factor){
        let rec = this.svg.getBoundingClientRect();
        const newZoom = Math.min(8, Math.max(0.25, this.zoom * factor));

        // World point under that screen position before zooming
        const worldX = this.newViewBox.x + screenX / this.zoom;
        const worldY = this.newViewBox.y + screenY / this.zoom;

        this.zoom = newZoom;

        // Shift the view so that same world point stays under that screen position
        this.newViewBox.x = worldX - screenX / this.zoom;
        this.newViewBox.y = worldY - screenY / this.zoom;
        this.viewBox.x = this.newViewBox.x;
        this.viewBox.y = this.newViewBox.y;
        this.svg.setAttribute("viewBox", `${this.newViewBox.x} ${this.newViewBox.y} ${rec.width / this.zoom} ${rec.height / this.zoom}`);
    }

    startPinch(){
        const [a, b] = [...this.pointers.values()];
        this.pinchLast = {
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2,
            distance: Math.hypot(a.x - b.x, a.y - b.y)
        };
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
        this.updateCamera();
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