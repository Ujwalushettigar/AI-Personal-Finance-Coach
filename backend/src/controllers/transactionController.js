/**
 * Transaction Controller
 * Member A - AI-Personal-Finance-Coach
 */

const { getSupabaseClient } = require('../config/db');
const {
  getTransactions,
  getTransactionById,
  createTransaction: createTransactionModel,
  updateTransaction: updateTransactionModel,
  deleteTransaction: deleteTransactionModel,
} = require('../models/Transaction');

async function listTransactions(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const filters = {
      category: req.query.category,
      type: req.query.type,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };
    const transactions = await getTransactions(userId, filters);
    return res.json(transactions);
  } catch (err) {
    console.error('Error in listTransactions:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function getTransaction(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const { id } = req.params;
    const transaction = await getTransactionById(userId, id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found or access denied' });
    }
    return res.json(transaction);
  } catch (err) {
    console.error('Error in getTransaction:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function createTransaction(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const { amount, type, date, category, description, merchant } = req.body;

    if (amount === undefined || amount === null || amount === '' || !type || !date) {
      return res.status(400).json({ error: 'Missing required fields: amount, type, and date are required.' });
    }

    const newTransaction = await createTransactionModel(userId, {
      amount,
      type,
      date,
      category,
      description,
      merchant,
    });

    return res.status(201).json(newTransaction);
  } catch (err) {
    console.error('Error in createTransaction:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function updateTransaction(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const { id } = req.params;
    const updatedTransaction = await updateTransactionModel(userId, id, req.body);
    if (!updatedTransaction) {
      return res.status(404).json({ error: 'Transaction not found or access denied' });
    }
    return res.json(updatedTransaction);
  } catch (err) {
    console.error('Error in updateTransaction:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function deleteTransaction(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const { id } = req.params;
    const deletedTransaction = await deleteTransactionModel(userId, id);
    if (!deletedTransaction) {
      return res.status(404).json({ error: 'Transaction not found or access denied' });
    }
    return res.json({ message: 'Transaction deleted successfully', transaction: deletedTransaction });
  } catch (err) {
    console.error('Error in deleteTransaction:', err);
    return res.status(500).json({ error: err.message });
  }
}

const multer = require('multer');
const { parse } = require('csv-parse/sync');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const { detectColumnMapping } = require('../services/csvMappingService');

const storage = multer.memoryStorage();
const uploadCsvMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'text/plain' ||
      (file.originalname && file.originalname.toLowerCase().endsWith('.csv'))
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .csv files are accepted'), false);
    }
  },
}).single('file');

/**
 * Parses date value across multiple formats using dayjs
 */
function parseDateValue(value) {
  if (!value || typeof value !== 'string' || !value.trim()) return null;
  const val = value.trim();

  // Try default ISO/RFC parsing first
  const std = dayjs(val);
  if (std.isValid() && val.length >= 8) {
    return std.format('YYYY-MM-DD');
  }

  const formats = [
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'DD-MM-YYYY',
    'YYYY/MM/DD',
    'YYYY-MM-DD',
    'DD.MM.YYYY',
  ];

  for (const fmt of formats) {
    const d = dayjs(val, fmt, true);
    if (d.isValid()) {
      return d.format('YYYY-MM-DD');
    }
  }

  return null;
}

/**
 * Preview endpoint: parses headers & 5 sample rows, auto-detects column mapping
 */
async function previewImportTransactionsFromCsv(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded. Please select a .csv file.' });
    }

    let records;
    try {
      records = parse(req.file.buffer, {
        columns: true,
        trim: true,
        skip_empty_lines: true,
      });
    } catch (parseErr) {
      return res.status(400).json({ error: `Failed to parse CSV file: ${parseErr.message}` });
    }

    if (!records || records.length === 0) {
      return res.status(400).json({ error: 'CSV file is empty or contains no records.' });
    }

    const headers = Object.keys(records[0]);
    const previewRows = records.slice(0, 5);
    const { suggestedMapping, isConfident } = detectColumnMapping(headers);

    return res.json({
      headers,
      previewRows,
      suggestedMapping,
      isConfident,
    });
  } catch (err) {
    console.error('Error in previewImportTransactionsFromCsv:', err);
    return res.status(500).json({ error: err.message || 'Failed to preview CSV file' });
  }
}

/**
 * Full import endpoint: imports transactions using confirmed column mapping
 */
async function importTransactionsFromCsv(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded. Please select a .csv file.' });
    }

    const token = req.token || req.authToken;
    const supabase = getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;

    let mapping = req.body.mapping;
    if (typeof mapping === 'string') {
      try {
        mapping = JSON.parse(mapping);
      } catch (e) {
        mapping = {};
      }
    }
    mapping = mapping || {};

    let records;
    try {
      records = parse(req.file.buffer, {
        columns: true,
        trim: true,
        skip_empty_lines: true,
      });
    } catch (parseErr) {
      return res.status(400).json({ error: `Failed to parse CSV file: ${parseErr.message}` });
    }

    if (!records || records.length === 0) {
      return res.status(400).json({ error: 'CSV file is empty.' });
    }

    const validRows = [];
    const invalidSkipped = [];

    records.forEach((row, idx) => {
      const rowNum = idx + 2;

      // 1. Date Validation
      const rawDate = mapping.date ? row[mapping.date] : null;
      const parsedDate = parseDateValue(rawDate);
      if (!parsedDate) {
        invalidSkipped.push({ row: rowNum, reason: `Invalid or unparseable date (${rawDate || 'blank'})` });
        return;
      }

      // 2. Amount and Type Determination
      let type = null;
      let amountNum = null;

      const cleanNumber = (val) => {
        if (val === undefined || val === null) return NaN;
        const str = String(val).replace(/,/g, '').replace(/[$₹€£]/g, '').trim();
        return parseFloat(str);
      };

      const rawAmountCol = mapping.amount ? row[mapping.amount] : null;
      const rawDebitCol = mapping.debitAmount ? row[mapping.debitAmount] : null;
      const rawCreditCol = mapping.creditAmount ? row[mapping.creditAmount] : null;
      const rawTypeVal = mapping.type && row[mapping.type] ? String(row[mapping.type]).trim().toLowerCase() : '';

      if (mapping.debitAmount || mapping.creditAmount) {
        // Case B: Separate Debit / Credit columns
        const debitVal = rawDebitCol ? cleanNumber(rawDebitCol) : NaN;
        const creditVal = rawCreditCol ? cleanNumber(rawCreditCol) : NaN;

        if (!isNaN(creditVal) && creditVal > 0) {
          type = 'income';
          amountNum = creditVal;
        } else if (!isNaN(debitVal) && debitVal > 0) {
          type = 'expense';
          amountNum = debitVal;
        } else if (rawAmountCol) {
          const val = cleanNumber(rawAmountCol);
          if (!isNaN(val) && val !== 0) {
            amountNum = Math.abs(val);
            type = (rawTypeVal.includes('credit') || rawTypeVal.includes('income') || rawTypeVal === 'cr' || rawTypeVal === 'c') ? 'income' : 'expense';
          }
        }
      } else if (mapping.amount) {
        // Case A: Single Amount column
        const val = cleanNumber(rawAmountCol);
        if (!isNaN(val) && val !== 0) {
          amountNum = Math.abs(val);
          if (rawTypeVal.includes('credit') || rawTypeVal.includes('income') || rawTypeVal === 'cr' || rawTypeVal === 'c') {
            type = 'income';
          } else {
            type = 'expense';
          }
        }
      }

      if (amountNum === null || isNaN(amountNum) || amountNum <= 0) {
        invalidSkipped.push({ row: rowNum, reason: 'Missing or invalid positive amount' });
        return;
      }

      // 3. Category & Merchant Fallbacks
      const category = (mapping.category && row[mapping.category])
        ? String(row[mapping.category]).trim()
        : 'Uncategorized';

      const paymentMode = (mapping.paymentMode && row[mapping.paymentMode])
        ? String(row[mapping.paymentMode]).trim()
        : null;

      const description = (mapping.description && row[mapping.description])
        ? (paymentMode ? `${String(row[mapping.description]).trim()} (via ${paymentMode})` : String(row[mapping.description]).trim())
        : (paymentMode ? `via ${paymentMode}` : null);

      const merchant = (mapping.merchant && row[mapping.merchant])
        ? String(row[mapping.merchant]).trim()
        : (description || 'Unknown Merchant');

      const externalRef = (mapping.externalRef && row[mapping.externalRef])
        ? String(row[mapping.externalRef]).trim()
        : null;

      validRows.push({
        user_id: userId,
        date: parsedDate,
        merchant,
        description,
        category: category || 'Uncategorized',
        type: type || 'expense',
        amount: amountNum,
        external_ref: externalRef,
      });
    });

    let importedCount = 0;
    let duplicatesSkippedCount = 0;

    if (validRows.length > 0) {
      const validRowsWithRef = validRows.filter((r) => r.external_ref);
      const validRowsNoRef = validRows.filter((r) => !r.external_ref);

      if (validRowsWithRef.length > 0) {
        const { data: upsertData, error: upsertErr } = await supabase
          .from('transactions')
          .upsert(validRowsWithRef, { onConflict: 'user_id,external_ref', ignoreDuplicates: true })
          .select();

        if (upsertErr) {
          throw new Error(`Failed to upsert transactions: ${upsertErr.message}`);
        }

        const insertedCount = upsertData ? upsertData.length : 0;
        importedCount += insertedCount;
        duplicatesSkippedCount += (validRowsWithRef.length - insertedCount);
      }

      if (validRowsNoRef.length > 0) {
        const { data: insertData, error: insertErr } = await supabase
          .from('transactions')
          .insert(validRowsNoRef)
          .select();

        if (insertErr) {
          throw new Error(`Failed to insert transactions: ${insertErr.message}`);
        }

        importedCount += (insertData ? insertData.length : 0);
      }
    }

    return res.json({
      totalRows: records.length,
      imported: importedCount,
      duplicatesSkipped: duplicatesSkippedCount,
      invalidSkipped,
    });
  } catch (err) {
    console.error('Error in importTransactionsFromCsv controller:', err);
    return res.status(500).json({ error: err.message || 'Failed to import CSV transactions' });
  }
}

module.exports = {
  listTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  previewImportTransactionsFromCsv,
  importTransactionsFromCsv,
  uploadCsvMiddleware,
};
