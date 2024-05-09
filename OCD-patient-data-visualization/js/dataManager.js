let femalePatients = [];
let malePatients = [];
let patientData = [];

function preparePatientData(ocdData) {
    ocdData.forEach(patient => {
        patientData.push({ age: patient.Age, gender: patient.Gender, duration: patient["Duration of Symptoms (months)"] });
        if (patient.Gender === "Female") {
            femalePatients.push({ age: patient.Age, gender: patient.Gender, duration: patient["Duration of Symptoms (months)"] });
        } else {
            malePatients.push({ age: patient.Age, gender: patient.Gender, duration: patient["Duration of Symptoms (months)"] });
        }
    });
}