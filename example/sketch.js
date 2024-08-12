let palette = ["#7b4800", "#002185", "#003c32", "#fcd300", "#ff2702", "#6b9404"];
let font;
let frames = [];
let months = [];
let currentFrame = 0;
let birds = [];
let csvData;
let isAnimating = true;
let stopButton;
let birdIndex = 0; // To keep track of which bird to draw next
let drawnBirds = []; // To store drawn birds

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

    frameRate(50);
    brush.field("seabed");
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

function draw() {
    if (isAnimating) {
        background("#202297"); // Consistently set the background color

        translate(-width / 2, -height / 2);

        // Redraw all previously drawn birds
        for (let i = 0; i < drawnBirds.length; i++) {
            let bird = drawnBirds[i];
            brush.fill(bird.color);
            brush.noStroke();
            drawSingleLine(i, bird.x, bird.y);
        }

        // Draw the current bird
        if (birdIndex < birds.length && currentFrame < frames.length) {
            let bird = birds[birdIndex];
            brush.fill(bird.color);
            brush.noStroke();
            drawSingleLine(birdIndex, bird.x, bird.y);

            // Store the drawn bird
            drawnBirds.push(bird);

            birdIndex++;
        }

        // Display the current frame text
        fill(255);
        noStroke();
        text(`${months[currentFrame]}`, 10, 50);

        // Check if we need to move to the next frame (i.e., month)
        if (birdIndex >= frames[currentFrame]) {
            birdIndex = 0;  // Reset bird index for the next frame
            currentFrame++;  // Move to the next frame (month)
        }

        // Reset the frame counter to loop indefinitely
        if (currentFrame >= frames.length) {
            currentFrame = 0;
            drawnBirds = []; // Clear the drawn birds to start over
        }
    }
}

function drawSingleLine(stroke, x, y) {
    brush.stroke(255);
    brush.line(x, y, x + 20, y);
    brush.line(x, y + 1, x + 25, y + 1);
    brush.line(x, y + 3, x + 20, y + 3);
    brush.line(x + 5, y, x + 20, y - 10);
    brush.line(x + 5, y, x + 20, y + 10);
}

function toggleAnimation() {
    isAnimating = !isAnimating;
    stopButton.html(isAnimating ? 'Stop Animation' : 'Resume Animation');
}
