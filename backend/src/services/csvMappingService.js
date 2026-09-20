/**
 * CSV Column Mapping Service
 * Detects CSV column mappings automatically using alias normalization, literal lists, and fuzzy matching.
 */

const TARGET_ALIASES = {
  date: ['date', 'txndate', 'transactiondate', 'valuedate', 'postingdate'],
  amount: ['amount', 'amountinr', 'amountrs', 'value', 'txnamount'],
  debitAmount: [
    'debit',
    'debitamount',
    'withdrawal',
    'withdrawalamt',
    'withdrawls',
    'withdrawlsamount',
    'withdrawals',
    'withdrawalsamount',
    'dr',
  ],
  creditAmount: [
    'credit',
    'creditamount',
    'deposit',
    'depositamt',
    'deposits',
    'depositamount',
    'depositsamount',
    'cr',
  ],
  type: ['type', 'txntype', 'drcr', 'transactiontype'],
  merchant: ['description', 'merchant', 'narration', 'particulars', 'payee'],
  description: ['remarks', 'notes', 'memo', 'details'],
  category: ['category', 'type_of_expense', 'categorytype'],
  externalRef: ['transactionid', 'txnid', 'referenceno', 'refno', 'chequeno'],
  paymentMode: ['paymentmode', 'mode', 'channel'],
};

/**
 * Normalizes strings by lowercasing and stripping spaces, underscores, and hyphens
 */
function normalizeString(str) {
  return (str || '').toLowerCase().replace(/[\s_\-]/g, '');
}

/**
 * Levenshtein distance 1 computation for typo tolerance
 */
function levenshteinDistance(a, b) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  if (Math.abs(a.length - b.length) > 2) return 99;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Auto-detects target field mappings from raw CSV headers
 * @param {Array<string>} headers - Raw header column names from CSV
 * @returns {Object} { suggestedMapping, isConfident }
 */
function detectColumnMapping(headers = []) {
  const normalizedHeaders = (headers || []).map((h) => ({
    original: h,
    normalized: normalizeString(h),
  }));

  const suggestedMapping = {
    date: null,
    amount: null,
    debitAmount: null,
    creditAmount: null,
    type: null,
    merchant: null,
    description: null,
    category: null,
    externalRef: null,
    paymentMode: null,
  };

  const usedHeaders = new Set();

  // Pass 1: Exact normalized alias matching
  Object.keys(TARGET_ALIASES).forEach((targetField) => {
    const aliases = TARGET_ALIASES[targetField];
    const match = normalizedHeaders.find(
      (h) => !usedHeaders.has(h.original) && aliases.includes(h.normalized)
    );

    if (match) {
      suggestedMapping[targetField] = match.original;
      usedHeaders.add(match.original);
    }
  });

  // Pass 2: Prefix and Levenshtein-distance <= 1 fuzzy matching for remaining unmatched fields
  Object.keys(TARGET_ALIASES).forEach((targetField) => {
    if (suggestedMapping[targetField]) return;

    const aliases = TARGET_ALIASES[targetField];
    const match = normalizedHeaders.find((h) => {
      if (usedHeaders.has(h.original)) return false;
      return aliases.some(
        (alias) =>
          h.normalized.startsWith(alias) ||
          alias.startsWith(h.normalized) ||
          levenshteinDistance(h.normalized, alias) <= 1
      );
    });

    if (match) {
      suggestedMapping[targetField] = match.original;
      usedHeaders.add(match.original);
    }
  });

  const hasDate = Boolean(suggestedMapping.date);
  const hasAmount = Boolean(suggestedMapping.amount);
  const hasDebitCredit = Boolean(
    suggestedMapping.debitAmount && suggestedMapping.creditAmount
  );

  const isConfident = hasDate && (hasAmount || hasDebitCredit);

  return {
    suggestedMapping,
    isConfident,
  };
}

module.exports = {
  detectColumnMapping,
};
