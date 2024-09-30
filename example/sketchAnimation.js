let sketchAnimation = function(p) {
    let months = [];         
    let canvasMargin = 80;    
    let canvasHeight;

    // brush.instance(p);

  

    p.preload = function() {
        font = p.loadFont('./opensans.ttf');
        csvData = p.loadTable('./civilian_casualties.csv', 'csv', 'header');
    };

    p.setup = function() {
        // Parse the CSV data
        for (let i = 0; i < csvData.getRowCount(); i++) {
            let month = csvData.getString(i, 'Month');
            let totalBirds = p.int(csvData.getString(i, 'Killed'));
            months.push({ month, totalBirds });
        }

        // Calculate layout and create canvas
        adjustLayout();
        p.createCanvas(p.windowWidth, canvasHeight, p.WEBGL)
        p.textFont(font);
        p.textSize(12);

        // Initialize bird positions
        initializeBirds();
        brush.load(); 
    };

    p.windowResized = function() {
        // Recalculate layout on window resize
        adjustLayout();
        p.resizeCanvas(p.windowWidth, canvasHeight);
        initializeBirds();  // Re-initialize bird positions on resize
    };

    function adjustLayout() {
        canvasWidth = p.windowWidth - canvasMargin * 2;
        canvasHeight = months.length * 100 + canvasMargin * 2; 

        document.getElementById('canvas-container').style.height = canvasHeight + "px";
    }

    function initializeBirds() {
        // Initialize bird positions for the full-width rectangle
        birds = [];
        for (let i = 0; i < months.length; i++) {
            let monthBirds = [];
            for (let j = 0; j < months[i].totalBirds; j++) {
                let bird = {
                    x: p.random(canvasMargin, canvasWidth + canvasMargin),  
                    y: p.random(canvasMargin, canvasHeight - canvasMargin), 
                };
                monthBirds.push(bird);
            }
            birds.push(monthBirds);
        }
    }
    p.draw = function() {
        p.background('#FCFCF2');
        // brush.pick('2H')
        // brush.strokeWeight(1);
        // brush.stroke('#202297'); 
        // brush.noFill();



        for (let i = 0; i < months.length; i++) {
            let monthBirds = birds[i];
            for (let j = 0; j < monthBirds.length; j++) {
                let bird = monthBirds[j];
                p.fill('#202297');
                p.noStroke();
                p.bird(bird.x, bird.y, p.random(2,20));  
            }
        }

        // for (let i = 0; i < 100; i+=5) {
        //     brush.line(canvasMargin, i, canvasWidth-canvasMargin,i);
        // }

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
        adjustLayout();
        p.resizeCanvas(p.windowWidth, canvasHeight);
        p.redraw();  
      };
};
