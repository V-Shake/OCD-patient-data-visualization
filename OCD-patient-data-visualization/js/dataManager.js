let femalePatients = [];
let malePatients = [];
let ocdData = [];
let minDuration, maxDuration;

function preparePatientData(ocdData) {
    minDuration = Infinity;
    maxDuration = 0;

    const harmRelatedPatients = [];
    const contaminationPatients = [];
    const symmetryPatients = [];
    const hoardingPatients = [];
    const religiousPatients = [];

    ocdData.forEach(patient => {
        let duration = patient["Duration of Symptoms (months)"];
        minDuration = Math.min(minDuration, duration);
        maxDuration = Math.max(maxDuration, duration);

        const maritalStatus = patient["Marital Status"];
        let familyHistory = patient["Family History of OCD"];
        const depressionDiagnosis = patient["Depression Diagnosis"];
        const anxietyDiagnosis = patient["Anxiety Diagnosis"];
        const compulsionType = patient["Compulsion Type"];
        const obsessionType = patient["Obsession Type"];
        const y_bocs_obsession = patient["Y-BOCS Score (Obsessions)"];

        const patientEntry = {
            age: patient.Age,
            gender: patient.Gender,
            duration,
            maritalStatus,
            familyHistory,
            depressionDiagnosis,
            anxietyDiagnosis,
            compulsionType,
            obsessionType,
            y_bocs_obsession
        };

        ocdData.push(patientEntry);

        if (patient.Gender === "Female") {
            femalePatients.push(patientEntry);
        } else {
            malePatients.push(patientEntry);
        }

        // Add to the appropriate obsession type list
        switch (obsessionType) {
            case "Harm-related":
                harmRelatedPatients.push(patientEntry);
                break;
            case "Contamination":
                contaminationPatients.push(patientEntry);
                break;
            case "Symmetry":
                symmetryPatients.push(patientEntry);
                break;
            case "Hoarding":
                hoardingPatients.push(patientEntry);
                break;
            case "Religious":
                religiousPatients.push(patientEntry);
                break;
        }
    });

    gmynd.sortData(ocdData, 'duration');
    gmynd.sortData(femalePatients, 'duration');
    gmynd.sortData(malePatients, 'duration');
    gmynd.sortData(harmRelatedPatients, 'duration');
    gmynd.sortData(contaminationPatients, 'duration');
    gmynd.sortData(symmetryPatients, 'duration');
    gmynd.sortData(hoardingPatients, 'duration');
    gmynd.sortData(religiousPatients, 'duration');

    return {
        minDuration,
        maxDuration,
        patientData: ocdData,
        femalePatients,
        malePatients,
        harmRelatedPatients,
        contaminationPatients,
        symmetryPatients,
        hoardingPatients,
        religiousPatients
    };
}
