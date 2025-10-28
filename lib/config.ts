// Application Configuration
export const config = {
  // Judge0 API Configuration
  judge0: {
    apiUrl: process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com',
    apiKey: process.env.JUDGE0_API_KEY || '',
  },
  
  // Contest Configuration
  contest: {
    maxExecutionTime: 2.0, // seconds
    maxMemoryLimit: 128000, // KB
    supportedLanguages: [
      { id: 'python', name: 'Python 3', judge0Id: 71 },
      { id: 'javascript', name: 'JavaScript (Node.js)', judge0Id: 63 },
      { id: 'java', name: 'Java', judge0Id: 62 },
      { id: 'cpp', name: 'C++', judge0Id: 54 },
      { id: 'c', name: 'C', judge0Id: 50 },
      { id: 'csharp', name: 'C#', judge0Id: 51 },
      { id: 'go', name: 'Go', judge0Id: 60 },
      { id: 'rust', name: 'Rust', judge0Id: 73 },
      { id: 'php', name: 'PHP', judge0Id: 68 },
      { id: 'ruby', name: 'Ruby', judge0Id: 72 },
      { id: 'swift', name: 'Swift', judge0Id: 83 },
      { id: 'kotlin', name: 'Kotlin', judge0Id: 78 },
      { id: 'scala', name: 'Scala', judge0Id: 81 },
      { id: 'typescript', name: 'TypeScript', judge0Id: 74 },
    ],
  },
  
  // Monitoring Configuration
  monitoring: {
    faceDetectionGracePeriod: 30000, // 30 seconds
    voiceDetectionGracePeriod: 30000, // 30 seconds
    warningCooldownPeriod: 15000, // 15 seconds
  },
}
