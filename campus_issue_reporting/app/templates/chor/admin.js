let reports = JSON.parse(localStorage.getItem('reports')) || [];

// Function to render reports
function renderReports(filteredReports) {
    const reportList = document.getElementById('reportList');
    reportList.innerHTML = '';

    if (filteredReports.length === 0) {
        reportList.innerHTML = '<p>No reports found.</p>';
        return;
    }

    filteredReports.forEach((report, index) => {
        const reportDiv = document.createElement('div');
        reportDiv.className = 'report';
        reportDiv.innerHTML = `
            <h3>Issue Report #${index + 1}</h3>
            <p>${report.description}</p>
            <p>Status: <span class="status ${report.status}">${report.status}</span></p>
            <button onclick="viewPhoto('${report.photo}')">View Photo</button>
            <button onclick="updateStatus(${index}, 'In Progress')">Mark as In Progress</button>
            <button onclick="updateStatus(${index}, 'Resolved')">Mark as Resolved</button>
        `;
        reportList.appendChild(reportDiv);
    });
}

// Function to view photo in a new window
// Function to view photo in a new window
function viewPhoto(photoUrl) {
    const photoWindow = window.open("", "_blank");
    photoWindow.document.write(`
        <html>
            <head>
                <title>Issue Photo</title>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f4f4f4;
                    }
                    img {
                        max-width: 90%;
                        max-height: 90%;
                        border: 2px solid #ccc;
                        border-radius: 8px;
                    }
                </style>
            </head>
            <body>
                <img src="${photoUrl}" alt="Issue Photo">
            </body>
        </html>
    `);
    photoWindow.document.close(); // Close the document to render the content
}

// Function to update report status
function updateStatus(index, newStatus) {
    reports[index].status = newStatus;
    localStorage.setItem('reports', JSON.stringify(reports));
    renderReports(reports);
}

// Function to filter reports
function filterReports() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;

    const filteredReports = reports.filter(report => {
        const matchesDescription = report.description.toLowerCase().includes(searchInput);
        const matchesStatus = statusFilter ? report.status === statusFilter : true;
        return matchesDescription && matchesStatus;
    });

    renderReports(filteredReports);
}

// Event listeners
document.getElementById('filterButton').addEventListener('click', filterReports);

// Initial render
renderReports(reports);