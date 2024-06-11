let stage;
let stageHeight;
let stageWidth;

/**
 * TODO
 * extract binary sunburst chart
 * update graph by switching graph
 * implement familiy history etc.
 * marital bar chart spacing, extract
 */

$(function () {
    renderer = $('#renderer');
    stageWidth = renderer.width();
    stageHeight = renderer.height();
    preparePatientData(ocdData);
    colors_gender = [
        [[252, 210, 211],[224, 115, 115],[85, 20, 24]],
        [[213, 222, 255],[125, 158, 235],[21, 37, 94]]
    ];
    tag_gender = [
        "gender",
        ["Female","Male"]
    ]
    colors_obsession = [
        [[255, 155, 129],[203, 66, 30],[140, 29, 1]],
        [[251, 229, 193],[245, 203, 126],[231, 165, 27]],
        [[194, 247, 202],[132, 199, 143],[121, 170, 129]],
        [[200, 224, 232],[64, 156, 196],[32, 117, 149]],
        [[111, 112, 190],[62, 63, 130],[22, 23, 59]]
    ];
    tag_obsession = [
        "obsessionType",
        ["Harm-related","Hoarding","Symmetry","Religious","Contamination"]
    ]
    colors_compulsion = [
        [[205, 223, 234],[178, 207, 226],[151, 190, 214]],
        [[249, 225, 220],[245, 211, 202],[247, 196, 179]],
        [[221, 216, 232],[202, 193, 221],[182, 170, 207]],
        [[232, 216, 216],[198, 164, 163],[167, 133, 136]],
        [[172, 212, 210],[139, 191, 189],[130, 184, 184]]
    ];
    tag_compulsion = [
        "compulsionType",
        ["Washing","Checking","Praying","Counting","Ordering"]
    ]
    drawSunburstChart(stageWidth, stageHeight, renderer,tag_gender[0],tag_gender[1],colors_gender);

    // Initialize the tabs
    $('#tab-gender').addClass('active');
    showSection('gender-section');
    
    let id = $('#tab-gender').attr('id').split('-')[1] + '-section';

    // hidw other toggles
    hideObsessionToggle();
    hideCompulsionToggle();

    // Variables to store toggle states
    let marriedClicked = false;
    let singleClicked = false;
    let divorcedClicked = false;

    // Event listeners for toggle switches
    $('#marriedToggle').click(function () {
        marriedClicked = !marriedClicked;
        singleClicked = false;
        divorcedClicked = false;
        toggleMaritalButton($(this), "Married", marriedClicked);
    });
    
    $('#singleToggle').click(function () {
        singleClicked = !singleClicked;
        marriedClicked = false;
        divorcedClicked = false;
        toggleMaritalButton($(this), "Single", singleClicked);
    });
    
    $('#divorcedToggle').click(function () {
        divorcedClicked = !divorcedClicked;
        singleClicked = false;
        marriedClicked = false;
        toggleMaritalButton($(this), "Divorced", divorcedClicked);
    });

    // Variables to store toggle states
    let familyHistoryClicked = false;
    let depressionDiagnosisClicked = false;
    let anxietyDiagnosisClicked = false;

    // Event listeners for toggle switches
    $('#familyHistoryButton').click(function () {
        familyHistoryClicked = !familyHistoryClicked;
        depressionDiagnosisClicked = false;
        anxietyDiagnosisClicked = false;
        toggleToggleButton($(this), "familyHistory", familyHistoryClicked, id);
    });
    
    $('#depressionButton').click(function () {
        depressionDiagnosisClicked = !depressionDiagnosisClicked;
        familyHistoryClicked = false;
        anxietyDiagnosisClicked = false;
        toggleToggleButton($(this), "depression", depressionDiagnosisClicked, id);
    });
    
    $('#anxietyButton').click(function () {
        anxietyDiagnosisClicked = !anxietyDiagnosisClicked;
        familyHistoryClicked = false;
        depressionDiagnosisClicked = false;
        toggleToggleButton($(this), "anxiety", anxietyDiagnosisClicked, id);
    });

    // Event listeners for tabs
    $('#tab-gender, #tab-obsession, #tab-compulsion').click(function () {
        id = $(this).attr('id').split('-')[1] + '-section';
        handleTabClick(id);
    });
});

function toggleToggleButton(thisButton, status, clicked, sectionId) {
    if (clicked) {
        $('.button').not(thisButton).removeClass('active');
    }
    thisButton.toggleClass('active');
    if (clicked) {
        switch (sectionId) {
            case 'gender-section':
                drawSunburstChart(stageWidth, stageHeight, renderer,tag_gender[0],tag_gender[1],colors_gender,status);
                break;
            case 'obsession-section':
                drawSunburstChart(stageWidth, stageHeight, renderer,tag_obsession[0],tag_obsession[1],colors_obsession,status);
                break;
            case 'compulsion-section':
                drawSunburstChart(stageWidth, stageHeight, renderer,tag_obsession[0],tag_obsession[1],colors_compulsion,status);
                break;    
            default:
                console.log("unexpected output");
                break;
        }
    } else {
        switch (sectionId) {
            case 'gender-section':
                drawSunburstChart(stageWidth, stageHeight, renderer,tag_gender[0],tag_gender[1],colors_gender);
                break;
            case 'obsession-section':
                drawSunburstChart(stageWidth, stageHeight, renderer,tag_obsession[0],tag_obsession[1],colors_obsession);
                break;
            case 'compulsion-section':
                drawSunburstChart(stageWidth, stageHeight, renderer,tag_obsession[0],tag_obsession[1],colors_compulsion);
                break;    
            default:
                console.log("unexpected output");
                break;
        }
    }
}

function toggleMaritalButton(toggle, maritalStatus, clicked) {
    if (clicked) {
        $('.toggle').not(toggle).removeClass('active');
    }
    toggle.toggleClass('active');
    if (clicked) {
        drawBarChart(stageWidth, stageHeight, renderer, maritalStatus);
    } else {
        drawSunburstChart(stageWidth, stageHeight, renderer,tag_gender[0],tag_gender[1],colors_gender);
    }
}

function clean() {
    // Remove existing bars
    $('.bar').remove();
    $('.dot').remove();
    $('.marital-dot').remove();
}


function handleTabClick(sectionId) {
    // Remove active class from all tabs
    $('.tab').removeClass('active');
    // Add active class to the clicked tab
    $('#tab-' + sectionId.split('-')[0]).addClass('active');
    // Show the corresponding section
    showSection(sectionId);


    switch (sectionId) {
        case 'gender-section':
            drawSunburstChart(stageWidth, stageHeight, renderer,tag_gender[0],tag_gender[1],colors_gender);
            hideObsessionToggle();
            hideCompulsionToggle();
            revealMaritalToggle();
            break;
        case 'obsession-section':
            drawSunburstChart(stageWidth, stageHeight, renderer,tag_obsession[0],tag_obsession[1],colors_obsession);
            hideMaritalToggle();
            hideCompulsionToggle();
            revealObsessionToggle();
            break;
        case 'compulsion-section':
            drawSunburstChart(stageWidth, stageHeight, renderer,tag_compulsion[0],tag_compulsion[1],colors_compulsion);
            hideMaritalToggle();
            hideObsessionToggle();
            revealCompulsionToggle();
            break;    
        default:
            console.log("unexpected output");
            break;
    }


    
    // if (sectionId === 'gender-section') {
    //     drawSunburstChart(stageWidth, stageHeight, renderer,tag_gender[0],tag_gender[1],colors_gender);
    // } else if (sectionId === 'obsession-section') {
    //     drawSunburstChart(stageWidth, stageHeight, renderer,tag_obsession[0],tag_obsession[1],colors_obsession);
    // } else if (sectionId === 'compulsion-section') {
    //     drawSunburstChart(stageWidth, stageHeight, renderer,tag_obsession[0],tag_obsession[1],colors_compulsion);
    // }
        
}
function revealMaritalToggle() {
    const marriedToggle = document.getElementById('marriedToggle');
    const singleToggle = document.getElementById('singleToggle');
    const divorcedToggle = document.getElementById('divorcedToggle');
    marriedToggle.classList.remove('hidden');
    singleToggle.classList.remove('hidden');
    divorcedToggle.classList.remove('hidden');
}

function revealObsessionToggle() {
    const harmRelatedToggle = document.getElementById('harm-relatedToggle');
    const hoardingToggle = document.getElementById('hoardingToggle');
    const symmetryToggle = document.getElementById('symmetryToggle');
    const religiousToggle = document.getElementById('religiousToggle');
    const contaminationToggle = document.getElementById('contaminationToggle');
    harmRelatedToggle.classList.remove('hidden');
    hoardingToggle.classList.remove('hidden');
    symmetryToggle.classList.remove('hidden');
    religiousToggle.classList.remove('hidden');
    contaminationToggle.classList.remove('hidden');
}

function revealCompulsionToggle() {
    const checkingToggle = document.getElementById('checkingToggle');
    const washingToggle = document.getElementById('washingToggle');
    const orderingToggle = document.getElementById('orderingToggle');
    const prayingToggle = document.getElementById('prayingToggle');
    const countingToggle = document.getElementById('countingToggle');
    checkingToggle.classList.remove('hidden');
    washingToggle.classList.remove('hidden');
    orderingToggle.classList.remove('hidden');
    prayingToggle.classList.remove('hidden');
    countingToggle.classList.remove('hidden');
}
function hideMaritalToggle() {
    const marriedToggle = document.getElementById('marriedToggle');
    const singleToggle = document.getElementById('singleToggle');
    const divorcedToggle = document.getElementById('divorcedToggle');
    marriedToggle.classList.add('hidden');
    singleToggle.classList.add('hidden');
    divorcedToggle.classList.add('hidden');
}

function hideObsessionToggle() {
    const harmRelatedToggle = document.getElementById('harm-relatedToggle');
    const hoardingToggle = document.getElementById('hoardingToggle');
    const symmetryToggle = document.getElementById('symmetryToggle');
    const religiousToggle = document.getElementById('religiousToggle');
    const contaminationToggle = document.getElementById('contaminationToggle');
    harmRelatedToggle.classList.add('hidden');
    hoardingToggle.classList.add('hidden');
    symmetryToggle.classList.add('hidden');
    religiousToggle.classList.add('hidden');
    contaminationToggle.classList.add('hidden');
}

function hideCompulsionToggle() {
    const checkingToggle = document.getElementById('checkingToggle');
    const washingToggle = document.getElementById('washingToggle');
    const orderingToggle = document.getElementById('orderingToggle');
    const prayingToggle = document.getElementById('prayingToggle');
    const countingToggle = document.getElementById('countingToggle');
    checkingToggle.classList.add('hidden');
    washingToggle.classList.add('hidden');
    orderingToggle.classList.add('hidden');
    prayingToggle.classList.add('hidden');
    countingToggle.classList.add('hidden');
}

function showSection(sectionId) {
    // Hide all sections
    $('.toggle-section').hide();
    // Show the selected section
    $('#' + sectionId).show();
}


