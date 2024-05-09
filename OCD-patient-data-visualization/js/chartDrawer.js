function drawSunburstChart(stageWidth, stageHeight, renderer) {
    const gap = 0; 
    const scaleFactor = 0.28; // Adjust this value to scale the bar heights
    const maximumAge = Math.max(...patientData.map(patient => patient.age));
    const totalCount = patientData.length;

    // Calculate the total width of all bars including gaps
    const totalGapWidth = gap * (totalCount - 1);
    const barWidth = (stageWidth - totalGapWidth) / totalCount / 4; // Reduced bar width

    // Calculate the total width of female and male bars
    const femaleWidth = femalePatients.length * barWidth * 4;
    const maleWidth = malePatients.length * barWidth * 4;

    // Calculate x offsets for female and male bars
    const xOffset = (stageWidth - (femaleWidth + maleWidth)) / 2;
    const femaleXOffset = xOffset; // Adjusted xOffset for female bars
    const maleXOffset = xOffset + femaleWidth; // Adjusted xOffset for male bars

    // Calculate y offset
    const yOffset = (stageHeight - (stageHeight / maximumAge) * maximumAge * scaleFactor) / 2 + 100;
    let genderGap = 1;

    // Draw female bars
    for (let i = 0; i < femalePatients.length; i++) {
        const age = femalePatients[i].age;
        const duration = femalePatients[i].duration;
        const barHeight = (stageHeight / maximumAge) * age * scaleFactor; // Apply the scale factor
        const angle = 270 + genderGap + (360 * femalePatients.length / patientData.length - 2 * genderGap) / femalePatients.length * i; 
        const radians = gmynd.radians(angle);
        const radius = 140; // Initial radius
        const x = stageWidth / 2 + Math.cos(radians) * radius; // Adjusted x position for female bars
        const y = stageHeight - barHeight - yOffset + Math.sin(radians) * radius; // Adjusted y position
        drawBar(barWidth, barHeight, x, y, angle, 'female', renderer, duration);
    }

    // Draw male bars
    for (let i = 0; i < malePatients.length; i++) {
        const age = malePatients[i].age;
        const duration = malePatients[i].duration;
        const barHeight = (stageHeight / maximumAge) * age * scaleFactor; // Apply the scale factor
        const angle = 270 + (360 * femalePatients.length / patientData.length) + genderGap + (360 * malePatients.length / patientData.length - 2 * genderGap) / malePatients.length * i;
        const radians = gmynd.radians(angle);
        const radius = 140; // Initial radius
        const x = stageWidth / 2 + Math.cos(radians) * radius; // Adjusted x position for male bars
        const y = stageHeight - barHeight - yOffset + Math.sin(radians) * radius; // Adjusted y position
        drawBar(barWidth, barHeight, x, y, angle, 'male', renderer, duration);
    }
}

function drawBar(barWidth, barHeight, x, y, angle, gender, renderer, duration) {
    let color;
    if (gender === 'female') {
        // Calculate the color gradient for females
        const startColor = [252, 210, 211]; // Light red
        const endColor = [85, 20, 24]; // Dark red
        color = calculateGradientColor(startColor, endColor, duration);
    } else {
        // Calculate the color gradient for males
        const startColor = [213, 222, 255]; // Light blue
        const endColor = [21, 37, 94]; // Dark blue
        color = calculateGradientColor(startColor, endColor, duration);
    }

    const bar = $('<div></div>');
    bar.addClass('bar ' + gender);
    bar.css({
        'height': barHeight,
        'width': barWidth, 
        'left': x, 
        'top': y,
        'transform-origin': 'bottom center',
        'transform': `rotate(${angle + 90}deg)`,
        'background-color': `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    });
    renderer.append(bar);
}

// Function to calculate gradient color based on duration
function calculateGradientColor(startColor, endColor, duration) {
    const percentage = (duration - minDuration) / (maxDuration - minDuration);
    const color = [];
    for (let i = 0; i < 3; i++) {
        color[i] = Math.round(startColor[i] + percentage * (endColor[i] - startColor[i]));
    }
    return color;
}
