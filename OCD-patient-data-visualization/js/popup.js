// Function to create and show the popup
function createPopup(data) {
    // Set the popup title and body
    $('#popup-title').text(data.title);
    $('#popup-body').html(`
        <p><strong>Gender:</strong> ${data.gender}</p>
        <p><strong>Age:</strong> ${data.age}</p>
        <p><strong>Duration:</strong> ${data.duration} months</p>
        <p><strong>Marital Status:</strong> ${data.maritalStatus}</p>
        <p><strong>Family History of OCD:</strong> ${data.familyHistory}</p>
        <p><strong>Depression Diagnosis:</strong> ${data.depressionDiagnosis}</p>
        <p><strong>Anxiety Diagnosis:</strong> ${data.anxietyDiagnosis}</p>
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
