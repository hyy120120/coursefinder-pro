const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const COURSES = [
  {
    name: 'Bachelor of Science in Computer Science',
    universityName: 'MIT',
    country: 'US',
    field: 'Computer Science & IT',
    level: 'undergraduate',
    tuitionFee: 60000,
    currency: 'USD',
    durationMonths: 48,
    intakes: ['Sep 2024', 'Jan 2025'],
    eligibility: { minGPA: 3.5, requiredTests: ['SAT'] },
    commissionRate: 2.5,
    qsRanking: 1,
  },
  {
    name: 'Master of Business Administration',
    universityName: 'Harvard Business School',
    country: 'US',
    field: 'Business & Management',
    level: 'postgraduate',
    tuitionFee: 75000,
    currency: 'USD',
    durationMonths: 24,
    intakes: ['Sep 2024', 'Jan 2025'],
    eligibility: { minGPA: 3.0, requiredTests: ['GMAT'] },
    commissionRate: 3.0,
    qsRanking: 2,
  },
  {
    name: 'Bachelor of Engineering',
    universityName: 'University of Toronto',
    country: 'CA',
    field: 'Engineering',
    level: 'undergraduate',
    tuitionFee: 20000,
    currency: 'CAD',
    durationMonths: 48,
    intakes: ['Sep 2024', 'Jan 2025'],
    eligibility: { minGPA: 3.2, requiredTests: ['IELTS'] },
    commissionRate: 2.0,
    qsRanking: 25,
  },
  {
    name: 'Master of Science in Data Science',
    universityName: 'University of Melbourne',
    country: 'AU',
    field: 'Computer Science & IT',
    level: 'postgraduate',
    tuitionFee: 45000,
    currency: 'AUD',
    durationMonths: 24,
    intakes: ['Feb 2025', 'Jul 2025'],
    eligibility: { minGPA: 3.3, requiredTests: ['IELTS', 'GRE'] },
    commissionRate: 2.5,
    qsRanking: 37,
  },
  {
    name: 'Bachelor of Law',
    universityName: 'University of Oxford',
    country: 'GB',
    field: 'Law',
    level: 'undergraduate',
    tuitionFee: 35000,
    currency: 'GBP',
    durationMonths: 36,
    intakes: ['Sep 2024', 'Jan 2025'],
    eligibility: { minGPA: 3.7, requiredTests: ['IELTS'] },
    commissionRate: 2.5,
    qsRanking: 4,
  },
  {
    name: 'Master of Medicine',
    universityName: 'University of Cambridge',
    country: 'GB',
    field: 'Medicine & Health',
    level: 'postgraduate',
    tuitionFee: 40000,
    currency: 'GBP',
    durationMonths: 24,
    intakes: ['Jan 2025'],
    eligibility: { minGPA: 3.8, requiredTests: ['IELTS'] },
    commissionRate: 3.5,
    qsRanking: 2,
  },
  {
    name: 'Bachelor of Commerce',
    universityName: 'University of Sydney',
    country: 'AU',
    field: 'Business & Management',
    level: 'undergraduate',
    tuitionFee: 35000,
    currency: 'AUD',
    durationMonths: 48,
    intakes: ['Feb 2025', 'Jul 2025'],
    eligibility: { minGPA: 3.0, requiredTests: ['IELTS'] },
    commissionRate: 2.0,
    qsRanking: 50,
  },
  {
    name: 'Master of Architecture',
    universityName: 'ETH Zurich',
    country: 'DE',
    field: 'Architecture',
    level: 'postgraduate',
    tuitionFee: 15000,
    currency: 'CHF',
    durationMonths: 24,
    intakes: ['Sep 2024'],
    eligibility: { minGPA: 3.4, requiredTests: ['IELTS'] },
    commissionRate: 2.0,
    qsRanking: 10,
  },
];

async function seedCourses() {
  console.log('🌱 Starting course seed...');

  try {
    for (const course of COURSES) {
      const docRef = db.collection('courses').doc();
      await docRef.set(course);
      console.log(`✅ Added: ${course.name} (${course.universityName})`);
    }

    console.log('\n✨ Seeding complete! 8 courses added.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedCourses();
