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
        patientData.push({ age: patient.Age, gender: patient.Gender, duration, maritalStatus });
        if (patient.Gender === "Female") {
            femalePatients.push({ age: patient.Age, gender: patient.Gender, duration, maritalStatus });
        } else {
            malePatients.push({ age: patient.Age, gender: patient.Gender, duration, maritalStatus });
        }
    });

    gmynd.sortData(patientData, 'duration');
    gmynd.sortData(femalePatients, 'duration');
    gmynd.sortData(malePatients, 'duration');
}

