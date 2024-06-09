function drawObsessionChart(stageWidth, stageHeight, renderer, filter) {
    const scaleFactor = 0.34; // Adjust this value to scale the bar heights
    const maximumAge = Math.max(...patientData.map(patient => patient.age));

    let filteredPatients = patientData;
    if (filter) {
        filteredPatients = patientData.filter(patient => patient.maritalStatus === filter);
    }

    const harmRelatedPatients = filteredPatients.filter(patient => patient.obsessionType === "Harm-related");
    const contaminationPatients = filteredPatients.filter(patient => patient.obsessionType === "Contamination");
    const symmetryPatients = filteredPatients.filter(patient => patient.obsessionType === "Symmetry");
    const hoardingPatients = filteredPatients.filter(patient => patient.obsessionType === "Hoarding");
    const religiousPatients = filteredPatients.filter(patient => patient.obsessionType === "Religious");

    const patientGroups = [
        { patients: harmRelatedPatients, color: [252, 210, 211] }, // Light red
        { patients: contaminationPatients, color: [213, 222, 255] }, // Light blue
        { patients: symmetryPatients, color: [213, 255, 213] }, // Light green
        { patients: hoardingPatients, color: [255, 213, 255] }, // Light purple
        { patients: religiousPatients, color: [255, 255, 213] } // Light yellow
    ];

    const totalPatients = filteredPatients.length;
    let startAngle = 0;
    let barsGap = 2;

    patientGroups.forEach(group => {
        const { patients, color } = group;
        const segmentAngle = (360 / totalPatients) * patients.length;

        for (let i = 0; i < patients.length; i++) {
            const age = patients[i].age;
            const duration = patients[i].duration;
            const maritalStatus = patients[i].maritalStatus;
            const barHeight = (stageHeight / maximumAge) * age * scaleFactor;
            const angle = startAngle + barsGap + (segmentAngle - 2 * barsGap) / patients.length * i;
            const radians = gmynd.radians(angle);
            const radius = 100; // Initial radius
            const x = stageWidth / 2 + Math.cos(radians) * radius;
            const y = stageHeight / 2 - barHeight + Math.sin(radians) * radius;
            drawObsessionBar(barHeight, x, y, angle, color, renderer, duration, maritalStatus, radians, age);
        }

        startAngle += segmentAngle;
    });
}

function drawObsessionBar(barHeight, x, y, angle, color, renderer, duration, maritalStatus, radians, age) {
    const bar = $('<div></div>');
    bar.addClass('bar');
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
}