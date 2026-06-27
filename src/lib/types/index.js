// User roles
export const USER_ROLES = {
  AGENT: 'agent',
  COUNSELLOR: 'counsellor',
  ADMIN: 'admin',
};

// Application statuses
export const APPLICATION_STATUS = {
  PROFILING: 'profiling',
  SHORTLISTING: 'shortlisting',
  APPLIED: 'applied',
  OFFER: 'offer',
  ENROLLED: 'enrolled',
  REJECTED: 'rejected',
  VISA: 'visa',
};

// Course levels
export const COURSE_LEVELS = {
  UNDERGRADUATE: 'undergraduate',
  POSTGRADUATE: 'postgraduate',
  DIPLOMA: 'diploma',
  CERTIFICATE: 'certificate',
};

// Countries
export const COUNTRIES = [
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
];

// Field of study
export const FIELDS_OF_STUDY = [
  'Computer Science & IT',
  'Engineering',
  'Business & Management',
  'Medicine & Health',
  'Law',
  'Arts & Humanities',
  'Social Sciences',
  'Architecture',
  'Design',
  'Finance & Economics',
];

// Test scores
export const TEST_TYPES = {
  IELTS: 'ielts',
  TOEFL: 'toefl',
  PTE: 'pte',
  DUOLINGO: 'duolingo',
  GRE: 'gre',
  GMAT: 'gmat',
  SAT: 'sat',
};

// JSDoc typedefs for IDE support
/**
 * @typedef {Object} User
 * @property {string} uid
 * @property {string} email
 * @property {string} displayName
 * @property {string} role
 * @property {string} agencyId
 * @property {boolean} isActive
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Agency
 * @property {string} id
 * @property {string} name
 * @property {string} ownerId
 * @property {string} primaryColor
 * @property {string} secondaryColor
 * @property {string} subdomain
 * @property {string} tagline
 * @property {number} walletBalance
 * @property {string} tier
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} Student
 * @property {string} id
 * @property {string} agencyId
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} phone
 * @property {string} nationality
 * @property {Object} academicProfile
 * @property {Object} testScores
 * @property {Object} preferences
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} universityName
 * @property {string} country
 * @property {string} name
 * @property {string} level
 * @property {string} field
 * @property {number} tuitionFee
 * @property {string} currency
 * @property {number} durationMonths
 * @property {Array} intakes
 * @property {Object} eligibility
 * @property {number} commissionRate
 * @property {number} qsRanking
 */

/**
 * @typedef {Object} Application
 * @property {string} id
 * @property {string} agencyId
 * @property {string} studentId
 * @property {string} courseId
 * @property {string} status
 * @property {Object} commission
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */
