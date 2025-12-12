// UI Utilities
// Generic DOM manipulation helpers.
const UiUtils = {
    showLoading: function (isLoading, message = "Loading...") {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (isLoading) {
            loadingOverlay.querySelector('p').textContent = message;
            loadingOverlay.style.display = 'flex';
        } else {
            loadingOverlay.style.display = 'none';
        }
    },

    showError: function (message) {
        const errorMessage = document.getElementById('error-message');
        const errorModal = document.getElementById('error-modal');
        errorMessage.textContent = message;
        errorModal.style.display = 'flex';
    },

    closeModal: function (modalId) {
        document.getElementById(modalId).style.display = 'none';
    },

    formatDate: function (dateString) {
        // Converts "YYYY-MM-DD" to "MM/DD/YYYY"
        if (!dateString) return '';
        try {
            const [year, month, day] = dateString.split('-');
            return `${month}/${day}/${year}`;
        } catch {
            return dateString; // Return as-is if format is unexpected
        }
    },

    reformatDateForInput: function (dateString) {
        // Converts "MM/DD/YYYY" to "YYYY-MM-DD"
        if (!dateString) return '';
        try {
            const [month, day, year] = dateString.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } catch {
            return dateString; // Return as-is if format is unexpected
        }
    },

    // --- File & Paste Handling Helpers ---
    setupPasteBox: function (box, id, onFileHandleCallback) {
        // Click to trigger file input
        box.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'IMG' && e.target.tagName !== 'A') {
                box.querySelector('input[type="file"]').click();
            }
        });

        // Drag/Drop events
        box.addEventListener('dragover', (e) => {
            e.preventDefault();
            box.classList.add('highlight');
        });
        box.addEventListener('dragleave', (e) => {
            e.preventDefault();
            box.classList.remove('highlight');
        });
        box.addEventListener('drop', (e) => {
            e.preventDefault();
            box.classList.remove('highlight');
            if (e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                onFileHandleCallback(box, file);
            }
        });
    },

    showFilePreview: function (pasteBox, file, fileName) {
        const previewContainer = pasteBox.querySelector('.preview-container');
        const textSpan = pasteBox.querySelector('span');

        previewContainer.innerHTML = ''; // Clear previous preview
        textSpan.classList.add('hidden'); // Hide "Click to upload..." text

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'rounded-lg inline-block';
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        } else {
            const fileInfo = document.createElement('p');
            fileInfo.className = 'text-gray-700 font-medium';
            fileInfo.textContent = `File: ${fileName}`;
            previewContainer.appendChild(fileInfo);
        }
    }
};
