import express from 'express';
import PDF from '../models/Pdf.js';

const router = express.Router();

/**
 * @route POST /api/pdf
 * @desc Save metadata about a merged PDF
 * @access Public (consider adding auth if needed)
 */
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const { filename, size, pages, mergedFrom } = req.body;

    if (!filename || !size || !pages || !mergedFrom) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new PDF record
    const pdfRecord = new PDF({
      filename,
      size,
      pages,
      mergedFrom,
      mergeDate: new Date(),
      status: 'completed'
    });

    await pdfRecord.save();

    res.status(201).json({
      success: true,
      data: {
        id: pdfRecord._id,
        filename: pdfRecord.filename,
        size: pdfRecord.size,
        pages: pdfRecord.pages,
        mergedFrom: pdfRecord.mergedFrom,
        mergeDate: pdfRecord.mergeDate
      }
    });

  } catch (err) {
    console.error('Error saving PDF metadata:', err);

    res.status(500).json({
      success: false,
      error: 'Failed to save PDF metadata',
      ...(process.env.NODE_ENV === 'development' && {
        details: err.message,
        stack: err.stack
      })
    });
  }
});

/**
 * @route GET /api/pdf
 * @desc Get paginated list of merged PDFs
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Query and count in parallel
    const [pdfs, total] = await Promise.all([
      PDF.find()
        .sort({ mergeDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PDF.countDocuments()
    ]);

    res.json({
      success: true,
      data: pdfs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit
      }
    });

  } catch (err) {
    console.error('Error fetching PDF records:', err);

    res.status(500).json({
      success: false,
      error: 'Failed to fetch PDF records',
      ...(process.env.NODE_ENV === 'development' && {
        details: err.message
      })
    });
  }
});

/**
 * @route GET /api/pdf/:id
 * @desc Get single PDF record
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        error: 'PDF record not found'
      });
    }

    res.json({
      success: true,
      data: pdf
    });

  } catch (err) {
    console.error('Error fetching PDF record:', err);

    res.status(500).json({
      success: false,
      error: 'Failed to fetch PDF record',
      ...(process.env.NODE_ENV === 'development' && {
        details: err.message
      })
    });
  }
});

export default router;
