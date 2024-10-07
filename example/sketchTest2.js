let sketchAnimation = function(p) {
  let months = [];
  let margin = 80; // Margin from left and right, and top and bottom
  let lineHeight = 200; // Height for each month's line
  let font, csvData;

  brush.instance(p);

  p.preload = function() {
    font = p.loadFont('./opensans.ttf');
    csvData = p.loadTable('./civilian_casualties.csv', 'csv', 'header');
  };

  p.setup = function() {
    // Parse CSV data
    for (let i = 0; i < csvData.getRowCount(); i++) {
      let month = csvData.getString(i, 'Month');
      let totalBirds = p.int(csvData.getString(i, 'Killed'));
      months.push({ month, totalBirds });
    }

    // Calculate canvas height based on the number of months
    let canvasHeight = lineHeight * months.length + margin * 2;

    p.createCanvas(p.windowWidth - margin * 2, canvasHeight, p.WEBGL);
    p.angleMode(p.DEGREES);
    p.textFont(font);
    p.textSize(12);
    
    initializeBirds();
    brush.load(); 
  };

  function initializeBirds() {
    birds = []; 
    for (let i = 0; i < months.length; i++) {
      let monthBirds = [];
      for (let j = 0; j < months[i].totalBirds; j++) {
        let bird = {
          x: p.random(10, p.width - 10),  // X position spanning the entire canvas width
          y: p.random(10, lineHeight - 10),  // Y position within each month's line
        };
        monthBirds.push(bird);
      }
      birds.push(monthBirds);
    }
  }

  p.draw = function() {
    p.background('#FCFCF2');

    // Draw horizontal lines for each month
    for (let monthIndex = 0; monthIndex < months.length; monthIndex++) {
      let yOffset = margin / 2 + monthIndex * lineHeight;

      // Draw horizontal line for the current month
      p.push();
      p.translate(-p.windowWidth / 2 + margin, -p.height / 2 + yOffset);
      brush.pick('hatch_brush');
      brush.strokeWeight(1);
      brush.stroke('#202297');
      // p.line(0, 0, p.width, 0);  // Horizontal line across the canvas width

      for (i=0; i < 200; i+=2){
        brush.line(p.random(0,15),i, p.random(p.width-15,p.width), i);
      }
      // Draw month label
      p.fill(0);
      p.textAlign(p.LEFT, p.CENTER);
      p.text(months[monthIndex].month, -margin, 0);  // Label the line with the month

      // Draw birds for this month
      for (let bird of birds[monthIndex]) {
        p.bird(bird.x, bird.y, p.random(2, 20));  // Draw bird at random positions within the line's height
      }

      p.pop();
    }

    p.noLoop(); 
  };

  p.bird = function(x, y, size) {
    p.stroke('#202297');
    p.strokeWeight(2);
    p.fill('#202297');
    
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
  };

  p.windowResized = function() {
    let canvasHeight = lineHeight * months.length + margin * 2;
    p.resizeCanvas(p.windowWidth - margin * 2, canvasHeight);
    p.redraw();  
  };
};
