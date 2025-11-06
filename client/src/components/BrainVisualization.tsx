import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Brain3D from './Brain3D';
import { fetchPatientMetrics, type PatientMetrics } from '../services/api';

interface BrainVisualizationProps {
  patientId: string;
}

export default function BrainVisualization({ patientId }: BrainVisualizationProps) {
  const [metrics, setMetrics] = useState<PatientMetrics>({
    emotionalBalance: 0.5,
    energyLevel: 0.5,
    cognitiveLoad: 0.5,
    stressLevel: 0.5,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      setLoading(true);
      try {
        const data = await fetchPatientMetrics(patientId);
        setMetrics({
          emotionalBalance: data.emotionalBalance ?? data.emotionalStability ?? 0.5,
          energyLevel: data.energyLevel ?? (data.energyTrend?.[0] ?? 0.5),
          cognitiveLoad: data.cognitiveLoad ?? data.cognitiveLoadAvg ?? 0.5,
          stressLevel: data.stressLevel ?? data.averageStress ?? 0.5,
        });
      } catch (error) {
        console.error('Failed to load metrics:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
    
    // Refresh metrics every 5 seconds
    const interval = setInterval(loadMetrics, 5000);
    return () => clearInterval(interval);
  }, [patientId]);

  // Normalize values to 0-1 range if they're in different ranges
  const normalizeValue = (value: number, max: number = 10): number => {
    return Math.max(0, Math.min(1, value / max));
  };

  const emotionalBalance = normalizeValue(metrics.emotionalBalance ?? 0.5);
  const energyLevel = normalizeValue(metrics.energyLevel ?? 0.5);
  const cognitiveLoad = normalizeValue(metrics.cognitiveLoad ?? 0.5);
  const stressLevel = normalizeValue(metrics.stressLevel ?? 0.5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-xl">Loading brain metrics...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-900">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Brain3D
          emotionalBalance={emotionalBalance}
          energyLevel={energyLevel}
          cognitiveLoad={cognitiveLoad}
          stressLevel={stressLevel}
        />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
        />
        <Environment preset="sunset" />
      </Canvas>
      
      {/* Metrics overlay */}
      <div className="absolute bottom-4 left-4 text-white bg-black/50 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-2">Patient Metrics</h3>
        <div className="space-y-1 text-sm">
          <div>Emotional Balance: {(emotionalBalance * 100).toFixed(0)}%</div>
          <div>Energy Level: {(energyLevel * 100).toFixed(0)}%</div>
          <div>Cognitive Load: {(cognitiveLoad * 100).toFixed(0)}%</div>
          <div>Stress Level: {(stressLevel * 100).toFixed(0)}%</div>
        </div>
      </div>
    </div>
  );
}

