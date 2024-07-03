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
    const innerRadius = 12;
    const innerColor = [
        [0, 0, 0, 0.2],
        [0, 0, 0, 0.2],
        [0, 0, 0, 0.2]
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
            gender = group[j]["Gender"];
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
                innerX, innerY, angle, gender,
                renderer, duration, maritalStatus,familyHistory,depressionDiagnosis,
                anxietyDiagnosis, radians,
                age, innerColor, minDuration, maxDuration, true, true);
            }
            drawBar(barHeight, x, y, angle, gender,
                renderer, duration, maritalStatus,familyHistory,depressionDiagnosis,anxietyDiagnosis
                , radians, age, color, minDuration, maxDuration, true, false);
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
    
    drawHorizontalBars(femalePatients, stageWidth / 2 + 10, stageHeight / 8,
         stageHeight, maximumAge, renderer, 'Female', 2, scaleFactor,minDuration,maxDuration);
    drawHorizontalBars(malePatients, stageWidth / 2 - 10, stageHeight / 8,
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
    function addHoverStyles() {
        bar.addClass('hover').css({
            'background-color': '1px solid black',
            'opacity': 0.5,
            'z-index': 9999
        });

        dot.addClass('hover').css({
            'border': '1px solid black',
            'opacity': 0.5,
            'z-index': 19999
        });

        if (maritalDot) {
            maritalDot.addClass('hover').css({
                'border': '1px solid black',
                'opacity': 0.5,
                'z-index': 19999
            });
        }
    }

    function removeHoverStyles() {
        if (!currentlyActiveElements.includes(bar[0])) {
            bar.removeClass('hover').css({
                'border': 'none',
                'opacity': 1,
                'z-index': 2
            });
        }

        if (!currentlyActiveElements.includes(dot[0])) {
            dot.removeClass('hover').css({
                'border': `0.1px solid rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                'opacity': 1 // Restore default visibility
            });
        }

        if (maritalDot && !currentlyActiveElements.includes(maritalDot[0])) {
            maritalDot.removeClass('hover').css({
                'border': `0.5px solid rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                'opacity': maritalStatus === "Married" || maritalStatus === "Single" || maritalStatus === "Divorced" ? 1 : 0
            });
        }

    }

    function applyClickStyles() {
        bar.addClass('clicked').css({
            'background-color': '1px solid black',
            'opacity': 1, // Increased opacity for clicked state
            'z-index': 9999
        });

        dot.addClass('clicked').css({
            'border': '1px solid black',
            'opacity': 1,
            'z-index': 19999
        });

        if (maritalDot) {
            maritalDot.addClass('clicked').css({
                'border': '1px solid black',
                'opacity': 1,
                'z-index': 19999
            });
        }

    }

    function removeClickStyles() {
        currentlyActiveElements.forEach(el => $(el).removeClass('clicked').css({
            'background-color': 'none',
            'border': 'none',
            'opacity': 1,
            'z-index': 2
        }));
        currentlyActiveElements = [];
    }

    bar.add(dot).add(maritalDot).hover(addHoverStyles, removeHoverStyles).click(function () {
        removeClickStyles();
        currentlyActiveElements = [bar[0], dot[0], maritalDot ? maritalDot[0] : null].filter(el => el);
        applyClickStyles();
        
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

function drawVerticalBars(colors, stageWidth, stageHeight, renderer, category, filter) {
    if (filter === "Harm_related") { filter = "Harm-related"; }
    let filtered = ocdData.filter(patient => patient[category] == filter);
    const maximumAge = Math.max(...filtered.map(patient => patient["Age"]));
    const scaleFactor = 0.34;
    const startX = stageWidth * (1/5);
    const startY = stageHeight * (1/4);
    const criteria = category === "Obsession" ? "Y-BOCS Score (Obsessions)" : "Y-BOCS Score (Compulsions)";
    const minY_bocs = Math.min(...ocdData.map(patient => patient[criteria]));
    const maxY_bocs = Math.max(...ocdData.map(patient => patient[criteria]));
    console.log(filtered.length);
    const gap = stageWidth / 1.7 / filtered.length;
    let age, maritalStatus, duration, y_bocs, familyHistory, depressionDiagnosis, anxietyDiagnosis;
    let barHeight, x, y;
    sortByKey(filtered, criteria, 'asc');
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
        y = startY;
        drawVerticalBar(colors, barHeight, x, y, renderer, y_bocs, maritalStatus, age, minY_bocs, maxY_bocs, gender, duration, familyHistory, depressionDiagnosis, anxietyDiagnosis);
    });

    // Add text for min and max Y-BOCS Score
    addText(renderer, `${minY_bocs}`, startX, stageHeight / 4 * 3.05, 'left', 'y-bocs-score');
    addText(renderer, `${maxY_bocs}`, startX, stageHeight / 4 * 3.05, 'right', 'y-bocs-score');

    // Add title at the bottom
    addText(renderer, 'Y-BOCS Score', startX, stageHeight / 4 * 3.15, 'center', 'title-text');

    // Add additional information text below the title
    addText(renderer, 'The Yale–Brown Obsessive–Compulsive Scale (Y-BOCS) rates the severity of OCD symptoms', startX, stageHeight / 4 * 3.27, 'center', 'info-text');
}

function addText(renderer, text, x, y, align, className) {
    const textElement = document.createElement('div');
    textElement.className = `chart-text ${className}`;
    textElement.style.left = align === 'left' ? `${x}px` : align === 'right' ? `calc(${x}px + 57.7%)` : `calc(${x}px + 30%)`;
    textElement.style.top = `${y}px`;
    textElement.style.transform = align === 'center' ? 'translateX(-50%)' : 'none';
    textElement.innerText = text;
    console.log(textElement);
    renderer.append(textElement);
}




function calculateColorFix(colors, y_bocs, minY_bocs, maxY_bocs) {
    const startColor = colors[0];
    const middleColor = colors[1];
    const endColor = colors[2];
    return calculateGradientColor(startColor, middleColor, endColor, y_bocs, minY_bocs, maxY_bocs);
}

function drawVerticalBar(colors, barHeight, x, y, renderer, y_bocs, maritalStatus, age, minY_bocs, maxY_bocs, gender, duration, familyHistory, depressionDiagnosis, anxietyDiagnosis) {
    const color = calculateColorFix(colors, y_bocs, minY_bocs, maxY_bocs);
    const bar = createVerticalBar(x, y, barHeight, color);
    const dot = createVerticalDot(color, x, y); // Adjusted dot position for vertical bars
    const maritalDot = createVerticalMaritalDot(maritalStatus, x, y, barHeight, color);

    renderer.append(bar, dot, maritalDot);

    function addHoverStyles() {
        bar.addClass('hover').css({
            'background-color': '1px solid black',
            'opacity': 0.5,
            'z-index': 9999
        });
    
        dot.addClass('hover').css({
            'border': '1px solid black',
            'opacity': 0.5,
            'z-index': 19999
        });
    
        if (maritalDot) {
            maritalDot.addClass('hover').css({
                'border': '1px solid black',
                'opacity': 0.5,
                'z-index': 19999
            });
        }
    }
    
    function removeHoverStyles() {
        if (!currentlyActiveElements.includes(bar[0])) {
            bar.removeClass('hover').css({
                'border': 'none',
                'opacity': 1,
                'z-index': 2
            });
        }
    
        if (!currentlyActiveElements.includes(dot[0])) {
            dot.removeClass('hover').css({
                'border': `0.1px solid rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                'opacity': 1 // Restore default visibility
            });
        }
    
        if (maritalDot && !currentlyActiveElements.includes(maritalDot[0])) {
            maritalDot.removeClass('hover').css({
                'border': `0.5px solid rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                'opacity': maritalStatus === "Married" || maritalStatus === "Single" || maritalStatus === "Divorced" ? 1 : 0
            });
        }
    }
    
    function applyClickStyles() {
        bar.addClass('clicked').css({
            'background-color': '1px solid black',
            'opacity': 1, // Increased opacity for clicked state
            'z-index': 9999
        });
    
        dot.addClass('clicked').css({
            'border': '1px solid black',
            'opacity': 1,
            'z-index': 19999
        });
    
        if (maritalDot) {
            maritalDot.addClass('clicked').css({
                'border': '1px solid black',
                'opacity': 1,
                'z-index': 19999
            });
        }
    }
    
    function removeClickStyles() {
        currentlyActiveElements.forEach(el => $(el).removeClass('clicked').css({
            'background-color': 'none',
            'border': 'none',
            'opacity': 1,
            'z-index': 2
        }));
        currentlyActiveElements = [];
    }
    
    function handleClick() {
        removeClickStyles();
        currentlyActiveElements = [bar[0], dot[0], maritalDot ? maritalDot[0] : null].filter(el => el);
        applyClickStyles();
        
        const patientData = {
            title: 'Patient Details',
            gender: gender,
            age: age,
            duration: duration,
            maritalStatus: maritalStatus,
            familyHistory: familyHistory,
            depressionDiagnosis: depressionDiagnosis,
            anxietyDiagnosis: anxietyDiagnosis,
        };
        createPopup(patientData);
    }
    
    bar.add(dot).add(maritalDot)
        .hover(addHoverStyles, removeHoverStyles)
        .click(handleClick);
    
    bar.click(() => createPopup({
        title: 'Patient Details',
        gender,
        age,
        duration,
        maritalStatus,
        familyHistory,
        depressionDiagnosis,
        anxietyDiagnosis
    }, { label: 'Y-BOCS Score', value: y_bocs }));
    
    maritalDot.click(() => createPopup({
        title: 'Patient Details',
        gender,
        age,
        duration,
        maritalStatus,
        familyHistory,
        depressionDiagnosis,
        anxietyDiagnosis
    }, { label: 'Y-BOCS Score', value: y_bocs }));
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
        'left': x - 2.5,
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

        smallerDot.click(() => createPopup({ title: 'Patient Details', gender, age, duration, maritalStatus }));
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
        'left': x - 1.5,
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





let currentlyActiveElements = [];

function drawBar(barHeight, x, y, angle, gender, renderer, duration, maritalStatus,
    familyHistory, depressionDiagnosis, anxietyDiagnosis, radians, age, color, minDuration, maxDuration, drawMaritalDots, isInnerConnection) {

    const finalColor = calculateGradientColor(color[0], color[1], color[2], duration, minDuration, maxDuration);

    const bar = $('<div></div>').addClass('bar ' + gender);
    bar.css({
        'height': barHeight,
        'width': '0.1px',
        'left': x,
        'top': y,
        'transform-origin': 'bottom center',
        'transform': `rotate(${angle + 90}deg)`,
        'background-color': `rgb(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]})`,
        'opacity': isInnerConnection ? 0.2 : 1
    });
    renderer.append(bar);

    const dot = $('<div></div>').addClass('dot');
    dot.css({
        'background-color': `rgba(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]}, 0.8)`,
        'border': `0.1px solid rgb(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]})`,
        'left': x - 2,
        'top': y + barHeight - 2,
        'z-index': 1,
        'opacity': isInnerConnection ? 0.3 : 1,
    });
    renderer.append(dot);

    let maritalDot, smallerDot;

    if (drawMaritalDots) {
        maritalDot = $('<div></div>').addClass('marital-dot');
        maritalDot.css({
            'left': x + Math.cos(radians) * barHeight - 3,
            'top': y + barHeight + Math.sin(radians) * barHeight - 3,
            'border': `0.5px solid rgb(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]})`,
            'z-index': 2,
            'opacity': maritalStatus === "Married" || maritalStatus === "Single" || maritalStatus === "Divorced" ? 1 : 0,
            'opacity': isInnerConnection ? 0.6 : 1 
        });

        if (maritalStatus === "Married") {
            maritalDot.addClass('filled');
            maritalDot.css({
                'background-color': `rgb(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]})`,
                'border-color': `rgb(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]})`
            });
        } else if (maritalStatus === "Single") {
            maritalDot.addClass('bordered');
        } else if (maritalStatus === "Divorced") {
            maritalDot.addClass('bordered divorced');
        }

        renderer.append(maritalDot);

        if (maritalStatus === "Divorced") {
            smallerDot = $('<div></div>').addClass('marital-dot smaller filled');
            smallerDot.css({
                'background-color': `rgb(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]})`,
                'left': x + Math.cos(radians) * barHeight - 1.5,
                'top': y + barHeight + Math.sin(radians) * barHeight - 1.5,
                'z-index': 2,
                'opacity': isInnerConnection ? 0.6 : 1 
            });
            renderer.append(smallerDot);
        }
    }

    function addHoverStyles() {
        bar.addClass('hover').css({
            'background-color': '1px solid black',
            'opacity': 0.5,
            'z-index': 9999
        });

        dot.addClass('hover').css({
            'border': '1px solid black',
            'opacity': 0.5,
            'z-index': 19999
        });

        if (maritalDot) {
            maritalDot.addClass('hover').css({
                'border': '1px solid black',
                'opacity': 0.5,
                'z-index': 19999
            });
        }

        if (smallerDot) {
            smallerDot.addClass('hover').css({
                'border': '1px solid black',
                'opacity': 0.5,
                'z-index': 19999
            });
        }
    }

    function removeHoverStyles() {
        if (!currentlyActiveElements.includes(bar[0])) {
            bar.removeClass('hover').css({
                'border': 'none',
                'opacity': isInnerConnection ? 0.2 : 1,
                'z-index': 2
            });
        }

        if (!currentlyActiveElements.includes(dot[0])) {
            dot.removeClass('hover').css({
                'border': `0.1px solid rgb(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]})`,
                'opacity': 1 // Restore default visibility
            });
        }

        if (maritalDot && !currentlyActiveElements.includes(maritalDot[0])) {
            maritalDot.removeClass('hover').css({
                'border': `0.5px solid rgb(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]})`,
                'opacity': maritalStatus === "Married" || maritalStatus === "Single" || maritalStatus === "Divorced" ? 1 : 0
            });
        }

        if (smallerDot && !currentlyActiveElements.includes(smallerDot[0])) {
            smallerDot.removeClass('hover').css({
                'border': `0.5px solid rgb(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]})`,
                'opacity': maritalStatus === "Divorced" ? 1 : 0
            });
        }
    }

    function applyClickStyles() {
        bar.addClass('clicked').css({
            'background-color': '1px solid black',
            'opacity': 1, // Increased opacity for clicked state
            'z-index': 9999
        });

        dot.addClass('clicked').css({
            'border': '1px solid black',
            'opacity': 1,
            'z-index': 19999
        });

        if (maritalDot) {
            maritalDot.addClass('clicked').css({
                'border': '1px solid black',
                'opacity': 1,
                'z-index': 19999
            });
        }

        if (smallerDot) {
            smallerDot.addClass('clicked').css({
                'border': '1px solid black',
                'opacity': 1,
                'z-index': 19999
            });
        }
    }

    function removeClickStyles() {
        currentlyActiveElements.forEach(el => $(el).removeClass('clicked').css({
            'background-color': 'none',
            'border': 'none',
            'opacity': 1,
            'z-index': 2
        }));
        currentlyActiveElements = [];
    }

    bar.add(dot).add(maritalDot).add(smallerDot).hover(addHoverStyles, removeHoverStyles).click(function () {
        removeClickStyles();
        currentlyActiveElements = [bar[0], dot[0], maritalDot ? maritalDot[0] : null, smallerDot ? smallerDot[0] : null].filter(el => el);
        applyClickStyles();
        
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


