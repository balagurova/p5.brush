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
      brush.pick("charcoal");
      brush.strokeWeight(1);
      brush.stroke('#202297');
              translate(-width / 2, -height / 2);

      for (let i = 0; i < height; i+=2) {  // Adjust the number of lines for denser or lighter effect
          let x1 = 10;
          let y1 = i+10;
          let angle = random(TWO_PI);
          let length = width - 10;  // Length of each line segment
  
          let x2 = x1 + cos(angle) * length;
          let y2 = y1 + sin(angle)
  
          brush.line(x1, y1, x2, y2);
        }
  
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