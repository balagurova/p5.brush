let palette = ["#7b4800", "#002185", "#003c32", "#fcd300", "#ff2702", "#6b9404"];
let font;
let frames = [];
let months = [];
let currentFrame = 0;
let birds = [];
let csvData;
let isAnimating = true;
let stopButton;

function preload() {
    font = loadFont('./opensans.ttf');
    csvData = loadTable('./civilian_casualties.csv', 'csv', 'header');
    console.log(csvData);
}

function setup() {
    createCanvas(600, 600, WEBGL);
    pixelDensity(4);
    angleMode(DEGREES);
    textFont(font);
    textSize(32);




    // Parse the CSV data
    for (let i = 0; i < csvData.getRowCount(); i++) {
        let month = csvData.getString(i, 'Month');
        let totalbirds = int(csvData.getString(i, 'Killed'));
        console.log(`Month: ${month}, Killed: ${totalbirds}`); // Debugging output
        months.push(month);
        frames.push(totalbirds);
    }


  

  
    // Initialize the random dot positions
    initializebirds();

    // Create stop button
    stopButton = createButton('Stop Animation');
    stopButton.position(10, 10);
    stopButton.mousePressed(toggleAnimation);

    // Resume audio context upon user gesture
    userStartAudio();

    background("#fcf7f3");
    frameRate(10);
    brush.field("seabed");

    // Create the strokes and store them in the array
    brush.pick("HB");
    brush.strokeWeight(1);


      //Background
     
     pencilShadedSquare(0, 0, width, height);

              
            }

function initializebirds() {
    let maxBirds = Math.max(...frames);
    for (let i = 0; i < maxBirds; i++) {
        birds.push({
            x: random(0, width),
            y: random(0, height),
            color: random(palette)
        });
    }
}

function pencilShadedSquare(x, y, w, h) {
    brush.pick("HB");
    brush.strokeWeight(1);
    brush.stroke('#202297');

    let density = 5000;  // Adjust for more or fewer strokes
    let maxLineLength = 200;  // Maximum length of each stroke
    let noiseScale = 0.02;  // Scale for the Perlin noise

    for (let i = 0; i < density; i++) {
        // Calculate the noise offset
        let noiseOffsetX = noise(i * noiseScale) * w;
        let noiseOffsetY = noise((i + 1000) * noiseScale) * h;

        // Random start position within the square, modified by noise
        let startX = x - width / 2 + noiseOffsetX;
        let startY = y - height / 2 + noiseOffsetY;

        // Angle and length for the line, introducing some noise
        let angle = noise((i + 2000) * noiseScale) * TWO_PI;
        let length = noise((i + 3000) * noiseScale) * maxLineLength;

        // Calculate the end positions
        let endX = startX + cos(angle) * length;
        let endY = startY + sin(angle) * length;

        // Ensure the line stays within the canvas bounds
        endX = constrain(endX, x - width / 2, x + w - width / 2);
        endY = constrain(endY, y - height / 2, y + h - height / 2);

        brush.line(startX, startY, endX, endY);
    }
}







function toggleAnimation() {
    isAnimating = !isAnimating;
    stopButton.html(isAnimating ? 'Stop Animation' : 'Resume Animation');
}

function draw() {
    // if (isAnimating) {
    //     if (currentFrame < frames.length) {
    //         background("#fcf7f3");

            
            
    //         translate(-width / 2, -height / 2);
    //         let numbirds = frames[currentFrame];
    //         let month = months[currentFrame];

    //         // for (let i = 0; i < numbirds; i++) {
    //         //     if (i < birds.length) {
    //         //         let bird = birds[i];
    //         //         fill(bird.color);
    //         //         noStroke();
    //         //         drawSingleLine(i, bird.x, bird.y, 10)
    //         //     }
    //         // }

    //         // Display the current frame text
    //         fill(0);
    //         noStroke();
    //         text(`${month}`, 10, 50);

    //         currentFrame++;
    //     } else {
    //         currentFrame = 0; // Reset the frame counter to loop indefinitely
    //     }
    // }
}

function drawSingleLine(stroke, x,y,d) {
    brush.stroke(random(palette));
    brush.circle(x,y, d);
}