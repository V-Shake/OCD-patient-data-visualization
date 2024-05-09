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
        const barHeight = (stageHeight / maximumAge) * age * scaleFactor; // Apply the scale factor
        const angle = 270 + genderGap + (360 * femalePatients.length / patientData.length - 2 * genderGap) / femalePatients.length * i; 
        const radians = gmynd.radians(angle);
        const radius = 140; // Initial radius
        const x = stageWidth / 2 + Math.cos(radians) * radius; // Adjusted x position for female bars
        const y = stageHeight - barHeight - yOffset + Math.sin(radians) * radius; // Adjusted y position
        drawBar(barWidth, barHeight, x, y, angle, 'female', renderer);
    }

    // Draw male bars
    for (let i = 0; i < malePatients.length; i++) {
        const age = malePatients[i].age;
        const barHeight = (stageHeight / maximumAge) * age * scaleFactor; // Apply the scale factor
        const angle = 270 + (360 * femalePatients.length / patientData.length) + genderGap + (360 * malePatients.length / patientData.length - 2 * genderGap) / malePatients.length * i;
        const radians = gmynd.radians(angle);
        const radius = 140; // Initial radius
        const x = stageWidth / 2 + Math.cos(radians) * radius; // Adjusted x position for male bars
        const y = stageHeight - barHeight - yOffset + Math.sin(radians) * radius; // Adjusted y position
        drawBar(barWidth, barHeight, x, y, angle, 'male', renderer);
    }
}

function drawBar(barWidth, barHeight, x, y, angle, gender, renderer) {
    const bar = $('<div></div>');
    bar.addClass('bar ' + gender);
    bar.css({
        'height': barHeight,
        'width': barWidth, 
        'left': x, 
        'top': y,
        'transform-origin': 'bottom center',
        'transform': `rotate(${angle + 90}deg)`
    });
    renderer.append(bar);
}

