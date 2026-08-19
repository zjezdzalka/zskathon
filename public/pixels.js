const starCount = 75;
const starColor = "rgba(255, 255, 255, 0.5)";
const starContainer = document.createElement("div");

starContainer.style.position = "fixed";
starContainer.style.top = "0";
starContainer.style.left = "0";
starContainer.style.width = "100%";
starContainer.style.height = "100%";
starContainer.style.pointerEvents = "none";
starContainer.style.overflow = "hidden";
starContainer.style.zIndex = "-1";

document.body.appendChild(starContainer);

function getDocumentHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}

function createStars() {
    while (starContainer.firstChild) {
        starContainer.removeChild(starContainer.firstChild);
    }
    
    const docHeight = getDocumentHeight();
    
    for (let i = 0; i < starCount; i++) {
        let starSize = Math.floor(Math.random() * 16) + 10; /* (10 - 25px) */

        const star = document.createElement("div");
        star.style.position = "absolute";
        star.style.width = `${starSize}px`;
        star.style.height = `${starSize}px`;
        star.style.backgroundColor = starColor;
        star.style.opacity = Math.random() * 0.5 + 0.5;
        
        star.style.top = `-${starSize}px`;
        star.style.left = `${Math.random() * 100}vw`;
        
        starContainer.appendChild(star);

        const fallDuration = Math.random() * 6000 + 6000; // (6-12 sek)

        const initialOffset = -Math.random() * fallDuration;
        
        star.animate([
            { transform: `translateY(0)` },
            { transform: `translateY(${docHeight + starSize}px)` }
        ], {
            duration: fallDuration,
            delay: initialOffset,
            easing: "linear",
            iterations: Infinity
        });
    }
}

createStars();
window.addEventListener("resize", createStars);