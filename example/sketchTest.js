let sketchGrid = function(p) {
  let cols, rows;
  let months = [];
  let squareSize;           // Dynamically calculated square size
  let canvasMargin = 80;    // Margin around the grid
  let squareSpacing = 32;   // Spacing between squares
  let canvasHeight;

  // Register instance method here, sending your function arg p
  brush.instance(p);

  p.preload = function() {
    font = p.loadFont('./opensans.ttf');
    csvData = p.loadTable('./civilian_casualties.csv', 'csv', 'header');
  };

  p.setup = function() {
    for (let i = 0; i < csvData.getRowCount(); i++) {
      let month = csvData.getString(i, 'Month');
      let totalBirds = p.int(csvData.getString(i, 'Killed'));
      months.push({ month, totalBirds });
    }

    adjustGridLayout();
    

    p.createCanvas(p.windowWidth, canvasHeight, p.WEBGL)
    p.angleMode(p.DEGREES);
    p.textFont(font);
    p.textSize(12);
    
    initializeBirds();
    brush.load(); 
  };

  // Dynamically calculate grid layout and square size
  function adjustGridLayout() {
    // Determine number of columns based on window width
    if (p.windowWidth > 800) {
      cols = 4;  // Larger screens: 4 squares per row
    } else if (p.windowWidth > 500) {
      cols = 2;  // Medium screens: 2 squares per row
    } else {
      cols = 1;  // Small screens (mobile): 1 square per row
    }

    // Ensure columns are capped at 4 as per your requirement
    cols = 4;

    // Calculate the number of rows based on the number of months
    rows = p.ceil(months.length / cols);

    // Calculate square size based on available width and number of columns
    let totalHorizontalSpace = canvasMargin + (squareSpacing * (cols - 1));
    squareSize = (p.windowWidth - totalHorizontalSpace) / cols;

    // Calculate total vertical space and adjust canvas height
    let totalVerticalSpace = canvasMargin + (squareSpacing * (rows - 1));
    canvasHeight = rows * squareSize + totalVerticalSpace;

    // Remove the height restriction, so canvas can be larger than the window height
    document.getElementById('canvas-container').style.height = canvasHeight + "px";
  }

  function initializeBirds() {
    // Initialize birds for each month
    birds = []; // Clear previous birds array
    for (let i = 0; i < months.length; i++) {
      let monthBirds = [];
      for (let j = 0; j < months[i].totalBirds; j++) {
        let bird = {
          x: p.random(10, squareSize - 10),  // Ensure birds stay within the square
          y: p.random(10, squareSize - 10),
        };
        monthBirds.push(bird);
      }
      birds.push(monthBirds);
    }
  }

  p.draw = function() {
    p.background('#FCFCF2');

    // Loop through all months and place them in the grid row by row
    for (let monthIndex = 0; monthIndex < months.length; monthIndex++) {
        // Calculate the row and column position based on the monthIndex
        let col = monthIndex % cols;
        let row = Math.floor(monthIndex / cols); 

        let xOffset = canvasMargin / 2 + col * (squareSize + squareSpacing);
        let yOffset = canvasMargin / 2 + row * (squareSize + squareSpacing);

        let noiseScale = 0.02; // Adjust this for more or less variation
        let numLines = 500; // Number of lines in each square

        // Draw rectangles at each grid position using brush
        p.push();
        p.translate(-p.windowWidth / 2 + xOffset, -canvasHeight / 2 + yOffset); 
        brush.noField();
        brush.bleed(0.01, 'out', 0.01);
        brush.noStroke();
        brush.fill('#202297', 255);
        brush.rect(0,0, squareSize,squareSize)
        // brush.pick('2H')
        // brush.strokeWeight(1);
        // brush.stroke('#202297');  // Set the color to match the image

        // Draw lines inside each square
        let lineSpacing = squareSize / numLines; // Space between each line
        // p.rect(0,0, squareSize,squareSize)
        // for (let i = 0; i < numLines; i++) {
        //     let y = i * lineSpacing; // Line Y position, evenly spaced from top to bottom
            
           
        // Draw the line from left to right with slight noise
        //     brush.line(p.random(0,10), y, p.random(squareSize-10,squareSize), y);
        // }

        p.fill(0);
        p.text(months[monthIndex].month, 0, -8);
  

        // for (let bird of birds[monthIndex]) {
        //   p.fill('#202297');
        //   p.noStroke();
        //   p.ellipse(bird.x, bird.y, 5, 5);  
        // }

        p.pop();
    }

    p.noLoop();  // Ensure that the grid is drawn once and doesn't continuously redraw
};



p.bird = function(x,y,size){
    brush.pick("pen");
    brush.stroke('#fff');
    brush.strokeWeight(2);
    brush.noFill();
    
    // Draw the left wing using vertex
    brush.beginShape();
    brush.vertex(x, y); // Start at the bird's body
    brush.vertex(x - size / 2, y - size / 4); // Left tip of the wing
    brush.vertex(x - size, y); // Left part of the wing returning to the body
    brush.endShape();
    
    // Draw the right wing using vertex
    brush.beginShape();
    brush.vertex(x, y); // Start at the bird's body
    brush.vertex(x + size / 2, y - size / 4); // Right tip of the wing
    brush.vertex(x + size, y); // Right part of the wing returning to the body
    brush.endShape();
    
    // Optionally draw a beak or head (simple triangle)
    brush.line(x, y, x, y + size / 2); // Simple body line down

}


  p.windowResized = function() {
    // Recalculate layout and resize the canvas when the window is resized
    adjustGridLayout();
    p.resizeCanvas(p.windowWidth, canvasHeight);
    p.redraw();  // Redraw the grid after resizing
  };
};

