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
        patientData.push({ age: patient.Age, gender: patient.Gender, duration });
        if (patient.Gender === "Female") {
            femalePatients.push({ age: patient.Age, gender: patient.Gender, duration });
        } else {
            malePatients.push({ age: patient.Age, gender: patient.Gender, duration });
        }
    });

    gmynd.sortData(patientData, 'duration');
    gmynd.sortData(femalePatients, 'duration');
    gmynd.sortData(malePatients, 'duration');
}

