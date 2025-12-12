// PDF Utilities
// Handles loading, filling, and saving the PDF form.
const PdfUtils = {
    BLANK_PDF_URL: 'assets/ESD-job-search-log-251009_0.pdf',

    createFilledPdf: async function (claimWeek) {
        const { PDFDocument } = PDFLib;
        let pdfDoc;
        try {
            // This fetch will now look for the PDF relative to the HTML file
            const existingPdfBytes = await fetch(PdfUtils.BLANK_PDF_URL).then(res => {
                if (!res.ok) throw new Error(`Failed to fetch PDF template (Status: ${res.status}). Make sure 'assets/ESD-job-search-log-251009_0.pdf' is in the correct location.`);
                return res.arrayBuffer();
            });
            pdfDoc = await PDFDocument.load(existingPdfBytes);
        } catch (e) {
            console.error("Error loading PDF template:", e);
            UiUtils.showError("Could not load official PDF. A new one will be created, but it may not be the official form.");
            pdfDoc = await PDFDocument.create();
            pdfDoc.addPage(); // Add a blank page
        }

        const form = pdfDoc.getForm();
        const fillTextField = (name, value) => { try { form.getTextField(name).setText(value || ''); } catch (e) { console.warn(`PDF field not found: ${name}`); } };
        const selectRadio = (name, value) => { try { form.getRadioGroup(name).select(value); } catch (e) { console.warn(`RadioGroup field not found: ${name} (value: ${value})`); } };
        const checkCheckBox = (name) => { try { form.getCheckBox(name).check(); } catch (e) { console.warn(`CheckBox field not found: ${name}`); } };

        // --- Fill General Info (Using names from dump) ---
        fillTextField('job-search-week', claimWeek.weekEnding);
        fillTextField('Jobsearch log for week ending MonthDayYear', claimWeek.name);
        fillTextField('ID or SSN', claimWeek.idOrSsn);
        // Note: Field names appear duplicated in the original code, retained for safety
        fillTextField('Jobsearch log for week ending MonthDayYear', claimWeek.name);
        fillTextField('ID or SSN', claimWeek.idOrSsn);

        // --- Fill Activities (Hardcoded based on dump) ---
        claimWeek.activities.forEach((activity, index) => {
            let activityName = activity.details.activityName || '';
            let documentation = activity.details.documentation || '';
            let officeName = '';

            // Combine dynamic fields into documentation string
            if (activity.category !== 'employer_contact') {
                let extraDetails = [];
                if (activity.details.link) extraDetails.push(`Link: ${activity.details.link}`);
                if (activity.details.workshop_name) extraDetails.push(`Workshop: ${activity.details.workshop_name}`);
                if (activity.details.facilitator_name) extraDetails.push(`Facilitator: ${activity.details.facilitator_name}`);
                if (activity.details.specialist_name) extraDetails.push(`Specialist: ${activity.details.specialist_name}`);
                if (activity.details.event_name) extraDetails.push(`Event: ${activity.details.event_name}`);
                if (activity.details.employer_contact) extraDetails.push(`Employer: ${activity.details.employer_contact}`);
                if (activity.details.course_name) extraDetails.push(`Course: ${activity.details.course_name}`);
                if (activity.details.platform_name) extraDetails.push(`Platform: ${activity.details.platform_name}`);
                // ...etc.

                if (extraDetails.length > 0) {
                    documentation = `${activity.details.documentation} (${extraDetails.join(', ')})`;
                }
                if (activity.proofFile) {
                    documentation += ` [Proof File: ${activity.proofFileName}]`;
                }
            }
            // NOTE THAT THIS PDF HAS NONSTANDARD FIELD NAMING CONVENTIONS - it is messed up. 
            // Field names will be weird and inconsistent, below, but they work

            // --- Column 1 (index 0) ---
            if (index === 0) {
                fillTextField('EMPLOYER CONTACTS AND JOB SEARCH ACTIVITIES', activity.date);

                if (activity.category === 'employer_contact') {
                    selectRadio('Activity', 'employer contact');
                    fillTextField('Job title or job reference number', activity.details.jobTitle);
                    fillTextField('Employer or business name', activity.details.employerName);

                    if (activity.details.contactMethod === 'In-person') checkCheckBox('In-person');
                    if (activity.details.contactMethod === 'Online') checkCheckBox('Online');
                    if (activity.details.contactMethod === 'By phone') checkCheckBox('By phone');
                    if (activity.details.contactMethod === 'By Email') checkCheckBox('By email');
                    if (activity.details.contactMethod === 'By mail') checkCheckBox('By mail');
                    if (activity.details.contactMethod === 'Other') {
                        checkCheckBox('Other');
                        fillTextField('other contact', activity.details.contactMethodOther);
                    }

                    if (activity.details.contactType === 'Application/resume') selectRadio('Type of Contact', 'application resume');
                    if (activity.details.contactType === 'Interview') selectRadio('Type of Contact', 'Interview');
                    if (activity.details.contactType === 'Inquiry') selectRadio('Type of Contact', 'Inquiry');

                    fillTextField('Employer or business contact information', activity.details.address); // nonstandard naming issue in pdf
                    fillTextField('Address', activity.details.addressCity);
                    fillTextField('State', activity.details.addressState);
                    fillTextField('Website or email address', activity.details.websiteEmail);
                    fillTextField('Phone number', activity.details.phone);

                } else if (activity.category.startsWith('worksource_') || activity.category === 'wioa_programs') {
                    selectRadio('Activity', 'Worksource activity');
                    officeName = activity.details.office_name || '';
                    if (activity.category === 'worksource_online') officeName = 'Online';

                    fillTextField('What activity did you complete', activityName);
                    fillTextField('What documentation do you have', documentation);
                    fillTextField('Office name', officeName);
                    fillTextField('City', activity.details.office_city);
                    fillTextField('State_2', activity.details.office_state);

                } else { // All others
                    selectRadio('Activity', 'other activity');
                    fillTextField('What activity did you complete_2', activityName);
                    fillTextField('What documentation do you have_2', documentation);
                }
            }

            // --- Column 2 (index 1) ---
            else if (index === 1) {
                fillTextField('Contact Date MMDDYYYY', activity.date);

                if (activity.category === 'employer_contact') {
                    selectRadio('Activity2', 'employer contract2'); // Name from dump
                    fillTextField('Job title or job reference number_2', activity.details.jobTitle);
                    fillTextField('Employer or business name_2', activity.details.employerName);

                    if (activity.details.contactMethod === 'In-person') checkCheckBox('In-person-2');
                    if (activity.details.contactMethod === 'Online') checkCheckBox('Online-2');
                    if (activity.details.contactMethod === 'By phone') checkCheckBox('By phone-2');
                    if (activity.details.contactMethod === 'By Email') checkCheckBox('By email-2');
                    if (activity.details.contactMethod === 'By mail') checkCheckBox('By mail-2');
                    if (activity.details.contactMethod === 'Other') {
                        checkCheckBox('Other-2');
                        fillTextField('Other contact2', activity.details.contactMethodOther);
                    }

                    if (activity.details.contactType === 'Application/resume') selectRadio('Type of Contact2', 'Application resume2');
                    if (activity.details.contactType === 'Interview') selectRadio('Type of Contact2', 'Interview2');
                    if (activity.details.contactType === 'Inquiry') selectRadio('Type of Contact2', 'Inquiry2');

                    fillTextField('Employer or business contact information_2', activity.details.address);
                    fillTextField('Address_2', activity.details.addressCity);
                    fillTextField('State2', activity.details.addressState);
                    fillTextField('Website or email address2', activity.details.websiteEmail);
                    fillTextField('Phone number2', activity.details.phone);

                } else if (activity.category.startsWith('worksource_') || activity.category === 'wioa_programs') {
                    selectRadio('Activity2', 'Worksource activity2');
                    officeName = activity.details.office_name || '';
                    if (activity.category === 'worksource_online') officeName = 'Online';

                    fillTextField('What activity did you complete_3', activityName);
                    fillTextField('What documentation do you have_3', documentation);
                    fillTextField('Where did you complete this activity_2', officeName); //office name
                    fillTextField('Office name_2', activity.details.office_city); //city
                    fillTextField('State_4', activity.details.office_state); //state

                } else { // All others
                    selectRadio('Activity2', 'other activity2');
                    fillTextField('What activity did you complete_4', activityName);
                    fillTextField('What documentation do you have_4', documentation);
                }
            }

            // --- Column 3 (index 2) ---
            else if (index === 2) {
                fillTextField('Keep this log for your records', activity.date);

                if (activity.category === 'employer_contact') {
                    selectRadio('Activity3', 'Employer contact'); // Name from dump
                    fillTextField('Job title or job reference number_3', activity.details.jobTitle);
                    fillTextField('Employer or business name_3', activity.details.employerName);

                    if (activity.details.contactMethod === 'In-person') checkCheckBox('In-person-3');
                    if (activity.details.contactMethod === 'Online') checkCheckBox('Online-3');
                    if (activity.details.contactMethod === 'By phone') checkCheckBox('By phone-3');
                    if (activity.details.contactMethod === 'By Email') checkCheckBox('By email-3');
                    if (activity.details.contactMethod === 'By mail') checkCheckBox('By mail-3');
                    if (activity.details.contactMethod === 'Other') {
                        checkCheckBox('Other-3');
                        fillTextField('Other contact3', activity.details.contactMethodOther);
                    }

                    if (activity.details.contactType === 'Application/resume') selectRadio('Type of contact3', 'application resume3');
                    if (activity.details.contactType === 'Interview') selectRadio('Type of contact3', 'Interview3');
                    if (activity.details.contactType === 'Inquiry') selectRadio('Type of contact3', 'Inquiry3');

                    fillTextField('Employer or business contact information_3', activity.details.address);
                    fillTextField('Address_3', activity.details.addressCity);
                    fillTextField('State3', activity.details.addressState);
                    fillTextField('Website or email address3', activity.details.websiteEmail);
                    fillTextField('Website or email address_3', activity.details.phone);

                } else if (activity.category.startsWith('worksource_') || activity.category === 'wioa_programs') {
                    selectRadio('Activity3', 'Worksource activity');
                    officeName = activity.details.office_name || '';
                    if (activity.category === 'worksource_online') officeName = 'Online';

                    fillTextField('What activity did you complete_5', activityName);
                    fillTextField('What documentation do you have_5', documentation);
                    fillTextField('Where did you complete this activity_3', officeName);
                    fillTextField('Office name_3', activity.details.office_city); // PDF City for WS3
                    fillTextField('State_6', activity.details.office_state); // PDF State for WS3 (per dump)

                } else { // All others
                    selectRadio('Activity3', 'Other activity');
                    fillTextField('What activity did you complete_6', activityName); // Per dump
                    fillTextField('What documentation do you have_6', documentation); // Per dump
                }
            }
        });

        try {
            if (form.getFields().length > 0) form.flatten();
        } catch (e) {
            console.warn("Could not flatten PDF. Fields will remain editable.", e.message);
        }

        return await pdfDoc.save();
    }
};
