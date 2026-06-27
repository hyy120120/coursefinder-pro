// Email service - OPTIONAL (Nodemailer is optional dependency)
// For production, use SendGrid, AWS SES, or similar managed services

let transporter = null;

// Initialize transporter (lazy loading) - optional dependency
function getTransporter() {
  if (!transporter) {
    try {
      const nodemailer = require('nodemailer');
      
      // Only initialize if email config is provided
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
        console.warn('⚠️ Email service not configured. Set SMTP_HOST and SMTP_USER in .env.local');
        return null;
      }

      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        // Security: validate configuration
        requireTLS: true,
        connectionTimeout: 5000,
        socketTimeout: 5000,
      });
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        console.warn('⚠️ Nodemailer not installed. Email service disabled.');
        console.warn('   To enable: npm install nodemailer');
      } else {
        console.error('⚠️ Email service error:', err.message);
      }
      return null;
    }
  }
  return transporter;
}

// Email Templates
const emailTemplates = {
  studentAdded: (agencyName, studentName) => ({
    subject: `New Student Added - ${studentName}`,
    html: `
      <h2>New Student Added</h2>
      <p>Agency: <strong>${agencyName}</strong></p>
      <p>Student: <strong>${studentName}</strong></p>
      <p>You can now start managing their applications in CourseFinder Pro.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/students" style="background: #0284c7; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">View Student</a></p>
    `,
  }),

  applicationCreated: (agencyName, studentName, courseName) => ({
    subject: `Application Created - ${studentName} → ${courseName}`,
    html: `
      <h2>Application Created</h2>
      <p>Agency: <strong>${agencyName}</strong></p>
      <p>Student: <strong>${studentName}</strong></p>
      <p>Course: <strong>${courseName}</strong></p>
      <p>Track progress in your dashboard.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/applications" style="background: #0284c7; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">View Applications</a></p>
    `,
  }),

  statusUpdate: (agencyName, studentName, newStatus) => ({
    subject: `Application Status Updated - ${newStatus}`,
    html: `
      <h2>Application Status Changed</h2>
      <p>Agency: <strong>${agencyName}</strong></p>
      <p>Student: <strong>${studentName}</strong></p>
      <p>New Status: <strong>${newStatus}</strong></p>
      <p>Check your dashboard for more details.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #0284c7; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Go to Dashboard</a></p>
    `,
  }),

  commissionEarned: (agencyName, amount, studentName) => ({
    subject: `Commission Earned - ₹${amount}`,
    html: `
      <h2>Commission Earned</h2>
      <p>Agency: <strong>${agencyName}</strong></p>
      <p>Student: <strong>${studentName}</strong></p>
      <p>Commission Amount: <strong>₹${amount}</strong></p>
      <p>Your cumulative earnings are being tracked in the dashboard.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/analytics" style="background: #0284c7; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">View Analytics</a></p>
    `,
  }),

  weeklyReport: (agencyName, stats) => ({
    subject: `Weekly Summary - ${agencyName}`,
    html: `
      <h2>Weekly Summary</h2>
      <p>Agency: <strong>${agencyName}</strong></p>
      <ul>
        <li>New Students: ${stats.newStudents}</li>
        <li>New Applications: ${stats.newApplications}</li>
        <li>Enrollments: ${stats.enrollments}</li>
        <li>Commission Earned: ₹${stats.commission}</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #0284c7; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">View Dashboard</a></p>
    `,
  }),
};

// Send Email Function
export async function sendEmail(toEmail, templateName, data) {
  try {
    // Check if email service is configured
    if (!emailConfig.auth.user || emailConfig.auth.user.includes('your-')) {
      console.warn('⚠️ Email service not configured. Email not sent.');
      return { success: false, message: 'Email service not configured' };
    }

    const transporter = getTransporter();
    const template = emailTemplates[templateName];

    if (!template) {
      throw new Error(`Email template "${templateName}" not found`);
    }

    const emailContent = template(...data);

    const mailOptions = {
      from: `"${process.env.NEXT_PUBLIC_APP_NAME || 'CourseFinder'}" <${emailConfig.auth.user}>`,
      to: toEmail,
      ...emailContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return { success: false, error: error.message };
  }
}

// Notification Functions (called from services)

export async function notifyStudentAdded(agencyName, studentName, agentEmail) {
  return sendEmail(agentEmail, 'studentAdded', [agencyName, studentName]);
}

export async function notifyApplicationCreated(agencyName, studentName, courseName, agentEmail) {
  return sendEmail(agentEmail, 'applicationCreated', [agencyName, studentName, courseName]);
}

export async function notifyStatusUpdate(agencyName, studentName, newStatus, agentEmail) {
  return sendEmail(agentEmail, 'statusUpdate', [agencyName, studentName, newStatus]);
}

export async function notifyCommissionEarned(agencyName, amount, studentName, agentEmail) {
  return sendEmail(agentEmail, 'commissionEarned', [agencyName, amount, studentName]);
}

export async function sendWeeklyReport(agencyName, stats, agentEmail) {
  return sendEmail(agentEmail, 'weeklyReport', [agencyName, stats]);
}

export default {
  sendEmail,
  notifyStudentAdded,
  notifyApplicationCreated,
  notifyStatusUpdate,
  notifyCommissionEarned,
  sendWeeklyReport,
};
