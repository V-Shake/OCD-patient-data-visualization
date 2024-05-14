function drawSunburstChart(stageWidth, stageHeight, renderer, filter) {
    // const gap = 0.1; 
    const scaleFactor = 0.34; // Adjust this value to scale the bar heights
    const maximumAge = Math.max(...patientData.map(patient => patient.age));
    // const totalCount = patientData.length;

    // Calculate the total width of all bars including gaps
    // const totalGapWidth = gap * (totalCount - 1);
    // const barWidth = (stageWidth - totalGapWidth) / totalCount; // Reduced bar width
    // console.log(stageHeight);

    // const femaleWidth = femalePatients.length * barWidth;
    // const maleWidth = malePatients.length * barWidth;

    let filteredPatients = patientData;
    if (filter) {
        filteredPatients = patientData.filter(patient => patient.maritalStatus === filter);
    }

    const femalePatients = filteredPatients.filter(patient => patient.gender === "Female");
    const malePatients = filteredPatients.filter(patient => patient.gender === "Male");

    // Calculate x offsets for female and male bars
    // const xOffset = (stageWidth - (femaleWidth + maleWidth)) / 2;
    // const femaleXOffset = xOffset; // Adjusted xOffset for female bars
    // const maleXOffset = xOffset + femaleWidth; // Adjusted xOffset for male bars

    // Calculate y offset
    // const yOffset = (stageHeight - (stageHeight / maximumAge) * scaleFactor) / 2 ;
    let barsGap = 2;

    // Draw female bars
    for (let i = 0; i < femalePatients.length; i++) {
        const age = femalePatients[i].age;
        const duration = femalePatients[i].duration;
        const maritalStatus = femalePatients[i].maritalStatus; 
        const barHeight = (stageHeight / maximumAge) * age * scaleFactor; // Apply the scale factor
        const angle = 270 + barsGap + (360 * femalePatients.length / patientData.length - 2 * barsGap) / femalePatients.length * i; 
        const radians = gmynd.radians(angle);
        const radius = 100; // Initial radius
        const x = stageWidth / 2 + Math.cos(radians) * radius; // Adjusted x position for female bars
        const y = stageHeight / 2 - barHeight + Math.sin(radians) * radius; // Adjusted y position
        drawBar(barHeight, x, y, angle, 'female', renderer, duration, maritalStatus, radians);
    }

    // Draw male bars
    for (let i = 0; i < malePatients.length; i++) {
        const age = malePatients[i].age;
        const duration = malePatients[i].duration;
        const maritalStatus = malePatients[i].maritalStatus; 
        const barHeight = (stageHeight / maximumAge) * age * scaleFactor; // Apply the scale factor
        const angle = 270 + (360 * femalePatients.length / patientData.length) + barsGap + (360 * malePatients.length / patientData.length - 2 * barsGap) / malePatients.length * i;
        const radians = gmynd.radians(angle);
        const radius = 100; // Initial radius
        const x = stageWidth / 2 + Math.cos(radians) * radius; // Adjusted x position for male bars
        const y = stageHeight / 2 - barHeight + Math.sin(radians) * radius; // Adjusted y position
        drawBar(barHeight, x, y, angle, 'male', renderer, duration, maritalStatus, radians);
    }
}

function drawBar(barHeight, x, y, angle, gender, renderer, duration, maritalStatus, radians) {
    let color;
    if (gender === 'female') {
        // Define start, middle, and end colors for females
        const startColor = [252, 210, 211]; // Light red
        const middleColor = [224, 115, 115]; // Middle red
        const endColor = [85, 20, 24]; // Dark red
        color = calculateGradientColor(startColor, middleColor, endColor, duration);
    } else {
        // Define start, middle, and end colors for males
        const startColor = [213, 222, 255]; // Light blue
        const middleColor = [125, 158, 235]; // Middle blue
        const endColor = [21, 37, 94]; // Dark blue
        color = calculateGradientColor(startColor, middleColor, endColor, duration);
    }

    const bar = $('<div></div>');
    bar.addClass('bar ' + gender);
    bar.css({
        'height': barHeight,
        'width': 0.1,
        'left': x,
        'top': y,
        'transform-origin': 'bottom center',
        'transform': `rotate(${angle + 90}deg)`,
        'background-color': `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    });

    renderer.append(bar);


    // Add dot to the bottom of the bar
    const dot = $('<div></div>');
    dot.addClass('dot');
    dot.css({
        'background-color': `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.1)`,
        'border': `0.1px solid rgb(${color[0]}, ${color[1]}, ${color[2]})`,
        'left': x - 2,
        'top': y + barHeight - 2, 
    });

    renderer.append(dot);


    // Add marital dot to the top of the bar
    const maritalDot = $('<div></div>');
    maritalDot.addClass('marital-dot');
    if (maritalStatus === "Married") {
        maritalDot.addClass('filled');
        maritalDot.css({
            'background-color': `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
            'border-color': `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
        });
    } else if (maritalStatus === "Single") {
        maritalDot.addClass('bordered');
    } else if (maritalStatus === "Divorced") {
        maritalDot.addClass('bordered divorced');
    }

    maritalDot.css({
        // 'background-color': 'transparent',
        'left': x + Math.cos(radians) * barHeight - 3, // Adjusted x position for the dot
        'top': y + barHeight + Math.sin(radians) * barHeight - 3, // Adjusted y position for the dot
        'border': `0.5px solid rgb(${color[0]}, ${color[1]}, ${color[2]})`,
    });

    renderer.append(maritalDot);

    if (maritalStatus === "Divorced") {
        const smallerDot = $('<div></div>');
        smallerDot.addClass('marital-dot smaller filled');
        smallerDot.css({
            'background-color': `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
            'left': x + Math.cos(radians) * barHeight - 1.5, // Adjusted x position for the smaller dot
            'top': y + barHeight + Math.sin(radians) * barHeight - 1.5, // Adjusted y position for the smaller dot
        });

    renderer.append(smallerDot);
    }

}




// Function to calculate gradient color based on duration
function calculateGradientColor(startColor, middleColor, endColor, duration) {
    let color = [];
    let percentage;

    // Define middle color position
    const middlePosition = 0.5; // middle color position relative to duration range

    // Calculate percentage for gradient color calculation
    if (duration <= minDuration + (maxDuration - minDuration) * middlePosition) {
        percentage = (duration - minDuration) / ((maxDuration - minDuration) * middlePosition);
        for (let i = 0; i < 3; i++) {
            color[i] = Math.round(startColor[i] + percentage * (middleColor[i] - startColor[i]));
        }
    } else {
        percentage = (duration - (minDuration + (maxDuration - minDuration) * middlePosition)) / ((maxDuration - minDuration) * (1 - middlePosition));
        for (let i = 0; i < 3; i++) {
            color[i] = Math.round(middleColor[i] + percentage * (endColor[i] - middleColor[i]));
        }
    }
    return color;
}
