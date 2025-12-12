// ZIP Utilities
// Handles packaging files into a ZIP archive.
const ZipUtils = {
    generateZip: async function (claimWeek, createFilledPdfCallback) {
        UiUtils.showLoading(true, "Generating your ZIP file...");
        try {
            const zip = new JSZip();

            UiUtils.showLoading(true, "Downloading PDF template...");
            const filledPdfBytes = await createFilledPdfCallback();

            const pdfFileName = `Job_Log_Week_Ending_${claimWeek.weekEnding.replace(/[/\\]/g, '-')}.pdf`;
            zip.file(pdfFileName, filledPdfBytes);

            UiUtils.showLoading(true, "Adding proof files...");
            const proofFolder = zip.folder("Proof_Files");

            for (let i = 0; i < claimWeek.activities.length; i++) {
                const activity = claimWeek.activities[i];
                if (activity.proofFile) {
                    const fileData = await ZipUtils.readFileAsArrayBuffer(activity.proofFile);
                    proofFolder.file(activity.proofFileName, fileData);
                }
            }

            UiUtils.showLoading(true, "Creating ZIP... Please wait.");
            const zipBlob = await zip.generateAsync({ type: "blob" });
            const zipFileName = `Job_Search_Log_${claimWeek.weekEnding.replace(/[/\\]/g, '-')}.zip`;

            saveAs(zipBlob, zipFileName);
            UiUtils.showLoading(false);

        } catch (err) {
            console.error("Error generating ZIP:", err);
            UiUtils.showLoading(false);
            UiUtils.showError(`Failed to generate ZIP: ${err.message}. Please check your connection and try again.`);
        }
    },

    readFileAsArrayBuffer: function (file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
            reader.readAsArrayBuffer(file);
        });
    }
};
