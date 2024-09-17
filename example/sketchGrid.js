let sketchGrid = function(p) {
    let palette = ["#FCF7F3", "#FCF7F3", "#FCF7F3", "#FCF7F3", "#FCF7F3", "#FCF7F3"];
    let font;
    let months = [];
    let birds = [];
    let csvData;
    let squareSize;
    let cols;
    let rows;
    let canvasHeight;
    let canvasMargin = 80;
    let squareSpacing = 16;
  
    p.preload = function() {
        font = p.loadFont('./opensans.ttf');
        csvData = p.loadTable('./civilian_casualties.csv', 'csv', 'header')
        }

 
    p.setup = function() {
      // Parse the CSV data
      for (let i = 0; i < csvData.getRowCount(); i++) {
        let month = csvData.getString(i, 'Month');
        let totalBirds = p.int(csvData.getString(i, 'Killed'));
        months.push({ month, totalBirds });
      }
  
      // Calculate grid layout and create canvas
      adjustGridLayout();
      p.createCanvas(p.windowWidth, canvasHeight).parent('canvas-container');
      p.pixelDensity(4);
      p.angleMode(p.DEGREES);
      p.textFont(font);
      p.textSize(12);
  
      // Initialize bird positions for each month
      initializeBirds();
    };
  
    p.windowResized = function() {
      // Adjust grid layout and recalculate based on the new window size
      adjustGridLayout();
      p.resizeCanvas(p.windowWidth, canvasHeight);
      p.redraw(); // Re-draw the grid and birds after resizing
    };
  
    function adjustGridLayout() {
      // Dynamically adjust the number of columns based on window width
      if (p.windowWidth > 800) {
        cols = 4;  // Larger screens: 4 squares per row
      } else if (p.windowWidth > 500) {
        cols = 2;  // Medium screens: 2 squares per row
      } else {
        cols = 1;  // Small screens (mobile): 1 square per row
      }
  
      // Dynamically calculate the size of each square based on the number of columns
      let totalHorizontalSpace = canvasMargin + (squareSpacing * (cols - 1));
      squareSize = (p.windowWidth - totalHorizontalSpace) / cols;
  
      // Calculate the number of rows based on the number of months and columns
      rows = p.ceil(months.length / cols);
  
      // Calculate the required canvas height, accounting for spacing between rows
      let totalVerticalSpace = canvasMargin + (squareSpacing * (rows - 1));
      canvasHeight = rows * squareSize + totalVerticalSpace;
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
            color: p.random(palette)
          };
          monthBirds.push(bird);
        }
        birds.push(monthBirds);
      }
    }
  
    p.draw = function() {
      p.background('#FCF7F3');
  
      // Loop through each month and draw its square and birds
      for (let i = 0; i < months.length; i++) {
        let col = i % cols;
        let row = p.floor(i / cols);
  
        // Calculate the top-left corner of the current square, including margin and spacing
        let xOffset = canvasMargin / 2 + col * (squareSize + squareSpacing);
        let yOffset = canvasMargin / 2 + row * (squareSize + squareSpacing);
  
        // Draw the square
        p.fill(220);
        p.stroke(0);
        p.rect(xOffset, yOffset, squareSize, squareSize);
  
        // Display the month name
        p.fill(0);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(months[i].month, xOffset + squareSize / 2, yOffset + 15);
  
        // Draw the birds inside the square
        for (let bird of birds[i]) {
          p.fill(bird.color);
          p.noStroke();
          p.ellipse(xOffset + bird.x, yOffset + bird.y, 5, 5);  // Represent birds as small circles
        }
      }
  
      p.noLoop(); // Ensure the sketch doesn't continuously redraw
    };
  };
  