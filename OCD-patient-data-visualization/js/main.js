let stage;
let stageHeight;
let stageWidth;

$(function () {
    renderer = $('#renderer');
    stageWidth = renderer.width();
    stageHeight = renderer.height();
    preparePatientData(ocdData);
    drawSunburstChart(stageWidth, stageHeight, renderer);

    // Event listeners for buttons
    $('#marriedButton').click(function () {
        filterData("Married");
    });

    $('#singleButton').click(function () {
        filterData("Single");
    });

    $('#divorcedButton').click(function () {
        filterData("Divorced");
    });
    
})

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
