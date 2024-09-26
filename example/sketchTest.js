let sketchGrid = function(p) {
  let cols, rows;
  let months = [];
  let squareSize;           // Dynamically calculated square size
  let canvasMargin = 80;    // Margin around the grid
  let squareSpacing = 16;   // Spacing between squares
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

    // Calculate grid layout based on window size
    adjustGridLayout();

    // Create the canvas with adjusted height
    p.createCanvas(p.windowWidth, canvasHeight, p.WEBGL)
    
    // Load the brush library
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

  p.draw = function() {
    p.background('#FCFCF2');

    // Loop through all months and place them in the grid row by row
    for (let monthIndex = 0; monthIndex < months.length; monthIndex++) {
        // Calculate the row and column position based on the monthIndex
        let col = monthIndex % cols;
        let row = Math.floor(monthIndex / cols); 

        let xOffset = canvasMargin / 2 + col * (squareSize + squareSpacing);
        let yOffset = canvasMargin / 2 + row * (squareSize + squareSpacing);

        let noiseFactor = 0.3; // Adjust this for more or less variation
        let noiseValue1 = p.noise(monthIndex * noiseFactor) * 10 - 5;
        let noiseValue2 = p.noise(monthIndex * noiseFactor + 100) * 10 - 5;

        // Draw rectangles at each grid position using brush
        p.push();
        p.translate(-p.windowWidth / 2 + xOffset, -canvasHeight / 2 + yOffset); 
        brush.strokeWeight(1);
        brush.stroke('#202297');
        
        // Add Perlin noise to the rectangle's corners to make it imperfect
        let cornerNoise1 = squareSize + noiseValue1;
        let cornerNoise2 = squareSize + noiseValue2;
        // p.fill('#424992');
        // p.rect(0, 0, cornerNoise1, cornerNoise2);
        // p.noFill();
        brush.pick("2H");
        brush.rect(0, 0, cornerNoise1, cornerNoise2); 

        // Introduce randomness in line placement
        brush.pick("2H");
        for(let i = 0; i < squareSize; i += 2.5){
          brush.line(0, i, squareSize, i); 
        }

        for(let i = 0; i < squareSize; i += 1){
          let xStart = p.random(0, squareSize);
          let xEnd = p.random(0, squareSize); // Randomize the end point instead of fixing it at squareSize / 2
          brush.line(xStart, i, xEnd, i);
        }
        

        p.pop();
    }

    p.noLoop();  // Ensure that the grid is drawn once and doesn't continuously redraw
};



  p.windowResized = function() {
    // Recalculate layout and resize the canvas when the window is resized
    adjustGridLayout();
    p.resizeCanvas(p.windowWidth, canvasHeight);
    p.redraw();  // Redraw the grid after resizing
  };
};

