// Form submission handler
document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    generateMarksheet();
});

// Generate marksheet function
function generateMarksheet() {
    // Get form values
    const studentData = {
        name: document.getElementById('name').value,
        rollNo: document.getElementById('rollNo').value,
        class: document.getElementById('class').value,
        school: document.getElementById('school').value,
        marks: {
            maths: parseInt(document.getElementById('maths').value),
            science: parseInt(document.getElementById('science').value),
            english: parseInt(document.getElementById('english').value),
            social: parseInt(document.getElementById('social').value),
            hindi: parseInt(document.getElementById('hindi').value),
            computer: parseInt(document.getElementById('computer').value)
        }
    };

    // Validate marks
    for (let subject in studentData.marks) {
        if (studentData.marks[subject] < 0 || studentData.marks[subject] > 100) {
            alert(Please, enter, valid, marks (0-100), $,{subject});
            return;
        }
    }

    // Calculate results
    const results = calculateResults(studentData.marks);
    
    // Generate marksheet HTML
    const marksheetHTML = createMarksheetHTML(studentData, results);
    
    // Display results
    document.querySelector('.marksheet').innerHTML = marksheetHTML;
    document.querySelector('.form-section').classList.add('hidden');
    document.getElementById('resultSection').classList.remove('hidden');
}

// Calculate results function
function calculateResults(marks) {
    const subjects = Object.values(marks);
    const totalMarks = subjects.reduce((sum, mark) => sum + mark, 0);
    const percentage = (totalMarks / (subjects.length * 100)) * 100;
    
    let grade, remarks, status;
    
    if (percentage >= 95) {
        grade = 'A+'; remarks = 'Outstanding!'; status = 'PASS';
    } else if (percentage >= 90) {
        grade = 'A+'; remarks = 'Excellent!'; status = 'PASS';
    } else if (percentage >= 80) {
        grade = 'A'; remarks = 'Very Good!'; status = 'PASS';
    } else if (percentage >= 70) {
        grade = 'B'; remarks = 'Good!'; status = 'PASS';
    } else if (percentage >= 60) {
        grade = 'C'; remarks = 'Average!'; status = 'PASS';
    } else if (percentage >= 50) {
        grade = 'D'; remarks = 'Below Average!'; status = 'PASS';
    } else {
        grade = 'F'; remarks = 'Needs Improvement!'; status = 'FAIL';
    }
    
    return {
        totalMarks,
        percentage: percentage.toFixed(2),
        grade,
        remarks,
        status,
        maxMarks: subjects.length * 100
    };
}

// Create marksheet HTML
function createMarksheetHTML(studentData, results) {
    return `
        <div class="marksheet-header">
            <h2>OFFICIAL MARKSHEET</h2>
            <p>Academic Year 2024-2025</p>
        </div>
        
        <div class="student-info">
            <div class="info-item">
                <strong>Name:</strong> ${studentData.name}
            </div>
            <div class="info-item">
                <strong>Roll No:</strong> ${studentData.rollNo}
            </div>
            <div class="info-item">
                <strong>Section and Class:</strong> ${studentData.class}
            </div>
            <div class="info-item">
                <strong>University/college name:</strong> ${studentData.school}
            </div>
        </div>
        
        <table class="marks-table">
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Marks Obtained</th>
                    <th>Maximum Marks</th>
                    <th>Remarks</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Mathematics</td>
                    <td>${studentData.marks.maths}</td>
                    <td>100</td>
                    <td>${getSubjectRemarks(studentData.marks.maths)}</td>
                </tr>
                <tr>
                    <td>Pakistan Studies/Islamiat</td>
                    <td>${studentData.marks.science}</td>
                    <td>100</td>
                    <td>${getSubjectRemarks(studentData.marks.science)}</td>
                </tr>
                <tr>
                    <td>English</td>
                    <td>${studentData.marks.english}</td>
                    <td>100</td>
                    <td>${getSubjectRemarks(studentData.marks.english)}</td>
                </tr>
                <tr>
                    <td>Physics</td>
                    <td>${studentData.marks.social}</td>
                    <td>100</td>
                    <td>${getSubjectRemarks(studentData.marks.social)}</td>
                </tr>
                <tr>
                    <td>Urdu/Sindhi</td>
                    <td>${studentData.marks.hindi}</td>
                    <td>100</td>
                    <td>${getSubjectRemarks(studentData.marks.hindi)}</td>
                </tr>
                <tr>
                    <td>Chemistry</td>
                    <td>${studentData.marks.computer}</td>
                    <td>100</td>
                    <td>${getSubjectRemarks(studentData.marks.computer)}</td>
                </tr>
            </tbody>
        </table>
        
        <div class="result-summary">
            <h3>Result Summary</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                <div><strong>Total Marks:</strong> ${results.totalMarks}/${results.maxMarks}</div>
                <div><strong>Percentage:</strong> ${results.percentage}%</div>
                <div><strong>Grade:</strong> <span class="grade-${results.grade}">${results.grade}</span></div>
                <div><strong>Remarks:</strong> ${results.remarks}</div>
                <div><strong>Status:</strong> <span style="color: ${results.status === 'PASS' ? '#27ae60' : '#e74c3c'}; font-weight: bold;">${results.status}</span></div>
            </div>
        </div>
        
        <div style="margin-top: 20px; text-align: center; color: #7f8c8d; font-size: 0.9em;">
            <p>Generated on: ${new Date().toLocaleDateString()} | This is a computer generated marksheet</p>
        </div>
    `;
}

// Get subject remarks
function getSubjectRemarks(marks) {
    if (marks >= 90) return 'Excellent';
    if (marks >= 80) return 'Very Good';
    if (marks >= 70) return 'Good';
    if (marks >= 60) return 'Average';
    if (marks >= 50) return 'Below Average';
    return 'Needs Improvement';
}

// Reset form function
function resetForm() {
    document.getElementById('studentForm').reset();
}

// Go back to form function
function goBack() {
    document.getElementById('resultSection').classList.add('hidden');
    document.querySelector('.form-section').classList.remove('hidden');
}

// Print marksheet function
function printMarksheet() {
    window.print();
}

// Add some sample data for testing (optional)
function loadSampleData() {
    document.getElementById('name').value = 'Raj Sharma';
    document.getElementById('rollNo').value = '12A';
    document.getElementById('class').value = '10th B';
    document.getElementById('school').value = 'Delhi Public School';
    document.getElementById('maths').value = '85';
    document.getElementById('science').value = '92';
    document.getElementById('english').value = '78';
    document.getElementById('social').value = '88';
    document.getElementById('hindi').value = '90';
    document.getElementById('computer').value = '95';
}

// Uncomment the line below to load sample data automatically
// window.onload = loadSampleData;//
function updateSubjectName() {
    let sectionValue = document.getElementById("section").value.trim().toLowerCase();
    let label = document.getElementById("subjectLabel");

    // Example: If section is "pre medical", change subject name
    if (sectionValue === "12" || sectionValue === "xii" || sectionValue === "2nd year") {
        label.textContent = "Islamiat:";
    } else {
        label.textContent = "Pakistan Studies:";
    }
}