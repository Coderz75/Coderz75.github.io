"use strict";
const mobileQuery = window.matchMedia("(max-width: 768px)");
function setSheet(open){
    document.getElementById("index").classList.toggle("open", open);
    document.getElementById("sheet-toggle").setAttribute("aria-expanded", open);
}
let scrollTimer;
function scrollIndexTo(id){ // id = a dropdown's id, or null to scroll back to the top
    clearTimeout(scrollTimer);
    // wait for the dropdowns to finish opening/closing (0.3s) so the layout has settled
    scrollTimer = setTimeout(() => {
        const panel = document.getElementById("index");
        let top = 0;
        if(id){
            const pad = parseFloat(getComputedStyle(panel).paddingTop); // leaves room for the link bar
            top = document.getElementById(id).getBoundingClientRect().top
                - panel.getBoundingClientRect().top + panel.scrollTop - pad;
        }
        panel.scrollTo({top: top, behavior: "smooth"});
    }, 350);
}

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
                    if(this.parent.name == "Sun"){
                        sim.animateToObject(this.parent, sim.homeZoom, 1500);
                        sim.cameraTarget = null;
                    }else{
                        sim.animateToObject(this.parent, 4, 1500);
                    }
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
        if (this.call){
            circle.addEventListener("click", () => {
                const isOpening = sim.cameraTarget !== this; // Determine if we are opening or closing
                const targetEl = document.getElementById(this.call);

                if (isOpening) {
                    sim.animateToObject(this, 4, 1500);
                    scrollIndexTo(this.call);
                    if (mobileQuery.matches && this.parent.name != "Sun") setSheet(true); 
                }else{
                    if(this.parent.name == "Sun"){
                        sim.animateToObject(this.parent, sim.homeZoom, 1500);
                        sim.cameraTarget = null;
                    }else{
                        sim.animateToObject(this.parent, 4, 1500);
                    }
                }
            });
        }else{ //sun
            circle.addEventListener("click", () => {
                sim.animateToObject(this, sim.homeZoom, 1500);
                sim.cameraTarget = null;
            });
        }
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
                50, 
                null,
                null,
                ids++,
                0,
                0,
                true
            );
        const education = new CelestialObject(
                "Education", 
                "#4C9AFF",
                10, 
                "education-dropdown",
                sun,
                ids++,
                110,
                0.01592,
                false
            );
        const research = new CelestialObject(
            "Research",
            "#F4736B",
            8,
            "research-dropdown",
            sun,
            ids++,
            291,
            0.0037,
            false
        )
        const experience = new CelestialObject(
            "Experience",
            "#34D399",
            12,
            "experience-dropdown",
            sun,
            ids++,
            204,
            0.00631,
        )
        const projects = new CelestialObject(
            "Projects",
            "#F472B6",
            12,
            "projects-dropdown",
            sun,
            ids++,
            422,
            0.00212,
            false
        )
        const battlecode = new CelestialObject(
            "Battlecode",
            "#c40ab8",
            12,
            "battlecode-dropdown",
            sun,
            ids++,
            422,
            0.00212,
            false
        )
        this.elements = [
            sun,
            education,
            research,
            projects,
            experience,
            battlecode,
            new CelestialObject(
                "UW", 
                "#4B2E83",
                5,
                "uw-dropdown",
                education,
                ids++,
                30,
                0.0609,
                false
            ),
            new CelestialObject(
                "Make4All Group",
                "#FFB0A8",
                3,
                "vtp-dropdown",
                research,
                ids++,
                25,
                0.08,
                false
            ),
            new CelestialObject(
                "G.R.A.S",
                "#FCD34D",
                6,
                "gras-dropdown",
                projects,
                ids++,
                25,
                0.08,
                false
            ),
            new CelestialObject(
                "Uprooted",
                "#FDBA74",
                4,
                "uprooted-dropdown",
                projects,
                ids++,
                39,
                0.0411,
                false
            ),
            new CelestialObject(
                "Runlang",
                "#F9A8D4",
                4,
                "runlang-dropdown",
                projects,
                ids++,
                51,
                0.0275,
                false
            ),
            new CelestialObject(
                "Alang",
                "#93C5FD",
                3,
                "alang-dropdown",
                projects,
                ids++,
                62,
                0.0205,
                false
            ),
            new CelestialObject(
                "Immune Quest",
                "#FDA4AF",
                3,
                "immune-dropdown",
                projects,
                ids++,
                72,
                0.0164,
                false
            ),
            new CelestialObject(
                "Moon Model",
                "#CBD5E1",
                3,
                "moon-dropdown",
                projects,
                ids++,
                82,
                0.0135,
                false
            ),
            new CelestialObject(
                "MM",
                "#A7F3D0",
                6,
                "mm-dropdown",
                experience,
                ids++,
                25,
                0.08,
                false
            ),
            new CelestialObject(
                "TSC",
                "#1F9D6B",
                3,
                "tsc-dropdown",
                experience,
                ids++,
                38,
                0.0427,
                false
            ),
            new CelestialObject(
                "MIT26",
                "#FF1323",
                5,
                "mitbc26-dropdown",
                battlecode,
                ids++,
                39,
                0.0411,
                false
            ),
            new CelestialObject(
                "CAM26E",
                "#85B09A",
                6,
                "cambc26e-dropdown",
                battlecode,
                ids++,
                25,
                0.08,
                false
            ),
            new CelestialObject(
                "FCL26",
                "#004791",
                3,
                "fcl26-dropdown",
                battlecode,
                ids++,
                82,
                0.0135,
                false
            ),
        ];    
        
    }
    visibleHeight(rec){
        if(!mobileQuery.matches) return rec.height;
        const sheetTop = document.getElementById("index").getBoundingClientRect().top;
        return Math.min(rec.height, sheetTop - rec.top);
    }
    animateToObject(obj, targetZoom = 4, duration = 1500) {
        this.cameraTarget = obj;
        this.cameraAnimating = true;
        const animationId = this.animationId = (this.animationId || 0) + 1;

        // Capture starting state
        const startZoom = this.zoom;
        const startX = this.newViewBox.x;
        const startY = this.newViewBox.y;
        const startTime = performance.now();

        // Smooth cubic easing (ease-in-out)
        const ease = t => t * t * (3 - 2 * t);

        const animate = (now) => {
            // If the user starts dragging during animation, cancel the camera transit
            if (!this.cameraAnimating || animationId !== this.animationId) return;

            const rec = this.svg.getBoundingClientRect();
            const t = Math.min((now - startTime) / duration, 1);
            const e = ease(t);

            // 1. Interpolate Zoom
            this.zoom = startZoom + (targetZoom - startZoom) * e;

            // 2. Calculate ideal centered camera target position at current frame
            const targetX = obj.position.x - (rec.width / this.zoom) / 2;
            const targetY = obj.position.y - (this.visibleHeight(rec) / this.zoom) / 2;

            // 3. Smoothly interpolate position from start to target
            this.newViewBox.x = startX + (targetX - startX) * e;
            this.newViewBox.y = startY + (targetY - startY) * e;

            this.viewBox.x = this.newViewBox.x;
            this.viewBox.y = this.newViewBox.y;

            // 4. Update SVG ViewBox attributes
            this.svg.setAttribute(
                "viewBox",
                `${this.newViewBox.x} ${this.newViewBox.y} ` +
                `${rec.width / this.zoom} ${rec.height / this.zoom}`
            );

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
        this.newViewBox.y =
    this.cameraTarget.position.y - (this.visibleHeight(rec) / this.zoom) / 2;

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
        this.zoom = this.homeZoom = Math.min(rec.width, rec.height) / (2 * 422);
        this.viewBox = {
            x: -rec.width / this.zoom / 2,
            y: -rec.height / this.zoom / 2,
        };
        this.newViewBox = {
            x: -rec.width / this.zoom / 2,
            y: -rec.height / this.zoom / 2,
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

document.getElementById("sheet-toggle").addEventListener("click", () => {
    setSheet(!document.getElementById("index").classList.contains("open"));
});