brush.add("watercolor", {
    type: "custom", // this is the TIP TYPE: choose standard / spray / marker / custom / image
    weight: 5, // Base weight of the brush tip
    vibration: 1, // Vibration of the lines, spread
    definition: 0.5, // Between 0 and 1
    quality: 8, // + quality = more continuous line
    opacity: 5, // Base opacity of the brush (this will be affected by pressure)
    spacing: 0.3, // Spacing between the points that compose the brush stroke
    blend: true, // Activate / Disable realistic color mixing. By default, this is active for marker-custom-image brushes 
    pressure: {
        type: "standard", // "standard" or "custom"
        curve: [0.15, 0.2], // If "standard", pick a and b values for the gauss curve.
        //curve: function (x) {return 1-x},     // If "custom", define the curve function
        min_max: [0.9, 1.1] // For both cases, define min and max pressure
    },
    // if you select the a custom type brush, define the tip geometry here. Use 0,0 as center of tip. If not, you can remove these lines.
    tip: function () {
        rect(-5, -5, 10, 10), rect(5, 5, 4, 4);
    },
    // if you select the image type brush, link your image below. If not, you can remove these lines.
    // image: {
    //     src: "./brush.jpg",
    // },
    // For "custom" and "image" types, you can define the tip angle rotation here.
    rotate: "natural", // "none" disables rotation | "natural" follows the direction of the stroke | "random"
});

let palette = ["#7b4800", "#002185", "#003c32", "#fcd300", "#ff2702", "#6b9404"];
let font;
let strokes = [];
let frames = [100, 200, 100, 50];
let currentFrame = 0;

function preload() {
    font = loadFont('./opensans.ttf');
}

function setup() {
    createCanvas(600, 600, WEBGL);
    pixelDensity(4);
    angleMode(DEGREES);

    textFont(font);
    textSize(32);

    background("#fcf7f3");
    translate(-width / 2, -height / 2);
    brush.pick("charcoal");
    brush.strokeWeight(1);
    brush.stroke('black');
    brush.rect(width / 2, height / 2, width - 100, height - 100, CENTER);

    frameRate(10);
    // You can select one of the given flowfields, or disable with brush.disableField()
    brush.field("seabed");

    // Create the strokes and store them in the array
    brush.pick("HB");
    brush.strokeWeight(1);
}

function draw() {
    if (currentFrame < frames.length) {
        background(0);
        translate(-width / 2, -height / 2);
        let numStrokes = frames[currentFrame];

        for (let i = 0; i < numStrokes; i++) {
            drawSingleLine(strokes[i]);
        }

        // Display the current frame text
        fill(0);
        noStroke();
        text(`Day ${currentFrame + 1}`, 10, 30);

        currentFrame++;
    } else {
        currentFrame = 0; // Reset the frame counter to loop indefinitely
    }
}

function drawSingleLine(stroke) {
    brush.stroke(random(palette));
    brush.circle(random(0, width), random(0, width), 10);
}
