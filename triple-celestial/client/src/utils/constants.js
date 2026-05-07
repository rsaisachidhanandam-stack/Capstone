export const ROLES = {
  STUDENT: 'student',
  DEPARTMENT: 'department',
  TPO: 'tpo',
};

export const APPLICATION_STATUS = {
  APPLIED: 'applied',
  SHORTLISTED: 'shortlisted',
  FORWARDED_TO_TPO: 'forwarded_to_tpo',
  TPO_APPROVED: 'tpo_approved',
  FINAL_SELECTED: 'final_selected',
  REJECTED: 'rejected',
};

export const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  STUDENT: '/students',
  DEPARTMENT: '/departments',
  TPO: '/tpo',
  DRIVE: '/drives',
  APPLICATION: '/applications',
  RESUME: '/resumes',
  NOTIFICATION: '/notifications',
};
