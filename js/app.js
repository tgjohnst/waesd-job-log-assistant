// Main Application Logic
// Depends on: ActivityData, PdfUtils, ZipUtils, UiUtils

let currentActivityIndex = 0;
let claimWeek = {
    weekEnding: '',
    name: '',
    idOrSsn: '',
    activities: [
        { category: null, activityId: null, date: '', details: {}, proofFile: null, proofFileName: '' },
        { category: null, activityId: null, date: '', details: {}, proofFile: null, proofFileName: '' },
        { category: null, activityId: null, date: '', details: {}, proofFile: null, proofFileName: '' }
    ]
};

// --- DOM Elements ---
const steps = {
    launch: document.getElementById('step-launch'),
    welcome: document.getElementById('step-welcome'),
    activity: document.getElementById('step-activity'),
    review: document.getElementById('step-review')
};
const activityCounter = document.getElementById('activity-counter');
const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('prev-button');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Setup for the static employer contact box
    const employerContactBox = document.getElementById('paste-box-employer_contact');
    if (employerContactBox) {
        UiUtils.setupPasteBox(employerContactBox, 'employer_contact', handleFile);
    }
    initializeActivityDropdowns();

    // Attach Global Event Listeners (that were previously inline or implicit)
    // Note: Inline onclicks in HTML still work if these functions are global.
    // However, to keep it clean, we should attach them here if we removed them from HTML.
    // For this refactor, I will keep the global functions so HTML onclicks work.
});

// --- Navigation & Flow ---
function setThisWeek() {
    const weekEndingInput = document.getElementById('weekEnding');
    const upcomingSaturday = getUpcomingSaturday();
    const yyyy = upcomingSaturday.getFullYear();
    const mm = String(upcomingSaturday.getMonth() + 1).padStart(2, '0');
    const dd = String(upcomingSaturday.getDate()).padStart(2, '0');
    weekEndingInput.value = `${yyyy}-${mm}-${dd}`;
}

function getUpcomingSaturday() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
    const daysUntilSaturday = 6 - dayOfWeek;
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + daysUntilSaturday);
    return saturday;
}

function showStep(stepName) {
    Object.values(steps).forEach(step => step && step.classList.add('hidden'));
    if (steps[stepName]) {
        steps[stepName].classList.remove('hidden');
    }
}

function startLogging() {
    const weekEnding = document.getElementById('weekEnding').value.trim();
    const claimantName = document.getElementById('claimantName').value.trim();
    const claimantId = document.getElementById('claimantId').value.trim();

    if (!weekEnding || !claimantName || !claimantId) {
        UiUtils.showError("Please fill in all your information to continue.");
        return;
    }

    claimWeek.weekEnding = UiUtils.formatDate(weekEnding);
    claimWeek.name = claimantName;
    claimWeek.idOrSsn = claimantId;

    currentActivityIndex = 0;
    loadActivity(currentActivityIndex);
    showStep('activity');
}

function nextActivity() {
    if (!saveActivity(currentActivityIndex)) {
        return; // Validation failed
    }

    if (currentActivityIndex < 2) {
        currentActivityIndex++;
        loadActivity(currentActivityIndex);
    } else {
        populateReview();
        showStep('review');
    }
}

function prevStep() {
    saveActivity(currentActivityIndex); // Save changes before going back
    if (currentActivityIndex > 0) {
        currentActivityIndex--;
        loadActivity(currentActivityIndex);
    } else {
        showStep('welcome');
    }
}

function startOver() {
    claimWeek = {
        weekEnding: '', name: '', idOrSsn: '',
        activities: [
            { category: null, activityId: null, date: '', details: {}, proofFile: null, proofFileName: '' },
            { category: null, activityId: null, date: '', details: {}, proofFile: null, proofFileName: '' },
            { category: null, activityId: null, date: '', details: {}, proofFile: null, proofFileName: '' }
        ]
    };
    currentActivityIndex = 0;
    document.getElementById('weekEnding').value = '';
    document.getElementById('claimantName').value = '';
    document.getElementById('claimantId').value = '';
    resetActivityForm();
    showStep('launch');
}

// --- Activity Form Logic ---
function showActivityForm() {
    const selectedCategory = document.getElementById('activityCategory').value;
    document.querySelectorAll('#activity-forms-container > div').forEach(form => {
        form.classList.add('hidden');
    });
    if (selectedCategory) {
        const formToShow = document.getElementById(`form-${selectedCategory}`);
        if (formToShow) {
            formToShow.classList.remove('hidden');
        }
    }
}

function initializeActivityDropdowns() {
    document.querySelectorAll('.dynamic-form').forEach(form => {
        const category = form.dataset.category;
        const select = form.querySelector('.activity-select');
        const activities = ActivityData[category];

        if (activities) {
            activities.forEach(activity => {
                const option = document.createElement('option');
                option.value = activity.id;
                option.textContent = activity.text;
                select.appendChild(option);
            });
        }
    });
}

function updateActivityDetails(selectElement) {
    const form = selectElement.closest('.dynamic-form');
    const category = form.dataset.category;
    const activityId = selectElement.value;
    const detailsContainer = form.querySelector('.details-container');

    detailsContainer.innerHTML = ''; // Clear previous

    if (!activityId) return;

    const activity = ActivityData[category].find(a => a.id === activityId);
    if (!activity) return;

    // 1. Add documentation box
    const docBox = document.createElement('div');
    docBox.className = 'doc-box';
    docBox.innerHTML = `<p><strong>Documentation Required:</strong> ${activity.doc}</p>`;
    detailsContainer.appendChild(docBox);

    // 2. Add dynamic text fields
    if (activity.fields) {
        activity.fields.forEach(field => {
            if (field.type === 'textarea') {
                const textarea = document.createElement('textarea');
                textarea.id = `detail-${field.id}`;
                textarea.placeholder = field.ph;
                textarea.className = 'form-input h-24';
                detailsContainer.appendChild(textarea);
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                input.id = `detail-${field.id}`;
                input.placeholder = field.ph;
                input.className = 'form-input';
                detailsContainer.appendChild(input);
            }
        });
    }

    // 3. Add proof upload box
    if (activity.proof !== 'none') {
        const label = document.createElement('label');
        label.className = 'block text-sm font-medium text-gray-700 mb-2';
        label.textContent = activity.proof === 'required' ? 'Proof (Required)' : 'Proof (Optional)';

        const pasteBox = document.createElement('div');
        pasteBox.id = `paste-box-${activity.id}`;
        pasteBox.className = 'paste-box p-4 rounded-lg text-center cursor-pointer';
        pasteBox.innerHTML = `
            <span class="text-gray-500">Click to upload or paste image</span>
            <input type="file" class="hidden" accept="image/*,.pdf" onchange="handleFileUpload(this, '${activity.id}')">
            <div class="preview-container mt-2"></div>
        `;

        UiUtils.setupPasteBox(pasteBox, activity.id, handleFile);

        detailsContainer.appendChild(label);
        detailsContainer.appendChild(pasteBox);
    }
}

function saveActivity(index) {
    const activity = claimWeek.activities[index];
    const dateInput = document.getElementById('activityDate').value.trim();
    const category = document.getElementById('activityCategory').value;

    if (!dateInput || !category) {
        UiUtils.showError("Please select an activity date and category.");
        return false;
    }

    activity.date = UiUtils.formatDate(dateInput);
    activity.category = category;
    activity.details = {};
    activity.activityId = null;

    if (category === 'employer_contact') {
        activity.activityId = 'employer_contact';
        activity.details = {
            jobTitle: document.getElementById('ec-job-title').value,
            employerName: document.getElementById('ec-employer-name').value,
            contactMethod: document.getElementById('ec-contact-method').value,
            contactMethodOther: document.getElementById('ec-contact-other').value,
            contactType: document.getElementById('ec-contact-type').value,
            websiteEmail: document.getElementById('ec-website-email').value,
            phone: document.getElementById('ec-phone').value,
            address: document.getElementById('ec-address').value,
            addressCity: document.getElementById('ec-address-city').value,
            addressState: document.getElementById('ec-address-state').value,
        };
        if (!activity.details.employerName) {
            UiUtils.showError("Employer Name is required for this activity.");
            return false;
        }
    } else {
        const form = document.getElementById(`form-${category}`);
        const select = form.querySelector('.activity-select');
        const activityId = select.value;

        if (!activityId) {
            UiUtils.showError("Please select a specific activity from the dropdown.");
            return false;
        }

        const activityDef = ActivityData[category].find(a => a.id === activityId);
        activity.activityId = activityId;
        activity.details['activityName'] = activityDef.text;
        activity.details['documentation'] = activityDef.doc;

        if (activityDef.fields) {
            activityDef.fields.forEach(field => {
                const input = form.querySelector(`#detail-${field.id}`);
                if (input) {
                    activity.details[field.id] = input.value;
                }
            });
        }

        if (activityDef.proof === 'required' && !activity.proofFile) {
            UiUtils.showError("A proof file (screenshot, PDF, etc.) is required for this activity.");
            return false;
        }
    }
    return true;
}

function loadActivity(index) {
    resetActivityForm();
    const activity = claimWeek.activities[index];

    document.getElementById('activityDate').value = UiUtils.reformatDateForInput(activity.date);
    document.getElementById('activityCategory').value = activity.category || '';

    showActivityForm();

    if (activity.category === 'employer_contact') {
        document.getElementById('ec-job-title').value = activity.details.jobTitle || '';
        document.getElementById('ec-employer-name').value = activity.details.employerName || '';
        document.getElementById('ec-contact-method').value = activity.details.contactMethod || '';
        document.getElementById('ec-contact-other').value = activity.details.contactMethodOther || '';
        document.getElementById('ec-contact-type').value = activity.details.contactType || '';
        document.getElementById('ec-website-email').value = activity.details.websiteEmail || '';
        document.getElementById('ec-phone').value = activity.details.phone || '';
        document.getElementById('ec-address').value = activity.details.address || '';
        document.getElementById('ec-address-city').value = activity.details.addressCity || '';
        document.getElementById('ec-address-state').value = activity.details.addressState || '';

        if (activity.proofFile) {
            UiUtils.showFilePreview(document.getElementById('paste-box-employer_contact'), activity.proofFile, activity.proofFileName);
        }
    } else if (activity.category && activity.activityId) {
        const form = document.getElementById(`form-${activity.category}`);
        const select = form.querySelector('.activity-select');
        select.value = activity.activityId;

        updateActivityDetails(select);

        const activityDef = ActivityData[activity.category].find(a => a.id === activity.activityId);
        if (activityDef.fields) {
            activityDef.fields.forEach(field => {
                const input = form.querySelector(`#detail-${field.id}`);
                if (input) {
                    input.value = activity.details[field.id] || '';
                }
            });
        }

        if (activity.proofFile) {
            const pasteBox = form.querySelector('.paste-box');
            if (pasteBox) {
                UiUtils.showFilePreview(pasteBox, activity.proofFile, activity.proofFileName);
            }
        }
    }

    activityCounter.textContent = index + 1;
    nextButton.textContent = (index === 2) ? 'Review & Finish' : 'Next Activity';
    prevButton.style.display = (index === 0) ? 'none' : 'inline-block';
}

function resetActivityForm() {
    document.getElementById('activityDate').value = '';
    document.getElementById('activityCategory').value = '';

    document.querySelectorAll('.dynamic-form').forEach(form => {
        form.querySelector('.activity-select').selectedIndex = 0;
        form.querySelector('.details-container').innerHTML = '';
    });

    const ecForm = document.getElementById('form-employer_contact');
    ecForm.querySelectorAll('input, select').forEach(el => {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
    });

    const ecPasteBox = document.getElementById('paste-box-employer_contact');
    ecPasteBox.querySelector('.preview-container').innerHTML = '';
    ecPasteBox.querySelector('span').classList.remove('hidden');

    showActivityForm();
}

// --- Upload Actions ---
function handleFileUpload(inputElement, id) {
    if (inputElement.files.length > 0) {
        const file = inputElement.files[0];
        const pasteBox = document.getElementById(`paste-box-${id}`);
        handleFile(pasteBox, file);
    }
}

function handleFile(pasteBox, file) {
    const index = currentActivityIndex;
    claimWeek.activities[index].proofFile = file;
    const saneFileName = file.name.replace(/[^a-z0-9._-]/gi, '_');
    claimWeek.activities[index].proofFileName = `proof_${index + 1}_${saneFileName}`;
    UiUtils.showFilePreview(pasteBox, file, claimWeek.activities[index].proofFileName);
}

// Global paste handler
document.addEventListener('paste', (e) => {
    const activeForm = document.querySelector('#activity-forms-container > div:not(.hidden)');
    if (!activeForm && document.getElementById('form-employer_contact').classList.contains('hidden')) return;

    // Use active form specifically or employer contact if visible
    let targetForm = activeForm;
    if (!targetForm && !document.getElementById('form-employer_contact').classList.contains('hidden')) {
        targetForm = document.getElementById('form-employer_contact');
    }
    if (!targetForm) return;

    const pasteBox = targetForm.querySelector('.paste-box');
    if (!pasteBox) return;

    const activeElement = document.activeElement;
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        return;
    }

    e.preventDefault();
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            file.name = `pasted_image_${Date.now()}.png`;
            handleFile(pasteBox, file);
            break;
        }
    }
});


// --- Review & Submit ---
function populateReview() {
    document.getElementById('review-weekEnding').textContent = claimWeek.weekEnding;
    document.getElementById('review-claimantName').textContent = claimWeek.name;
    document.getElementById('review-claimantId').textContent = "•".repeat(Math.max(0, claimWeek.idOrSsn.length - 4)) + claimWeek.idOrSsn.slice(-4);

    const activitiesContainer = document.getElementById('review-activities');
    activitiesContainer.innerHTML = '';

    claimWeek.activities.forEach((activity, index) => {
        let detailsHtml = '';
        let activityName = 'N/A';

        if (activity.category === 'employer_contact') {
            activityName = `Employer Contact: ${activity.details.employerName || 'N/A'}`;
            detailsHtml = `
                <li><strong>Job Title:</strong> ${activity.details.jobTitle || 'N/A'}</li>
                <li><strong>Contact:</strong> ${activity.details.contactMethod || 'N/A'} (${activity.details.contactType || 'N/A'})</li>
            `;
        } else if (activity.activityId) {
            activityName = activity.details.activityName;
            const activityDef = ActivityData[activity.category].find(a => a.id === activity.activityId);
            if (activityDef.fields) {
                activityDef.fields.forEach(field => {
                    detailsHtml += `<li><strong>${field.ph}:</strong> ${activity.details[field.id] || 'N/A'}</li>`;
                });
            }
        }

        const activityCard = document.createElement('div');
        activityCard.className = 'p-4 bg-gray-50 rounded-lg border border-gray-200';
        activityCard.innerHTML = `
            <h4 class="text-md font-semibold text-teal-700 mb-2">Activity ${index + 1}: ${activity.date}</h4>
            <p class="font-semibold text-gray-800">${activityName}</p>
            <ul class="list-disc list-inside text-gray-700 space-y-1 mt-2">
                ${detailsHtml}
                <li class="truncate"><strong>Proof:</strong> ${activity.proofFile ? activity.proofFileName : 'None provided'}</li>
            </ul>
        `;
        activitiesContainer.appendChild(activityCard);
    });
}

function generateZip() {
    // We pass createFilledPdf as a callback effectively by keeping the state shared or passing it.
    // However, PdfUtils.createFilledPdf needs claimWeek. 
    // And ZipUtils.generateZip takes (claimWeek, pdfCallback).
    ZipUtils.generateZip(claimWeek, () => PdfUtils.createFilledPdf(claimWeek));
}

// Expose functions to global scope for HTML onclick attributes
window.showStep = showStep;
window.setThisWeek = setThisWeek;
window.startLogging = startLogging;
window.nextActivity = nextActivity;
window.prevStep = prevStep;
window.startOver = startOver;
window.showActivityForm = showActivityForm;
window.updateActivityDetails = updateActivityDetails;
window.handleFileUpload = handleFileUpload;
window.generateZip = generateZip;
window.closeModal = UiUtils.closeModal;
