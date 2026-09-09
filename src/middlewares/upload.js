import multer from 'multer';

const storage = multer.memoryStorage();
const allowedMimeTypes = [
    // PDF
    'application/pdf',

    // Images
    'image/jpeg',
    'image/png',
    'image/webp',

    // Word
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-word.document.macroEnabled.12',

    // Excel
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel.sheet.macroEnabled.12',
    'application/vnd.ms-excel.sheet.binary.macroEnabled.12'
];

const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if(!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Nieobsługiwany typ pliku.'));
        }

        cb(null, true);
    }
});

export default upload;