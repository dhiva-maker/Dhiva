import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  ViewType, 
  Position, 
  Kpi, 
  ControlDataPoint, 
  KpiDriverNode, 
  RoutineTask 
} from '../types/dwm';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface DwmContextType {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  selectedPositionId: string;
  setSelectedPositionId: (id: string) => void;
  selectedKpiId: string;
  setSelectedKpiId: (id: string) => void;
  positions: Position[];
  kpis: Kpi[];
  kpiTree: KpiDriverNode;
  setKpiTree: React.Dispatch<React.SetStateAction<KpiDriverNode>>;
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  addControlDataPoint: (
    kpiId: string, 
    pointData: { value: number; shift: string; sampleSize: number; notes?: string; auditor?: string }
  ) => void;
  updateRoutineTask: (
    positionId: string, 
    taskId: string, 
    status: 'Completed' | 'Pending' | 'Exception', 
    notes?: string
  ) => void;
  addRoutineTask: (positionId: string, task: Omit<RoutineTask, 'id'>) => void;
}

const DwmContext = createContext<DwmContextType | undefined>(undefined);

// Initial Positions (Kauvery Hospital Billing Structure)
const INITIAL_POSITIONS: Position[] = [
  {
    id: 'pos-rcm-head',
    name: 'Dr. S. Sundararajan',
    title: 'Regional Head - Business Excellence & RCM',
    tier: 'Tier 4',
    department: 'Audit & Revenue Assurance',
    reportsTo: 'Group CEO & CFO',
    email: 'regionalbusinessexcellence@kauveryhospital.com',
    phone: '+91 98401 22345',
    shift: 'General (09:00 - 17:30)',
    avatarUrl: '/src/assets/images/avatar_billing_head_1791200110291.jpg',
    objective: 'Institutionalize lean daily work management, maintain under 1.2 DNFB days, achieve 99.5% billing integrity across all regional clusters, and govern statistical process control.',
    spanOfControl: 38,
    activeDischargesToday: 84,
    auditPassRate: 99.4,
    status: 'On Duty',
    dailyRoutine: [
      {
        id: 'rt-head-1',
        timeSlot: '08:30 - 09:00',
        taskTitle: 'Regional Flash Revenue & DNFB Review',
        description: 'Examine overnight admission ledger, unbilled exposure > 48h, and high-value claim authorizations.',
        frequency: 'Daily',
        targetMinutes: 30,
        outputArtifact: 'Executive Flash Ledger',
        verificationMethod: 'ERP Dashboard Verification',
        status: 'Completed',
        completedAt: '08:55 AM',
      },
      {
        id: 'rt-head-2',
        timeSlot: '11:00 - 12:00',
        taskTitle: 'Tier 4 Monthly Quality & Statistical Control Review',
        description: 'Evaluate Shewhart X-bar charts, Cpk stability across branches, and audit exception trends.',
        frequency: 'Weekly',
        targetMinutes: 60,
        outputArtifact: 'Quality Excellence Scorecard',
        verificationMethod: 'Signature on DWM Register',
        status: 'Completed',
        completedAt: '11:50 AM',
      },
      {
        id: 'rt-head-3',
        timeSlot: '16:00 - 17:00',
        taskTitle: 'Inter-Branch Best Practices & CAPA Audit',
        description: 'Cross-audit recurring billing query resolutions across Chennai, Trichy, and Bengaluru units.',
        frequency: 'Daily',
        targetMinutes: 60,
        outputArtifact: 'CAPA Cross-Branch Matrix',
        verificationMethod: 'Meeting Minutes Approval',
        status: 'Pending',
      }
    ],
    kras: [
      { id: 'kra-1', name: 'Regional DNFB Exposure Days', target: '< 1.20 days', actual: '1.12 days', uom: 'Days', formula: 'Total Unbilled / Average Daily Revenue', weightage: 35, status: 'Green', linkedKpiId: 'kpi-dnfb' },
      { id: 'kra-2', name: 'Overall Clean Claim Acceptance Rate', target: '≥ 95.0%', actual: '95.9%', uom: '%', formula: 'Approved without query / Total Submissions', weightage: 35, status: 'Green', linkedKpiId: 'kpi-clean-claim' },
      { id: 'kra-3', name: 'Standard Work Adherence Score', target: '≥ 95%', actual: '97.2%', uom: '%', formula: 'Completed Tasks / Scheduled Standard Work', weightage: 30, status: 'Green' }
    ],
    escalationRules: [
      { triggerCondition: 'Regional billing system outage or EDI gateway stoppage > 15 mins', escalateTo: 'Group CIO & Operations Board', slaMinutes: 15, mode: 'Emergency Call' },
      { triggerCondition: 'Statutory or NABH pricing compliance audit variance', escalateTo: 'Board of Directors & Legal Audit', slaMinutes: 30, mode: 'Huddle Escalation' }
    ],
    competencies: [
      { skill: 'Healthcare Lean Daily Management & Hoshin Kanri', levelRequired: 'Level 4 (Expert)', currentLevel: 'Level 4 (Expert)' },
      { skill: 'Statistical Process Control & Shewhart Analysis', levelRequired: 'Level 4 (Expert)', currentLevel: 'Level 4 (Expert)' },
      { skill: 'Hospital Financial Accounting & RCM Governance', levelRequired: 'Level 4 (Expert)', currentLevel: 'Level 4 (Expert)' }
    ]
  },
  {
    id: 'pos-billing-mgr',
    name: 'Priya Ramakrishnan',
    title: 'Central Billing Operations Manager',
    tier: 'Tier 3',
    department: 'Audit & Revenue Assurance',
    reportsTo: 'Dr. S. Sundararajan',
    reportsToId: 'pos-rcm-head',
    email: 'priya.r@kauveryhospital.com',
    phone: '+91 98402 33456',
    shift: 'General (09:00 - 17:30)',
    avatarUrl: '/src/assets/images/avatar_ip_manager_1791200127922.jpg',
    objective: 'Orchestrate hospital-wide daily work routines, ensure discharge bill turnaround under 45 minutes, supervise 5 billing counters, and conduct daily Gemba walks.',
    spanOfControl: 37,
    activeDischargesToday: 84,
    auditPassRate: 98.8,
    status: 'On Duty',
    dailyRoutine: [
      {
        id: 'rt-mgr-1',
        timeSlot: '08:30 - 09:15',
        taskTitle: 'Tier 3 Operations Review & Huddle',
        description: 'Conduct Tier 3 huddle with IP Billing, OP Billing, TPA, and Cash Leads. Scrutinize SQDCM metrics and discharge targets.',
        frequency: 'Daily',
        targetMinutes: 45,
        outputArtifact: 'Tier 3 Daily SQDCM Scorecard',
        verificationMethod: 'Sign-off on DWM Board',
        status: 'Completed',
        completedAt: '09:15 AM',
      },
      {
        id: 'rt-mgr-2',
        timeSlot: '10:00 - 12:00',
        taskTitle: 'Gemba Walk across Billing Counters & Lobby',
        description: 'Walk OPD billing counters, emergency admissions, and IP discharge desk. Observe standard work adherence and eliminate bottlenecks.',
        frequency: 'Daily',
        targetMinutes: 120,
        outputArtifact: 'Gemba Observation Register',
        verificationMethod: 'Gemba Action Sheet Logged',
        status: 'Completed',
        completedAt: '11:50 AM',
      },
      {
        id: 'rt-mgr-3',
        timeSlot: '12:00 - 13:30',
        taskTitle: 'Control Graph Review & Out-of-Control RCA',
        description: 'Review Statistical Process Control charts for Discharge TAT and Query Rates. Inspect any points breaching UCL/LCL.',
        frequency: 'Daily',
        targetMinutes: 90,
        outputArtifact: 'SPC Variance Review Sheet',
        verificationMethod: 'CAPA Approval & System Status Update',
        status: 'Completed',
        completedAt: '13:20 PM',
      },
      {
        id: 'rt-mgr-4',
        timeSlot: '16:30 - 17:30',
        taskTitle: 'Day-End Revenue Reconciliation & CFO Briefing',
        description: 'Consolidate day collection figures, gross billings, corporate receivables, and unbilled exposure.',
        frequency: 'Shift-End',
        targetMinutes: 60,
        outputArtifact: 'Daily Hospital Billing Flash Report',
        verificationMethod: 'Group CFO Acceptance Sign-off',
        status: 'Pending',
      }
    ],
    kras: [
      { id: 'kra-mgr-1', name: 'IP Discharge TAT Compliance (< 45m)', target: '≥ 90.0%', actual: '88.5%', uom: '%', formula: '(Discharges within 45m / Total Discharges) * 100', weightage: 35, status: 'Amber', linkedKpiId: 'kpi-discharge-tat' },
      { id: 'kra-mgr-2', name: 'DNFB Exposure Days', target: '< 1.20 days', actual: '1.12 days', uom: 'Days', formula: 'Total Unbilled / Avg Daily Revenue', weightage: 35, status: 'Green', linkedKpiId: 'kpi-dnfb' },
      { id: 'kra-mgr-3', name: 'DWM Routine Task Completion', target: '≥ 95%', actual: '96.5%', uom: '%', formula: 'Completed Routine Tasks / Scheduled', weightage: 30, status: 'Green' }
    ],
    escalationRules: [
      { triggerCondition: 'Hospital-wide discharge backlog exceeding 15 pending beds past 2 hours', escalateTo: 'Medical Superintendent & COO', slaMinutes: 20, mode: 'Emergency Call' },
      { triggerCondition: 'Unresolved consultant billing dispute > ₹50,000', escalateTo: 'Group CFO & Regional Head', slaMinutes: 45, mode: 'Huddle Escalation' }
    ],
    competencies: [
      { skill: 'Lean Healthcare Management & Daily Work Management (DWM)', levelRequired: 'Level 4 (Expert)', currentLevel: 'Level 4 (Expert)' },
      { skill: 'Statistical Process Control & Capability Indices', levelRequired: 'Level 4 (Expert)', currentLevel: 'Level 4 (Expert)' },
      { skill: 'Hospital Financial Accounting & RCM Auditing', levelRequired: 'Level 4 (Expert)', currentLevel: 'Level 4 (Expert)' }
    ]
  },
  {
    id: 'pos-ip-exec',
    name: 'K. Saravanan',
    title: 'Senior Inpatient (IP) Discharge Billing Executive',
    tier: 'Tier 1',
    department: 'Inpatient (IP) Billing',
    reportsTo: 'M. Balaji (IP Billing Lead)',
    reportsToId: 'pos-billing-mgr',
    email: 'saravanan.k@kauveryhospital.com',
    phone: '+91 98404 55678',
    shift: 'Morning (07:00 - 15:30)',
    avatarUrl: '/src/assets/images/avatar_tpa_lead_1791200144930.jpg',
    objective: 'Generate zero-error inpatient final bills within 45 minutes of clinical discharge order, verifying cross-departmental charges, surgical implants, and pharmacy returns in adherence to Kauvery NABH standards.',
    spanOfControl: 0,
    activeDischargesToday: 18,
    auditPassRate: 99.5,
    status: 'On Duty',
    dailyRoutine: [
      {
        id: 'rt-ip-1',
        timeSlot: '07:30 - 08:30',
        taskTitle: 'Morning Shift Handover & Bed-Head Review',
        description: 'Verify planned discharge list from HIS and review ongoing ICU/Ward bed-head charges.',
        frequency: 'Daily',
        targetMinutes: 60,
        outputArtifact: 'Handover Log & Discharge Manifest',
        verificationMethod: 'Lead signature in DWM Register',
        status: 'Completed',
        completedAt: '08:25 AM',
      },
      {
        id: 'rt-ip-2',
        timeSlot: '08:30 - 09:00',
        taskTitle: 'Tier 1 Daily Standup / DWM Huddle',
        description: 'Attend Billing Tier 1 Huddle. Review yesterday TAT, audit findings, unbilled items, and potential bottlenecks.',
        frequency: 'Daily',
        targetMinutes: 30,
        outputArtifact: 'DWM Standup Action Sheet',
        verificationMethod: 'Huddle Board Attendance Record',
        status: 'Completed',
        completedAt: '08:58 AM',
      },
      {
        id: 'rt-ip-3',
        timeSlot: '09:00 - 11:30',
        taskTitle: 'Pre-Discharge Interim Audit & Package Cross-Check',
        description: 'Audit consumables, surgery packages, consultant visits, and surgical implants against clinical notes.',
        frequency: 'Hourly',
        targetMinutes: 150,
        outputArtifact: 'Pre-Discharge Audit Clearance Slips',
        verificationMethod: 'System Audit Checkmark in HIS',
        status: 'Completed',
        completedAt: '11:20 AM',
      },
      {
        id: 'rt-ip-4',
        timeSlot: '11:30 - 14:00',
        taskTitle: 'Discharge Bill Generation & Pharmacy Return Sync',
        description: 'Receive clinical discharge orders. Verify pharmacy return credits, diagnostic laboratory approvals, and generate bill draft.',
        frequency: 'Hourly',
        targetMinutes: 150,
        outputArtifact: 'Draft Bill & Patient Co-pay Estimate',
        verificationMethod: 'Discharge Slip Barcode Scan',
        status: 'Completed',
        completedAt: '13:45 PM',
      },
      {
        id: 'rt-ip-5',
        timeSlot: '14:00 - 15:00',
        taskTitle: 'Final Bill Settlement & Patient Counseling',
        description: 'Facilitate co-pay settlement with patient attenders, explain tariff breakdown, print final stamped bill, and issue gate pass.',
        frequency: 'Hourly',
        targetMinutes: 60,
        outputArtifact: 'Original Stamped Bill & Gate Pass Token',
        verificationMethod: 'Patient Digital Acknowledgement',
        status: 'Pending',
      },
      {
        id: 'rt-ip-6',
        timeSlot: '15:00 - 15:30',
        taskTitle: 'Unbilled Charges (DNFB) & Shift Handover',
        description: 'Run Discharged Not Final Billed (DNFB) report. Reconcile pending doctor notes, unresolved pharmacy credit notes, and log exceptions.',
        frequency: 'Shift-End',
        targetMinutes: 30,
        outputArtifact: 'Shift Handover & Exception Summary',
        verificationMethod: 'Supervisor Electronic Sign-off',
        status: 'Pending',
      }
    ],
    kras: [
      { id: 'kra-ip-1', name: 'Discharge-to-Bill Turnaround Time (TAT)', target: '< 45 mins', actual: '41.2 mins', uom: 'Minutes', formula: 'Sum(Final Bill Print - Discharge Order) / Total Discharges', weightage: 35, status: 'Green', linkedKpiId: 'kpi-discharge-tat' },
      { id: 'kra-ip-2', name: 'Billing Accuracy / Zero Pre-Audit Leakage', target: '≥ 99.2%', actual: '99.5%', uom: '%', formula: '(Total Bills - Corrected Bills) / Total Bills * 100', weightage: 25, status: 'Green', linkedKpiId: 'kpi-audit-err' },
      { id: 'kra-ip-3', name: 'Same-Day DNFB Clearance', target: '100%', actual: '96.8%', uom: '%', formula: '(Cleared Discharges / Total Discharges) * 100', weightage: 20, status: 'Amber', linkedKpiId: 'kpi-dnfb' },
      { id: 'kra-ip-4', name: 'Patient Attender Financial Rating', target: '≥ 4.5 / 5.0', actual: '4.7 / 5.0', uom: 'Score', formula: 'Average Feedback Rating', weightage: 20, status: 'Green' }
    ],
    escalationRules: [
      { triggerCondition: 'Doctor discharge summary or clinical notes pending > 30 minutes', escalateTo: 'Medical Administration / Nursing In-Charge', slaMinutes: 15, mode: 'HIS Red Flag' },
      { triggerCondition: 'Billing discrepancy or tariff variance > ₹15,000 against pre-estimate', escalateTo: 'M. Balaji (IP Billing Lead)', slaMinutes: 20, mode: 'Huddle Escalation' },
      { triggerCondition: 'Pharmacy credit adjustment disputed or pharmacy return pending > 25 mins', escalateTo: 'Chief Pharmacist on Duty', slaMinutes: 15, mode: 'Emergency Call' }
    ],
    competencies: [
      { skill: 'HIS Inpatient Module & Tariff Engines', levelRequired: 'Level 3 (Autonomous)', currentLevel: 'Level 4 (Trainer/Expert)' },
      { skill: 'Implant & Consumable Cross-Matching', levelRequired: 'Level 3 (Autonomous)', currentLevel: 'Level 3 (Autonomous)' },
      { skill: 'De-escalation & Financial Counseling', levelRequired: 'Level 2 (Capable)', currentLevel: 'Level 3 (Autonomous)' }
    ]
  },
  {
    id: 'pos-tpa-lead',
    name: 'Karthik Natarajan',
    title: 'Lead - Insurance & TPA Claims Desk',
    tier: 'Tier 2',
    department: 'Insurance & TPA Claims',
    reportsTo: 'Priya Ramakrishnan',
    reportsToId: 'pos-billing-mgr',
    email: 'karthik.n@kauveryhospital.com',
    phone: '+91 98407 88901',
    shift: 'General (09:00 - 17:30)',
    avatarUrl: '/src/assets/images/avatar_tpa_lead_1791200144930.jpg',
    objective: 'Drive first-pass clean claim submission above 95%, accelerate cashless final approval TAT to under 60 minutes, and resolve insurance queries with zero clinical denial.',
    spanOfControl: 10,
    activeDischargesToday: 26,
    auditPassRate: 97.8,
    status: 'On Duty',
    dailyRoutine: [
      {
        id: 'rt-tpa-1',
        timeSlot: '08:00 - 09:00',
        taskTitle: 'TPA Portal Sync & Initial Authorization Tracking',
        description: 'Verify overnight emergency admissions. Check initial pre-auth status from Vidal, MediAssist, Paramount, FHPL, Star Health portals.',
        frequency: 'Daily',
        targetMinutes: 60,
        outputArtifact: 'Morning TPA Pipeline Report',
        verificationMethod: 'Portal Dashboard Export',
        status: 'Completed',
        completedAt: '08:50 AM',
      },
      {
        id: 'rt-tpa-2',
        timeSlot: '09:00 - 09:30',
        taskTitle: 'Tier 2 Supervisory Huddle',
        description: 'Lead shift coordination for 6 TPA executives. Allocate high-value claim scrutiny and coordinate ICU enhancements.',
        frequency: 'Daily',
        targetMinutes: 30,
        outputArtifact: 'Tier 2 Daily Allocation Matrix',
        verificationMethod: 'Huddle Minutes Logged',
        status: 'Completed',
        completedAt: '09:30 AM',
      },
      {
        id: 'rt-tpa-3',
        timeSlot: '13:00 - 15:30',
        taskTitle: 'Query Resolution & TPA Medical Desk Liaison',
        description: 'Follow up on medical queries, discrepancy requests, tariff clarification, and negotiate disallowed items.',
        frequency: 'Hourly',
        targetMinutes: 150,
        outputArtifact: 'Query Resolution Slips',
        verificationMethod: 'Portal Query Status: Cleared',
        status: 'Pending',
      }
    ],
    kras: [
      { id: 'kra-tpa-1', name: 'First-Pass Clean Claim Approval Rate', target: '≥ 95.0%', actual: '95.9%', uom: '%', formula: '(Approved without query / Total Submissions) * 100', weightage: 30, status: 'Green', linkedKpiId: 'kpi-clean-claim' },
      { id: 'kra-tpa-2', name: 'TPA Final Approval Turnaround Time', target: '< 60 mins', actual: '52 mins', uom: 'Minutes', formula: 'Average turnaround from final dossier upload to approval', weightage: 30, status: 'Green', linkedKpiId: 'kpi-tpa-query' },
      { id: 'kra-tpa-3', name: 'Insurance Denial Rate', target: '< 1.5%', actual: '1.1%', uom: '%', formula: '(Value of Rejected Claims / Total Claims) * 100', weightage: 25, status: 'Green' }
    ],
    escalationRules: [
      { triggerCondition: 'TPA approval delay exceeding 90 minutes from upload', escalateTo: 'Zonal TPA Relationship Manager & Billing Ops Manager', slaMinutes: 15, mode: 'Emergency Call' },
      { triggerCondition: 'Disallowed surgery or package component > ₹50,000 without prior query', escalateTo: 'Medical Superintendent / Treating Consultant', slaMinutes: 30, mode: 'HIS Red Flag' }
    ],
    competencies: [
      { skill: 'IRDAI Guidelines & Standardized Coding (ICD-10 / CPT)', levelRequired: 'Level 4 (Expert)', currentLevel: 'Level 4 (Expert)' },
      { skill: 'Payer Contract Terms & GIPSA PPN Packages', levelRequired: 'Level 4 (Expert)', currentLevel: 'Level 4 (Expert)' }
    ]
  },
  {
    id: 'pos-audit-lead',
    name: 'Meenakshi Sundaram',
    title: 'Senior Billing Auditor & Revenue Assurance Lead',
    tier: 'Tier 2',
    department: 'Audit & Revenue Assurance',
    reportsTo: 'Priya Ramakrishnan',
    reportsToId: 'pos-billing-mgr',
    email: 'meenakshi.s@kauveryhospital.com',
    phone: '+91 98410 11234',
    shift: 'General (09:00 - 17:30)',
    avatarUrl: '/src/assets/images/avatar_billing_head_1791200110291.jpg',
    objective: 'Safeguard hospital revenue integrity through pre-discharge clinical bill audits, verifying 100% of high-value implants, OT consumable kits, and oncology drug billing.',
    spanOfControl: 4,
    activeDischargesToday: 84,
    auditPassRate: 99.8,
    status: 'On Duty',
    dailyRoutine: [
      {
        id: 'rt-aud-1',
        timeSlot: '08:00 - 10:00',
        taskTitle: 'High-Value Surgical Case Sampling',
        description: 'Audit surgery bills > ₹1,50,000 (Cardiology, Orthopedics, Neuro). Match implant stickers and barcoded batch numbers.',
        frequency: 'Daily',
        targetMinutes: 120,
        outputArtifact: 'Implant Verification Audit Slips',
        verificationMethod: 'Barcode Scan Confirmation',
        status: 'Completed',
        completedAt: '09:45 AM',
      },
      {
        id: 'rt-aud-2',
        timeSlot: '14:00 - 16:00',
        taskTitle: 'Tariff Rate Card & Payer Package Compliance Check',
        description: 'Verify adherence to GIPSA, corporate MOUs, and scheme tariffs. Identify any unapproved manual discounts.',
        frequency: 'Daily',
        targetMinutes: 120,
        outputArtifact: 'Discrepancy Query Register',
        verificationMethod: 'Supervisor Alert in HIS',
        status: 'Pending',
      }
    ],
    kras: [
      { id: 'kra-aud-1', name: 'Pre-Discharge Audit Discrepancy Rate', target: '< 0.8%', actual: '0.65%', uom: '%', formula: '(Audit Defect Cases / Total Audits) * 100', weightage: 35, status: 'Green', linkedKpiId: 'kpi-audit-err' },
      { id: 'kra-aud-2', name: 'Revenue Leakage Recovered Prior to Settlement', target: '≥ ₹1,50,000/mo', actual: '₹2,10,000', uom: 'INR', formula: 'Sum of Unbilled Services Intercepted', weightage: 35, status: 'Green' }
    ],
    escalationRules: [
      { triggerCondition: 'Unbilled surgical implant or prosthesis exceeding ₹50,000', escalateTo: 'OT Nurse Manager & Chief Medical Officer', slaMinutes: 30, mode: 'Emergency Call' }
    ],
    competencies: [
      { skill: 'Clinical Documentation & Surgical Consumable Auditing', levelRequired: 'Level 4 (Expert)', currentLevel: 'Level 4 (Expert)' },
      { skill: 'Statistical Sampling & Defect Rate Tracking', levelRequired: 'Level 3 (Autonomous)', currentLevel: 'Level 3 (Autonomous)' }
    ]
  },
  {
    id: 'pos-op-lead',
    name: 'Rajesh Kumar',
    title: 'OPD & Emergency Billing In-Charge',
    tier: 'Tier 2',
    department: 'Outpatient (OP) & Daycare',
    reportsTo: 'Priya Ramakrishnan',
    reportsToId: 'pos-billing-mgr',
    email: 'rajesh.k@kauveryhospital.com',
    phone: '+91 98411 22345',
    shift: 'Morning (07:00 - 15:30)',
    avatarUrl: '/src/assets/images/avatar_tpa_lead_1791200144930.jpg',
    objective: 'Supervise 8 OPD & Emergency billing counters, maintaining patient counter queue time under 3 minutes, 100% test booking precision, and seamless shift cash balancing.',
    spanOfControl: 9,
    activeDischargesToday: 0,
    auditPassRate: 99.9,
    status: 'On Duty',
    dailyRoutine: [
      {
        id: 'rt-op-1',
        timeSlot: '07:30 - 08:30',
        taskTitle: 'Counter Readiness & Cash Float Issuance',
        description: 'Verify POS machines, token display systems, barcode printers, and issue physical float cash.',
        frequency: 'Daily',
        targetMinutes: 60,
        outputArtifact: 'Counter Readiness Checklist',
        verificationMethod: 'Executive Signature',
        status: 'Completed',
        completedAt: '08:15 AM',
      },
      {
        id: 'rt-op-2',
        timeSlot: '08:30 - 13:00',
        taskTitle: 'Peak OPD Counter Queue Monitoring & Line Balancing',
        description: 'Monitor token queue velocity. Open flexi-counters if queue length exceeds 5 patients.',
        frequency: 'Hourly',
        targetMinutes: 270,
        outputArtifact: 'Hourly Queue Throughput Log',
        verificationMethod: 'QMS System Analytics',
        status: 'Completed',
        completedAt: '12:45 PM',
      }
    ],
    kras: [
      { id: 'kra-op-1', name: 'OPD Billing Counter Wait Time', target: '< 3.0 mins', actual: '2.4 mins', uom: 'Minutes', formula: 'Average Token Wait Time to Receipt Generation', weightage: 35, status: 'Green' },
      { id: 'kra-op-2', name: 'Investigation Booking Accuracy', target: '≥ 99.5%', actual: '99.7%', uom: '%', formula: '(Correct Code Mappings / Total Bookings) * 100', weightage: 35, status: 'Green' }
    ],
    escalationRules: [
      { triggerCondition: 'EDC swipe machine or UPI gateway failure during peak hours', escalateTo: 'Bank Helpdesk & Hospital IT Desk', slaMinutes: 10, mode: 'Emergency Call' }
    ],
    competencies: [
      { skill: 'QMS Queue Analytics & Counter Balancing', levelRequired: 'Level 3 (Autonomous)', currentLevel: 'Level 4 (Expert)' }
    ]
  }
];

// Initial KPIs with Statistical Control Graph Data
const INITIAL_KPIS: Kpi[] = [
  {
    id: 'kpi-discharge-tat',
    code: 'KPI-IPD-01',
    title: 'Discharge-to-Final Bill Turnaround Time (TAT)',
    shortName: 'Discharge TAT',
    category: 'Velocity & TAT',
    positionId: 'pos-ip-exec',
    responsibleTitle: 'Senior IP Billing Executive (K. Saravanan)',
    department: 'Inpatient (IP) Billing',
    unit: 'min',
    target: 45.0,
    targetDirection: 'lower_is_better',
    historicalMean: 48.6,
    historicalUcl: 79.4,
    historicalLcl: 24.2,
    historicalSigma: 9.2,
    usl: 60.0,
    lsl: 15.0,
    subgroupSize: 15,
    stabilityStatus: 'Unstable', // Has special cause rule breach
    capabilityStatus: 'Borderline (1.0 ≤ Cpk < 1.33)',
    cp: 1.15,
    cpk: 1.08,
    dataPoints: [
      { id: 'p1', date: '2026-09-11', shift: 'Shift A', value: 44.2, sampleSize: 18, auditor: 'M. Balaji' },
      { id: 'p2', date: '2026-09-12', shift: 'Shift A', value: 46.8, sampleSize: 20, auditor: 'M. Balaji' },
      { id: 'p3', date: '2026-09-13', shift: 'Shift B', value: 51.2, sampleSize: 16, auditor: 'K. Saravanan' },
      { id: 'p4', date: '2026-09-14', shift: 'Shift A', value: 42.5, sampleSize: 22, auditor: 'M. Balaji' },
      { id: 'p5', date: '2026-09-15', shift: 'Shift B', value: 48.0, sampleSize: 19, auditor: 'K. Saravanan' },
      { id: 'p6', date: '2026-09-16', shift: 'Shift A', value: 45.1, sampleSize: 24, auditor: 'M. Balaji' },
      { id: 'p7', date: '2026-09-17', shift: 'Shift B', value: 49.3, sampleSize: 21, auditor: 'K. Saravanan' },
      { id: 'p8', date: '2026-09-18', shift: 'Shift A', value: 43.8, sampleSize: 20, auditor: 'M. Balaji' },
      { id: 'p9', date: '2026-09-19', shift: 'Shift B', value: 47.6, sampleSize: 18, auditor: 'K. Saravanan' },
      { id: 'p10', date: '2026-09-20', shift: 'Shift A', value: 41.5, sampleSize: 15, auditor: 'M. Balaji' },
      { id: 'p11', date: '2026-09-21', shift: 'Shift B', value: 50.4, sampleSize: 22, auditor: 'K. Saravanan' },
      { id: 'p12', date: '2026-09-22', shift: 'Shift A', value: 46.2, sampleSize: 19, auditor: 'M. Balaji' },
      { id: 'p13', date: '2026-09-23', shift: 'Shift B', value: 52.8, sampleSize: 25, auditor: 'K. Saravanan' },
      { id: 'p14', date: '2026-09-24', shift: 'Shift A', value: 45.9, sampleSize: 23, auditor: 'M. Balaji' },
      { id: 'p15', date: '2026-09-25', shift: 'Shift B', value: 48.7, sampleSize: 20, auditor: 'K. Saravanan' },
      { id: 'p16', date: '2026-09-26', shift: 'Shift A', value: 43.1, sampleSize: 22, auditor: 'M. Balaji' },
      { id: 'p17', date: '2026-09-27', shift: 'Shift B', value: 54.0, sampleSize: 17, auditor: 'K. Saravanan' },
      { id: 'p18', date: '2026-09-28', shift: 'Shift B', value: 88.5, sampleSize: 21, auditor: 'K. Saravanan', notes: 'Pharmacy credit delays on Ward 4', outOfControlRule: 'Rule 1: Point Beyond 3σ (UCL)', hasCapa: true, capaStatus: 'Implemented' },
      { id: 'p19', date: '2026-09-29', shift: 'Shift A', value: 47.2, sampleSize: 24, auditor: 'M. Balaji' },
      { id: 'p20', date: '2026-09-30', shift: 'Shift B', value: 46.0, sampleSize: 19, auditor: 'K. Saravanan' },
      { id: 'p21', date: '2026-10-01', shift: 'Shift A', value: 42.0, sampleSize: 26, auditor: 'M. Balaji' },
      { id: 'p22', date: '2026-10-02', shift: 'Shift B', value: 45.4, sampleSize: 22, auditor: 'K. Saravanan' },
      { id: 'p23', date: '2026-10-03', shift: 'Shift A', value: 40.8, sampleSize: 25, auditor: 'M. Balaji' },
      { id: 'p24', date: '2026-10-04', shift: 'Shift B', value: 44.5, sampleSize: 23, auditor: 'K. Saravanan' },
      { id: 'p25', date: '2026-10-05', shift: 'Shift A', value: 41.2, sampleSize: 27, auditor: 'M. Balaji', notes: 'Today live morning shift audit' },
    ]
  },
  {
    id: 'kpi-clean-claim',
    code: 'KPI-TPA-01',
    title: 'First-Pass Insurance Clean Claim Approval Rate (%)',
    shortName: 'Clean Claim Rate',
    category: 'Quality & Accuracy',
    positionId: 'pos-tpa-lead',
    responsibleTitle: 'Lead - Insurance & TPA Claims (Karthik Natarajan)',
    department: 'Insurance & TPA Claims',
    unit: '%',
    target: 95.0,
    targetDirection: 'higher_is_better',
    historicalMean: 92.4,
    historicalUcl: 98.6,
    historicalLcl: 84.2,
    historicalSigma: 2.4,
    usl: 100.0,
    lsl: 85.0,
    subgroupSize: 20,
    stabilityStatus: 'Stable',
    capabilityStatus: 'Capable (Cpk ≥ 1.33)',
    cp: 1.42,
    cpk: 1.38,
    dataPoints: [
      { id: 'c1', date: '2026-09-20', shift: 'General', value: 92.6, sampleSize: 20, auditor: 'Karthik N.' },
      { id: 'c2', date: '2026-09-21', shift: 'General', value: 93.5, sampleSize: 33, auditor: 'Karthik N.' },
      { id: 'c3', date: '2026-09-22', shift: 'General', value: 92.4, sampleSize: 29, auditor: 'Karthik N.' },
      { id: 'c4', date: '2026-09-23', shift: 'General', value: 94.8, sampleSize: 32, auditor: 'Karthik N.' },
      { id: 'c5', date: '2026-09-24', shift: 'General', value: 93.5, sampleSize: 28, auditor: 'Karthik N.' },
      { id: 'c6', date: '2026-09-25', shift: 'General', value: 95.0, sampleSize: 30, auditor: 'Karthik N.' },
      { id: 'c7', date: '2026-09-26', shift: 'General', value: 93.0, sampleSize: 25, auditor: 'Karthik N.' },
      { id: 'c8', date: '2026-09-27', shift: 'General', value: 94.2, sampleSize: 31, auditor: 'Karthik N.' },
      { id: 'c9', date: '2026-09-28', shift: 'General', value: 95.6, sampleSize: 34, auditor: 'Karthik N.' },
      { id: 'c10', date: '2026-09-29', shift: 'General', value: 94.7, sampleSize: 28, auditor: 'Karthik N.' },
      { id: 'c11', date: '2026-09-30', shift: 'General', value: 95.8, sampleSize: 35, auditor: 'Karthik N.' },
      { id: 'c12', date: '2026-10-01', shift: 'General', value: 96.2, sampleSize: 32, auditor: 'Karthik N.' },
      { id: 'c13', date: '2026-10-02', shift: 'General', value: 95.1, sampleSize: 30, auditor: 'Karthik N.' },
      { id: 'c14', date: '2026-10-03', shift: 'General', value: 96.4, sampleSize: 28, auditor: 'Karthik N.' },
      { id: 'c15', date: '2026-10-04', shift: 'General', value: 95.9, sampleSize: 31, auditor: 'Karthik N.' },
      { id: 'c16', date: '2026-10-05', shift: 'General', value: 96.5, sampleSize: 30, auditor: 'Karthik N.', notes: 'Today live shift audit' }
    ]
  },
  {
    id: 'kpi-dnfb',
    code: 'KPI-FIN-01',
    title: 'Discharged Not Final Billed (DNFB) Exposure in Days',
    shortName: 'DNFB Days',
    category: 'Financial & DNFB',
    positionId: 'pos-billing-mgr',
    responsibleTitle: 'Billing Operations Manager (Priya Ramakrishnan)',
    department: 'Audit & Revenue Assurance',
    unit: 'days',
    target: 1.20,
    targetDirection: 'lower_is_better',
    historicalMean: 1.45,
    historicalUcl: 2.35,
    historicalLcl: 0.55,
    historicalSigma: 0.30,
    usl: 1.80,
    lsl: 0.50,
    subgroupSize: 1,
    stabilityStatus: 'Stable',
    capabilityStatus: 'Capable (Cpk ≥ 1.33)',
    cp: 1.38,
    cpk: 1.35,
    dataPoints: [
      { id: 'd1', date: '2026-09-20', shift: 'General', value: 1.50, sampleSize: 1, auditor: 'Meenakshi S.' },
      { id: 'd2', date: '2026-09-21', shift: 'General', value: 1.62, sampleSize: 1, auditor: 'Meenakshi S.' },
      { id: 'd3', date: '2026-09-22', shift: 'General', value: 1.70, sampleSize: 1, auditor: 'Meenakshi S.' },
      { id: 'd4', date: '2026-09-23', shift: 'General', value: 1.58, sampleSize: 1, auditor: 'Meenakshi S.' },
      { id: 'd5', date: '2026-09-24', shift: 'General', value: 1.42, sampleSize: 1, auditor: 'Meenakshi S.' },
      { id: 'd6', date: '2026-09-25', shift: 'General', value: 1.36, sampleSize: 1, auditor: 'Meenakshi S.' },
      { id: 'd7', date: '2026-09-26', shift: 'General', value: 1.30, sampleSize: 1, auditor: 'Meenakshi S.' },
      { id: 'd8', date: '2026-09-27', shift: 'General', value: 1.28, sampleSize: 1, auditor: 'Meenakshi S.' },
      { id: 'd9', date: '2026-09-28', shift: 'General', value: 1.45, sampleSize: 1, auditor: 'Meenakshi S.' },
      { id: 'd10', date: '2026-09-29', shift: 'General', value: 1.35, sampleSize: 1, auditor: 'Meenakshi S.' },
      { id: 'd11', date: '2026-09-30', shift: 'General', value: 1.25, sampleSize: 1, auditor: 'Meenakshi S.' },
      { id: 'd12', date: '2026-10-01', shift: 'General', value: 1.20, sampleSize: 1, auditor: 'Meenakshi S.' },
      { id: 'd13', date: '2026-10-02', shift: 'General', value: 1.18, sampleSize: 1, auditor: 'Meenakshi S.' },
      { id: 'd14', date: '2026-10-03', shift: 'General', value: 1.22, sampleSize: 1, auditor: 'Meenakshi S.' },
      { id: 'd15', date: '2026-10-04', shift: 'General', value: 1.15, sampleSize: 1, auditor: 'Meenakshi S.' },
      { id: 'd16', date: '2026-10-05', shift: 'General', value: 1.12, sampleSize: 1, auditor: 'Meenakshi S.' }
    ]
  },
  {
    id: 'kpi-audit-err',
    code: 'KPI-AUD-01',
    title: 'Pre-Discharge Billing Audit Discrepancy Rate (%)',
    shortName: 'Audit Error Rate',
    category: 'Quality & Accuracy',
    positionId: 'pos-audit-lead',
    responsibleTitle: 'Lead Billing Auditor (Meenakshi Sundaram)',
    department: 'Audit & Revenue Assurance',
    unit: '%',
    target: 0.80,
    targetDirection: 'lower_is_better',
    historicalMean: 1.15,
    historicalUcl: 2.45,
    historicalLcl: 0.05,
    historicalSigma: 0.40,
    usl: 1.50,
    lsl: 0.00,
    subgroupSize: 25,
    stabilityStatus: 'Stable',
    capabilityStatus: 'Capable (Cpk ≥ 1.33)',
    cp: 1.40,
    cpk: 1.36,
    dataPoints: [
      { id: 'a1', date: '2026-09-25', shift: 'General', value: 0.90, sampleSize: 35, auditor: 'Meenakshi S.' },
      { id: 'a2', date: '2026-09-26', shift: 'General', value: 0.80, sampleSize: 32, auditor: 'Meenakshi S.' },
      { id: 'a3', date: '2026-09-27', shift: 'General', value: 1.10, sampleSize: 29, auditor: 'Meenakshi S.' },
      { id: 'a4', date: '2026-09-28', shift: 'General', value: 1.45, sampleSize: 34, auditor: 'Meenakshi S.' },
      { id: 'a5', date: '2026-09-29', shift: 'General', value: 1.00, sampleSize: 36, auditor: 'Meenakshi S.' },
      { id: 'a6', date: '2026-09-30', shift: 'General', value: 0.85, sampleSize: 30, auditor: 'Meenakshi S.' },
      { id: 'a7', date: '2026-10-01', shift: 'General', value: 0.78, sampleSize: 37, auditor: 'Meenakshi S.' },
      { id: 'a8', date: '2026-10-02', shift: 'General', value: 0.74, sampleSize: 35, auditor: 'Meenakshi S.' },
      { id: 'a9', date: '2026-10-03', shift: 'General', value: 0.82, sampleSize: 31, auditor: 'Meenakshi S.' },
      { id: 'a10', date: '2026-10-04', shift: 'General', value: 0.70, sampleSize: 33, auditor: 'Meenakshi S.' },
      { id: 'a11', date: '2026-10-05', shift: 'General', value: 0.65, sampleSize: 38, auditor: 'Meenakshi S.' }
    ]
  },
  {
    id: 'kpi-tpa-query',
    code: 'KPI-TPA-02',
    title: 'TPA Cashless Query Turnaround Time',
    shortName: 'TPA Query TAT',
    category: 'Velocity & TAT',
    positionId: 'pos-tpa-lead',
    responsibleTitle: 'Lead - Insurance & TPA Claims (Karthik Natarajan)',
    department: 'Insurance & TPA Claims',
    unit: 'min',
    target: 30.0,
    targetDirection: 'lower_is_better',
    historicalMean: 36.5,
    historicalUcl: 68.2,
    historicalLcl: 12.8,
    historicalSigma: 9.2,
    usl: 45.0,
    lsl: 10.0,
    subgroupSize: 10,
    stabilityStatus: 'Stable',
    capabilityStatus: 'Borderline (1.0 ≤ Cpk < 1.33)',
    cp: 1.22,
    cpk: 1.18,
    dataPoints: [
      { id: 'q1', date: '2026-09-25', shift: 'General', value: 30.5, sampleSize: 13, auditor: 'Anitha B.' },
      { id: 'q2', date: '2026-09-26', shift: 'General', value: 29.0, sampleSize: 12, auditor: 'Karthik N.' },
      { id: 'q3', date: '2026-09-27', shift: 'General', value: 34.2, sampleSize: 11, auditor: 'Anitha B.' },
      { id: 'q4', date: '2026-09-28', shift: 'General', value: 37.8, sampleSize: 16, auditor: 'Karthik N.' },
      { id: 'q5', date: '2026-09-29', shift: 'General', value: 31.5, sampleSize: 14, auditor: 'Anitha B.' },
      { id: 'q6', date: '2026-09-30', shift: 'General', value: 28.2, sampleSize: 13, auditor: 'Karthik N.' },
      { id: 'q7', date: '2026-10-01', shift: 'General', value: 27.5, sampleSize: 15, auditor: 'Anitha B.' },
      { id: 'q8', date: '2026-10-02', shift: 'General', value: 26.8, sampleSize: 16, auditor: 'Karthik N.' },
      { id: 'q9', date: '2026-10-03', shift: 'General', value: 29.1, sampleSize: 12, auditor: 'Anitha B.' },
      { id: 'q10', date: '2026-10-04', shift: 'General', value: 28.0, sampleSize: 14, auditor: 'Karthik N.' },
      { id: 'q11', date: '2026-10-05', shift: 'General', value: 25.4, sampleSize: 15, auditor: 'Anitha B.' }
    ]
  }
];

// Initial Cascading KPI Driver Tree
const INITIAL_KPI_TREE: KpiDriverNode = {
  id: 'tree-root',
  title: 'Kauvery Hospital Billing & Revenue Realization Excellence',
  level: 1,
  category: 'Financial & DNFB',
  currentValue: 94.8,
  targetValue: 96.0,
  unit: 'Index',
  weight: 100,
  status: 'Healthy',
  responsiblePositionId: 'pos-rcm-head',
  responsibleTitle: 'Regional Head - Business Excellence (Dr. S. Sundararajan)',
  description: 'Composite hospital daily work management performance combining discharge velocity, clean claim accuracy, and revenue realization.',
  children: [
    {
      id: 'tree-v',
      title: 'Discharge & Billing Velocity (TAT)',
      level: 2,
      category: 'Velocity & TAT',
      currentValue: 88.5,
      targetValue: 92.0,
      unit: '%',
      weight: 35,
      status: 'At-Risk',
      responsiblePositionId: 'pos-billing-mgr',
      responsibleTitle: 'Billing Operations Manager (Priya Ramakrishnan)',
      linkedKpiId: 'kpi-discharge-tat',
      description: 'Percentage of all patient discharges completed within the 45-minute clinical SLA without administrative delay.',
      children: [
        {
          id: 'tree-v1',
          title: 'IP Final Bill Preparation TAT',
          level: 3,
          category: 'Velocity & TAT',
          currentValue: 41.2,
          targetValue: 45.0,
          unit: 'min',
          weight: 40,
          status: 'Healthy',
          responsiblePositionId: 'pos-ip-exec',
          responsibleTitle: 'Senior IP Billing Exec (K. Saravanan)',
          linkedKpiId: 'kpi-discharge-tat',
          description: 'Time taken to cross-audit bed charges and generate final printed bill in HIS.',
        },
        {
          id: 'tree-v2',
          title: 'TPA Final Approval Turnaround',
          level: 3,
          category: 'Velocity & TAT',
          currentValue: 52.0,
          targetValue: 60.0,
          unit: 'min',
          weight: 35,
          status: 'Healthy',
          responsiblePositionId: 'pos-tpa-lead',
          responsibleTitle: 'Lead - TPA Claims (Karthik Natarajan)',
          linkedKpiId: 'kpi-tpa-query',
          description: 'Turnaround from upload of itemized dossier to cashless sanction receipt.',
        },
        {
          id: 'tree-v3',
          title: 'Pharmacy Return Credit Turnaround',
          level: 3,
          category: 'Velocity & TAT',
          currentValue: 18.5,
          targetValue: 20.0,
          unit: 'min',
          weight: 25,
          status: 'Healthy',
          responsiblePositionId: 'pos-ip-exec',
          responsibleTitle: 'Senior IP Billing Exec (K. Saravanan)',
          description: 'Time to physically inspect, credit, and post unused bed medications into patient ledger.',
        }
      ]
    },
    {
      id: 'tree-q',
      title: 'First-Pass Quality & Audit Yield',
      level: 2,
      category: 'Quality & Accuracy',
      currentValue: 95.9,
      targetValue: 96.0,
      unit: '%',
      weight: 35,
      status: 'Healthy',
      responsiblePositionId: 'pos-audit-lead',
      responsibleTitle: 'Lead Billing Auditor (Meenakshi Sundaram)',
      linkedKpiId: 'kpi-clean-claim',
      description: 'Zero-defect billing integrity, ensuring bills submitted to insurance or cash patients are audit-proof.',
      children: [
        {
          id: 'tree-q1',
          title: 'Clean Claim Submission Rate',
          level: 3,
          category: 'Quality & Accuracy',
          currentValue: 95.9,
          targetValue: 95.0,
          unit: '%',
          weight: 45,
          status: 'Healthy',
          responsiblePositionId: 'pos-tpa-lead',
          responsibleTitle: 'Lead - TPA Claims (Karthik Natarajan)',
          linkedKpiId: 'kpi-clean-claim',
          description: 'Claims accepted by payers without clarification queries or documentation deficiencies.',
        },
        {
          id: 'tree-q2',
          title: 'Pre-Discharge Audit Discrepancy Rate',
          level: 3,
          category: 'Quality & Accuracy',
          currentValue: 0.65,
          targetValue: 0.80,
          unit: '%',
          weight: 35,
          status: 'Healthy',
          responsiblePositionId: 'pos-audit-lead',
          responsibleTitle: 'Lead Billing Auditor (Meenakshi Sundaram)',
          linkedKpiId: 'kpi-audit-err',
          description: 'Variance discovered during high-risk surgery and ICU pre-discharge bill verification.',
        },
        {
          id: 'tree-q3',
          title: 'OPD Counter Booking Precision',
          level: 3,
          category: 'Quality & Accuracy',
          currentValue: 99.7,
          targetValue: 99.5,
          unit: '%',
          weight: 20,
          status: 'Healthy',
          responsiblePositionId: 'pos-op-lead',
          responsibleTitle: 'OPD In-Charge (Rajesh Kumar)',
          description: 'Correct test code and department routing for all outpatient consultation and diagnostics bookings.',
        }
      ]
    },
    {
      id: 'tree-f',
      title: 'Revenue Realization & DNFB Compression',
      level: 2,
      category: 'Financial & DNFB',
      currentValue: 96.4,
      targetValue: 95.0,
      unit: '%',
      weight: 30,
      status: 'Healthy',
      responsiblePositionId: 'pos-billing-mgr',
      responsibleTitle: 'Billing Operations Manager (Priya Ramakrishnan)',
      linkedKpiId: 'kpi-dnfb',
      description: 'Minimizing unbilled hospital revenue exposure (DNFB) and accelerating cash settlement velocity.',
      children: [
        {
          id: 'tree-f1',
          title: 'DNFB (Discharged Not Final Billed) Days',
          level: 3,
          category: 'Financial & DNFB',
          currentValue: 1.12,
          targetValue: 1.20,
          unit: 'days',
          weight: 50,
          status: 'Healthy',
          responsiblePositionId: 'pos-billing-mgr',
          responsibleTitle: 'Billing Operations Manager (Priya Ramakrishnan)',
          linkedKpiId: 'kpi-dnfb',
          description: 'Hospital days of gross revenue locked in unfinalized discharges awaiting clinical or insurer clearance.',
        },
        {
          id: 'tree-f2',
          title: 'Midday Shift Cash Balancing Accuracy',
          level: 3,
          category: 'Financial & DNFB',
          currentValue: 100.0,
          targetValue: 100.0,
          unit: '%',
          weight: 50,
          status: 'Healthy',
          responsiblePositionId: 'pos-op-lead',
          responsibleTitle: 'OPD In-Charge (Rajesh Kumar)',
          description: 'Zero discrepancy between physical vault escrow drops and HIS cashier collection receipts.',
        }
      ]
    }
  ]
};

export const DwmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewType>('organogram');
  const [selectedPositionId, setSelectedPositionId] = useState<string>('pos-ip-exec');
  const [selectedKpiId, setSelectedKpiId] = useState<string>('kpi-discharge-tat');
  const [positions, setPositions] = useState<Position[]>(INITIAL_POSITIONS);
  const [kpis, setKpis] = useState<Kpi[]>(INITIAL_KPIS);
  const [kpiTree, setKpiTree] = useState<KpiDriverNode>(INITIAL_KPI_TREE);
  const [selectedBranch, setSelectedBranch] = useState<string>('Chennai - Alwarpet (Main)');
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3800);
  };

  const addControlDataPoint = (
    kpiId: string, 
    pointData: { value: number; shift: string; sampleSize: number; notes?: string; auditor?: string }
  ) => {
    setKpis((prev) =>
      prev.map((k) => {
        if (k.id === kpiId) {
          const newPoint: ControlDataPoint = {
            id: `pt-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            shift: pointData.shift,
            value: pointData.value,
            sampleSize: pointData.sampleSize,
            auditor: pointData.auditor || 'Shift Lead',
            notes: pointData.notes,
          };

          // Nelson Rule 1 check: point > UCL or < LCL
          if (pointData.value > k.historicalUcl || pointData.value < k.historicalLcl) {
            newPoint.outOfControlRule = 'Rule 1: Point Beyond 3σ Limit';
          }

          const updatedPoints = [...k.dataPoints, newPoint];
          const sum = updatedPoints.reduce((acc, p) => acc + p.value, 0);
          const newMean = Number((sum / updatedPoints.length).toFixed(2));

          return {
            ...k,
            historicalMean: newMean,
            dataPoints: updatedPoints,
          };
        }
        return k;
      })
    );
    showToast(`Recorded new audit sample for ${kpis.find((k) => k.id === kpiId)?.shortName || 'metric'}`, 'success');
  };

  const updateRoutineTask = (
    positionId: string, 
    taskId: string, 
    status: 'Completed' | 'Pending' | 'Exception', 
    notes?: string
  ) => {
    setPositions((prev) =>
      prev.map((pos) => {
        if (pos.id === positionId) {
          const updatedRoutine = pos.dailyRoutine.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                status,
                completedAt: status === 'Completed' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
                notes: notes !== undefined ? notes : task.notes,
              };
            }
            return task;
          });
          return { ...pos, dailyRoutine: updatedRoutine };
        }
        return pos;
      })
    );
    showToast(`Task status updated to ${status}`, 'info');
  };

  const addRoutineTask = (positionId: string, task: Omit<RoutineTask, 'id'>) => {
    const newTask: RoutineTask = {
      ...task,
      id: `rt-custom-${Date.now()}`,
    };
    setPositions((prev) =>
      prev.map((pos) => {
        if (pos.id === positionId) {
          return { ...pos, dailyRoutine: [...pos.dailyRoutine, newTask] };
        }
        return pos;
      })
    );
    showToast('New standard work routine task added', 'success');
  };

  const value = useMemo(
    () => ({
      activeView,
      setActiveView,
      selectedPositionId,
      setSelectedPositionId,
      selectedKpiId,
      setSelectedKpiId,
      positions,
      kpis,
      kpiTree,
      setKpiTree,
      selectedBranch,
      setSelectedBranch,
      toast,
      showToast,
      addControlDataPoint,
      updateRoutineTask,
      addRoutineTask,
    }),
    [
      activeView,
      selectedPositionId,
      selectedKpiId,
      positions,
      kpis,
      kpiTree,
      selectedBranch,
      toast,
    ]
  );

  return <DwmContext.Provider value={value}>{children}</DwmContext.Provider>;
};

export const useDwm = (): DwmContextType => {
  const context = useContext(DwmContext);
  if (!context) {
    throw new Error('useDwm must be used within a DwmProvider');
  }
  return context;
};
