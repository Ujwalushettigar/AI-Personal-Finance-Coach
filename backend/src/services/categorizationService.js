/**
 * Categorization Service
 * Member A - AI-Personal-Finance-Coach
 * 
 * Provides automatic rule-based categorization for income and expense transactions.
 * Manual category selection strictly overrides automatic categorization.
 */

const CATEGORIES = {
  INCOME: [
    'Salary',
    'Freelance',
    'Other Income'
  ],
  EXPENSE: [
    'Food',
    'Transport',
    'Shopping',
    'Entertainment',
    'Bills',
    'Healthcare',
    'Education',
    'Travel',
    'Other'
  ]
};

// Keyword mapping for automatic rule-based categorization
const EXPENSE_RULES = [
  {
    category: 'Food',
    keywords: [
      'swiggy', 'zomato', 'restaurant', 'cafe', 'food', 'burger', 'pizza',
      'mcdonald', 'starbucks', 'kfc', 'bakery', 'dine', 'dining', 'kitchen',
      'eats', 'blinkit', 'instamart', 'zepto', 'grocery', 'supermarket', 'subway'
    ]
  },
  {
    category: 'Transport',
    keywords: [
      'uber', 'ola', 'rapido', 'fuel', 'taxi', 'petrol', 'diesel', 'metro',
      'bus', 'auto', 'cab', 'parking', 'toll', 'fare', 'railways'
    ]
  },
  {
    category: 'Shopping',
    keywords: [
      'amazon', 'flipkart', 'myntra', 'zara', 'h&m', 'ajio', 'meesho',
      'shopping', 'retail', 'clothing', 'apparel', 'electronics', 'mall', 'mart'
    ]
  },
  {
    category: 'Entertainment',
    keywords: [
      'netflix', 'spotify', 'youtube', 'movie', 'cinema', 'pvr', 'inox',
      'hotstar', 'prime video', 'disney', 'gaming', 'steam', 'playstation',
      'concert', 'ticket', 'show', 'theater'
    ]
  },
  {
    category: 'Bills',
    keywords: [
      'electricity', 'water', 'internet', 'mobile', 'recharge', 'wifi',
      'broadband', 'utility', 'gas', 'bill', 'dth', 'postpaid', 'prepaid',
      'maintenance', 'rent'
    ]
  },
  {
    category: 'Healthcare',
    keywords: [
      'hospital', 'pharmacy', 'medical', 'clinic', 'doctor', 'medicine',
      'apollo', 'medplus', 'lab', 'diagnostics', 'dental', 'health', 'consultation'
    ]
  },
  {
    category: 'Education',
    keywords: [
      'college', 'course', 'books', 'education', 'university', 'school',
      'tuition', 'udemy', 'coursera', 'library', 'training', 'exam', 'fees'
    ]
  },
  {
    category: 'Travel',
    keywords: [
      'flight', 'hotel', 'airbnb', 'booking', 'irctc', 'train', 'trip',
      'airline', 'makemytrip', 'agoda', 'stay', 'vacation', 'resort'
    ]
  }
];

const INCOME_RULES = [
  {
    category: 'Salary',
    keywords: [
      'salary', 'payroll', 'wages', 'stipend', 'monthly pay', 'employer'
    ]
  },
  {
    category: 'Freelance',
    keywords: [
      'freelance', 'client', 'upwork', 'fiverr', 'consulting', 'contract', 'gig'
    ]
  },
  {
    category: 'Other Income',
    keywords: [
      'refund', 'cashback', 'bonus', 'dividend', 'interest', 'gift', 'grant', 'reward'
    ]
  }
];

/**
 * Validate whether a category belongs to the valid list for the given type
 * @param {string} category 
 * @param {string} type - 'income' | 'expense'
 * @returns {boolean}
 */
const isValidCategory = (category, type) => {
  if (!category || typeof category !== 'string') return false;
  const list = type === 'income' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;
  return list.some(c => c.toLowerCase() === category.trim().toLowerCase());
};

/**
 * Get automatic suggested category based on text and transaction type
 * @param {string} text - Description or merchant name
 * @param {string} type - 'income' | 'expense'
 * @returns {string} - Inferred category
 */
const getSuggestedCategory = (text = '', type = 'expense') => {
  const normalized = String(text).toLowerCase();
  const rules = type === 'income' ? INCOME_RULES : EXPENSE_RULES;

  for (const rule of rules) {
    const matched = rule.keywords.some(keyword => normalized.includes(keyword.toLowerCase()));
    if (matched) {
      return rule.category;
    }
  }

  // Fallback defaults
  return type === 'income' ? 'Other Income' : 'Other';
};

/**
 * Categorize a transaction.
 * Manual category selection strictly overrides automatic categorization.
 * 
 * @param {Object} params
 * @param {string} [params.description]
 * @param {string} [params.merchant]
 * @param {string} [params.type='expense']
 * @param {string} [params.manualCategory]
 * @returns {string} - Final resolved category
 */
const categorizeTransaction = ({ description = '', merchant = '', type = 'expense', manualCategory = null } = {}) => {
  const normalizedType = type && type.toLowerCase() === 'income' ? 'income' : 'expense';

  // 1. Manual selection strictly overrides auto-categorization if provided
  if (manualCategory && typeof manualCategory === 'string' && manualCategory.trim().length > 0) {
    const trimmed = manualCategory.trim();
    // Normalize casing to match standard category name if known
    const list = normalizedType === 'income' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;
    const match = list.find(c => c.toLowerCase() === trimmed.toLowerCase());
    return match || trimmed;
  }

  // 2. Automatic rule-based matching using description and merchant
  const combinedText = `${description} ${merchant}`.trim();
  return getSuggestedCategory(combinedText, normalizedType);
};

module.exports = {
  CATEGORIES,
  isValidCategory,
  getSuggestedCategory,
  categorizeTransaction
};
