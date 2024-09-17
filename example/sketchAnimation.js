let sketchAnimation = function(p) {
    let palette = ["#7b4800", "#002185", "#003c32", "#fcd300", "#ff2702", "#6b9404"];
    let font;
    let months = [];
    let birds = [];
    let csvData;
    let canvasWidth;
    let canvasHeight;
    let canvasMargin = 80;  // Same margin
    let birdIndex = 0;
    let currentMonthIndex = 0;
    let birdAnimationSpeed = 30;
    let birdAnimationCounter = 0;

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
        p.createCanvas(p.windowWidth, canvasHeight).parent('canvas-container');
        p.pixelDensity(4);
        p.angleMode(p.DEGREES);
        p.textFont(font);
        p.textSize(12);

        // Initialize bird positions
        initializeBirds();
    };

    p.windowResized = function() {
        // Recalculate layout on window resize
        adjustLayout();
        p.resizeCanvas(p.windowWidth, canvasHeight);
    };

    function adjustLayout() {
        // Calculate the width of the rectangle, which is the full canvas width minus the margins
        canvasWidth = p.windowWidth - canvasMargin;

        // Set a fixed height for the canvas (similar to previous layout)
        canvasHeight = 800;  // Fixed height + top and bottom margins
    }

    function initializeBirds() {
        // Initialize bird positions for the full-width rectangle
        birds = [];
        for (let i = 0; i < months.length; i++) {
            let monthBirds = [];
            for (let j = 0; j < months[i].totalBirds; j++) {
                let bird = {
                    x: p.random(10, canvasWidth - 10),  // Random x position within the full-width rectangle
                    y: p.random(10, 300 - 10),  // Random y position within the fixed rectangle height
                    color: p.random(palette)    // Random color from palette
                };
                monthBirds.push(bird);
            }
            birds.push(monthBirds);
        }
    }

    p.draw = function() {
        p.background('#FCF7F3');

        // Calculate position for the full-width rectangle
        let xOffset = canvasMargin / 2;  // Margin on the left
        let yOffset = canvasMargin / 2;  // Margin on top

        // Draw the rectangle
        p.fill(220);
        p.stroke(0);
        p.rect(xOffset, yOffset, canvasWidth, canvasHeight-canvasMargin);  // Full-width rectangle with fixed height

        // Display the current month name at the top of the rectangle
        p.fill(0);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(months[currentMonthIndex].month, xOffset + canvasWidth / 2, yOffset + 20);

        // Animate the birds inside the full-width rectangle
        for (let i = 0; i < birdIndex; i++) {
            let bird = birds[currentMonthIndex][i];
            p.fill(bird.color);
            p.noStroke();
            p.ellipse(xOffset + bird.x, yOffset + bird.y, 5, 5);  // Draw the bird as a small circle
        }

        // Control bird animation speed
        birdAnimationCounter++;
        if (birdAnimationCounter % birdAnimationSpeed === 0) {
            if (birdIndex < birds[currentMonthIndex].length) {
                birdIndex++;  // Draw the next bird
            } else {
                // Move to the next month
                currentMonthIndex = (currentMonthIndex + 1) % months.length;
                birdIndex = 0;  // Reset bird index for the new month
            }
        }
    };
};
