let isPopupOpen = false; 

function createPopup(data, extraData) {
    // Set the popup title and body
    $('#popup-title').text(data.title);
    let popupBody = `
        <p><strong>Gender:</strong> ${data.gender}</p>
        <p><strong>Age:</strong> ${data.age}</p>
        <p><strong>Duration:</strong> ${data.duration} months</p>
        <p><strong>Marital Status:</strong> ${data.maritalStatus}</p>
        <p><strong>Family History of OCD:</strong> ${data.familyHistory}</p>
        <p><strong>Depression Diagnosis:</strong> ${data.depressionDiagnosis}</p>
        <p><strong>Anxiety Diagnosis:</strong> ${data.anxietyDiagnosis}</p>
    `;

    // Add extra data if provided
    if (extraData) {
        popupBody += `<p><strong>${extraData.label}:</strong> ${extraData.value}</p>`;
    }

    $('#popup-body').html(popupBody);

    // Show the popup
    $('#popup').show();
    isPopupOpen = true; // Set the global variable to true

    // Close button event
    $('.close-button').click(function() {
        closePopup();
    });
}

    $(window).click(function(event) {
    if ($(event.target).hasClass('popup')) {
        closePopup();
    }
    });

    function closePopup() {
        $('#popup').hide();
        isPopupOpen = false; // Update the global variable
    }