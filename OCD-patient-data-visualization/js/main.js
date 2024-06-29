let stage;
let stageHeight;
let stageWidth;

/**
 * TODO
 * while hovering over a bar/dot, all elements which belong to the that should turn black (with low opacity)  
 * while clicking on a bar/dot, all elements which belong to that should turn black (100% opacity)
 * hide all buttons (family history etc.) if click on toggles (3 marital toggles, 5 obsession etc.)
 * draw an unvisible line at the bottom of the vertical bar chart, write 0 and 40 on both sides, and write "Y-BOCS Score" between 0 and 40 
 * hide the clicked pop up window, if clicking on any toogles, buttons or tabs
 * add Y-BOCS Score to the pop up, only when clicking on the vertical bar chart
 * draw icons (3 marital dots for marital toggles, 5 smaller filled dots using 5 different colors for obsession and compulsion toggles)
 * auto placing vertical bar chart: 
 * potential optimizing by reducing memory allocation
 */

$(function () {
    renderer = $('#renderer');
    stageWidth = renderer.width();
    stageHeight = renderer.height();
    // preparePatientData(ocdData);
    colors_gender = [
        [[252, 210, 211],[224, 115, 115],[85, 20, 24]],
        [[213, 222, 255],[125, 158, 235],[21, 37, 94]]
    ];
    tag_gender = [
        "Gender",
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
        "Obsession Type",
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
        "Compulsion Type",
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


    let toggleObsessionStates = {
        Harm_related: false,
        Hoarding: false,
        Symmetry: false,
        Religious: false,
        Contamination: false
    };

    // Function to handle the toggle and reset states
    function handleObsessionToggle(colors,selectedToggle) {
        // Reset all toggle states
        for (let key in toggleObsessionStates) {
            if (key != selectedToggle) {
                toggleObsessionStates[key] = false;
            } else {
                toggleObsessionStates[key] = !toggleObsessionStates[key];
            }
        }
        // Update the UI accordingly
        toggleObsessionButton(colors,$(`#${selectedToggle}Toggle`), selectedToggle, toggleObsessionStates[selectedToggle]);
    }
    
        // Event listeners for toggle switches
    $('#Harm_relatedToggle').click(function () {
        handleObsessionToggle(colors_obsession[0],"Harm_related");
    });

    $('#HoardingToggle').click(function () {
        handleObsessionToggle(colors_obsession[1],"Hoarding");
    });

    $('#SymmetryToggle').click(function () {
        handleObsessionToggle(colors_obsession[2],"Symmetry");
    });

    $('#ReligiousToggle').click(function () {
        handleObsessionToggle(colors_obsession[3],"Religious");
    });

    $('#ContaminationToggle').click(function () {
        handleObsessionToggle(colors_obsession[4],"Contamination");
    });
    

    let toggleCompulsionStates = {
        Washing: false,
        Checking: false,
        Praying: false,
        Counting: false,
        Ordering: false
    };

    // Function to handle the toggle and reset states
    function handleCompulsionToggle(colors,selectedToggle) {
        // Reset all toggle states
        for (let key in toggleCompulsionStates) {
            if (key != selectedToggle) {
                toggleCompulsionStates[key] = false;
            } else {
                toggleCompulsionStates[key] = !toggleCompulsionStates[key];
            }
        }
        // Update the UI accordingly
        toggleCompulsionButton(colors,$(`#${selectedToggle}Toggle`), selectedToggle, toggleCompulsionStates[selectedToggle]);
    }
    
        // Event listeners for toggle switches

    $('#WashingToggle').click(function () {
        handleCompulsionToggle(colors_compulsion[0],"Washing");
    });

    $('#CheckingToggle').click(function () {
        handleCompulsionToggle(colors_compulsion[1],"Checking");
    });

    $('#PrayingToggle').click(function () {
        handleCompulsionToggle(colors_compulsion[2],"Praying");
    });

    $('#CountingToggle').click(function () {
        handleCompulsionToggle(colors_compulsion[3],"Counting");
    });
   
    $('#OrderingToggle').click(function () {
        handleCompulsionToggle(colors_compulsion[4],"Ordering");
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
                drawSunburstChart(stageWidth, stageHeight, renderer,tag_compulsion[0],tag_compulsion[1],colors_compulsion,status);
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
                drawSunburstChart(stageWidth, stageHeight, renderer,tag_compulsion[0],tag_compulsion[1],colors_compulsion);
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
        // drawBarChart_o(stageWidth, stageHeight, renderer, maritalStatus);
        drawBars(null,stageWidth, stageHeight, renderer, "maritalStatus", maritalStatus, "horizontal");
    } else {
        drawSunburstChart(stageWidth, stageHeight, renderer,tag_gender[0],tag_gender[1],colors_gender);
    }
}

function toggleObsessionButton(colors,toggleName, obsessionStatus, activated) {
    console.log(`${toggleName.attr('id')} is now ${activated ? 'on' : 'off'}`);
    if (activated) {
        $('.toggle').not(toggleName).removeClass('active');
    }
    toggleName.toggleClass('active');
    if (activated) {
        drawBars(colors,stageWidth, stageHeight, renderer, "Obsession Type", obsessionStatus, "vertical");
    } else {
        drawSunburstChart(stageWidth, stageHeight, renderer,tag_obsession[0],tag_obsession[1],colors_obsession);
    }
}

function toggleCompulsionButton(colors,toggleName, compulsionStatus, activated) {
    console.log(`${toggleName.attr('id')} is now ${activated ? 'on' : 'off'}`);
    if (activated) {
        $('.toggle').not(toggleName).removeClass('active');
    }
    toggleName.toggleClass('active');
    if (activated) {
        drawBars(colors,stageWidth, stageHeight, renderer, "Compulsion Type", compulsionStatus, "vertical");
    } else {
        drawSunburstChart(stageWidth, stageHeight, renderer,tag_compulsion[0],tag_compulsion[1],colors_compulsion);
    }
}

// Define function to handle toggle buttons
function handleToggle(toggleId, category) {
    // Variables to store toggle states
    let toggles = ["checking", "washing", "ordering", "praying", "counting"]; // For obsession type
    let clicked = toggles.map(toggle => toggle === category); // Initialize all toggles to false except the clicked one

    // Event listeners for toggle switches
    $('#' + toggleId).click(function () {
        clicked = toggles.map(toggle => toggle === category);
        toggleButtons($(this), category, clicked);
    });
}

// Function to toggle buttons
function toggleButtons(toggle, category, clicked) {
    clicked = clicked.map((click, index) => index === category);
    if (clicked) {
        $('.toggle').not(toggle).removeClass('active');
    }
    toggle.toggleClass('active');
    if (clicked) {
        // Handle the action for when the button is clicked
        drawHorizontalBarChart(stageWidth, stageHeight, renderer, category);
    } else {
        // Handle the action for when the button is not clicked
        drawSunburstChart(stageWidth, stageHeight, renderer, tag_gender[0], tag_gender[1], colors_gender);
    }
}

// Set up event listeners for obsession type toggles
$('.toggles').each(function() {
    $(this).children('.toggle').each(function(index) {
        handleToggle($(this).attr('id'), index);
    });
});


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
    const harmRelatedToggle = document.getElementById('Harm_relatedToggle');
    const hoardingToggle = document.getElementById('HoardingToggle');
    const symmetryToggle = document.getElementById('SymmetryToggle');
    const religiousToggle = document.getElementById('ReligiousToggle');
    const contaminationToggle = document.getElementById('ContaminationToggle');
    harmRelatedToggle.classList.remove('hidden');
    hoardingToggle.classList.remove('hidden');
    symmetryToggle.classList.remove('hidden');
    religiousToggle.classList.remove('hidden');
    contaminationToggle.classList.remove('hidden');
}

function revealCompulsionToggle() {
    const washingToggle = document.getElementById('WashingToggle');
    const checkingToggle = document.getElementById('CheckingToggle');
    const prayingToggle = document.getElementById('PrayingToggle');
    const countingToggle = document.getElementById('CountingToggle');
    const orderingToggle = document.getElementById('OrderingToggle');
    washingToggle.classList.remove('hidden');
    checkingToggle.classList.remove('hidden');
    prayingToggle.classList.remove('hidden');
    countingToggle.classList.remove('hidden');
    orderingToggle.classList.remove('hidden');
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
    const harmRelatedToggle = document.getElementById('Harm_relatedToggle');
    const hoardingToggle = document.getElementById('HoardingToggle');
    const symmetryToggle = document.getElementById('SymmetryToggle');
    const religiousToggle = document.getElementById('ReligiousToggle');
    const contaminationToggle = document.getElementById('ContaminationToggle');
    harmRelatedToggle.classList.add('hidden');
    hoardingToggle.classList.add('hidden');
    symmetryToggle.classList.add('hidden');
    religiousToggle.classList.add('hidden');
    contaminationToggle.classList.add('hidden');
}

function hideCompulsionToggle() {
    const washingToggle = document.getElementById('WashingToggle');
    const checkingToggle = document.getElementById('CheckingToggle');
    const prayingToggle = document.getElementById('PrayingToggle');
    const countingToggle = document.getElementById('CountingToggle');
    const orderingToggle = document.getElementById('OrderingToggle');
    washingToggle.classList.add('hidden');
    checkingToggle.classList.add('hidden');
    prayingToggle.classList.add('hidden');
    countingToggle.classList.add('hidden');
    orderingToggle.classList.add('hidden');
}

function showSection(sectionId) {
    // Hide all sections
    $('.toggle-section').hide();
    // Show the selected section
    $('#' + sectionId).show();
}


