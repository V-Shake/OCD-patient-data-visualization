function drawSunburstChart(stageWidth, stageHeight, renderer, category, membersInCategory, colors, innerStatus) {
    /**
     * age, marital status/dot type fixed
     * get scale and max age
     * split patients into groups determined by given category and elements within
     */

    clean();
    const gap = 4;
    const scaleFactor = 0.34; // Adjust this value to scale the bar heights
    const maximumAge = Math.max(...patientData.map(patient => patient.age));

    const groups = membersInCategory.map((member) => {
        return patientData.filter(patient => patient[category] === member);
    }
    )
    // calc area of segment of chart for each member in group
    totalLength = patientData.length;
    const segmentArea = groups.map((member) => {
        return (member.length / totalLength)
    })

    // usable area for drawing the chart, the rest is for the gap
    usableArea = 360 - membersInCategory.length * gap;
    angleForEachBar = usableArea / totalLength;

    // calc start angle for each segment
    startAngles = Array(membersInCategory.length);
    offset = 270;
    for (let i = 0; i < membersInCategory.length; i++) {
        startAngles[i] = offset;
        offset = offset + usableArea * (segmentArea[i]);
    }
    // draw sunburst chart for each group in groups
    const radius = 100; // Initial radius
    const innerRadius = 20;
    const innerColor = [
        [0, 0, 0, 0.3],
        [0, 0, 0, 0.3],
        [0, 0, 0, 0.3]
    ];
    for (let i = 0; i < groups.length; i++) {
        group = groups[i];
        for (let j = 0; j < group.length; j++) {
            const age = group[j].age;
            const duration = group[j].duration;
            const maritalStatus = group[j].maritalStatus;
            const barHeight = (stageHeight / maximumAge) * age * scaleFactor; // Apply the scale factor
            const angle = startAngles[i] + j * angleForEachBar + i * gap;
            const radians = gmynd.radians(angle);
            const x = stageWidth / 2 + Math.cos(radians) * radius; // Adjusted x position for female bars
            const y = stageHeight / 2 - barHeight + Math.sin(radians) * radius; // Adjusted y position
            const color = colors[i];
            // draw inner circle if top right buttons toggled
            let connection;
            switch (innerStatus) {
                case "familyHistory":
                    connection = group[j].familyHistory;
                    break;
                case "depression":
                    connection = group[j].depressionDiagnosis;
                    break;
                case "anxiety":
                    connection = group[j].anxietyDiagnosis;
                    break;
                default:
                    break;
            }
            if (connection === "Yes") {
                const innerX = stageWidth / 2 + Math.cos(radians) * innerRadius; // Adjusted x position for female bars
                const innerY = stageHeight / 2 - (radius - innerRadius) + Math.sin(radians) * innerRadius; // Adjusted y position
                drawBar((radius - innerRadius), innerX, innerY, angle, membersInCategory[i], renderer, duration, maritalStatus, radians, age, innerColor);
            }
            drawBar(barHeight, x, y, angle, membersInCategory[i], renderer, duration, maritalStatus, radians, age, color);
        }
    }
}
function drawSunburstChart_o(stageWidth, stageHeight, renderer, filter) {
    // const gap = 0.1; 
    const scaleFactor = 0.34; // Adjust this value to scale the bar heights
    const maximumAge = Math.max(...patientData.map(patient => patient.age));

    let filteredPatients = patientData;
    if (filter) {
        filteredPatients = patientData.filter(patient => patient.maritalStatus === filter);
    }

    const femalePatients = filteredPatients.filter(patient => patient.gender === "Female");
    const malePatients = filteredPatients.filter(patient => patient.gender === "Male");

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
        drawBar(barHeight, x, y, angle, 'female', renderer, duration, maritalStatus, radians, age);
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
        drawBar(barHeight, x, y, angle, 'male', renderer, duration, maritalStatus, radians, age);
    }
}

function drawBarChart(stageWidth, stageHeight, renderer, filter) {
    clean();
    const scaleFactor = 0.34; // Adjust this value to scale the bar heights
    const maximumAge = Math.max(...patientData.map(patient => patient.age));

    let filteredPatients = patientData;
    if (filter) {
        filteredPatients = patientData.filter(patient => patient.maritalStatus === filter);
    }
    const femalePatients = filteredPatients.filter(patient => patient.gender === "Female");
    const malePatients = filteredPatients.filter(patient => patient.gender === "Male");

    drawHorizontalBars(femalePatients, stageWidth / 2 + 10, 90, stageWidth, stageHeight, maximumAge, renderer, 'female', 2, scaleFactor);
    drawHorizontalBars(malePatients, stageWidth / 2 - 10, 90, stageWidth, stageHeight, maximumAge, renderer, 'male', 2, scaleFactor);
}

function drawHorizontalBars(patients, startX, startY, stageWidth, stageHeight, maximumAge, renderer, gender, gap, scaleFactor) {
    
    patients.forEach((patient, i) => {
        const { age, duration, maritalStatus } = patient;
        const barHeight = (stageHeight / maximumAge) * age * scaleFactor; // Apply the scale factor
        const gap = 1.5;
        const x = startX + (gender === 'female' ? 0 : -barHeight);
        const y = startY + gap * i;

        drawHorizontalBar(barHeight, x, y, gender, renderer, duration, maritalStatus, age);
    });
}

function drawHorizontalBar(barHeight, x, y, gender, renderer, duration, maritalStatus, age) {
    const color = calculateColorGender(gender, duration);

    const bar = createHorizontalBar(gender, x, y, barHeight, color);
    let offset = (gender === 'female' ? 0 : barHeight);
    const dot = createDot(color, x+offset, y + 0.1);
    const maritalDot = createMaritalDot(maritalStatus, gender, x, y, barHeight, color);

    renderer.append(bar, dot, maritalDot);

    bar.click(() => createPopup({ title: 'Patient Details', gender, age, duration, maritalStatus }));
    maritalDot.click(() => createPopup({ title: 'Patient Details', gender, age, duration, maritalStatus }));
}

function calculateColorGender(gender, duration) {
    const startColor = gender === 'female' ? [252, 210, 211] : [213, 222, 255];
    const middleColor = gender === 'female' ? [224, 115, 115] : [125, 158, 235];
    const endColor = gender === 'female' ? [85, 20, 24] : [21, 37, 94];
    return calculateGradientColor(startColor, middleColor, endColor, duration);
}

function createHorizontalBar(gender, x, y, barHeight, color) {
    const bar = $('<div></div>');
    bar.addClass('bar ' + gender);
    bar.css({
        'width': barHeight,
        'height': 0.5,
        'left': x,
        'top': y,
        'transform-origin': 'center',
        'transform': gender === 'female' ? 'none' : 'rotate(180deg)',
        'background-color': `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    });
    return bar;
}

function createDot(color, x, y) {
    const dot = $('<div></div>');
    dot.addClass('dot');
    dot.css({
        'background-color': `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`,
        'border': `0.1px solid rgb(${color[0]}, ${color[1]}, ${color[2]})`,
        'left': x,
        'top': y,
    });
    return dot;
}

function createMaritalDot(maritalStatus, gender, x, y, barHeight, color) {
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
        'left': x + (gender === 'female' ? barHeight : -3),
        'top': y - 3,
        'border': `0.5px solid rgb(${color[0]}, ${color[1]}, ${color[2]})`,
    });

    if (maritalStatus === "Divorced") {
        const smallerDot = $('<div></div>');
        smallerDot.addClass('marital-dot smaller filled');
        smallerDot.css({
            'background-color': `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
            'left': '50%',
            'top': '50%',
            'transform': 'translate(-50%, -50%)',
        });

        smallerDot.click(() => createPopup({ title: 'Patient Details', gender, age, duration, maritalStatus }));
        maritalDot.append(smallerDot);
    }

    return maritalDot;
}

// function calculateColor(startColor, middleColor, endColor, duration) {
//     return calculateGradientColor(startColor, middleColor, endColor, duration);
// }

// function createVerticalBar(x, y, barHeight, color) {
//     const bar = $('<div></div>');
//     bar.addClass('bar ');
//     bar.css({
//         'width': 0.5,
//         'height': barHeight,
//         'left': x,
//         'top': y,
//         // 'transform-origin': 'center',
//         // 'transform': gender === 'female' ? 'none' : 'rotate(180deg)',
//         'background-color': `rgb(${color[0]}, ${color[1]}, ${color[2]})`
//     });
//     return bar;
// }


// function drawVerticalBar(barHeight, x, y, renderer, duration, category, type, age) {
//     const color = calculateColor(startColor, middleColor, endColor, duration);

//     const bar = createHorizontalBar(gender, x, y, barHeight, color);
//     const dot = createDot(color, x, y + 0.1);
//     const maritalDot = createMaritalDot(maritalStatus, gender, x, y, barHeight, color);

//     renderer.append(bar, dot, maritalDot);

//     bar.click(() => createPopup({ title: 'Patient Details', gender, age, duration, maritalStatus }));
//     maritalDot.click(() => createPopup({ title: 'Patient Details', gender, age, duration, maritalStatus }));
// }


// function drawVerticalBar(stageWidth, stageHeight, renderer, filter) {
//     clean();
//     const scaleFactor = 0.34;
//     const maximumAge = Math.max(...patientData.map(patient => patient.age));

//     let filteredPatients = patientData;
//     if (filter) {
//         filteredPatients = patientData.filter(patient => patient.maritalStatus === filter);
//     }

//     const femalePatients = filteredPatients.filter(patient => patient.gender === "Female");
//     // const malePatients = filteredPatients.filter(patient => patient.gender === "Male");

//     drawVerticalBars(femalePatients, 50, stageHeight / 2 + 10, stageWidth, stageHeight, maximumAge, renderer, 'female', 2, scaleFactor);
//     drawVerticalBars(malePatients, 50, stageHeight / 2 - 10, stageWidth, stageHeight, maximumAge, renderer, 'male', 2, scaleFactor);
// }

function drawVerticalBars(patients, startX, startY, stageWidth, stageHeight, maximumAge, renderer, gender, gap, scaleFactor) {
    patients.forEach((patient, i) => {
        const { age, duration, maritalStatus } = patient;
        const barWidth = (stageWidth / maximumAge) * age * scaleFactor;

        const x = startX + gap * i;
        // const x = startX + (gap + barWidth) * i;
        const y = startY + (gender === 'female' ? -barWidth : 0);

        drawVerticalBar(barWidth, x, y, gender, renderer, duration, maritalStatus, age);
    });
}

function drawVerticalBar(barWidth, x, y, gender, renderer, duration, maritalStatus, age) {
    const color = calculateColorGender(gender, duration);
    const bar = createVerticalBar(gender, x, y, barHeight, color);
    const dot = createDot(color, x + barWidth - 0.1, y); // Adjusted dot position for vertical bars
    const maritalDot = createMaritalDot(maritalStatus, gender, x, y, barWidth, color);

    renderer.append(bar, dot, maritalDot);

    bar.click(() => createPopup({ title: 'Patient Details', gender, age, duration, maritalStatus }));
    maritalDot.click(() => createPopup({ title: 'Patient Details', gender, age, duration, maritalStatus }));
}

function createVerticalBar(gender, x, y, barHeight, color) {
    const bar = $('<div></div>');
    bar.addClass('bar ' + gender);
    bar.css({
        'width': 0.5,
        'height': barHeight,
        'left': x,
        'top': y,
        'transform-origin': 'center',
        'transform': gender === 'female' ? 'none' : 'rotate(180deg)',
        'background-color': `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    });
    return bar;
}

function drawBars(stageWidth, stageHeight, renderer, filter, orientation) {
    if (orientation === 'horizontal') {
        drawBarChart(stageWidth, stageHeight, renderer, filter);
    } else if (orientation === 'vertical') {
        drawVerticalBar(stageWidth, stageHeight, renderer, filter);
    } else {
        console.error("Invalid orientation specified.");
    }
}

function drawBarChartForMaritalStatus(stageWidth, stageHeight, renderer, maritalStatus) {
    clean();
    const scaleFactor = 0.34;
    const maximumAge = Math.max(...patientData.map(patient => patient.age));
    const filteredPatients = patientData.filter(patient => patient.maritalStatus === maritalStatus);

    drawHorizontalBars(filteredPatients, stageWidth / 2 + 10, 90, stageWidth, stageHeight, maximumAge, renderer, 'female', 2, scaleFactor);
    drawHorizontalBars(filteredPatients, stageWidth / 2 - 10, 90, stageWidth, stageHeight, maximumAge, renderer, 'male', 2, scaleFactor);
}

function drawBarChart_o(stageWidth, stageHeight, renderer, filter) {
    clean();
    const scaleFactor = 0.34; // Adjust this value to scale the bar heights
    const maximumAge = Math.max(...patientData.map(patient => patient.age));

    let filteredPatients = patientData;
    if (filter) {
        filteredPatients = patientData.filter(patient => patient.maritalStatus === filter);
    }

    const femalePatients = filteredPatients.filter(patient => patient.gender === "Female");
    const malePatients = filteredPatients.filter(patient => patient.gender === "Male");

    // Calculate y offset
    let gap = 2;

    // Draw female bars
    const femaleStartX = stageWidth / 2 + 10;
    const femaleStartY = 90;
    drawHorizontalBars(femalePatients, femaleStartX, femaleStartY, stageWidth, stageHeight, maximumAge, renderer, 'female', gap, scaleFactor);

    // Draw male bars
    const maleStartX = stageWidth / 2 - 10;
    const maleStartY = 90;
    drawHorizontalBars(malePatients, maleStartX, maleStartY, stageWidth, stageHeight, maximumAge, renderer, 'male', gap, scaleFactor);
}

function drawHorizontalBars_o(patients, startX, startY, stageWidth, stageHeight, maximumAge, renderer, gender, gap, scaleFactor) {
    for (let i = 0; i < patients.length; i++) {
        const age = patients[i].age;
        const duration = patients[i].duration;
        const maritalStatus = patients[i].maritalStatus;
        const barHeight = (stageHeight / maximumAge) * age * scaleFactor; // Apply the scale factor

        // Adjusted x position for bars
        const x = startX + (gender === 'female' ? 0 : -barHeight);

        // Adjusted y position for bars
        // const y = startY + gap + ((stageHeight - gap * patients.length) / patients.length) * i;
        const y = startY + gap * i;
        // console.log(y);

        drawHorizontalBar(barHeight, x, y, gender, renderer, duration, maritalStatus, age);
    }
}

function drawHorizontalBar_o(barHeight, x, y, gender, renderer, duration, maritalStatus, age) {
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
        'width': barHeight,
        'height': 0.5,
        'left': x,
        'top': y,
        'transform-origin': 'center',
        'transform': gender === 'female' ? 'none' : 'rotate(180deg)',
        'background-color': `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    });


    renderer.append(bar);

    // Add hover effect to the bar
    bar.hover(
        function () {
            // Calculate new dimensions
            const newWidth = barHeight * 1.1; // Increase width by 10%

            // Apply hover styles
            $(this).css({
                'width': newWidth,
                'height': 0.1,
                'transform-origin': 'center',
                'transform': gender === 'female' ? 'none' : 'rotate(180deg)',
                'border': '1px solid white'
            });
        },
        function () {
            // Reset styles on hover out
            $(this).css({
                'width': barHeight,
                'height': 0.1,
                'transform-origin': 'center',
                'transform': gender === 'female' ? 'none' : 'rotate(180deg)',
                'border': 'none'
            });
        }
    );

    // Add dot to the bottom of the bar
    if (gender === "female") {
        x_gender = x;
    } else {
        x_gender = x + barHeight;
    }
    const dot = $('<div></div>');
    dot.addClass('dot');
    dot.css({
        'background-color': `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`,
        'border': `0.1px solid rgb(${color[0]}, ${color[1]}, ${color[2]})`,
        'left': x_gender,
        'top': y + 0.1,
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
        'left': x + (gender === 'female' ? barHeight : -3),
        'top': y - 3,
        'border': `0.5px solid rgb(${color[0]}, ${color[1]}, ${color[2]})`,
    });

    renderer.append(maritalDot);

    if (maritalStatus === "Divorced") {
        const smallerDot = $('<div></div>');
        smallerDot.addClass('marital-dot smaller filled');
        smallerDot.css({
            'background-color': `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
            'left': x + (gender === 'female' ? barHeight - 1.5 : -1.5),
            'top': y - 1.5,
        });

        renderer.append(smallerDot);

        smallerDot.click(function () {
            const patientData = {
                title: 'Patient Details',
                gender: gender,
                age: age,
                duration: duration,
                maritalStatus: maritalStatus,
            };
            createPopup(patientData);
        });
    }

    bar.click(function () {
        const patientData = {
            title: 'Patient Details',
            gender: gender,
            age: age,
            duration: duration,
            maritalStatus: maritalStatus,
        };
        createPopup(patientData);
    });

    maritalDot.click(function () {
        const patientData = {
            title: 'Patient Details',
            gender: gender,
            age: age,
            duration: duration,
            maritalStatus: maritalStatus,
        };
        createPopup(patientData);
    });

    // Add hover effect to the bar
    bar.hover(
        function () {
            const newHeight = barHeight * 1.1; // Increase height by 10%
            const newWidth = barWidth * 1.1; // Increase width by 10%
            const newX = x - ((newWidth - barWidth) / 2);
            const newY = y - ((newHeight - barHeight) / 2);

            $(this).css({
                'height': newHeight + 'px',
                'width': newWidth + 'px',
                'left': newX + 'px',
                'top': newY + 'px',
                'border': '1px solid white'
            });

            dot.css({
                'height': '6px', // Increase dot size
                'width': '6px', // Increase dot size
                'left': (newX + newWidth - 2) + 'px',
                'top': (newY + newHeight - 2) + 'px',
                'border': '1px solid white',
                'z-index': 1,
            });
        },
        function () {
            $(this).css({
                'height': barHeight + 'px',
                'width': barWidth + 'px',
                'left': x + 'px',
                'top': y + 'px',
                'border': 'none'
            });

            dot.css({
                'height': '4px',
                'width': '4px',
                'left': (x + barWidth - 2) + 'px',
                'top': (y + barHeight - 2) + 'px',
                'border': 'none',
                'z-index': 1,
            });
        }
    );
}



function drawBar(barHeight, x, y, angle, gender, renderer, duration, maritalStatus, radians, age, color) {
    /**
     * color is array containing [start,middle,end]
     */
    // let color;
    // if (gender === 'female') {
    //     // Define start, middle, and end colors for females
    //     const startColor = [252, 210, 211]; // Light red
    //     const middleColor = [224, 115, 115]; // Middle red
    //     const endColor = [85, 20, 24]; // Dark red
    //     color = calculateGradientColor(startColor, middleColor, endColor, duration);
    // } else {
    //     // Define start, middle, and end colors for males
    //     const startColor = [213, 222, 255]; // Light blue
    //     const middleColor = [125, 158, 235]; // Middle blue
    //     const endColor = [21, 37, 94]; // Dark blue
    //     color = calculateGradientColor(startColor, middleColor, endColor, duration);
    // }

    finalColor = calculateGradientColor(color[0], color[1], color[2], duration);
    const bar = $('<div></div>');
    bar.addClass('bar ' + gender);
    bar.css({
        'height': barHeight,
        'width': 0.1,
        'left': x,
        'top': y,
        'transform-origin': 'bottom center',
        'transform': `rotate(${angle + 90}deg)`,
        'background-color': `rgb(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]})`,
        // opacity: 0.5,
    });

    renderer.append(bar);

    // Add hover effect to the bar
    bar.hover(
        function () {
            // Calculate new dimensions
            const newHeight = barHeight * 1.1; // Increase height by 10%
            const newWidth = 0.1 * 1.1; // Increase width by 10%

            // Calculate new position to keep it centered
            const newX = x - ((newWidth - 0.1) / 2); // Adjusted x position for the bar
            const newY = y + (barHeight - newHeight); // Adjusted y position for the bar

            // Apply hover styles
            $(this).css({
                'height': newHeight,
                'width': newWidth,
                'left': newX,
                'top': newY,
                'transform-origin': 'bottom center',
                'transform': `rotate(${angle + 90}deg)`,
                'border': '1px solid white'
            });

            // Calculate the new position for the dot
            const newDotLeft = x - 2 - ((newWidth - 0.1) / 2); // Adjusted x position for the dot

            // Apply hover styles to the dot
            dot.css({
                'height': '6px', // Increase dot size
                'width': '6px', // Increase dot size
                'border': '1px solid white',
                'left': newDotLeft,
                'z-index': 1,
            });
        },
        function () {
            // Reset styles on hover out
            $(this).css({
                'height': barHeight,
                'width': '0.1',
                'left': x,
                'top': y,
                'transform-origin': 'bottom center',
                'transform': `rotate(${angle + 90}deg)`,
                'border': 'none'
            });

            // Reset styles on the dot
            dot.css({
                'height': '4px', // Reset dot size
                'width': '4px', // Reset dot size
                'border': 'none',
                'left': x - 2, // Reset dot position
                'z-index': 1,
            });
        }
    );




    // Add dot to the bottom of the bar
    const dot = $('<div></div>');
    dot.addClass('dot');
    dot.css({
        'background-color': `rgba(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]}, 0.8)`,
        'border': `0.1px solid rgb(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]})`,
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
            'background-color': `rgb(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]})`,
            'border-color': `rgb(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]})`,
        });
    } else if (maritalStatus === "Single") {
        maritalDot.addClass('bordered');
    } else if (maritalStatus === "Divorced") {
        maritalDot.addClass('bordered divorced');
    }

    maritalDot.css({
        'left': x + Math.cos(radians) * barHeight - 3, // Adjusted x position for the dot
        'top': y + barHeight + Math.sin(radians) * barHeight - 3, // Adjusted y position for the dot
        'border': `0.5px solid rgb(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]})`,
    });

    renderer.append(maritalDot);

    if (maritalStatus === "Divorced") {
        const smallerDot = $('<div></div>');
        smallerDot.addClass('marital-dot smaller filled');
        smallerDot.css({
            'background-color': `rgb(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]})`,
            'left': x + Math.cos(radians) * barHeight - 1.5, // Adjusted x position for the smaller dot
            'top': y + barHeight + Math.sin(radians) * barHeight - 1.5, // Adjusted y position for the smaller dot
        });

        renderer.append(smallerDot);

        smallerDot.click(function () {
            const patientData = {
                title: 'Patient Details',
                gender: gender,
                age: age,
                duration: duration,
                maritalStatus: maritalStatus,
            };
            createPopup(patientData);
        });

    }

    bar.click(function () {
        const patientData = {
            title: 'Patient Details',
            gender: gender,
            age: age,
            duration: duration,
            maritalStatus: maritalStatus,
            // details: 'Additional information.'
        };
        createPopup(patientData);
    });

    maritalDot.click(function () {
        const patientData = {
            title: 'Patient Details',
            gender: gender,
            age: age,
            duration: duration,
            maritalStatus: maritalStatus,
            // details: 'Additional information.'
        };
        createPopup(patientData);
    });
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
