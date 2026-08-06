window.addEventListener("load", () => {

    const nav = document.querySelector("header");
    const hero = document.querySelector(".hero");
    const bio = document.querySelector(".bio-card");
    const video = document.querySelector(".video-card");

    nav.style.opacity = "0";
    nav.style.transform = "translateY(-60px)";

    hero.style.opacity = "0";
    hero.style.transform = "translateY(-40px)";

    bio.style.opacity = "0";
    bio.style.transform = "translateX(-100px)";

    video.style.opacity = "0";
    video.style.transform = "translateX(100px)";

    setTimeout(() => {
        nav.style.transition = ".8s ease";
        nav.style.opacity = "1";
        nav.style.transform = "translateY(0)";
    }, 200);

    setTimeout(() => {
        hero.style.transition = "1s ease";
        hero.style.opacity = "1";
        hero.style.transform = "translateY(0)";
    }, 600);

    setTimeout(() => {
        bio.style.transition = "1s ease";
        bio.style.opacity = "1";
        bio.style.transform = "translateX(0)";
    }, 1000);

    setTimeout(() => {
        video.style.transition = "1s ease";
        video.style.opacity = "1";
        video.style.transform = "translateX(0)";
    }, 1200);

});

/* ===========================
   SPIDER-MAN CURSOR TRAIL
=========================== */

const cursorTrail = () => {
    const mouseX = [];
    const mouseY = [];
    const trail = 20;
    let lastTime = 0;
    const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    
    // Setup SVG container
    svgContainer.style.position = "fixed";
    svgContainer.style.top = "0";
    svgContainer.style.left = "0";
    svgContainer.style.width = "100%";
    svgContainer.style.height = "100%";
    svgContainer.style.pointerEvents = "none";
    svgContainer.style.zIndex = "9999";
    svgContainer.setAttribute("preserveAspectRatio", "none");
    document.body.appendChild(svgContainer);
    
    document.addEventListener("mousemove", (e) => {
        const now = Date.now();
        
        // Throttle for performance
        if (now - lastTime < 40) return;
        lastTime = now;
        
        mouseX.unshift(e.clientX);
        mouseY.unshift(e.clientY);
        
        if (mouseX.length > trail) {
            mouseX.pop();
            mouseY.pop();
        }
        
        // Clear and redraw SVG lines
        svgContainer.innerHTML = "";
        
        if (mouseX.length > 1) {
            // Draw connecting lines between trail points
            for (let i = 0; i < mouseX.length - 1; i++) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                const opacity = (1 - (i / trail)) * 0.6;
                const width = (1 - (i / trail)) * 2.5;
                
                line.setAttribute("x1", mouseX[i]);
                line.setAttribute("y1", mouseY[i]);
                line.setAttribute("x2", mouseX[i + 1]);
                line.setAttribute("y2", mouseY[i + 1]);
                line.setAttribute("stroke", `rgba(220, 20, 60, ${opacity})`);
                line.setAttribute("stroke-width", width);
                line.setAttribute("stroke-linecap", "round");
                line.setAttribute("stroke-linejoin", "round");
                line.setAttribute("filter", "url(#webGlow)");
                
                svgContainer.appendChild(line);
            }
            
            // Add particles at trail points
            for (let i = 0; i < mouseX.length; i++) {
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                const opacity = (1 - (i / trail)) * 0.8;
                const radius = (1 - (i / trail)) * 6 + 2;
                
                circle.setAttribute("cx", mouseX[i]);
                circle.setAttribute("cy", mouseY[i]);
                circle.setAttribute("r", radius);
                circle.setAttribute("fill", `rgba(220, 20, 60, ${opacity})`);
                circle.setAttribute("filter", "url(#particleGlow)");
                
                svgContainer.appendChild(circle);
            }
        }
        
        // Add glow filters once
        if (!svgContainer.querySelector("defs")) {
            const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            defs.innerHTML = `
                <filter id="webGlow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <filter id="particleGlow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            `;
            svgContainer.appendChild(defs);
        }
    });
};

cursorTrail();

/* ===========================
   INTRO - Only on first load
=========================== */

const intro = document.getElementById("intro");

// Check if this is the first visit to the site
const isFirstVisit = !sessionStorage.getItem("visited");

if (isFirstVisit) {
    // Mark that the site has been visited
    sessionStorage.setItem("visited", "true");
    
    // Show intro animation on first visit
    window.addEventListener("load", () => {
        setTimeout(() => {
            intro.style.opacity = "0";
            setTimeout(() => {
                intro.style.display = "none";
            }, 1000);
        }, 3000);
    });
} else {
    // Skip intro on subsequent visits
    intro.style.display = "none";
}

const spidermanVideo = document.getElementById("spiderman-video");
const volumeButton = document.getElementById("volume-button");
const volumeRange = document.getElementById("volume-range");

function updateVideoIcon() {
    if (!spidermanVideo) return;

    if (spidermanVideo.muted || spidermanVideo.volume === 0) {
        volumeButton.textContent = "🔇";
    } else if (spidermanVideo.volume < 0.5) {
        volumeButton.textContent = "🔈";
    } else {
        volumeButton.textContent = "🔊";
    }
}

if (spidermanVideo && volumeButton && volumeRange) {
    volumeRange.addEventListener("input", (event) => {
        const value = Number(event.target.value) / 100;
        spidermanVideo.volume = value;
        spidermanVideo.muted = value === 0;
        updateVideoIcon();
    });

    volumeButton.addEventListener("click", () => {
        spidermanVideo.muted = !spidermanVideo.muted;
        if (spidermanVideo.muted) {
            volumeRange.value = "0";
        } else {
            const restored = spidermanVideo.volume > 0 ? spidermanVideo.volume : 0.5;
            spidermanVideo.volume = restored;
            volumeRange.value = String(restored * 100);
        }
        updateVideoIcon();
    });

    updateVideoIcon();
}

/* ===========================
   PARTICLES
=========================== */

const particles = document.getElementById("particles");

for(let i=0;i<70;i++){

    const p = document.createElement("span");

    p.classList.add("particle");

    p.style.left = Math.random()*100 + "%";

    p.style.animationDuration = (6 + Math.random()*8) + "s";

    p.style.animationDelay = Math.random()*5 + "s";

    p.style.opacity = Math.random();

    particles.appendChild(p);

}

