// Function to create and show the popup
function createPopup(patientData) {
    // Set the popup title and body
    $('#popup-title').text(patientData.title);
    $('#popup-body').html(`
        <p><strong>Gender:</strong> ${patientData.gender}</p>
        <p><strong>Age:</strong> ${patientData.age}</p>
        <p><strong>Duration:</strong> ${patientData.duration} months</p>
        <p><strong>Marital Status:</strong> ${patientData.maritalStatus}</p>
        <p><strong>Family History of OCD:</strong> ${patientData.familyHistory}</p>
        <p><strong>Depression Diagnosis:</strong> ${patientData.depressionDiagnosis}</p>
        <p><strong>Anxiety Diagnosis:</strong> ${patientData.anxietyDiagnosis}</p>
        <p>${patientData.details}</p>
    `);

    // Show the popup
    $('#popup').show();

    // Close button event
    $('.close-button').click(function() {
        $('#popup').hide();
    });
   
}

// Event to close the popup when clicking outside of it
$(window).click(function(event) {
    if ($(event.target).hasClass('popup')) {
        $('#popup').hide();
    }
});
