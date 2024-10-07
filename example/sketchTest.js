let sketchGrid = function(p) {
  let cols, rows;
  let months = [];
  let squareSize;           
  let canvasMargin = 80;    
  let squareSpacing = 32;  
  let canvasHeight;

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
    

    brush.load(); 
    initializeBirds();
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
    birds = []; 
    for (let i = 0; i < months.length; i++) {
      let monthBirds = [];
      for (let j = 0; j < months[i].totalBirds; j++) {
        let bird = {
          x: p.random(10, squareSize - 10),
          y: p.random(10, squareSize - 10),
        };
        monthBirds.push(bird);
      }
      birds.push(monthBirds);
    }
  }

  p.draw = function() {
    p.background('#FCFCF2');

    for (let monthIndex = 0; monthIndex < months.length; monthIndex++) {
        let col = monthIndex % cols;
        let row = Math.floor(monthIndex / cols); 

        let xOffset = canvasMargin / 2 + col * (squareSize + squareSpacing);
        let yOffset = canvasMargin / 2 + row * (squareSize + squareSpacing);
        
        p.push();  // Ensure the translation is isolated
        p.translate(-p.windowWidth / 2 + xOffset, -canvasHeight / 2 + yOffset); 

        // Squares and lines (Brush drawing)
        p.push();  // Start new drawing state for brush
        brush.pick('2H')
        brush.strokeWeight(1);
        brush.stroke('#202297'); 
        brush.noFill();
        let numLines = 300; 
        let lineSpacing = squareSize / numLines;

        for (let i = 0; i < numLines; i++) {
            let y = i * lineSpacing;
            brush.line(p.random(0,10), y, p.random(squareSize-10,squareSize), y);
        }
        p.pop();  // End the isolated brush state

        // Text
        p.fill(0);
        p.text(months[monthIndex].month, 0, -8);

        // Birds (Draw after lines and text)
        for (let bird of birds[monthIndex]) {
          p.fill('#202297');
          p.noStroke();
          p.bird(bird.x, bird.y, p.random(10, 20));  
        }

        p.pop();
    }

    p.noLoop(); 
};



p.bird = function(x, y, size) {

  p.fill('#202297');  // Black fill for the bird silhouette

// brush.field('seabed')
// brush.pick('HB')
  // brush.line(x - size / 2, y, x + size, y);

  // Draw the bird's body (with sharp, tapered corners)
  p.beginShape();
  p.vertex(x - size / 2, y);  // Leftmost point (sharp corner)
  p.bezierVertex(x - size / 4, y - size / 8, x + size / 4, y - size / 8, x + size / 2, y);  // Top curve (thinner height)
  p.bezierVertex(x + size / 4, y + size / 8, x - size / 4, y + size / 8, x - size / 2, y);  // Bottom curve (thinner height)
  p.endShape(p.CLOSE);  // Close the shape to form the body

  // Randomize which wings to draw (1: top wing, 2: bottom wing, 3: both wings)
  let wingsOption = p.floor(p.random(1, 4));  // Random number between 1 and 3

  // Draw the top wing (arc-like, only if wingsOption is 1 or 3)
  if (wingsOption === 1 || wingsOption === 3) {
      p.beginShape();
      p.vertex(x, y);  // Start at the center of the body
      // Thinner and arc-like top wing
      p.bezierVertex(x - size / 3, y - size / 4, x + size / 3, y - size / 2, x + size / 2, y - size / 3);  // Arc shape
      p.vertex(x, y);  // Connect back to the body
      p.endShape(p.CLOSE);  // Close the shape to fill the top wing
  }

  // Draw the bottom wing (arc-like, only if wingsOption is 2 or 3)
  if (wingsOption === 2 || wingsOption === 3) {
      p.beginShape();
      p.vertex(x, y);  // Start at the center of the body
      // Thinner and arc-like bottom wing
      p.bezierVertex(x - size / 3, y + size / 4, x + size / 3, y + size / 2, x + size / 2, y + size / 3);  // Arc shape
      p.vertex(x, y);  // Connect back to the body
      p.endShape(p.CLOSE);  // Close the shape to fill the bottom wing
  }
}











// p.bird = function(x,y,size){
//     p.stroke('#202297');
//     p.strokeWeight(2);
//     p.noFill();
    
//     p.beginShape();
//     p.vertex(x, y); 
//     p.vertex(x - size / 2, y - size / 4); 
//     p.vertex(x - size, y); 
//     p.endShape();
    
//     p.beginShape();
//     p.vertex(x, y); 
//     p.vertex(x + size / 2, y - size / 4); 
//     p.vertex(x + size, y); 
//     p.endShape();
// }

  p.windowResized = function() {
    adjustGridLayout();
    p.resizeCanvas(p.windowWidth, canvasHeight);
    p.redraw();  
  };
};

