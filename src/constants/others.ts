export const ROLES = {
  PATIENT: 'PATIENT',
  PHYSICIAN: 'PHYSICIAN',
  LAB_PHYSICIAN: 'LAB_PHYSICIAN',
  IMAGE_PHYSICIAN: 'IMAGE_PHYSICIAN',
};

export const DUTIES = {
  GENERAL_EXAMINATION: 'Khám sơ bộ',
  SPECIALIST_EXAMINATION: 'Khám chuyên khoa',
};

// All service type
export const SERVICE_TYPES = {
  GENERAL_CONSULTATION: 'Sơ bộ',
  SPECIALIST_CONSULTATION: 'Chuyên khoa',
  LABORATORY_TEST: 'Xét nghiệm',
  IMAGING_SCAN: 'Chụp chiếu',
};

// All service names except service has its type is general or specialist
export const SERVICE_NAMES = {
  // GENERAL_CONSULTATION: 'Khám sơ bộ',
  // NEUROLOGY_SPECIALIST_CONSULTATION: 'Khám chuyên khoa thần kinh',
  // CARDIOLOGY_SPECIALIST_CONSULTATION: 'Khám chuyên khoa tim mạch',
  BLOOD_BIOCHEMISTRY_TEST: 'Xét nghiệm hóa sinh máu',
  X_RAY_SCAN: 'Chụp X-quang',
};
