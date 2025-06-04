import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import PDFMerger from 'pdf-merger-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Setup __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 10
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API to clear uploads folder
app.post('/api/clear-uploads', (req, res) => {
  const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads');
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error('Error reading uploads directory:', err);
      return res.status(500).json({ error: 'Failed to read uploads directory' });
    }

    files.forEach(file => {
      fs.unlink(path.join(uploadDir, file), (unlinkErr) => {
        if (unlinkErr) console.error('Failed to delete file:', file, unlinkErr);
      });
    });

    res.status(200).json({ message: 'Uploads folder cleared' });
  });
});

// PDF Merge Route
app.post('/api/merge', (req, res, next) => {
  upload.array('pdfs', 10)(req, res, (err) => {
    if (err) {
      console.error('Multer upload error:', err);
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Minimum 2 PDF files required'
      });
    }

    const invalidFiles = [];
    for (const file of req.files) {
      try {
        const data = fs.readFileSync(file.path);
        if (!data.slice(0, 5).toString().includes('%PDF-')) {
          invalidFiles.push({ name: file.originalname, reason: 'Invalid PDF header' });
        }
      } catch {
        invalidFiles.push({ name: file.originalname, reason: 'Unreadable file' });
      }
    }

    if (invalidFiles.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid PDF files detected',
        invalidFiles
      });
    }

    const merger = new PDFMerger();
    for (const file of req.files) {
      await merger.add(file.path);
    }

    const mergedFileName = `merged-${Date.now()}.pdf`;
    const outputPath = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads', mergedFileName);
    await merger.save(outputPath);

    res.download(outputPath, mergedFileName, (err) => {
      if (err) {
        console.error('Error sending merged PDF:', err);
      }

      // Delete merged file
      fs.unlink(outputPath, (err) => {
        if (err) console.error('Error deleting merged file:', err);
      });

      // Delete uploaded files
      for (const file of req.files) {
        fs.unlink(file.path, (err) => {
          if (err) console.error(`Error deleting uploaded file ${file.path}:`, err);
        });
      }
    });

  } catch (err) {
    console.error('Merge failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Upload directory: ${path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')}`);
});
