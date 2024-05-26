// ToDo: 
// bisherige sunburst chart muss zu "Gender" tab zugeordnet werden.
// sunburst Chart in 5 Teile aufteilen für anderen tabs.
// filtered "married","single" und "divorced" muessen zu bar chart umwandeln.
// "family History", "depression" und "anxiety" buttons
// pop-ups: ausgewaehlte bar muss gekenntzeichnet werden
// mousehover
// animation

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


    // Event listeners for toggle switches
    $('#marriedToggle').click(function () {
        marriedClicked = !marriedClicked; // Toggle the state
        singleClicked = false;
        divorcedClicked=false;
        toggleToggleButton($(this), "Married", marriedClicked);
    });
    
    $('#singleToggle').click(function () {
        singleClicked = !singleClicked; // Toggle the state
        marriedClicked = false;
        divorcedClicked=false;
        toggleToggleButton($(this), "Single", singleClicked);
    });
    
    $('#divorcedToggle').click(function () {
        divorcedClicked = !divorcedClicked; // Toggle the state
        singleClicked = false;
        marriedClicked=false;
        toggleToggleButton($(this), "Divorced", divorcedClicked);
    });
    
});



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

function toggleTab(tabId) {
    // Remove active class from all tabs
    $('.tab').removeClass('active');
    // Add active class to the clicked tab
    $('#' + tabId).addClass('active');

    // Clear the content of the section
    $('.toggle-section').html('');

    // Toggle the "Gender" tab based on the clicked tab
    if (tabId === 'obsession' || tabId === 'compulsion') {
        // Deselect the "Gender" tab
        $('#tab-gender').removeClass('active');
    }

    // Show content based on the clicked tab
    if (tabId === 'gender') {
        // Call the drawSunburstChart function and pass the necessary parameters
        drawSunburstChart(stageWidth, stageHeight, $('#chart-container'), 'Married'); // You may adjust the parameters as needed
    } else if (tabId === 'obsession') {
        // Show content for the Obsession Type tab
    } else if (tabId === 'compulsion') {
        // Show content for the Compulsion Type tab
    }
}