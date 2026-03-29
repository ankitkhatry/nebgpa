$(document).ready(function() {
    // Credit hours mapping for Management stream
    const creditHours = {
        // Compulsory Subjects
        'english': { theory: 3, practical: 1 },       // Total 4
        'nepali': { theory: 2.25, practical: 0.75 },  // Total 3
        'math': { theory: 3.75, practical: 1.25 },    // Total 5
        'social': { theory: 3.75, practical: 1.25 },  // Total 5
        
        // Optional Subjects
        'accountancy': { theory: 3.75, practical: 1.25 }, // Total 5
        'economics': { theory: 3.75, practical: 1.25 },   // Total 5
        'business': { theory: 3.75, practical: 1.25 },    // Total 5
        'businessMath': { theory: 3.75, practical: 1.25 }, // Total 5
        'computer': { theory: 2.5, practical: 2.5 },       // Total 5
        'tourism': { theory: 2.5, practical: 2.5 },        // Total 5
        'hotel': { theory: 2.5, practical: 2.5 }           // Total 5
    };

    // Subject names for display
    const subjectNames = {
        'english': 'English',
        'nepali': 'Nepali',
        'math': 'Mathematics',
        'social': 'Social Studies & Life Skills',
        'accountancy': 'Accountancy',
        'economics': 'Economics',
        'business': 'Business Studies',
        'businessMath': 'Business Mathematics',
        'computer': 'Computer Science',
        'tourism': 'Tourism & Mountaineering',
        'hotel': 'Hotel Management'
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

    function gradeClass(grade) {
        return `grade-${grade.toLowerCase().replace('+', 'plus')}`;
    }

    // Calculate final grade based on weighted average
    function calculateFinalGrade(theoryGPA, practicalGPA, theoryCredit, practicalCredit) {
        const totalCredit = theoryCredit + practicalCredit;
        const weightedGPA = (theoryGPA * theoryCredit + practicalGPA * practicalCredit) / totalCredit;
        const roundedGPA = Math.round(weightedGPA * 100) / 100;
        return getGradeFromGPA(roundedGPA);
    }

    // Show error message
    function showError(message) {
        const errorElement = $('#errorMessage');
        errorElement.text(message).fadeIn();
        setTimeout(() => errorElement.fadeOut(), 5000);
    }

    // Update optional subject grade options
    function updateOptionalSubject(optionalNumber, subject) {
        const isPracticalHeavy = ['computer', 'tourism', 'hotel'].includes(subject);
        
        // Update theory options
        const theorySelect = $(`.gpa-select.optional-theory[data-optional="${optionalNumber}"]`);
        theorySelect.empty().append('<option value="">Select Grade</option>');
        
        if (isPracticalHeavy) {
            // 50/50 subjects
            theorySelect.append(`
                <option value="4.0">A+ (45-50)</option>
                <option value="3.6">A (40-45)</option>
                <option value="3.2">B+ (35-40)</option>
                <option value="2.8">B (30-35)</option>
                <option value="2.4">C+ (25-30)</option>
                <option value="2.0">C (20-25)</option>
                <option value="1.6">D (17.5-20)</option>
            `);
        } else {
            // 75/25 subjects
            theorySelect.append(`
                <option value="4.0">A+ (67.5-75)</option>
                <option value="3.6">A (60-67.5)</option>
                <option value="3.2">B+ (52.5-60)</option>
                <option value="2.8">B (45-52.5)</option>
                <option value="2.4">C+ (37.5-45)</option>
                <option value="2.0">C (30-37.5)</option>
                <option value="1.6">D (26.25-30)</option>
            `);
        }
        
        // Update practical options
        const practicalSelect = $(`.gpa-select.optional-practical[data-optional="${optionalNumber}"]`);
        practicalSelect.empty().append('<option value="">Select Grade</option>');
        
        if (isPracticalHeavy) {
            // 50/50 subjects
            practicalSelect.append(`
                <option value="4.0">A+ (45-50)</option>
                <option value="3.6">A (40-45)</option>
                <option value="3.2">B+ (35-40)</option>
                <option value="2.8">B (30-35)</option>
                <option value="2.4">C+ (25-30)</option>
                <option value="2.0">C (20-25)</option>
                <option value="1.6">D (17.5-20)</option>
            `);
        } else {
            // 75/25 subjects
            practicalSelect.append(`
                <option value="4.0">A+ (22.5-25)</option>
                <option value="3.6">A (20-22.5)</option>
                <option value="3.2">B+ (17.5-20)</option>
                <option value="2.8">B (15-17.5)</option>
                <option value="2.4">C+ (12.5-15)</option>
                <option value="2.0">C (10-12.5)</option>
                <option value="1.6">D (8.75-10)</option>
            `);
        }
    }

    // Change Math/Social Studies selection
    $('#mathSocialChoice').change(function() {
        const selected = $(this).val();
        if (selected === 'math') {
            $('#mathSocialTitle').text('Mathematics');
            $('#mathSocialPracticalLabel').text('Internal (25)');
        } else {
            $('#mathSocialTitle').text('Social Studies & Life Skills');
            $('#mathSocialPracticalLabel').text('Practical (25)');
        }
    });

    // Change optional subject selection
    $('.optional-subject').change(function() {
        const optionalNumber = $(this).data('optional');
        const subject = $(this).val();
        updateOptionalSubject(optionalNumber, subject);
    });

    // Validate all grades are selected
    function validateGrades() {
        let isValid = true;
        let emptyFields = [];
        
        // Compulsory subjects
        $('.gpa-select:not(.optional-theory):not(.optional-practical)').each(function() {
            if (!$(this).val()) {
                $(this).addClass('error');
                isValid = false;
                const subject = $(this).closest('.subject-card').find('h3').text();
                if (!emptyFields.includes(subject)) {
                    emptyFields.push(subject);
                }
            } else {
                $(this).removeClass('error');
            }
        });
        
        // Optional subjects
        $('.optional-subject').each(function() {
            const optionalNumber = $(this).data('optional');
            const subject = $(this).val();
            
            if (!subject) {
                isValid = false;
                emptyFields.push(`Optional ${optionalNumber}`);
            } else {
                const theory = $(`.gpa-select.optional-theory[data-optional="${optionalNumber}"]`).val();
                const practical = $(`.gpa-select.optional-practical[data-optional="${optionalNumber}"]`).val();
                
                if (!theory || !practical) {
                    isValid = false;
                    if (!theory) {
                        $(`.gpa-select.optional-theory[data-optional="${optionalNumber}"]`).addClass('error');
                    }
                    if (!practical) {
                        $(`.gpa-select.optional-practical[data-optional="${optionalNumber}"]`).addClass('error');
                    }
                    emptyFields.push(`Optional ${optionalNumber}`);
                } else {
                    $(`.gpa-select[data-optional="${optionalNumber}"]`).removeClass('error');
                }
            }
        });
        
        if (!isValid) {
            showError(`Please complete grades for: ${emptyFields.join(', ')}`);
        }
        
        return isValid;
    }

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

        // Process compulsory subjects
        const compulsorySubjects = ['english', 'nepali'];
        compulsorySubjects.forEach(subject => {
            const theoryGPA = parseFloat($(`.gpa-select.theory[data-subject="${subject}"]`).val());
            const practicalGPA = parseFloat($(`.gpa-select.practical[data-subject="${subject}"]`).val());
            
            const theoryCredit = creditHours[subject].theory;
            const practicalCredit = creditHours[subject].practical;
            
            totalCreditPoints += (theoryGPA * theoryCredit) + (practicalGPA * practicalCredit);
            totalCreditHours += theoryCredit + practicalCredit;

            const finalGrade = calculateFinalGrade(theoryGPA, practicalGPA, theoryCredit, practicalCredit);
            
            marksheetData.push({
                subject: subjectNames[subject],
                theoryGrade: getGradeFromGPA(theoryGPA),
                practicalGrade: getGradeFromGPA(practicalGPA),
                finalGrade: finalGrade,
                creditHours: (theoryCredit + practicalCredit).toFixed(2)
            });
        });

        // Process Math/Social Studies
        const mathSocialChoice = $('#mathSocialChoice').val();
        const mathSocialSubject = mathSocialChoice === 'math' ? 'math' : 'social';
        const mathSocialTheoryGPA = parseFloat($('#mathSocialTheory').val());
        const mathSocialPracticalGPA = parseFloat($('#mathSocialPractical').val());
        
        const mathSocialTheoryCredit = creditHours[mathSocialSubject].theory;
        const mathSocialPracticalCredit = creditHours[mathSocialSubject].practical;
        
        totalCreditPoints += (mathSocialTheoryGPA * mathSocialTheoryCredit) + (mathSocialPracticalGPA * mathSocialPracticalCredit);
        totalCreditHours += mathSocialTheoryCredit + mathSocialPracticalCredit;

        const mathSocialFinalGrade = calculateFinalGrade(mathSocialTheoryGPA, mathSocialPracticalGPA, mathSocialTheoryCredit, mathSocialPracticalCredit);

        marksheetData.push({
            subject: mathSocialChoice === 'math' ? 'Mathematics' : 'Social Studies & Life Skills',
            theoryGrade: getGradeFromGPA(mathSocialTheoryGPA),
            practicalGrade: getGradeFromGPA(mathSocialPracticalGPA),
            finalGrade: mathSocialFinalGrade,
            creditHours: (mathSocialTheoryCredit + mathSocialPracticalCredit).toFixed(2)
        });

        // Process optional subjects
        for (let i = 1; i <= 3; i++) {
            const subject = $(`.optional-subject[data-optional="${i}"]`).val();
            if (!subject) continue;
            
            const theoryGPA = parseFloat($(`.gpa-select.optional-theory[data-optional="${i}"]`).val());
            const practicalGPA = parseFloat($(`.gpa-select.optional-practical[data-optional="${i}"]`).val());
            
            const theoryCredit = creditHours[subject].theory;
            const practicalCredit = creditHours[subject].practical;
            
            totalCreditPoints += (theoryGPA * theoryCredit) + (practicalGPA * practicalCredit);
            totalCreditHours += theoryCredit + practicalCredit;

            const finalGrade = calculateFinalGrade(theoryGPA, practicalGPA, theoryCredit, practicalCredit);
            
            marksheetData.push({
                subject: subjectNames[subject],
                theoryGrade: getGradeFromGPA(theoryGPA),
                practicalGrade: getGradeFromGPA(practicalGPA),
                finalGrade: finalGrade,
                creditHours: (theoryCredit + practicalCredit).toFixed(2)
            });
        }

        // Calculate final GPA
        const finalGPA = totalCreditPoints / totalCreditHours;
        const roundedGPA = Math.round(finalGPA * 100) / 100;
        const finalGradeInfo = getGradeFromGPA(roundedGPA);

        displayResult(studentName, roundedGPA, finalGradeInfo, marksheetData, totalCreditHours);
    }

    // Display results
    function displayResult(studentName, gpa, finalGradeInfo, marksheetData, totalCreditHours) {
        const issueDate = new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        $('#resultTitle').text('NEB Provisional Marksheet');
        $('#sheetStudentName').text(studentName);
        $('#sheetIssueDate').text(issueDate);
        $('#finalGPA').text(gpa.toFixed(2));
        $('#finalGrade').text(finalGradeInfo.grade)
                       .removeClass()
                       .addClass(gradeClass(finalGradeInfo.grade));
        $('#totalCredits').text(totalCreditHours.toFixed(2));

        // Populate marksheet table
        const marksheetBody = $('#marksheetBody');
        marksheetBody.empty();
        
        marksheetData.forEach(subject => {
            marksheetBody.append(`
                <tr>
                    <td>${subject.subject}</td>
                    <td class="${gradeClass(subject.theoryGrade.grade)}">${subject.theoryGrade.grade}</td>
                    <td class="${gradeClass(subject.practicalGrade.grade)}">${subject.practicalGrade.grade}</td>
                    <td class="${gradeClass(subject.finalGrade.grade)}">${subject.finalGrade.grade}</td>
                    <td>${subject.creditHours}</td>
                </tr>
            `);
        });
        
        openResultModal();
    }

    function openResultModal() {
        $('body').addClass('modal-open');
        $('#resultModal').fadeIn();
    }

    function closeResultModal() {
        $('#resultModal').fadeOut(function() {
            $('body').removeClass('modal-open');
        });
    }

    // Close modal when X is clicked
    $('.close-btn').click(function() {
        closeResultModal();
    });

    // Close modal when clicking outside
    $(window).click(function(event) {
        if (event.target.id === 'resultModal') {
            closeResultModal();
        }
    });

    // Print button functionality
    $('#printBtn').click(function() {
        const marksheetHtml = $('#marksheetPaper').prop('outerHTML');
        const printWindow = window.open('', '_blank', 'width=900,height=1200');

        if (!printWindow) {
            showError('Please allow pop-ups to print/save PDF.');
            return;
        }

        const printStyles = `
            <style>
                @page { size: A4 portrait; margin: 10mm; }
                * { box-sizing: border-box; }
                body {
                    margin: 0;
                    font-family: 'Poppins', Arial, sans-serif;
                    color: #111827;
                    background: #fff;
                }
                .print-wrapper {
                    width: 100%;
                    max-width: 190mm;
                    margin: 0 auto;
                    border: 1px solid #111;
                    padding: 8mm;
                    position: relative;
                }
                .print-watermark {
                    position: absolute;
                    top: 45%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-22deg);
                    font-size: 42px;
                    font-weight: 700;
                    color: rgba(0, 0, 0, 0.06);
                    white-space: nowrap;
                    pointer-events: none;
                }
                .result-details { display: block !important; }
                .marksheet-header {
                    text-align: center;
                    border: 1px solid #d1d5db;
                    padding: 8px;
                    margin-bottom: 8px;
                }
                .marksheet-header h3 { margin: 0; font-size: 18px; }
                .marksheet-header p { margin: 4px 0 0; font-size: 13px; }
                .marksheet-meta {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 6px;
                    margin-bottom: 8px;
                }
                .marksheet-meta div {
                    border: 1px solid #d1d5db;
                    padding: 6px;
                    min-height: 44px;
                }
                .marksheet-meta span { display: block; font-size: 10px; color: #4b5563; }
                .marksheet-meta strong { font-size: 12px; }
                .result-summary {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 8px;
                    margin-bottom: 8px;
                }
                .gpa-display, .grade-display, .credit-display {
                    border: 1px solid #d1d5db;
                    text-align: center;
                    padding: 6px;
                }
                .gpa-display span, .grade-display span, .credit-display span {
                    display: block;
                    font-size: 24px;
                    font-weight: 700;
                    line-height: 1.1;
                }
                .gpa-display small, .grade-display small, .credit-display small {
                    font-size: 10px;
                    color: #374151;
                }
                .marksheet-table-container {
                    overflow: visible !important;
                    max-height: none !important;
                }
                .marksheet-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 11px;
                }
                .marksheet-table th,
                .marksheet-table td {
                    border: 1px solid #d1d5db;
                    padding: 5px 6px;
                    text-align: left;
                }
                .marksheet-table th { background: #f3f4f6; }
                .marksheet-table tr { page-break-inside: avoid; }
                .marksheet-note { font-size: 10px; margin: 8px 0; }
                .marksheet-signature-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 14px;
                    margin-top: 14px;
                }
                .signature-box {
                    border-top: 1px dashed #6b7280;
                    padding-top: 8px;
                    text-align: center;
                    font-size: 10px;
                }
                .grade-aplus, .grade-Aplus { color: #166534; font-weight: 700; }
                .grade-a, .grade-A { color: #166534; font-weight: 700; }
                .grade-bplus, .grade-Bplus { color: #1d4ed8; font-weight: 700; }
                .grade-b, .grade-B { color: #1d4ed8; font-weight: 700; }
                .grade-cplus, .grade-Cplus { color: #b45309; font-weight: 700; }
                .grade-c, .grade-C { color: #b45309; font-weight: 700; }
                .grade-d, .grade-D { color: #b91c1c; font-weight: 700; }
                .grade-ng, .grade-NG { color: #6b7280; font-weight: 700; }
            </style>
        `;

        printWindow.document.open();
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>NEB Marksheet (Sample)</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                ${printStyles}
            </head>
            <body>
                <div class="print-wrapper">
                    <div class="print-watermark">SAMPLE / EXAMPLE</div>
                    ${marksheetHtml}
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();

        printWindow.onload = function() {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        };
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

    // Initialize optional subject dropdowns
    $('.optional-subject').trigger('change');
    $('#mathSocialChoice').trigger('change');
});