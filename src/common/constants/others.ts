export const ROLES = {
  PATIENT: 'PATIENT',
  PHYSICIAN: 'PHYSICIAN',
  LAB_PHYSICIAN: 'LAB_PHYSICIAN',
  IMAGE_PHYSICIAN: 'IMAGE_PHYSICIAN',
};

export const GENDER = {
  MALE: 'Nam',
  FEMALE: 'Nữ',
};

export const SERVICE_TYPES = {
  GENERAL_CONSULTATION: 'Sơ bộ',
  SPECIALIST_CONSULTATION: 'Chuyên khoa',
  LABORATORY_TEST: 'Xét nghiệm',
  IMAGING_SCAN: 'Chẩn đoán hình ảnh',
};

export const REPORT_TYPES = {
  DIAGNOSIS: 'diagnosis',
  IMAGING: 'imaging',
  LABORATORY: 'laboratory',
};

export const AGE_GROUP_LABELS = {
  CHILDREN: 'Children (0-12)',
  YOUTH: 'Youth (13-25)',
  ADULTS: 'Adults (26-40)',
  MIDDLE_AGED: 'Middle-aged (41-60)',
  SENIORS: 'Seniors (60+)',
};

export const QUEUE_NAME = {
  CLOSE_REPORT: 'close-report',
};

export const VALID_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const METADATA = {
  DEPARTMENT: 'Đông Đô',
  HOSPITAL: 'Bệnh viện Thanh Mai',
  PHONE: '0987654321',
  RECORD_NUMBER: '12345',
};

export const TEMPLATE_PATH = 'src/common/files/forms/reports/';
export const EXPORT_PATH = 'src/common/files/demos/';
export const PROCESS_PATH = process.cwd();
