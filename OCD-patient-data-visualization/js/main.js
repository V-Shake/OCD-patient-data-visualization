let stage;
let stageHeight;
let stageWidth;


$(function () {
    renderer = $('#renderer');
    stageWidth = renderer.width();
    stageHeight = renderer.height();
    preparePatientData(ocdData);
    drawSunburstChart(stageWidth, stageHeight, renderer);

    // Variables to store toggle states
    let marriedClicked = false;
    let singleClicked = false;
    let divorcedClicked = false;

    // Event listeners for buttons
    $('#genderButton').click(function () {
        toggleActiveButton($(this));
    });

    $('#obsessionButton').click(function () {
        toggleActiveButton($(this));
    });

    $('#compulsionButton').click(function () {
        toggleActiveButton($(this));
    });

    // Event listeners for toggle switches
    $('#marriedToggle').click(function () {
        marriedClicked = !marriedClicked; // Toggle the state
        console.log("Married clicked:", marriedClicked); // Add this line
        toggleToggleButton($(this), "Married", marriedClicked);
    });
    
    $('#singleToggle').click(function () {
        singleClicked = !singleClicked; // Toggle the state
        console.log("Single clicked:", singleClicked); // Add this line
        toggleToggleButton($(this), "Single", singleClicked);
    });
    
    $('#divorcedToggle').click(function () {
        divorcedClicked = !divorcedClicked; // Toggle the state
        console.log("Divorced clicked:", divorcedClicked); // Add this line
        toggleToggleButton($(this), "Divorced", divorcedClicked);
    });
    
    
});

function toggleActiveButton(button) {
    $('.button').removeClass('active');
    button.addClass('active');
    // Call the appropriate function based on the active button
    if (button.attr('id') === 'genderButton') {
        // Call function to filter by gender
    } else if (button.attr('id') === 'obsessionButton') {
        // Call function to filter by obsession type
    } else if (button.attr('id') === 'compulsionButton') {
        // Call function to filter by compulsion type
    }
}

function toggleToggleButton(toggle, maritalStatus, clicked) {
    console.log("Toggle:", toggle.attr('id'), "Clicked:", clicked); // Add this line
    // Remove active class from other toggles if current toggle is clicked
    if (clicked) {
        $('.toggle').not(toggle).removeClass('active');
    }
    toggle.toggleClass('active');
    if (clicked) {
        filterData(maritalStatus);
    } else {
        filterData(); // Filter with no marital status
    }
}


function filterData(maritalStatus) {
    const isFiltered = $('.bar.' + maritalStatus).length > 0;

    // Remove existing bars
    $('.bar').remove();
    $('.dot').remove();
    $('.marital-dot').remove();
    
    // Toggle the filtered chart
    if (!isFiltered) {
        drawSunburstChart(stageWidth, stageHeight, renderer, maritalStatus);
    } else {
        drawSunburstChart(stageWidth, stageHeight, renderer);
    }
}
