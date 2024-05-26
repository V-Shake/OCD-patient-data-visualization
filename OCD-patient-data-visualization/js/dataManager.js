let femalePatients = [];
let malePatients = [];
let patientData = [];
let minDuration, maxDuration;

function preparePatientData(ocdData) {
    minDuration = Infinity;
    maxDuration = 0;
    ocdData.forEach(patient => {
        const duration = patient["Duration of Symptoms (months)"];
        minDuration = Math.min(minDuration, duration);
        maxDuration = Math.max(maxDuration, duration);
        const maritalStatus = patient["Marital Status"];
        const familyHistory = patient["Family History of OCD"];
        const depressionDiagnosis = patient["Depression Diagnosis"];
        const anxietyDiagnosis = patient["Anxiety Diagnosis"];
        const compulsionType = patient["Compulsion Type"];
        patientData.push({ 
            age: patient.Age, gender: patient.Gender, duration, maritalStatus, familyHistory, depressionDiagnosis, anxietyDiagnosis, compulsionType }); 
        if (patient.Gender === "Female") {
            femalePatients.push({ 
             age: patient.Age, gender: patient.Gender, duration, maritalStatus, familyHistory, depressionDiagnosis, anxietyDiagnosis }); 
        } else {
            malePatients.push({ 
            age: patient.Age, gender: patient.Gender, duration, maritalStatus, familyHistory, depressionDiagnosis, anxietyDiagnosis });
        }
    });

    gmynd.sortData(patientData, 'duration');
    gmynd.sortData(femalePatients, 'duration');
    gmynd.sortData(malePatients, 'duration');
}


function filterData(maritalStatus) {
    const isFiltered = $('.bar.' + maritalStatus).length > 0;

    // Remove existing bars
    $('.bar').remove();
    $('.dot').remove();
    $('.marital-dot').remove();
    
    // Toggle the filtered chart
    if (!isFiltered) {
        if (maritalStatus === "Married") {
            drawBarChart(stageWidth, stageHeight, renderer, maritalStatus);
        } else {
            drawSunburstChart(stageWidth, stageHeight, renderer, maritalStatus);
        }
    } else {
        drawSunburstChart(stageWidth, stageHeight, renderer);
    }
}

function filterByFamilyHistory() {
    const filteredPatients = patientData.filter(patient => patient["Family History of OCD"] === "Yes");
    return filteredPatients;
}