$(document).ready(function() {
    // Updated Credit hours mapping with precise values
    const creditHours = {
        'english': { theory: 3, practical: 1 },       // Total 4
        'nepali': { theory: 2.25, practical: 0.75 },  // Total 3
        'physics': { theory: 3.75, practical: 1.25 }, // Total 5
        'chemistry': { theory: 3.75, practical: 1.25 }, // Total 5
        'math': { theory: 3.75, practical: 1.25 },    // Total 5
        'computer': { theory: 2.5, practical: 2.5 },   // Total 5 (CS)
        'biology': { theory: 3.75, practical: 1.25 }   // Total 5 (Bio)
    };

    // Grade to GPA mapping (NG after D)
    const gradeToGPA = {
        'A+': 4.0,
        'A': 3.6,
        'B+': 3.2,
        'B': 2.8,
        'C+': 2.4,
        'C': 2.0,
        'D+': 1.8,
        'D': 1.6,
        'NG': 0.0  // Non-Graded
    };

    // Convert GPA to letter grade with NG
    function getGradeFromGPA(gpa) {
        if (gpa > 3.6 && gpa <= 4.0) return { grade: 'A+', gpa: 4.0 };
        if (gpa > 3.2 && gpa <= 3.6) return { grade: 'A', gpa: 3.6 };
        if (gpa > 2.8 && gpa <= 3.2) return { grade: 'B+', gpa: 3.2 };
        if (gpa > 2.4 && gpa <= 2.8) return { grade: 'B', gpa: 2.8 };
        if (gpa > 2.0 && gpa <= 2.4) return { grade: 'C+', gpa: 2.4 };
        if (gpa > 1.6 && gpa <= 2.0) return { grade: 'C', gpa: 2.0 };
        if (gpa > 0.0 && gpa <= 1.6) return { grade: 'D', gpa: 1.6 };
        return { grade: 'NG', gpa: 0.0 }; // Non-Graded
    }

    // Calculate final grade based on weighted average
    function calculateFinalGrade(theoryGPA, practicalGPA, theoryCredit, practicalCredit) {
        const totalCredit = theoryCredit + practicalCredit;
        const weightedGPA = (theoryGPA * theoryCredit + practicalGPA * practicalCredit) / totalCredit;
        const roundedGPA = Math.round(weightedGPA * 100) / 100;
        return getGradeFromGPA(roundedGPA);
    }

    // Format subject name
    function formatSubjectName(subject) {
        const names = {
            'english': 'English',
            'nepali': 'Nepali',
            'physics': 'Physics',
            'chemistry': 'Chemistry',
            'math': 'Mathematics',
            'computer': 'Computer Science',
            'biology': 'Biology'
        };
        return names[subject] || subject;
    }

    // Show error message
    function showError(message) {
        const errorElement = $('#errorMessage');
        errorElement.text(message).fadeIn();
        setTimeout(() => errorElement.fadeOut(), 5000);
    }

    // Validate all grades are selected
    function validateGrades() {
        let isValid = true;
        $('.gpa-select').removeClass('error');
        
        $('.gpa-select').each(function() {
            if (!$(this).val()) {
                $(this).addClass('error');
                isValid = false;
            }
        });
        
        return isValid;
    }

    // Change optional subject when selection changes
    $('#optionalSubject').change(function() {
        const selectedSubject = $(this).val();
        if (selectedSubject === 'computer') {
            $('#optionalSubjectTitle').text('Computer Science');
            $('#optionalTheoryLabel').text('Theory (50)');
            $('#optionalPracticalLabel').text('Practical (50)');
            
            // Computer Science (50/50 split)
            $('#optionalTheorySelect').html(`
                <option value="">Select Grade</option>
                <option value="4.0">A+ (45-50)</option>
                <option value="3.6">A (40-45)</option>
                <option value="3.2">B+ (35-40)</option>
                <option value="2.8">B (30-35)</option>
                <option value="2.4">C+ (25-30)</option>
                <option value="2.0">C (20-25)</option>
                <option value="1.6">D (17.5-20)</option>
            `);
            
            $('#optionalPracticalSelect').html(`
                <option value="">Select Grade</option>
                <option value="4.0">A+ (45-50)</option>
                <option value="3.6">A (40-45)</option>
                <option value="3.2">B+ (35-40)</option>
                <option value="2.8">B (30-35)</option>
                <option value="2.4">C+ (25-30)</option>
                <option value="2.0">C (20-25)</option>
                <option value="1.6">D (17.5-20)</option>
            `);
        } else {
            $('#optionalSubjectTitle').text('Biology');
            $('#optionalTheoryLabel').text('Theory (75)');
            $('#optionalPracticalLabel').text('Practical (25)');
            
            // Biology (75/25 split) - Corrected ranges
            $('#optionalTheorySelect').html(`
                <option value="">Select Grade</option>
                <option value="4.0">A+ (67.5-75)</option>
                <option value="3.6">A (60-67.5)</option>
                <option value="3.2">B+ (52.5-60)</option>
                <option value="2.8">B (45-52.5)</option>
                <option value="2.4">C+ (37.5-45)</option>
                <option value="2.0">C (30-37.5)</option>
                <option value="1.6">D (26.25-30)</option>
            `);
            
            $('#optionalPracticalSelect').html(`
                <option value="">Select Grade</option>
                <option value="4.0">A+ (22.5-25)</option>
                <option value="3.6">A (20-22.5)</option>
                <option value="3.2">B+ (17.5-20)</option>
                <option value="2.8">B (15-17.5)</option>
                <option value="2.4">C+ (12.5-15)</option>
                <option value="2.0">C (10-12.5)</option>
                <option value="1.6">D (8.75-10)</option>
            `);
        }
    });

    // Calculate GPA when button is clicked
    $('#calculateBtn').click(function() {
        // Validate student name
        const studentName = $('#studentName').val().trim();
        if (!studentName) {
            showError('Please enter your name');
            $('#studentName').focus();
            return;
        }

        // Validate all grades are selected
        if (!validateGrades()) {
            showError('Please select grades for all subjects');
            $('.gpa-select.error').first().focus();
            return;
        }

        // Calculate GPA
        calculateGPA(studentName);
    });

    // Main GPA calculation function
    function calculateGPA(studentName) {
        let totalCreditPoints = 0;
        let totalCreditHours = 0;
        const marksheetData = [];

        // Process core subjects
        const subjects = ['english', 'nepali', 'physics', 'chemistry', 'math'];
        subjects.forEach(subject => {
            const theoryGPA = parseFloat($(`.gpa-select.theory[data-subject="${subject}"]`).val());
            const practicalGPA = parseFloat($(`.gpa-select.practical[data-subject="${subject}"]`).val());
            
            const theoryCredit = creditHours[subject].theory;
            const practicalCredit = creditHours[subject].practical;
            
            totalCreditPoints += (theoryGPA * theoryCredit) + (practicalGPA * practicalCredit);
            totalCreditHours += theoryCredit + practicalCredit;

            const finalGrade = calculateFinalGrade(theoryGPA, practicalGPA, theoryCredit, practicalCredit);
            
            marksheetData.push({
                subject: formatSubjectName(subject),
                theoryGrade: getGradeFromGPA(theoryGPA),
                practicalGrade: getGradeFromGPA(practicalGPA),
                finalGrade: finalGrade,
                creditHours: (theoryCredit + practicalCredit).toFixed(2)
            });
        });

        // Process optional subject
        const optionalSubject = $('#optionalSubject').val();
        const optionalTheoryGPA = parseFloat($(`.gpa-select.theory[data-subject="optional"]`).val());
        const optionalPracticalGPA = parseFloat($(`.gpa-select.practical[data-subject="optional"]`).val());
        
        const optionalTheoryCredit = creditHours[optionalSubject].theory;
        const optionalPracticalCredit = creditHours[optionalSubject].practical;
        
        totalCreditPoints += (optionalTheoryGPA * optionalTheoryCredit) + (optionalPracticalGPA * optionalPracticalCredit);
        totalCreditHours += optionalTheoryCredit + optionalPracticalCredit;

        const optionalFinalGrade = calculateFinalGrade(optionalTheoryGPA, optionalPracticalGPA, optionalTheoryCredit, optionalPracticalCredit);

        marksheetData.push({
            subject: $('#optionalSubjectTitle').text(),
            theoryGrade: getGradeFromGPA(optionalTheoryGPA),
            practicalGrade: getGradeFromGPA(optionalPracticalGPA),
            finalGrade: optionalFinalGrade,
            creditHours: (optionalTheoryCredit + optionalPracticalCredit).toFixed(2)
        });

        // Calculate final GPA
        const finalGPA = totalCreditPoints / totalCreditHours;
        const roundedGPA = Math.round(finalGPA * 100) / 100;
        const finalGradeInfo = getGradeFromGPA(roundedGPA);

        displayResult(studentName, roundedGPA, finalGradeInfo, marksheetData, totalCreditHours);
    }

    // Display results
    function displayResult(studentName, gpa, finalGradeInfo, marksheetData, totalCreditHours) {
        $('#resultTitle').text(`${studentName}'s NEB +2 Result`);
        $('#finalGPA').text(gpa.toFixed(2));
        $('#finalGrade').text(finalGradeInfo.grade)
                       .removeClass()
                       .addClass(`grade-${finalGradeInfo.grade.toLowerCase()}`);
        $('#totalCredits').text(totalCreditHours.toFixed(2));

        // Populate marksheet table
        const marksheetBody = $('#marksheetBody');
        marksheetBody.empty();
        
        marksheetData.forEach(subject => {
            marksheetBody.append(`
                <tr>
                    <td>${subject.subject}</td>
                    <td class="grade-${subject.theoryGrade.grade.toLowerCase()}">${subject.theoryGrade.grade}</td>
                    <td class="grade-${subject.practicalGrade.grade.toLowerCase()}">${subject.practicalGrade.grade}</td>
                    <td class="grade-${subject.finalGrade.grade.toLowerCase()}">${subject.finalGrade.grade}</td>
                    <td>${subject.creditHours}</td>
                </tr>
            `);
        });
        
        $('#resultModal').fadeIn();
    }

    // Close modal when X is clicked
    $('.close-btn').click(function() {
        $('#resultModal').fadeOut();
    });

    // Close modal when clicking outside
    $(window).click(function(event) {
        if (event.target.id === 'resultModal') {
            $('#resultModal').fadeOut();
        }
    });

    // Print button functionality
    $('#printBtn').click(function() {
        const printContent = $('.modal-content').clone();
        const originalContent = $('body').html();
        
        $('body').empty().append(printContent);
        window.print();
        $('body').html(originalContent);
        $('#resultModal').show();
    });

    // Initialize subject cards animation
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $(entry.target).addClass('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    $('.subject-card').each(function() {
        observer.observe(this);
    });

    // Initialize optional subject dropdown
    $('#optionalSubject').trigger('change');
});