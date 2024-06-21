let femalePatients = [];
let malePatients = [];
let patientData = [];
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




        // // change propability of 50% Yes to 5% Yes 
        // if (familyHistory == "Yes") {
        //     if (Math.random() < 0.9) {
        //         familyHistory = "No";
        //     }
        // }

        // // make duration shorter for very old and young people
        // let ageDiff = Math.abs(patient.Age - 50) / 50  // big number for old and young people
        // if (Math.random() < 0.8) {
        //     duration = duration * (1 - ageDiff);
        // }
    



        const patientEntry = {
            age: patient.Age,
            gender: patient.Gender,
            duration,
            maritalStatus,
            familyHistory,
            depressionDiagnosis,
            anxietyDiagnosis,
            compulsionType,
            obsessionType
        };

        patientData.push(patientEntry);

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

    gmynd.sortData(patientData, 'duration');
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
        patientData,
        femalePatients,
        malePatients,
        harmRelatedPatients,
        contaminationPatients,
        symmetryPatients,
        hoardingPatients,
        religiousPatients
    };
}



function filterData(maritalStatus) {
    const isFiltered = $('.bar.' + maritalStatus).length > 0;
    console.log($('.bar.' + maritalStatus).length);
    // Remove existing bars
    $('.bar').remove();
    $('.dot').remove();
    $('.marital-dot').remove();
    
    
    // Toggle the filtered chart
    if (!isFiltered) {
        // if (maritalStatus === "Married") {
        //     drawBarChart(stageWidth, stageHeight, renderer, maritalStatus);
        // } else {
        //     drawSunburstChart(stageWidth, stageHeight, renderer, tag_gender[0],tag_gender[1],colors_gender);
        // }
        drawBarChart(stageWidth, stageHeight, renderer, maritalStatus);
    } else {
        drawSunburstChart(stageWidth, stageHeight, renderer,tag_gender[0],tag_gender[1],colors_gender);
    }

    if (filter.obsessionTypes && filter.obsessionTypes.length > 0) {
        filteredPatients = filteredPatients.filter(patient => {
            // Check if any of the patient's obsession types match the selected types
            return filter.obsessionTypes.some(type => patient.obsessionTypes.includes(type));
        });
    }

    return filteredPatients;
}

function filterByFamilyHistory() {
    const filteredPatients = patientData.filter(patient => patient["Family History of OCD"] === "Yes");
    return filteredPatients;

    
}