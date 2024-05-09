let stage;
let stageHeight;
let stageWidth;

$(function () {
    renderer = $('#renderer');
    stageWidth = renderer.width();
    stageHeight = renderer.height();
    preparePatientData(ocdData);
    drawSunburstChart(stageWidth, stageHeight, renderer);
})
