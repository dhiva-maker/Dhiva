export type ViewType = 
  | 'organogram' 
  | 'rolesheets' 
  | 'kpitree' 
  | 'controlgraph' 
  | 'stability_matrix' 
  | 'checksheet';

export interface RoutineTask {
  id: string;
  timeSlot: string;
  taskTitle: string;
  description: string;
  frequency: 'Daily' | 'Hourly' | 'Shift-End' | 'Weekly';
  targetMinutes: number;
  outputArtifact: string;
  verificationMethod: string;
  status: 'Completed' | 'Pending' | 'Exception';
  completedAt?: string;
  notes?: string;
}

export interface KraItem {
  id: string;
  name: string;
  target: string;
  actual: string;
  uom: string;
  formula: string;
  weightage: number;
  status: 'Green' | 'Amber' | 'Red';
  linkedKpiId?: string;
}

export interface EscalationRule {
  triggerCondition: string;
  escalateTo: string;
  slaMinutes: number;
  mode: 'Emergency Call' | 'HIS Red Flag' | 'Huddle Escalation';
}

export interface SkillCompetency {
  skill: string;
  levelRequired: string;
  currentLevel: string;
}

export interface Position {
  id: string;
  name: string;
  title: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4';
  department: string;
  reportsTo: string;
  reportsToId?: string;
  email: string;
  phone: string;
  shift: string;
  avatarUrl?: string;
  objective: string;
  spanOfControl: number;
  activeDischargesToday: number;
  auditPassRate: number;
  status: 'On Duty' | 'In Huddle' | 'On Break' | 'Off Duty';
  dailyRoutine: RoutineTask[];
  kras: KraItem[];
  escalationRules: EscalationRule[];
  competencies: SkillCompetency[];
  children?: Position[];
}

export interface ControlDataPoint {
  id: string;
  date: string;
  shift: string;
  value: number;
  sampleSize: number;
  auditor: string;
  notes?: string;
  outOfControlRule?: string;
  hasCapa?: boolean;
  capaStatus?: 'Open' | 'Investigating' | 'Implemented' | 'Verified';
}

export interface Kpi {
  id: string;
  code: string;
  title: string;
  shortName: string;
  category: 'Velocity & TAT' | 'Quality & Accuracy' | 'Financial & DNFB' | 'Compliance & Safety';
  positionId: string;
  responsibleTitle: string;
  department: string;
  unit: string;
  target: number;
  targetDirection: 'lower_is_better' | 'higher_is_better';
  historicalMean: number;
  historicalUcl: number;
  historicalLcl: number;
  historicalSigma: number;
  usl?: number;
  lsl?: number;
  subgroupSize: number;
  dataPoints: ControlDataPoint[];
  // Process Capability & Stability status
  stabilityStatus: 'Stable' | 'Unstable';
  capabilityStatus: 'Capable (Cpk ≥ 1.33)' | 'Borderline (1.0 ≤ Cpk < 1.33)' | 'Not Capable (Cpk < 1.0)';
  cp: number;
  cpk: number;
}

export interface KpiDriverNode {
  id: string;
  title: string;
  level: 1 | 2 | 3;
  category: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  weight: number;
  status: 'Healthy' | 'At-Risk' | 'Critical';
  responsiblePositionId: string;
  responsibleTitle: string;
  linkedKpiId?: string;
  description: string;
  children?: KpiDriverNode[];
}
