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
    drawSunburstChart(stageWidth, stageHeight, renderer,tag_gender[0],tag_gender[1],colors_gender);

    // Initialize the tabs
    $('#tab-gender').addClass('active');
    showSection('gender-section');
    

    // Variables to store toggle states
    let marriedClicked = false;
    let singleClicked = false;
    let divorcedClicked = false;

    // Event listeners for toggle switches
    $('#marriedToggle').click(function () {
        marriedClicked = !marriedClicked;
        singleClicked = false;
        divorcedClicked = false;
        toggleToggleButton($(this), "Married", marriedClicked);
    });
    
    $('#singleToggle').click(function () {
        singleClicked = !singleClicked;
        marriedClicked = false;
        divorcedClicked = false;
        toggleToggleButton($(this), "Single", singleClicked);
    });
    
    $('#divorcedToggle').click(function () {
        divorcedClicked = !divorcedClicked;
        singleClicked = false;
        marriedClicked = false;
        toggleToggleButton($(this), "Divorced", divorcedClicked);
    });

    // Event listeners for tabs
    $('#tab-gender, #tab-obsession, #tab-compulsion').click(function () {
        let id = $(this).attr('id').split('-')[1] + '-section';
        handleTabClick(id);
    });
});

function toggleToggleButton(toggle, maritalStatus, clicked) {
    if (clicked) {
        $('.toggle').not(toggle).removeClass('active');
    }
    toggle.toggleClass('active');
    if (clicked) {
        filterData(maritalStatus);
    } else {
        filterData();
    }
}



function handleTabClick(sectionId) {
    // Remove active class from all tabs
    $('.tab').removeClass('active');
    // Add active class to the clicked tab
    $('#tab-' + sectionId.split('-')[0]).addClass('active');
    // Show the corresponding section
    showSection(sectionId);


    if (sectionId === 'gender-section') {
        drawSunburstChart(stageWidth, stageHeight, renderer,tag_gender[0],tag_gender[1],colors_gender);
    } else if (sectionId === 'obsession-section') {
        drawObsessionChart(stageWidth, stageHeight, renderer);
    } else if (sectionId === 'compulsion-section') {
        // Call the function to draw the compulsion chart (assumed to exist)
        drawCompulsionChart(stageWidth, stageHeight, renderer);
    }
        
}

function showSection(sectionId) {
    // Hide all sections
    $('.toggle-section').hide();
    // Show the selected section
    $('#' + sectionId).show();
}


