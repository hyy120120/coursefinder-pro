// Groq AI Integration (Free, Unlimited)
// Get key from: https://console.groq.com

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const MODEL = "llama-3.3-70b-versatile"; // Best free model

if (!GROQ_API_KEY) {
  console.warn('⚠️ GROQ_API_KEY not configured');
}

export const SYSTEM_PROMPTS = {
  courseAdvisor: `You are an expert study abroad counselor with deep knowledge of universities, courses, and admission requirements worldwide. 
Help students find the best courses, universities, and countries for their profile.
Be specific, data-driven, encouraging, and honest.
Always ask clarifying questions about CGPA, test scores, budget, and preferences.
Provide 3-5 specific course recommendations with reasons.`,

  sopWriter: `You are an expert Statement of Purpose (SOP) writer for university applications.
Write compelling, authentic SOPs that highlight the student's strengths, motivations, and fit for the program.
Structure: Hook → Background → Why this program → Career goals → Conclusion.
Be concise (250-400 words), impactful, honest, and unique.
Make it stand out from thousands of applications.`,

  eligibilityChecker: `You are a university admission consultant specializing in eligibility assessment.
Analyze student profiles and give detailed eligibility feedback:
1. Academic fitness (GPA requirement)
2. English proficiency (IELTS/TOEFL scores needed)
3. Entrance exams (GRE/GMAT if required)
4. Experience gaps
5. Concrete ways to improve application
Provide admission probability (%) with honest assessment.
Be constructive and encouraging even for weak profiles.`,

  visaAdvisor: `You are a visa and immigration expert for study abroad.
Provide country-specific visa guidance:
1. Required documents with specific requirements
2. Visa processing timeline
3. Financial proof needed (exact amounts)
4. Interview tips and common questions
5. Common rejection reasons to avoid
6. Post-study work visa options and salary thresholds
Be thorough, accurate, and use actual 2024 requirements.`,
};

// Call Groq API
async function callGroqAPI(systemPrompt, userMessage, maxTokens = 1500) {
  try {
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not configured. Add it to .env.local');
    }

    const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `API error: ${response.status}`);
    }

    return data.choices[0].message.content;
  } catch (err) {
    console.error('Groq API error:', err.message);
    throw new Error(`AI Service Error: ${err.message}`);
  }
}

// Course Matching
export async function matchCourses(studentProfile) {
  const prompt = `Given this student profile, recommend TOP 5 courses:
Name: ${studentProfile.name || 'Student'}
CGPA: ${studentProfile.cgpa || 'Not provided'}
IELTS/TOEFL: ${studentProfile.englishScore || 'Not taken'}
GRE/GMAT: ${studentProfile.standardizedTest || 'Not taken'}
Budget: ${studentProfile.budget || 'Flexible'}
Preferred Countries: ${studentProfile.countries || 'Any'}
Field of Study: ${studentProfile.field || 'Any'}

For each course recommend:
1. University name & country
2. Course name & level
3. Why it's a good fit
4. Admission probability (%)
5. Estimated fees
6. Scholarship opportunities

Format as clear numbered list.`;

  return callGroqAPI(SYSTEM_PROMPTS.courseAdvisor, prompt, 1500);
}

// Eligibility Check
export async function checkEligibility(studentProfile, courseDetails) {
  const prompt = `Check eligibility for this student to apply:

STUDENT PROFILE:
- Name: ${studentProfile.name || 'Student'}
- CGPA: ${studentProfile.cgpa || 'N/A'}
- IELTS: ${studentProfile.ielts || 'Not taken'}
- TOEFL: ${studentProfile.toefl || 'Not taken'}
- GRE: ${studentProfile.gre || 'Not taken'}
- GMAT: ${studentProfile.gmat || 'Not taken'}
- Work Experience: ${studentProfile.experience || 'Fresher'}

COURSE REQUIREMENTS:
- University: ${courseDetails.university || 'N/A'}
- Course: ${courseDetails.course || 'N/A'}
- Country: ${courseDetails.country || 'N/A'}
- Min GPA: ${courseDetails.minGpa || 'Not specified'}
- English Test: ${courseDetails.englishTest || 'IELTS'}
- Entrance Exam: ${courseDetails.entranceExam || 'None'}

Provide:
1. **Eligibility Status** (Strong/Moderate/Weak with %)
2. **Requirements Met**
3. **Requirements Missing**
4. **How to Improve** (specific steps)
5. **Alternative Courses** (if not eligible)
6. **Timeline** (when to apply)

Be honest but encouraging.`;

  return callGroqAPI(SYSTEM_PROMPTS.eligibilityChecker, prompt, 1500);
}

// SOP Generation
export async function generateSOP(studentProfile) {
  const prompt = `Write a compelling Statement of Purpose (SOP) for this student:

Student: ${studentProfile.name || 'Applicant'}
Education: ${studentProfile.education || 'Bachelors'}
CGPA: ${studentProfile.cgpa || '3.5'}
Background: ${studentProfile.background || 'Not specified'}
Target Program: ${studentProfile.targetProgram || 'Masters'}
Target University: ${studentProfile.targetUniversity || 'Top university'}
Career Goal: ${studentProfile.careerGoal || 'Not specified'}
Unique Strengths: ${studentProfile.strengths || 'To be mentioned'}
Challenges Overcome: ${studentProfile.challenges || 'None'}

Write a 300-350 word SOP that:
1. Opens with a compelling hook/story
2. Explains educational background and achievements
3. Clearly states motivation for the program
4. Shows understanding of the university and program
5. Demonstrates fit between student and program
6. Outlines clear career goals
7. Explains why this is the right next step
8. Closes with strong, confident conclusion

Make it authentic, specific, impactful, and unique.
Avoid clichés and generic statements.`;

  return callGroqAPI(SYSTEM_PROMPTS.sopWriter, prompt, 1200);
}

// Visa Guidance
export async function getVisaGuidance(country) {
  const prompt = `Provide comprehensive visa guidance for studying in ${country} (2024):

1. **Required Documents** (country-specific)
   - List all required documents
   - Specific formats and requirements
   - Where to get each document

2. **Financial Requirements**
   - Minimum funds needed (in local currency)
   - Bank statement format
   - Sponsor affidavit if applicable
   - Why amount is needed

3. **Visa Timeline**
   - Application process duration
   - Best time to apply
   - Processing speed
   - When you'll receive decision

4. **Visa Interview**
   - Common interview questions
   - How to prepare
   - What documents to bring
   - Tips to succeed
   - Common reasons for rejection

5. **After Visa Approval**
   - What to do next
   - Pre-departure checklist
   - Arrival process
   - First steps in country

6. **Post-Study Work Visa**
   - Duration allowed to stay
   - Salary/job requirements
   - How to apply
   - Path to permanent residency
   - Best industries for work visa

Be specific with current 2024 requirements and actual amounts.`;

  return callGroqAPI(SYSTEM_PROMPTS.visaAdvisor, prompt, 2000);
}

// Chat (Conversational)
export async function streamChat(messages, context = 'general') {
  const contextMap = {
    general: SYSTEM_PROMPTS.courseAdvisor,
    sop: SYSTEM_PROMPTS.sopWriter,
    visa: SYSTEM_PROMPTS.visaAdvisor,
    eligibility: SYSTEM_PROMPTS.eligibilityChecker,
  };

  const systemPrompt = contextMap[context] || contextMap.general;
  const lastMessage = messages[messages.length - 1];

  if (!lastMessage || lastMessage.role !== 'user') {
    throw new Error('Last message must be from user');
  }

  return callGroqAPI(systemPrompt, lastMessage.content, 2000);
}

// Student Profile Analysis
export async function analyzeStudentProfile(studentProfile) {
  const prompt = `Provide comprehensive analysis of this student's study abroad readiness:

${JSON.stringify(studentProfile, null, 2)}

Include:
1. **Strengths** (what works in their favor)
2. **Improvement Areas** (what needs work)
3. **Best Fit Countries** (3-5 recommendations)
4. **Recommended Fields** (based on profile)
5. **Timeline** (when they should apply)
6. **Preparation Action Plan** (specific steps)
7. **Success Probability** (% for top 100 universities)
8. **Risk Factors** (what could go wrong)
9. **Budget Estimate** (total cost)
10. **Post-Study Opportunities** (job market, salary)

Be thorough, honest, and actionable.
Give specific numbers and timelines.`;

  return callGroqAPI(SYSTEM_PROMPTS.courseAdvisor, prompt, 2000);
}

// Document Checklist
export async function generateDocumentChecklist(country, courseLevel) {
  const prompt = `Create detailed document checklist for ${courseLevel} in ${country}:

Organize documents by category:

**Academic Documents**
- Required documents with specific formats
- Who issues them
- Processing time

**English Proficiency**
- Which tests are accepted
- Minimum scores needed
- Where to register
- Test dates

**Financial Documents**
- Proof of funds amount
- Bank statements requirements
- Affidavit format if needed
- Who can sponsor

**Personal Documents**
- Valid passport requirements
- Visa pages if applicable
- Health insurance proof
- Police clearance (if required)

**Application Documents**
- Personal statement/SOP
- Recommendation letters (how many, from whom)
- CV/Resume
- Work experience certificates

**Country-Specific Documents** (if any)
- Any extra requirements for ${country}

For each document:
1. Why it's needed
2. Specific requirements
3. How to obtain
4. Processing timeline
5. Common mistakes to avoid

Also provide:
- **Optimal order** to collect documents
- **Timeline** (when to start collecting)
- **Cost estimate** for all documents
- **Common rejections** and how to avoid

Make it practical and comprehensive.`;

  return callGroqAPI(SYSTEM_PROMPTS.courseAdvisor, prompt, 2000);
}

export default {
  matchCourses,
  checkEligibility,
  generateSOP,
  getVisaGuidance,
  streamChat,
  analyzeStudentProfile,
  generateDocumentChecklist,
};