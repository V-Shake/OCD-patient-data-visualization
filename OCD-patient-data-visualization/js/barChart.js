let stage;
let stageHeight;
let stageWidth;
let patientData = [];

$(function () {
    renderer = $('#renderer');
    stageWidth = renderer.width();
    stageHeight = renderer.height();
    prepareData();
    drawBarChart();
})

function prepareData() {
    ocdData.forEach(patient => {
        patientData.push({ age: patient.Age, gender: patient.Gender, duration: patient["Duration of Symptoms (months)"] });
    });
}

function drawBarChart() {
    const gap = 2/5;
    const barWidth = 1/10;
    const scaleFactor = 0.7; // Adjust this value to scale the bar heights
    
    const maximumAge = Math.max(...patientData.map(patient => patient.age));
    const totalWidth = ocdData.length * (barWidth + gap) - gap; // Total width of all bars including gaps

    // Calculate the total width of female and male bars
    const femaleCount = patientData.filter(patient => patient.gender === 'Female').length;
    const maleCount = patientData.filter(patient => patient.gender === 'Male').length;
    const femaleWidth = femaleCount * (barWidth + gap) - gap;
    const maleWidth = maleCount * (barWidth + gap) - gap;

    // Calculate x offsets for female and male bars
    const femaleXOffset = (stageWidth - totalWidth) / 2 - maleWidth;
    const maleXOffset = (stageWidth - totalWidth) / 2 + femaleWidth;

    // Calculate y offset
    const yOffset = (stageHeight - (stageHeight / maximumAge) * maximumAge * scaleFactor) / 2;

    for (let i = 0; i < ocdData.length; i++) {
        const age = patientData[i].age;
        const gender = patientData[i].gender;
        const barHeight = (stageHeight / maximumAge) * age * scaleFactor; // Apply the scale factor
        let x, y;

        if (gender === 'Female') {
            x = femaleXOffset + i * (barWidth + gap); // Adjusted x position for female bars
            y = stageHeight - barHeight - yOffset; // Adjusted y position
        } else if (gender === 'Male') {
            x = maleXOffset + i * (barWidth + gap); // Adjusted x position for male bars
            y = stageHeight - barHeight - yOffset; // Adjusted y position
        }

        let bar = $('<div></div>');

        bar.addClass('bar');

        // Add gender-specific class
        if (gender === 'Female') {
            bar.addClass('female');
        } else if (gender === 'Male') {
            bar.addClass('male');
        }

        bar.css({
            'height': barHeight,
            'width': barWidth,
            'left': x,
            'top': y,
        });

        renderer.append(bar);
    }
}



//  function drawBarChart() {
//     const gap = 9/10;
//     // const barWidth = (stageWidth - gap * (ocdData.length - 1)) / ocdData.length;
//     const barWidth = 1/10;
    
//     const maximumAge = Math.max(...patientAges);
    
//     const totalBarWidth = ocdData.length * (barWidth + gap) - gap;
//     const startX = (stageWidth - totalBarWidth) / 2;

//     for (let i = 0; i < ocdData.length; i++) {
//         const barHeight = (stageHeight / maximumAge) * patientAges[i];
//         const x = i * (barWidth + gap);
//         const y = stageHeight - barHeight;

//         let bar = $('<div></div>');

//         bar.addClass('bar');
//         bar.css({
//             'height': barHeight,
//             'width': barWidth,
//             'left': x,
//             'top': y,
//             'color': 'white',
//         });

//         renderer.append(bar);
//     }
// }
