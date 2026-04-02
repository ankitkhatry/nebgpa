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

    function gradeClass(grade) {
        return `grade-${grade.toLowerCase().replace('+', 'plus')}`;
    }

    let latestMarksheetPayload = null;

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

        latestMarksheetPayload = {
            stream: 'Science',
            studentName,
            issueDate,
            gpa: gpa.toFixed(2),
            finalGrade: finalGradeInfo.grade,
            totalCredits: totalCreditHours.toFixed(2),
            rows: marksheetData.map(subject => ({
                subject: subject.subject,
                theoryGrade: subject.theoryGrade.grade,
                practicalGrade: subject.practicalGrade.grade,
                finalGrade: subject.finalGrade.grade,
                creditHours: subject.creditHours
            }))
        };
        
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

    // Download marksheet as PDF
    function downloadMarksheetPdf() {
        if (!latestMarksheetPayload) {
            showError('Please calculate GPA first.');
            return;
        }

        if (!window.jspdf || !window.jspdf.jsPDF) {
            showError('PDF library not loaded. Please refresh and try again.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        const data = latestMarksheetPayload;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(215, 220, 230);
        doc.setFontSize(28);
        doc.text('PROVISIONAL • NOT OFFICIAL', pageWidth / 2, pageHeight / 2, { align: 'center', angle: -28 });

        doc.setTextColor(23, 37, 84);
        doc.setFontSize(16);
        doc.text('National Examination Board (NEB)', pageWidth / 2, 18, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        doc.setFontSize(11);
        doc.text('Grade 12 - Provisional GPA Marksheet', pageWidth / 2, 24, { align: 'center' });

        doc.setDrawColor(180, 196, 232);
        doc.roundedRect(margin, 30, pageWidth - (margin * 2), 18, 1.5, 1.5);
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text('Student Name', 14, 36);
        doc.text('Stream', 82, 36);
        doc.text('Issued Date', 138, 36);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(17, 24, 39);
        doc.setFontSize(10.5);
        doc.text(String(data.studentName || '-'), 14, 42);
        doc.text(String(data.stream || '-'), 82, 42);
        doc.text(String(data.issueDate || '-'), 138, 42);

        doc.setDrawColor(180, 196, 232);
        doc.roundedRect(margin, 52, pageWidth - (margin * 2), 18, 1.5, 1.5);
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text('GPA', 20, 58);
        doc.text('Grade', 97, 58);
        doc.text('Total Credits', 158, 58, { align: 'center' });

        doc.setTextColor(17, 24, 39);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text(String(data.gpa || '0.00'), 20, 66);
        doc.text(String(data.finalGrade || '-'), 97, 66);
        doc.text(String(data.totalCredits || '0.00'), 158, 66, { align: 'center' });

        const rows = (data.rows || []).map((r) => [
            r.subject || '-',
            r.theoryGrade || '-',
            r.practicalGrade || '-',
            r.finalGrade || '-',
            r.creditHours || '-'
        ]);

        if (typeof doc.autoTable !== 'function') {
            showError('PDF table plugin not loaded. Please refresh and try again.');
            return;
        }

        doc.autoTable({
            startY: 74,
            head: [['Subject', 'Theory Grade', 'Practical Grade', 'Final Grade', 'Credit Hours']],
            body: rows,
            theme: 'grid',
            styles: { fontSize: 9, cellPadding: 2.4, textColor: [31, 41, 55] },
            headStyles: { fillColor: [241, 245, 255], textColor: [31, 47, 85], fontStyle: 'bold' },
            columnStyles: {
                0: { cellWidth: 62 },
                1: { cellWidth: 32, halign: 'center' },
                2: { cellWidth: 34, halign: 'center' },
                3: { cellWidth: 28, halign: 'center' },
                4: { cellWidth: 24, halign: 'center' }
            },
            didParseCell: function (hookData) {
                if (hookData.section !== 'body') return;
                const gradeColumns = [1, 2, 3];
                if (!gradeColumns.includes(hookData.column.index)) return;
                const g = String(hookData.cell.raw || '').toUpperCase();
                if (g === 'A+' || g === 'A') hookData.cell.styles.textColor = [22, 101, 52];
                else if (g === 'B+' || g === 'B') hookData.cell.styles.textColor = [29, 78, 216];
                else if (g === 'C+' || g === 'C') hookData.cell.styles.textColor = [180, 83, 9];
                else if (g === 'D') hookData.cell.styles.textColor = [185, 28, 28];
                else if (g === 'NG') hookData.cell.styles.textColor = [107, 114, 128];
                hookData.cell.styles.fontStyle = 'bold';
            }
        });

        const tableBottomY = doc.lastAutoTable.finalY || 220;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.setFontSize(8.8);
        doc.text(
            'This marksheet is generated using GPA Calculator by Ankit Khatri KC for reference purposes and is not an official NEB result.',
            margin,
            tableBottomY + 8,
            { maxWidth: pageWidth - (margin * 2) }
        );

        const signY = tableBottomY + 18;
        doc.setDrawColor(125, 142, 168);
        doc.line(margin + 5, signY, margin + 65, signY);
        doc.line(pageWidth - margin - 65, signY, pageWidth - margin - 5, signY);
        doc.setFontSize(8.5);
        doc.text('Prepared By', margin + 35, signY + 4, { align: 'center' });
        doc.text('Verified By', pageWidth - margin - 35, signY + 4, { align: 'center' });

        const safeName = String(data.studentName || 'Student').trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'Student';
        doc.save(`NEB-Marksheet-${safeName}.pdf`);
    }

    $('#printBtn').click(function() {
        downloadMarksheetPdf();
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