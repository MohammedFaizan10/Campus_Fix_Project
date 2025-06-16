document.getElementById('issueForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const photoInput = document.getElementById('issuePhoto');
    const descriptionInput = document.getElementById('issueDescription');
    const confirmationMessage = document.getElementById('confirmationMessage');

    // Create a report object
    const report = {
        photo: URL.createObjectURL(photoInput.files[0]), // Create a URL for the uploaded image
        description: descriptionInput.value,
        status: 'Pending' // Default status
    };

    // Retrieve existing reports from local storage or initialize an empty array
    const existingReports = JSON.parse(localStorage.getItem('reports')) || [];
    existingReports.push(report); // Add the new report to the array

    // Save updated reports back to local storage
    localStorage.setItem('reports', JSON.stringify(existingReports));

    // Show confirmation message
    confirmationMessage.innerText = 'Report submitted successfully!';
    confirmationMessage.classList.remove('hidden');

    // Reset the form
    photoInput.value = '';
    descriptionInput.value = '';

    // Update the submitted reports display
    displaySubmittedReports(existingReports);
});

// Function to display submitted reports
function displaySubmittedReports(reports) {
    const submittedReportsDiv = document.getElementById('submittedReports');
    submittedReportsDiv.innerHTML = '';

    if (reports.length === 0) {
        submittedReportsDiv.innerHTML = '<p>No reports submitted yet.</p>';
        return;
    }

    reports.forEach((report, index) => {
        const reportDiv = document.createElement('div');
        reportDiv.className = ' report';
        reportDiv.innerHTML = `
            <h3>Issue Report #${index + 1}</h3>
            <img src="${report.photo}" alt="Issue Photo" style="max-width: 100%; height: auto;">
            <p>${report.description}</p>
            <p>Status: <span class="status">${report.status}</span></p>
        `;
        submittedReportsDiv.appendChild(reportDiv);
    });
}

// Load and display reports on page load
window.onload = function () {
    const existingReports = JSON.parse(localStorage.getItem('reports')) || [];
    displaySubmittedReports(existingReports);
};