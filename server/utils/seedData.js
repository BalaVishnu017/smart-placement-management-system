const User = require('../models/User');
const Company = require('../models/Company');
const PlacementDrive = require('../models/PlacementDrive');
const Job = require('../models/Job');
const CompanyResource = require('../models/CompanyResource');
const Notice = require('../models/Notice');
const Notification = require('../models/Notification');
const SystemConfig = require('../models/SystemConfig');

const seedData = async () => {
  try {
    // Ensure SystemConfig exists
    const configExists = await SystemConfig.findOne();
    if (!configExists) {
      await SystemConfig.create({ activeGraduationYear: 2026 });
      console.log('Default system config initialized (Active Graduation Year: 2026)');
    }

    // Check if already seeded
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Database already seeded');
      return;
    }

    console.log('Seeding database...');

    // Create Admin
    const admin = await User.create({
      name: 'Placement Officer',
      email: 'admin@spms.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create Students
    const students = await User.insertMany([
      { name: 'Rahul Sharma', email: 'rahul@student.com', password: '$2a$10$XkYV2F.c8s9Xw6VqQxvEZOdZfYr5lE5mC8pRjKp1VZsMrVB7pF6Aq', role: 'student', rollNo: 'CS2101', branch: 'CS', department: 'Computer Science', graduationYear: 2025, cgpa: 8.5, tenthPercent: 92, twelfthPercent: 88, backlogs: 0, phone: '9876543210', skills: ['JavaScript', 'React', 'Node.js', 'Python'] },
      { name: 'Priya Patel', email: 'priya@student.com', password: '$2a$10$XkYV2F.c8s9Xw6VqQxvEZOdZfYr5lE5mC8pRjKp1VZsMrVB7pF6Aq', role: 'student', rollNo: 'CS2102', branch: 'CS', department: 'Computer Science', graduationYear: 2025, cgpa: 9.1, tenthPercent: 95, twelfthPercent: 93, backlogs: 0, phone: '9876543211', skills: ['Java', 'Spring Boot', 'MySQL', 'AWS'] },
      { name: 'Amit Kumar', email: 'amit@student.com', password: '$2a$10$XkYV2F.c8s9Xw6VqQxvEZOdZfYr5lE5mC8pRjKp1VZsMrVB7pF6Aq', role: 'student', rollNo: 'EC2101', branch: 'ECE', department: 'Electronics', graduationYear: 2025, cgpa: 7.8, tenthPercent: 85, twelfthPercent: 82, backlogs: 1, phone: '9876543212', skills: ['VLSI', 'Embedded C', 'Python', 'MATLAB'] },
      { name: 'Sneha Gupta', email: 'sneha@student.com', password: '$2a$10$XkYV2F.c8s9Xw6VqQxvEZOdZfYr5lE5mC8pRjKp1VZsMrVB7pF6Aq', role: 'student', rollNo: 'ME2101', branch: 'ME', department: 'Mechanical', graduationYear: 2025, cgpa: 7.2, tenthPercent: 80, twelfthPercent: 78, backlogs: 0, phone: '9876543213', skills: ['AutoCAD', 'SolidWorks', 'MATLAB', 'Python'] },
      { name: 'Vikram Singh', email: 'vikram@student.com', password: '$2a$10$XkYV2F.c8s9Xw6VqQxvEZOdZfYr5lE5mC8pRjKp1VZsMrVB7pF6Aq', role: 'student', rollNo: 'IT2101', branch: 'IT', department: 'Information Technology', graduationYear: 2025, cgpa: 8.0, tenthPercent: 88, twelfthPercent: 85, backlogs: 0, phone: '9876543214', skills: ['Python', 'Django', 'React', 'MongoDB'] },
      { name: 'Neha Reddy', email: 'neha@student.com', password: '$2a$10$XkYV2F.c8s9Xw6VqQxvEZOdZfYr5lE5mC8pRjKp1VZsMrVB7pF6Aq', role: 'student', rollNo: 'CS2103', branch: 'CS', department: 'Computer Science', graduationYear: 2026, cgpa: 8.8, tenthPercent: 90, twelfthPercent: 87, backlogs: 0, phone: '9876543215', skills: ['C++', 'Data Structures', 'Machine Learning', 'TensorFlow'] },
      { name: 'Arjun Nair', email: 'arjun@student.com', password: '$2a$10$XkYV2F.c8s9Xw6VqQxvEZOdZfYr5lE5mC8pRjKp1VZsMrVB7pF6Aq', role: 'student', rollNo: 'EE2101', branch: 'EE', department: 'Electrical', graduationYear: 2025, cgpa: 7.5, tenthPercent: 83, twelfthPercent: 80, backlogs: 2, phone: '9876543216', skills: ['Power Systems', 'MATLAB', 'PLC', 'AutoCAD'] },
      { name: 'Kavya Menon', email: 'kavya@student.com', password: '$2a$10$XkYV2F.c8s9Xw6VqQxvEZOdZfYr5lE5mC8pRjKp1VZsMrVB7pF6Aq', role: 'student', rollNo: 'CE2101', branch: 'CE', department: 'Civil', graduationYear: 2025, cgpa: 8.3, tenthPercent: 89, twelfthPercent: 86, backlogs: 0, phone: '9876543217', skills: ['AutoCAD', 'STAAD Pro', 'Revit', 'Project Management'] },
      { name: 'Rohan Das', email: 'rohan@student.com', password: '$2a$10$XkYV2F.c8s9Xw6VqQxvEZOdZfYr5lE5mC8pRjKp1VZsMrVB7pF6Aq', role: 'student', rollNo: 'IT2102', branch: 'IT', department: 'Information Technology', graduationYear: 2025, cgpa: 6.5, tenthPercent: 75, twelfthPercent: 72, backlogs: 3, phone: '9876543218', skills: ['HTML', 'CSS', 'JavaScript', 'PHP'] },
      { name: 'Ananya Iyer', email: 'ananya@student.com', password: '$2a$10$XkYV2F.c8s9Xw6VqQxvEZOdZfYr5lE5mC8pRjKp1VZsMrVB7pF6Aq', role: 'student', rollNo: 'EC2102', branch: 'ECE', department: 'Electronics', graduationYear: 2026, cgpa: 9.0, tenthPercent: 94, twelfthPercent: 91, backlogs: 0, phone: '9876543219', skills: ['IoT', 'Arduino', 'Python', 'Signal Processing'] }
    ]);

    // Create Companies
    const google = await Company.create({ name: 'Google', industry: 'Technology', website: 'https://careers.google.com', description: 'Google is a global technology leader focused on improving the ways people connect with information. Products include Search, Android, YouTube, Cloud, and Workspace.', headquarters: 'Mountain View, CA', employeeCount: 180000, techStack: ['Python', 'Java', 'Go', 'C++', 'JavaScript', 'TensorFlow', 'Kubernetes'], avgPackage: 30, status: 'active', addedBy: admin._id });
    const microsoft = await Company.create({ name: 'Microsoft', industry: 'Technology', website: 'https://careers.microsoft.com', description: 'Microsoft is a multinational corporation that develops, licenses, and sells computer software, consumer electronics, and personal computers. Key products: Azure, Office 365, Windows.', headquarters: 'Redmond, WA', employeeCount: 220000, techStack: ['C#', '.NET', 'Azure', 'TypeScript', 'React', 'Python'], avgPackage: 25, status: 'active', addedBy: admin._id });
    const amazon = await Company.create({ name: 'Amazon', industry: 'Technology / E-commerce', website: 'https://www.amazon.jobs', description: 'Amazon is guided by four principles: customer obsession, passion for invention, commitment to operational excellence, and long-term thinking. Divisions include AWS, Retail, and Alexa.', headquarters: 'Seattle, WA', employeeCount: 1500000, techStack: ['Java', 'Python', 'AWS', 'React', 'Node.js', 'DynamoDB'], avgPackage: 28, status: 'active', addedBy: admin._id });
    const tcs = await Company.create({ name: 'TCS', industry: 'IT Services', website: 'https://www.tcs.com/careers', description: 'Tata Consultancy Services is an Indian multinational IT services and consulting company. Part of the Tata Group, it is the largest Indian company by market capitalization.', headquarters: 'Mumbai, India', employeeCount: 600000, techStack: ['Java', 'Python', '.NET', 'SAP', 'Angular', 'SQL'], avgPackage: 7, status: 'active', addedBy: admin._id });
    const infosys = await Company.create({ name: 'Infosys', industry: 'IT Services', website: 'https://www.infosys.com/careers', description: 'Infosys is a global leader in next-generation digital services and consulting, enabling clients in 56 countries to navigate their digital transformation.', headquarters: 'Bengaluru, India', employeeCount: 340000, techStack: ['Java', 'Python', 'Spring Boot', 'Angular', 'React', 'AWS'], avgPackage: 6.5, status: 'active', addedBy: admin._id });

    // Create Placement Drives
    const drive1 = await PlacementDrive.create({
      title: 'Google Campus Hiring 2025', company: google._id, description: 'Google is visiting campus for SDE and Cloud Engineer roles. Multiple rounds including online test, technical interviews, and HR round.',
      driveDate: new Date('2025-09-15'), lastDateToApply: new Date('2025-09-10'), status: 'upcoming',
      eligibility: { branches: ['CS', 'IT', 'ECE'], minCGPA: 8.0, maxBacklogs: 0, graduationYears: [2025, 2026] },
      instructions: 'Carry college ID. Formal dress code mandatory. Bring 2 copies of resume.', venue: 'Main Auditorium', createdBy: admin._id
    });

    const drive2 = await PlacementDrive.create({
      title: 'TCS National Qualifier Test', company: tcs._id, description: 'TCS NQT for all branches. Online test followed by interview rounds. Mass recruitment drive.',
      driveDate: new Date('2025-08-20'), lastDateToApply: new Date('2025-08-15'), status: 'upcoming',
      eligibility: { branches: ['CS', 'IT', 'ECE', 'EE', 'ME', 'CE'], minCGPA: 6.0, maxBacklogs: 1, graduationYears: [2025] },
      instructions: 'Online test link will be shared via email. Keep your laptop and stable internet ready.', venue: 'Online', createdBy: admin._id
    });

    const drive3 = await PlacementDrive.create({
      title: 'Amazon SDE Hiring', company: amazon._id, description: 'Amazon is hiring for SDE-1 positions. Rigorous coding rounds followed by bar raiser interview.',
      driveDate: new Date('2025-07-25'), lastDateToApply: new Date('2025-07-30'), status: 'ongoing',
      eligibility: { branches: ['CS', 'IT'], minCGPA: 7.5, maxBacklogs: 0, graduationYears: [2025, 2026] },
      instructions: 'Prepare DSA thoroughly. Focus on system design basics. Practice on LeetCode.', venue: 'Computer Lab Block A', createdBy: admin._id
    });

    // Create Jobs
    const jobs = await Job.insertMany([
      { title: 'Software Development Engineer', company: google._id, drive: drive1._id, description: 'Design, develop and test software for Google products. Work on large-scale distributed systems handling millions of users.', type: 'full-time', packageLPA: 32, location: 'Bangalore / Hyderabad', openings: 5, skills: ['Data Structures', 'Algorithms', 'System Design', 'Java/Python/C++'], eligibility: { branches: ['CS', 'IT'], minCGPA: 8.0, maxBacklogs: 0, graduationYears: [2025, 2026] }, deadline: new Date('2025-09-10'), status: 'open', createdBy: admin._id },
      { title: 'Cloud Engineer', company: google._id, drive: drive1._id, description: 'Build and maintain cloud infrastructure on Google Cloud Platform. Work with Kubernetes, BigQuery, and Cloud Spanner.', type: 'full-time', packageLPA: 28, location: 'Bangalore', openings: 3, skills: ['Cloud Computing', 'Linux', 'Networking', 'Python', 'Kubernetes'], eligibility: { branches: ['CS', 'IT', 'ECE'], minCGPA: 8.0, maxBacklogs: 0, graduationYears: [2025, 2026] }, deadline: new Date('2025-09-10'), status: 'open', createdBy: admin._id },
      { title: 'Systems Engineer', company: tcs._id, drive: drive2._id, description: 'Join TCS as a Systems Engineer. Work on enterprise applications, software development, and IT infrastructure for global clients.', type: 'full-time', packageLPA: 7, location: 'Pan India', openings: 50, skills: ['Programming', 'SQL', 'Problem Solving', 'Communication'], eligibility: { branches: ['CS', 'IT', 'ECE', 'EE', 'ME', 'CE'], minCGPA: 6.0, maxBacklogs: 1, graduationYears: [2025] }, deadline: new Date('2025-08-15'), status: 'open', createdBy: admin._id },
      { title: 'Digital Engineer', company: tcs._id, drive: drive2._id, description: 'Work with cutting-edge digital technologies including AI/ML, Cloud, IoT, and Blockchain at TCS Digital division.', type: 'full-time', packageLPA: 9, location: 'Mumbai / Pune / Chennai', openings: 20, skills: ['AI/ML', 'Cloud', 'Full Stack', 'Problem Solving'], eligibility: { branches: ['CS', 'IT', 'ECE'], minCGPA: 7.5, maxBacklogs: 0, graduationYears: [2025] }, deadline: new Date('2025-08-15'), status: 'open', createdBy: admin._id },
      { title: 'SDE-1', company: amazon._id, drive: drive3._id, description: 'Build scalable, distributed systems at Amazon. Work on challenging problems in e-commerce, AWS, or Alexa.', type: 'full-time', packageLPA: 30, location: 'Bangalore / Hyderabad', openings: 8, skills: ['Data Structures', 'Algorithms', 'OOP', 'System Design', 'Java/C++'], eligibility: { branches: ['CS', 'IT'], minCGPA: 7.5, maxBacklogs: 0, graduationYears: [2025, 2026] }, deadline: new Date('2025-07-30'), status: 'open', createdBy: admin._id }
    ]);

    // Create Company Resources
    await CompanyResource.insertMany([
      { company: google._id, type: 'pyq', title: 'Google Online Test Questions 2024', content: '1. Given an array of integers, find two numbers such that they add up to a specific target (Two Sum).\n2. Design a data structure that supports insert, delete, and getRandom in O(1) time.\n3. Find the longest substring without repeating characters.\n4. Merge K sorted linked lists.\n5. Design a URL shortener system (System Design).', year: 2024, difficulty: 'hard', uploadedBy: admin._id },
      { company: google._id, type: 'technical_interview', title: 'Google Technical Interview Experience - SDE', content: 'Round 1 (Online Coding): 2 medium-hard DSA problems in 60 mins on Google\'s platform. Topics: Dynamic Programming and Graph.\n\nRound 2 (Technical Phone Screen): Asked about projects, then a coding problem on trees. Interviewer was very helpful with hints.\n\nRound 3 (Onsite - Coding): Two coding rounds back to back. Problems on sliding window and binary search.\n\nRound 4 (System Design): Design Google Maps navigation system. Focus on scalability and real-time updates.\n\nRound 5 (Behavioral - Googleyness): Questions about teamwork, conflict resolution, and leadership experiences.', year: 2024, difficulty: 'hard', uploadedBy: admin._id },
      { company: google._id, type: 'tech_stack', title: 'Google Technology Stack', content: 'Languages: Python, Java, Go, C++, JavaScript/TypeScript\nFrontend: Angular (internal), React\nBackend: gRPC, Protocol Buffers, Spanner, Bigtable\nCloud: Google Cloud Platform (GCP), Kubernetes (originated at Google)\nAI/ML: TensorFlow, JAX, Vertex AI\nBuild: Bazel, Blaze\nVersion Control: Piper (monorepo), Git\nCI/CD: TAP (Test Automation Platform)', year: 2024, difficulty: 'medium', uploadedBy: admin._id },
      { company: amazon._id, type: 'pyq', title: 'Amazon SDE-1 Coding Questions 2024', content: '1. LRU Cache implementation\n2. Number of Islands (BFS/DFS)\n3. Merge Intervals\n4. Word Ladder problem\n5. Design a parking lot system (OOP Design)\n6. Find median from data stream', year: 2024, difficulty: 'hard', uploadedBy: admin._id },
      { company: amazon._id, type: 'hr_interview', title: 'Amazon Leadership Principles Interview', content: 'Amazon interviews heavily focus on their 16 Leadership Principles. Prepare STAR-format stories for:\n\n1. Customer Obsession: "Tell me about a time you went above and beyond for a customer/user"\n2. Ownership: "Describe a situation where you took initiative without being asked"\n3. Dive Deep: "Tell me about a time you had to dig into data to solve a problem"\n4. Bias for Action: "Describe a time when you had to make a decision with incomplete information"\n5. Earn Trust: "Tell me about a time you had to deliver bad news"\n\nTip: Always have 8-10 well-prepared stories that can be adapted to different principles.', year: 2024, difficulty: 'medium', uploadedBy: admin._id },
      { company: tcs._id, type: 'aptitude', title: 'TCS NQT Aptitude Questions Pattern', content: 'TCS NQT consists of the following sections:\n\n1. Numerical Ability (26 questions, 40 mins): Number systems, HCF/LCM, percentages, profit & loss, time & work, probability, permutations.\n\n2. Verbal Ability (24 questions, 30 mins): Reading comprehension, sentence correction, para jumbles, vocabulary.\n\n3. Reasoning Ability (30 questions, 50 mins): Blood relations, seating arrangement, syllogisms, coding-decoding, data interpretation.\n\n4. Programming Logic (10 questions, 15 mins): Pseudocode understanding, output prediction, flowcharts.\n\n5. Coding (1-2 questions, 30 mins): Easy-medium difficulty. Arrays, strings, basic algorithms.\n\nPassing score: ~60% for Systems Engineer, ~75% for Digital role.', year: 2024, difficulty: 'easy', uploadedBy: admin._id },
      { company: tcs._id, type: 'recruitment_process', title: 'TCS Recruitment Process Overview', content: 'Step 1: Registration on TCS NextStep Portal\nStep 2: TCS National Qualifier Test (NQT) - Online test\nStep 3: Shortlisting based on NQT score and college CGPA\nStep 4: Technical Interview (30-45 mins) - Projects, basics of programming, DBMS, OS\nStep 5: Managerial Round (15-20 mins) - Behavioral questions, willingness to relocate\nStep 6: HR Round (10-15 mins) - Salary discussion, joining date, location preference\n\nTimeline: Results within 2-4 weeks of interview\nOffer Letter: Digital offer within 1 month\nJoining: Based on project requirements, typically 1-6 months', year: 2024, difficulty: 'easy', uploadedBy: admin._id },
      { company: infosys._id, type: 'coding', title: 'Infosys InfyTQ Coding Problems', content: '1. Reverse a linked list\n2. Check if a string is palindrome\n3. Find the second largest element in an array\n4. Implement stack using queues\n5. Binary search implementation\n6. Find GCD of two numbers\n7. Matrix multiplication\n8. Pattern printing problems\n\nDifficulty: Easy to Medium\nLanguages allowed: C, C++, Java, Python', year: 2024, difficulty: 'easy', uploadedBy: admin._id },
      { company: microsoft._id, type: 'technical_interview', title: 'Microsoft SDE Interview Experience', content: 'Round 1 (Online Assessment): 3 coding problems in 75 minutes on Codility. Mix of easy, medium, hard.\n\nRound 2 (Technical Interview 1): Asked to implement a Trie data structure and solve a problem using it. Discussion about time/space complexity.\n\nRound 3 (Technical Interview 2): System Design - Design a chat application like Microsoft Teams. Focus on real-time messaging, file sharing, and scalability.\n\nRound 4 (Technical + Managerial): Deep dive into projects. Asked about design patterns used. Then a coding problem on graphs.\n\nRound 5 (HR): Cultural fit, career aspirations, Why Microsoft?\n\nTip: Microsoft loves candidates who think out loud and communicate their approach clearly.', year: 2024, difficulty: 'hard', uploadedBy: admin._id },
      { company: microsoft._id, type: 'company_overview', title: 'About Microsoft - Key Facts', content: 'Founded: 1975 by Bill Gates and Paul Allen\nCEO: Satya Nadella (since 2014)\nHeadquarters: Redmond, Washington, USA\nRevenue: $211.9 billion (FY 2023)\nEmployees: 220,000+ worldwide\n\nKey Products & Services:\n- Azure (Cloud Platform - 2nd largest globally)\n- Microsoft 365 (Office Suite)\n- Windows OS\n- LinkedIn\n- GitHub\n- Xbox Gaming\n- Dynamics 365 (ERP/CRM)\n- Copilot (AI Assistant)\n\nIndia Offices: Hyderabad (largest), Bangalore, Noida, Pune\nIndia Dev Center: One of the largest outside US\n\nCulture: Growth Mindset, Diversity & Inclusion, Work-Life Balance\nPerks: Competitive salary, RSUs, health insurance, flexible work, learning allowance', year: 2024, difficulty: 'easy', uploadedBy: admin._id }
    ]);

    // Create Notices
    await Notice.insertMany([
      { title: 'Placement Season 2025 - Important Guidelines', content: 'Dear Students,\n\nThe placement season for 2025 batch is beginning. Please ensure:\n1. Your profile on the placement portal is complete and up-to-date\n2. Upload your latest resume in PDF format\n3. Maintain minimum attendance of 75% to be eligible\n4. Follow the dress code during campus drives\n5. Any misbehavior will result in debarment from placements\n\nAll the best!\nPlacement Cell', priority: 'important', targetAudience: 'all', publishedBy: admin._id },
      { title: 'Resume Workshop - Mandatory for Final Year Students', content: 'A resume building workshop will be conducted on August 5th, 2025 from 10 AM to 1 PM in the Main Auditorium. Attendance is mandatory for all final year students. Bring your laptop.', priority: 'normal', targetAudience: 'students', publishedBy: admin._id },
      { title: 'Google Campus Drive - Registration Open', content: 'Google campus hiring registrations are now open. Eligible branches: CS, IT, ECE. Minimum CGPA: 8.0. No backlogs allowed. Register through the portal before September 10, 2025.', priority: 'urgent', targetAudience: 'students', targetBranches: ['CS', 'IT', 'ECE'], publishedBy: admin._id }
    ]);

    // Mark some students as placed (for demo stats)
    await User.findOneAndUpdate({ email: 'priya@student.com' }, { isPlaced: true, placedCompany: 'Google', placedPackage: 32 });
    await User.findOneAndUpdate({ email: 'vikram@student.com' }, { isPlaced: true, placedCompany: 'Amazon', placedPackage: 30 });

    console.log('Database seeded successfully!');
    console.log('Admin login: admin@spms.com / admin123');
    console.log('Student passwords are pre-hashed. Use Register to create new student accounts.');
  } catch (error) {
    console.error('Seeding error:', error.message);
  }
};

module.exports = seedData;
