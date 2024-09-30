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
        
        // Squares
        p.push();
        p.translate(-p.windowWidth / 2 + xOffset, -canvasHeight / 2 + yOffset); 
        brush.pick('hatch_brush')
        brush.strokeWeight(1);
        brush.stroke('#202297'); 
        brush.noFill();
        let numLines = 300; 
        let lineSpacing = squareSize / numLines;

        for (let i = 0; i < numLines; i++) {
            let y = i * lineSpacing;
            brush.line(p.random(0,10), y, p.random(squareSize-10,squareSize),y);
        }

        // Text
        p.fill(0);
        p.text(months[monthIndex].month, 0, -8);
  
        // Birds
        for (let bird of birds[monthIndex]) {
          p.fill('#202297');
          p.noStroke();
          p.bird(bird.x, bird.y, p.random(2,20));  
        }

        p.pop();
    }

    p.noLoop(); 
};



p.bird = function(x,y,size){
    p.stroke('#202297');
    p.strokeWeight(2);
    p.noFill();
    
    p.beginShape();
    p.vertex(x, y); 
    p.vertex(x - size / 2, y - size / 4); 
    p.vertex(x - size, y); 
    p.endShape();
    
    p.beginShape();
    p.vertex(x, y); 
    p.vertex(x + size / 2, y - size / 4); 
    p.vertex(x + size, y); 
    p.endShape();
}

  p.windowResized = function() {
    adjustGridLayout();
    p.resizeCanvas(p.windowWidth, canvasHeight);
    p.redraw();  
  };
};

