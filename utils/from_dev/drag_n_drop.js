import { Page } from '@playwright/test';
import { readFileSync } from 'fs';

export const dragAndDropFile = async (
    page,
    selector,
    filePath,
    fileName,
    fileType = ''
) => {
    const buffer = readFileSync(filePath).toString('base64');
    const dataTransfer = await page.evaluateHandle(
        async ({ bufferData, localFileName, localFileType }) => {
            function b64toBlob(b64Data) {
                const byteString = atob(b64Data.split(',')[1]);
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                return new Blob([ab], { type: 'application/octet-stream' });
            }
            const dt = new DataTransfer();
            const blobData = b64toBlob(bufferData);
            const file = new File([blobData], localFileName, { type: localFileType });
            dt.items.add(file);
            return dt;
        },
        {
            bufferData: `data:${fileType};base64,${buffer}`,
            localFileName: fileName,
            localFileType: fileType,
        }
    );

    await page.dispatchEvent(selector, 'drop', { dataTransfer });
};

