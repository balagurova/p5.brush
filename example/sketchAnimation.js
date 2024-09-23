let sketchAnimation = function(p) {
    let palette = ["#7b4800", "#002185", "#003c32", "#fcd300", "#ff2702", "#6b9404"];
    let font;
    let months = [];
    let birds = [];
    let csvData;
    let canvasWidth;
    let canvasHeight;
    let canvasMargin = 40;  // Same margin

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
        p.textFont(font);
        p.textSize(12);

        // Initialize bird positions
        initializeBirds();
    };

    p.windowResized = function() {
        // Recalculate layout on window resize
        adjustLayout();
        p.resizeCanvas(p.windowWidth, canvasHeight);
        initializeBirds();  // Re-initialize bird positions on resize
    };

    function adjustLayout() {
        // Calculate the width of the rectangle, which is the full canvas width minus the margins
        canvasWidth = p.windowWidth - canvasMargin * 2;

        // Set canvas height depending on the number of months to cover from Feb 2022 to Feb 2024
        canvasHeight = months.length * 100 + canvasMargin * 2; // Dynamic height based on months
    }

    function initializeBirds() {
        // Initialize bird positions for the full-width rectangle
        birds = [];
        for (let i = 0; i < months.length; i++) {
            let monthBirds = [];
            for (let j = 0; j < months[i].totalBirds; j++) {
                let bird = {
                    x: p.random(canvasMargin, canvasWidth + canvasMargin),  // Random x within canvas bounds
                    y: p.random(canvasMargin, canvasHeight - canvasMargin),  // Random y within canvas bounds
                    color: p.random(palette)    // Random color from palette
                };
                monthBirds.push(bird);
            }
            birds.push(monthBirds);
        }
    }

    p.draw = function() {
        p.background('#FCF7F3');

        // Draw the background rectangle (optional, can be removed)
        p.fill(220);
        p.stroke(0);
        p.rect(canvasMargin, canvasMargin, canvasWidth, canvasHeight - canvasMargin * 2);  // Full-width rectangle with fixed height

        // Show all birds at once for all months
        for (let i = 0; i < months.length; i++) {
            let monthBirds = birds[i];

            // Draw the birds for this month
            for (let j = 0; j < monthBirds.length; j++) {
                let bird = monthBirds[j];
                p.fill(bird.color);
                p.noStroke();
                p.ellipse(bird.x, bird.y, 5, 5);  // Draw the bird as a small circle
            }
        }

        noLoop();
    };
};
