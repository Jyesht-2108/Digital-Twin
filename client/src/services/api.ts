const API_BASE_URL = 'http://localhost:3000';

export interface PatientMetrics {
  emotionalBalance?: number;
  energyLevel?: number;
  cognitiveLoad?: number;
  stressLevel?: number;
  averageStress?: number;
  emotionalStability?: number;
  cognitiveLoadAvg?: number;
  energyTrend?: number[];
  [key: string]: any;
}

export async function fetchPatientMetrics(patientId: string): Promise<PatientMetrics> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reports/${patientId}/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch metrics: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching patient metrics:', error);
    // Return default values if API fails
    return {
      emotionalBalance: 0.5,
      energyLevel: 0.5,
      cognitiveLoad: 0.5,
      stressLevel: 0.5,
    };
  }
}

