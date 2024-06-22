function sortByKey(array, key, order = 'asc') {
    return array.sort((a, b) => {
      if (a[key] < b[key]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

function drawSunburstChart(stageWidth, stageHeight, renderer, category, membersInCategory, colors, innerStatus) {
    /**
     * age, marital status/dot type fixed
     * get scale and max age
     * split patients into groups determined by given category and elements within
     */
    console.log(`draw sunburst chart for ${category}`);
    clean();
    const gap = 4;
    const scaleFactor = 0.34; // Adjust this value to scale the bar heights
    const maximumAge = Math.max(...ocdData.map(patient => patient["Age"]));
    const minDuration = Math.min(...ocdData.map(patient => patient["Duration of Symptoms (months)"]));
    const maxDuration = Math.max(...ocdData.map(patient => patient["Duration of Symptoms (months)"]));
    const groups = membersInCategory.map((member) => {
        return ocdData.filter(patient => patient[category] === member);
    })
    groups.forEach(group => {
        sortByKey(group, 'Duration of Symptoms (months)', 'asc');
    });

    // calc area of segment of chart for each member in group
    totalLength = ocdData.length;   
    const segmentArea = groups.map(group => {
        return (group.length / totalLength)
    });
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
    let age,duration,maritalStatus;
    let familyHistory,depressionDiagnosis,anxietyDiagnosis;
    let barHeight,angle,radians,x,y,color;
    let connection,innerX,innerY;
    for (let i = 0; i < groups.length; i++) {
        group = groups[i];
        for (let j = 0; j < group.length; j++) {
            age = group[j]["Age"];
            duration = group[j]["Duration of Symptoms (months)"];
            maritalStatus = group[j]["Marital Status"];
            familyHistory = group[j]["Family History of OCD"];
            depressionDiagnosis = group[j]["Depression Diagnosis"];
            anxietyDiagnosis = group[j]["Anxiety Diagnosis"];
            barHeight = (stageHeight / maximumAge) * age * scaleFactor; // Apply the scale factor
            angle = startAngles[i] + j * angleForEachBar + i * gap;
            radians = gmynd.radians(angle);
            x = stageWidth / 2 + Math.cos(radians) * radius; // Adjusted x position for female bars
            y = stageHeight / 2 - barHeight + Math.sin(radians) * radius; // Adjusted y position
            color = colors[i];
            // draw inner circle if top right buttons toggled
            switch (innerStatus) {
                case "familyHistory":
                    connection = group[j]["Family History of OCD"];
                    break;
                case "depression":
                    connection = group[j]["Depression Diagnosis"];
                    break;
                case "anxiety":
                    connection = group[j]["Anxiety Diagnosis"];
                    break;
                default:
                    break;
            }
            if (connection === "Yes") {
                innerX = stageWidth / 2 + Math.cos(radians) * innerRadius; // Adjusted x position for female bars
                innerY = stageHeight / 2 - (radius - innerRadius) + Math.sin(radians) * innerRadius; // Adjusted y position
                drawBar((radius - innerRadius),
                innerX, innerY, angle, membersInCategory[i],
                renderer, duration, maritalStatus,familyHistory,depressionDiagnosis,
                anxietyDiagnosis, radians,
                age, innerColor, minDuration, maxDuration, false);
            }
            drawBar(barHeight, x, y, angle, membersInCategory[i],
                renderer, duration, maritalStatus,familyHistory,depressionDiagnosis,anxietyDiagnosis
                , radians, age, color, minDuration, maxDuration, true);
        }
    }
}


function drawHorizontalBarChart(stageWidth, stageHeight, renderer, filter) {
    const scaleFactor = 0.34; // Adjust this value to scale the bar heights
    const maximumAge = Math.max(...ocdData.map(patient => patient["Age"]));
    const minDuration = Math.min(...ocdData.map(patient => patient["Duration of Symptoms (months)"]));
    const maxDuration = Math.max(...ocdData.map(patient => patient["Duration of Symptoms (months)"]));
    const femalePatients = ocdData.filter(patient => patient["Gender"] === "Female" 
        && patient["Marital Status"] === filter);
    const malePatients = ocdData.filter(patient => patient["Gender"] === "Male" 
        && patient["Marital Status"] === filter);
    sortByKey(femalePatients, 'Duration of Symptoms (months)', 'asc');
    sortByKey(malePatients, 'Duration of Symptoms (months)', 'asc');
    
    drawHorizontalBars(femalePatients, stageWidth / 2 + 10, 90,
         stageHeight, maximumAge, renderer, 'Female', 2, scaleFactor,minDuration,maxDuration);
    drawHorizontalBars(malePatients, stageWidth / 2 - 10, 90,
         stageHeight, maximumAge, renderer, 'Male', 2, scaleFactor,minDuration,maxDuration);
}

function drawHorizontalBars(patients, startX, startY, stageHeight, maximumAge, renderer, gender, gap, scaleFactor,minDuration,maxDuration) {
    let age,duration,maritalStatus;
    let familyHistory,depressionDiagnosis,anxietyDiagnosis;
    let barHeight,x,y;
    patients.forEach((patient, i) => {
        age = patient["Age"];
        duration = patient["Duration of Symptoms (months)"];
        maritalStatus = patient["Marital Status"];
        familyHistory = patient["Family History of OCD"];
        depressionDiagnosis = patient["Depression Diagnosis"];
        anxietyDiagnosis = patient["Anxiety Diagnosis"];
        barHeight = (stageHeight / maximumAge) * age * scaleFactor; // Apply the scale factor
        x = startX + (gender === 'Female' ? 0 : -barHeight);
        y = startY + gap * i;

        drawHorizontalBar(barHeight, x, y, gender, renderer, duration, maritalStatus, age,familyHistory,depressionDiagnosis,anxietyDiagnosis,minDuration,maxDuration);
    });
}

function drawHorizontalBar(barHeight, x, y, gender, renderer, duration, maritalStatus, age,familyHistory,depressionDiagnosis,anxietyDiagnosis,minDuration,maxDuration) {
    const color = calculateColorGender(gender, duration,minDuration,maxDuration);

    const offset = (gender === 'Female' ? 0 : barHeight);
    const bar = createHorizontalBar(gender, x, y, barHeight, color);
    const dot = createDot(color, x+offset, y + 0.1);
    const maritalDot = createMaritalDot(maritalStatus, gender, x, y, barHeight, color);

    renderer.append(bar, dot, maritalDot);

    bar.click(() => createPopup({ title: 'Patient Details', gender, age, duration, maritalStatus ,familyHistory,depressionDiagnosis,anxietyDiagnosis}));
    maritalDot.click(() => createPopup({ title: 'Patient Details', gender, age, duration, maritalStatus ,familyHistory,depressionDiagnosis,anxietyDiagnosis}));
}

function calculateColorGender(gender, duration, minDuration, maxDuration) {
    const startColor = gender === 'Female' ? [252, 210, 211] : [213, 222, 255];
    const middleColor = gender === 'Female' ? [224, 115, 115] : [125, 158, 235];
    const endColor = gender === 'Female' ? [85, 20, 24] : [21, 37, 94];
    return calculateGradientColor(startColor, middleColor, endColor, duration, minDuration, maxDuration);
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
        'transform': gender === 'Female' ? 'none' : 'rotate(180deg)',
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
        'left': x + (gender === 'Female' ? barHeight : -3),
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

function drawVerticalBars(colors,stageWidth, stageHeight, renderer, category, filter) {
    if (filter === "Harm_related") { filter = "Harm-related"};
    let filtered = ocdData.filter(patient => patient[category] == filter);
    const maximumAge = Math.max(...filtered.map(patient => patient["Age"]));
    const scaleFactor = 0.34;
    const startX = stageWidth * (1/4);
    const startY = stageHeight * (1/4);
    const criteria = category === "Obsession" ? "Y-BOCS Score (Obsessions)" : "Y-BOCS Score (Compulsions)";
    const minY_bocs = Math.min(...ocdData.map(patient => patient[criteria]));
    const maxY_bocs = Math.max(...ocdData.map(patient => patient[criteria]));
    const gap = 2;
    let age,maritalStatus,duration,y_bocs,familyHistory,depressionDiagnosis,anxietyDiagnosis;
    let barHeight,x,y;
    sortByKey(filtered,criteria,'asc');
    filtered.forEach((patient, i) => {
        gender = patient["Gender"];
        age = patient["Age"];
        duration = patient["Duration of Symptoms (months)"];
        maritalStatus = patient["Marital Status"];
        y_bocs = patient[criteria];
        familyHistory = patient["Family History of OCD"];
        depressionDiagnosis = patient["Depression Diagnosis"];
        anxietyDiagnosis = patient["Anxiety Diagnosis"];
        barHeight = stageHeight * scaleFactor * (age / maximumAge); // Apply the scale factor
        x = startX + gap * i;
        y = startY ;
        drawVerticalBar(colors,barHeight, x, y, renderer, y_bocs, maritalStatus, age,minY_bocs,maxY_bocs,gender,duration,familyHistory,depressionDiagnosis,anxietyDiagnosis);
    });
}

function calculateColorFix(colors, y_bocs, minY_bocs, maxY_bocs) {
    const startColor = colors[0];
    const middleColor = colors[1];
    const endColor = colors[2];
    return calculateGradientColor(startColor, middleColor, endColor, y_bocs, minY_bocs, maxY_bocs);
}

function drawVerticalBar(colors,barHeight, x, y, renderer, y_bocs, maritalStatus, age,minY_bocs,maxY_bocs,gender,duration,familyHistory,depressionDiagnosis,anxietyDiagnosis) {
    const color = calculateColorFix(colors, y_bocs,minY_bocs,maxY_bocs);
    const bar = createVerticalBar(x, y, barHeight, color);
    const dot = createVerticalDot(color, x, y); // Adjusted dot position for vertical bars
    const maritalDot = createVerticalMaritalDot(maritalStatus, x, y, barHeight, color);

    renderer.append(bar,dot,maritalDot);

    bar.click(() => createPopup({ title: 'Patient Details', gender, age, duration, maritalStatus ,familyHistory,depressionDiagnosis,anxietyDiagnosis}));
    maritalDot.click(() => createPopup({ title: 'Patient Details', gender, age, duration, maritalStatus ,familyHistory,depressionDiagnosis,anxietyDiagnosis}));
}

function createVerticalMaritalDot(maritalStatus, x, y, barHeight, color) {
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
        'left': x - 3,
        'bottom': y + barHeight,
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

        smallerDot.click(() => createPopup({ title: 'Patient Details', age, duration, maritalStatus }));
        maritalDot.append(smallerDot);
    }

    return maritalDot;
}
function createVerticalDot(color, x, y) {
    const dot = $('<div></div>');
    dot.addClass('dot');
    dot.css({
        'background-color': `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`,
        'border': `0.1px solid rgb(${color[0]}, ${color[1]}, ${color[2]})`,
        'left': x,
        'bottom': y,
    });
    return dot;
}

function createVerticalBar(x, y, barHeight, color) {
    const bar = $('<div></div>');
    bar.addClass('bar');
    bar.css({
        'width': 0.5,
        'height': barHeight,
        'left': x,
        'bottom': y,
        'background-color': `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    });
    return bar;
}

function drawBars(colors,stageWidth, stageHeight, renderer, category, filter, orientation) {
    console.log(`draw bar chart for ${filter}`);
    clean();
    if (orientation === 'horizontal') {
        drawHorizontalBarChart(stageWidth, stageHeight, renderer, filter);
    } else if (orientation === 'vertical') {
        drawVerticalBars(colors,stageWidth, stageHeight, renderer, category, filter);
    } else {
        console.error("Invalid orientation specified.");
    }
}


function drawBar(barHeight, x, y, angle, gender, renderer, duration, maritalStatus,
    familyHistory,depressionDiagnosis,anxietyDiagnosis, radians, age, color, minDuration, maxDuration, drawMaritalDots) {
    /**
     * color is array containing [start,middle,end]
     */
    // console.log(maxDuration);
    finalColor = calculateGradientColor(color[0], color[1], color[2], duration, minDuration, maxDuration);
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

    if (drawMaritalDots){
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
                familyHistory: familyHistory,
                depressionDiagnosis: depressionDiagnosis,
                anxietyDiagnosis: anxietyDiagnosis
            };
            createPopup(patientData);
        });

    }
    maritalDot.click(function () {
        const patientData = {
            title: 'Patient Details',
            gender: gender,
            age: age,
            duration: duration,
            maritalStatus: maritalStatus,
            familyHistory: familyHistory,
            depressionDiagnosis: depressionDiagnosis,
            anxietyDiagnosis: anxietyDiagnosis
        };
        createPopup(patientData);
    });
    };
    bar.click(function () {
        const patientData = {
            title: 'Patient Details',
            gender: gender,
            age: age,
            duration: duration,
            maritalStatus: maritalStatus,
            familyHistory: familyHistory,
            depressionDiagnosis: depressionDiagnosis,
            anxietyDiagnosis: anxietyDiagnosis
        };
        createPopup(patientData);
    });

    
}








// Function to calculate gradient color based on duration
function calculateGradientColor(startColor, middleColor, endColor, duration, minDuration, maxDuration) {
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
