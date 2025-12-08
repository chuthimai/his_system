// TODO: Dữ liệu chuyên khoa
export const SpecialtyData = [
  { identifier: 1, name: 'Đa khoa', description: '', contact: '' },
  { identifier: 2, name: 'Nội khoa', description: '', contact: '' },
  { identifier: 3, name: 'Ngoại khoa', description: '', contact: '' },
  { identifier: 4, name: 'Sản phụ khoa', description: '', contact: '' },
  { identifier: 5, name: 'Nhi khoa', description: '', contact: '' },
  { identifier: 6, name: 'Tai Mũi Họng', description: '', contact: '' },
  { identifier: 7, name: 'Mắt', description: '', contact: '' },
  { identifier: 8, name: 'Răng Hàm Mặt', description: '', contact: '' },
  { identifier: 9, name: 'Da liễu', description: '', contact: '' },
  { identifier: 10, name: 'Thần kinh', description: '', contact: '' },
  { identifier: 11, name: 'Tim mạch', description: '', contact: '' },
  // Xét nghiệm
  { identifier: 12, name: 'Hóa sinh', description: '', contact: '' },
  { identifier: 13, name: 'Huyết học', description: '', contact: '' },
  { identifier: 14, name: 'Huyết học lâm sàng', description: '', contact: '' },
  { identifier: 15, name: 'Sinh lý thần kinh', description: '', contact: '' },
  { identifier: 16, name: 'Sinh lý hô hấp', description: '', contact: '' },
  // Chẩn đoán hình ảnh
  { identifier: 17, name: 'Chẩn đoán hình ảnh', description: '', contact: '' },
];

// TODO: Dữ liệu vị trí, địa điểm
// 5 Phòng xét nghiệm, 5 Phòng chẩn đoán hình ảnh
export const LocationData = [
  // --- Tòa nhà ---
  {
    identifier: 1,
    type: 'Tòa nhà',
    name: 'Tòa A',
    parentIdentifier: null as unknown as number,
  },
  {
    identifier: 2,
    type: 'Tòa nhà',
    name: 'Tòa B',
    parentIdentifier: null as unknown as number,
  },

  // --- Tầng - Tòa A ---
  { identifier: 3, type: 'Tầng', name: 'Tầng 1', parentIdentifier: 1 },
  { identifier: 4, type: 'Tầng', name: 'Tầng 2', parentIdentifier: 1 },
  { identifier: 5, type: 'Tầng', name: 'Tầng 3', parentIdentifier: 1 },

  // --- Tầng - Tòa B ---
  { identifier: 6, type: 'Tầng', name: 'Tầng 1', parentIdentifier: 2 },
  { identifier: 7, type: 'Tầng', name: 'Tầng 2', parentIdentifier: 2 },
  { identifier: 8, type: 'Tầng', name: 'Tầng 3', parentIdentifier: 2 },

  // --- Phòng thuộc tầng 1 của Tòa A ---
  {
    identifier: 9,
    type: 'Phòng',
    name: 'Vị trí 1 sảnh A',
    parentIdentifier: 3,
  },
  {
    identifier: 10,
    type: 'Phòng',
    name: 'Phòng Đa khoa 1',
    parentIdentifier: 3,
  },
  {
    identifier: 11,
    type: 'Phòng',
    name: 'Phòng Nội khoa 1',
    parentIdentifier: 3,
  },
  {
    identifier: 12,
    type: 'Phòng',
    name: 'Phòng Nội khoa 2',
    parentIdentifier: 3,
  },

  // --- Phòng thuộc tầng 2 của Tòa A ---
  {
    identifier: 13,
    type: 'Phòng',
    name: 'Phòng Ngoại khoa 1',
    parentIdentifier: 4,
  },
  {
    identifier: 14,
    type: 'Phòng',
    name: 'Phòng Ngoại khoa 2',
    parentIdentifier: 4,
  },

  // --- Phòng thuộc tầng 3 của Tòa A ---
  {
    identifier: 15,
    type: 'Phòng',
    name: 'Phòng Sản phụ khoa 1',
    parentIdentifier: 5,
  },
  {
    identifier: 16,
    type: 'Phòng',
    name: 'Phòng Sản phụ khoa 2',
    parentIdentifier: 5,
  },

  // --- Phòng thuộc tầng 1 của Tòa B ---
  {
    identifier: 17,
    type: 'Phòng',
    name: 'Phòng Nhi khoa 1',
    parentIdentifier: 6,
  },
  {
    identifier: 18,
    type: 'Phòng',
    name: 'Phòng Nhi khoa 2',
    parentIdentifier: 6,
  },

  // --- Phòng thuộc tầng 2 của Tòa B ---
  {
    identifier: 19,
    type: 'Phòng',
    name: 'Phòng Tai Mũi Họng 1',
    parentIdentifier: 7,
  },
  {
    identifier: 20,
    type: 'Phòng',
    name: 'Phòng Tai Mũi Họng 2',
    parentIdentifier: 7,
  },

  // --- Phòng thuộc tầng 3 của Tòa B ---
  { identifier: 21, type: 'Phòng', name: 'Phòng Mắt 1', parentIdentifier: 8 },
  { identifier: 22, type: 'Phòng', name: 'Phòng Mắt 2', parentIdentifier: 8 },

  // --- Phòng bổ sung thuộc tầng 1 của Tòa A ---
  {
    identifier: 23,
    type: 'Phòng',
    name: 'Phòng Răng Hàm Mặt 1',
    parentIdentifier: 3,
  },
  {
    identifier: 24,
    type: 'Phòng',
    name: 'Phòng Răng Hàm Mặt 2',
    parentIdentifier: 3,
  },

  // --- Phòng bổ sung thuộc tầng 2 của Tòa A ---
  {
    identifier: 25,
    type: 'Phòng',
    name: 'Phòng Da liễu 1',
    parentIdentifier: 4,
  },
  {
    identifier: 26,
    type: 'Phòng',
    name: 'Phòng Da liễu 2',
    parentIdentifier: 4,
  },

  // --- Phòng bổ sung thuộc tầng 3 của Tòa A ---
  {
    identifier: 27,
    type: 'Phòng',
    name: 'Phòng Thần kinh 1',
    parentIdentifier: 5,
  },
  {
    identifier: 28,
    type: 'Phòng',
    name: 'Phòng Thần kinh 2',
    parentIdentifier: 5,
  },

  // --- Phòng bổ sung thuộc tầng 1 của Tòa B ---
  {
    identifier: 29,
    type: 'Phòng',
    name: 'Phòng Tim mạch 1',
    parentIdentifier: 6,
  },
  {
    identifier: 30,
    type: 'Phòng',
    name: 'Phòng Tim mạch 2',
    parentIdentifier: 6,
  },

  // --- Phòng Xét nghiệm thuộc tầng 2 của Tòa B ---
  {
    identifier: 31,
    type: 'Phòng',
    name: 'Phòng Xét nghiệm 1',
    parentIdentifier: 7,
  },
  {
    identifier: 32,
    type: 'Phòng',
    name: 'Phòng Xét nghiệm 2',
    parentIdentifier: 7,
  },
  {
    identifier: 33,
    type: 'Phòng',
    name: 'Phòng Xét nghiệm 3',
    parentIdentifier: 7,
  },
  {
    identifier: 34,
    type: 'Phòng',
    name: 'Phòng Xét nghiệm 4',
    parentIdentifier: 7,
  },
  {
    identifier: 35,
    type: 'Phòng',
    name: 'Phòng Xét nghiệm 5',
    parentIdentifier: 7,
  },

  // --- Phòng Chẩn đoán hình ảnh thuộc tầng 3 của Tòa B ---
  {
    identifier: 36,
    type: 'Phòng',
    name: 'Phòng Chẩn đoán hình ảnh 1',
    parentIdentifier: 8,
  },
  {
    identifier: 37,
    type: 'Phòng',
    name: 'Phòng Chẩn đoán hình ảnh 2',
    parentIdentifier: 8,
  },
  {
    identifier: 38,
    type: 'Phòng',
    name: 'Phòng Chẩn đoán hình ảnh 3',
    parentIdentifier: 8,
  },
  {
    identifier: 39,
    type: 'Phòng',
    name: 'Phòng Chẩn đoán hình ảnh 4',
    parentIdentifier: 8,
  },
  {
    identifier: 40,
    type: 'Phòng',
    name: 'Phòng Chẩn đoán hình ảnh 5',
    parentIdentifier: 8,
  },
];

// TODO: Dữ liệu người dùng
export const UserData = [
  // ----------------------Bệnh nhân------------------------------
  {
    identifier: 1,
    name: 'Nguyễn Văn Hùng',
    email: 'hung.nguyen1987@gmail.com',
    telecom: '0985123456',
    birthDate: '1987-03-22',
    gender: true,
    address: 'Số 35, phố Trần Duy Hưng, phường Trung Hòa, thành phố Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'PATIENT',
  },
  {
    identifier: 1000000001,
    name: 'Trần Thị Lan',
    email: 'tran.lan98@gmail.com',
    telecom: '0912345678',
    birthDate: '1998-07-15',
    gender: false,
    address: 'Số 22, đường Lạc Long Quân, phường Nhật Tân, thành phố Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'PATIENT',
  },
  {
    identifier: 1000000002,
    name: 'Phạm Đức Minh',
    email: 'minh.pham78@gmail.com',
    telecom: '0978654321',
    birthDate: '1978-11-03',
    gender: true,
    address: 'Số 10, phố Nguyễn Trãi, phường Thượng Đình, thành phố Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'PATIENT',
  },
  {
    identifier: 1000000003,
    name: 'Lê Thị Hương',
    email: 'le.huong92@gmail.com',
    telecom: '0903456789',
    birthDate: '1992-05-19',
    gender: false,
    address: 'Số 88, phố Bà Triệu, phường Nguyễn Du, thành phố Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'PATIENT',
  },
  {
    identifier: 1000000004,
    name: 'Đỗ Văn Quân',
    email: 'do.quan04@gmail.com',
    telecom: '0934567890',
    birthDate: '2004-09-08',
    gender: true,
    address: 'Số 12, đường Hoàng Quốc Việt, phường Nghĩa Tân, thành phố Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'PATIENT',
  },
  {
    identifier: 1000000005,
    name: 'Ngô Thị Mai',
    email: 'mai.ngo85@gmail.com',
    telecom: '0987564321',
    birthDate: '1985-11-12',
    gender: false,
    address: 'Số 9, phố Kim Mã, phường Giảng Võ, thành phố Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'PATIENT',
  },
  {
    identifier: 1000000006,
    name: 'Vũ Văn Long',
    email: 'long.vu91@gmail.com',
    telecom: '0912789456',
    birthDate: '1991-04-08',
    gender: true,
    address: 'Số 21, phố Láng Hạ, phường Thành Công, thành phố Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'PATIENT',
  },
  {
    identifier: 1000000007,
    name: 'Phan Thị Hòa',
    email: 'hoa.phan99@gmail.com',
    telecom: '0965234789',
    birthDate: '1999-06-25',
    gender: false,
    address: 'Số 47, đường Nguyễn Xiển, phường Hạ Đình, thành phố Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'PATIENT',
  },
  {
    identifier: 1000000008,
    name: 'Đặng Quang Vinh',
    email: 'vinh.dang80@gmail.com',
    telecom: '0906123987',
    birthDate: '1980-01-30',
    gender: true,
    address:
      'Số 2, đường Nguyễn Chí Thanh, phường Ngọc Khánh, thành phố Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'PATIENT',
  },
  {
    identifier: 1000000009,
    name: 'Trịnh Thu Trang',
    email: 'trang.trinh95@gmail.com',
    telecom: '0938542761',
    birthDate: '1995-08-17',
    gender: false,
    address: 'Số 33, phố Tôn Đức Thắng, phường Quốc Tử Giám, thành phố Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'PATIENT',
  },

  // ----------------------BS. Đa khoa------------------------------
  {
    identifier: 2,
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@his.vn',
    telecom: '0911000001',
    birthDate: '1980-01-01',
    gender: true,
    address: '10 Lê Lợi, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'GENERAL_PHYSICIAN',
  },
  {
    identifier: 2000000001,
    name: 'Trần Thị Bình',
    email: 'binh.tran@his.vn',
    telecom: '0911000002',
    birthDate: '1982-02-02',
    gender: false,
    address: '12 Lê Lợi, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'GENERAL_PHYSICIAN',
  },

  // ----------------------BS. Nội khoa------------------------------
  {
    identifier: 3,
    name: 'Nguyễn Văn Minh',
    email: 'minh.nguyen@his.vn',
    telecom: '0912345678',
    birthDate: '1980-03-12',
    gender: true,
    address: '12 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'INTERNAL_PHYSICIAN',
  },
  {
    identifier: 3000000001,
    name: 'Trần Thị Lan',
    email: 'lan.tran@his.vn',
    telecom: '0912345679',
    birthDate: '1982-04-15',
    gender: false,
    address: '15 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'INTERNAL_PHYSICIAN',
  },

  // ----------------------BS. Ngoại khoa------------------------------
  {
    identifier: 3000000002,
    name: 'Trần Hữu Phát',
    email: 'phat.tran@his.vn',
    telecom: '0905123456',
    birthDate: '1978-07-25',
    gender: true,
    address: '45 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'SURGICAL_PHYSICIAN',
  },
  {
    identifier: 3000000003,
    name: 'Lê Văn Hưng',
    email: 'hung.le@his.vn',
    telecom: '0905123457',
    birthDate: '1979-09-12',
    gender: true,
    address: '47 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'SURGICAL_PHYSICIAN',
  },

  // ----------------------BS. Sản phụ khoa------------------------------
  {
    identifier: 3000000004,
    name: 'Lê Thị Thu Hà',
    email: 'ha.le@his.vn',
    telecom: '0978456123',
    birthDate: '1985-11-05',
    gender: false,
    address: '23 Hai Bà Trưng, Quận 1, TP.HCM',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'OBSTETRIC_PHYSICIAN',
  },

  // ----------------------BS. Nhi khoa------------------------------
  {
    identifier: 3000000005,
    name: 'Phạm Anh Dũng',
    email: 'dung.pham@his.vn',
    telecom: '0909789123',
    birthDate: '1983-01-18',
    gender: true,
    address: '56 Trần Hưng Đạo, Quận 5, TP.HCM',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'PEDIATRIC_PHYSICIAN',
  },

  // ----------------------BS. Tai Mũi Họng------------------------------
  {
    identifier: 3000000006,
    name: 'Nguyễn Thanh Tùng',
    email: 'tung.nguyen@his.vn',
    telecom: '0932346789',
    birthDate: '1981-09-20',
    gender: true,
    address: '89 Nguyễn Văn Linh, Đà Nẵng',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'ENT_PHYSICIAN',
  },

  // ----------------------BS. Mắt------------------------------
  {
    identifier: 3000000007,
    name: 'Đỗ Thị Mai',
    email: 'mai.do@his.vn',
    telecom: '0945345678',
    birthDate: '1986-04-09',
    gender: false,
    address: '101 Cách Mạng Tháng 8, Quận 3, TP.HCM',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'OPHTHALMOLOGY_PHYSICIAN',
  },

  // ----------------------BS. Răng Hàm Mặt------------------------------
  {
    identifier: 3000000008,
    name: 'Lê Hoàng Nam',
    email: 'nam.le@his.vn',
    telecom: '0923456123',
    birthDate: '1984-02-14',
    gender: true,
    address: '34 Pasteur, Quận 1, TP.HCM',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'DENTAL_PHYSICIAN',
  },

  // ----------------------BS. Da liễu------------------------------
  {
    identifier: 3000000009,
    name: 'Vũ Ngọc Hương',
    email: 'huong.vu@his.vn',
    telecom: '0968234567',
    birthDate: '1987-06-28',
    gender: false,
    address: '78 Lạch Tray, Ngô Quyền, Hải Phòng',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'DERMATOLOGY_PHYSICIAN',
  },

  // ----------------------BS. Thần kinh------------------------------
  {
    identifier: 3000000010,
    name: 'Trịnh Văn Quang',
    email: 'quang.trinh@his.vn',
    telecom: '0907654321',
    birthDate: '1979-10-11',
    gender: true,
    address: '65 Nguyễn Lương Bằng, Đống Đa, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'NEUROLOGY_PHYSICIAN',
  },

  // ----------------------BS. Tim mạch------------------------------
  {
    identifier: 3000000011,
    name: 'Hoàng Thị Lan',
    email: 'lan.hoang@his.vn',
    telecom: '0987456321',
    birthDate: '1988-12-03',
    gender: false,
    address: '90 Nguyễn Huệ, Quận 1, TP.HCM',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'CARDIOLOGY_PHYSICIAN',
  },

  // ----------------------BS. Xét nghiệm hóa sinh------------------------------
  {
    identifier: 4,
    name: 'Nguyễn Thị Hà',
    email: 'ha.nguyen@his.vn',
    telecom: '0905003001',
    birthDate: '1984-02-11',
    gender: false,
    address: '20 Trần Hưng Đạo, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'BIOCHEMISTRY_PHYSICIAN', // Hóa sinh
  },
  {
    identifier: 4000000001,
    name: 'Phạm Văn Nam',
    email: 'nam.pham@his.vn',
    telecom: '0905003002',
    birthDate: '1982-06-03',
    gender: true,
    address: '32 Hai Bà Trưng, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'BIOCHEMISTRY_PHYSICIAN',
  },

  // ----------------------BS. Xét nghiệm huyết học------------------------------
  {
    identifier: 4000000002,
    name: 'Lê Minh Tuấn',
    email: 'tuan.le@his.vn',
    telecom: '0905004001',
    birthDate: '1985-09-09',
    gender: true,
    address: '25 Phan Chu Trinh, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'HEMATOLOGY_PHYSICIAN',
  },

  // ----------------------BS. Xét nghiệm huyết học lâm sàng------------------------------
  {
    identifier: 4000000003,
    name: 'Đặng Thị Lan',
    email: 'lan.dang@his.vn',
    telecom: '0905005001',
    birthDate: '1984-05-20',
    gender: false,
    address: '70 Trần Khát Chân, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'CLINICAL_HEMATOLOGY_PHYSICIAN',
  },

  // ----------------------BS. Chẩn đoán hình ảnh------------------------------
  {
    identifier: 5,
    name: 'Nguyễn Văn Tâm',
    email: 'tam.nguyen@his.vn',
    telecom: '0904002002',
    birthDate: '1983-05-12',
    gender: true,
    address: '34 Nguyễn Huệ, TP.HCM',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'RADIOLOGY_PHYSICIAN',
  },
  {
    identifier: 5000000001,
    name: 'Trần Hữu Đức',
    email: 'duc.tran@his.vn',
    telecom: '0904002003',
    birthDate: '1982-02-25',
    gender: true,
    address: '98 Pasteur, Quận 3, TP.HCM',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'RADIOLOGY_PHYSICIAN',
  },
];

export const StaffData = UserData.filter((user) => user.role !== 'PATIENT').map(
  (user) => ({
    identifier: user.identifier,
    active: true,
    startDate: '2025-01-01',
    endDate: undefined,
  }),
);

// TODO: Dữ liệu bác sĩ
const ROLE_TO_SPECIALTY_MAP: Record<string, number> = {
  GENERAL_PHYSICIAN: 1,
  INTERNAL_PHYSICIAN: 2,
  SURGICAL_PHYSICIAN: 3,
  OBSTETRIC_PHYSICIAN: 4,
  PEDIATRIC_PHYSICIAN: 5,
  ENT_PHYSICIAN: 6,
  OPHTHALMOLOGY_PHYSICIAN: 7,
  DENTAL_PHYSICIAN: 8,
  DERMATOLOGY_PHYSICIAN: 9,
  NEUROLOGY_PHYSICIAN: 10,
  CARDIOLOGY_PHYSICIAN: 11,
  BIOCHEMISTRY_PHYSICIAN: 12,
  HEMATOLOGY_PHYSICIAN: 13,
  CLINICAL_HEMATOLOGY_PHYSICIAN: 14,
  RADIOLOGY_PHYSICIAN: 17,
};
export const PhysicianData = UserData.filter(
  (user) => user.role !== 'PATIENT',
).map((user) => ({
  identifier: user.identifier,
  specialtyIdentifier: ROLE_TO_SPECIALTY_MAP[user.role] ?? null,
}));

// TODO: Dữ liệu bằng cấp
export const QualificationData = [
  // Đa khoa
  {
    identifier: 1,
    name: 'Bằng tốt nghiệp Đại học Y - Đa khoa',
    specialty: 'Đa khoa',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2008-06-15',
    expiredDate: undefined,
    physicianIdentifier: 2,
  },
  {
    identifier: 2,
    name: 'Chứng chỉ chuyên khoa - Đa khoa',
    specialty: 'Đa khoa',
    issuer: 'Bộ Y tế',
    type: 'Chứng chỉ',
    effectiveDate: '2012-05-10',
    expiredDate: undefined,
    physicianIdentifier: 2,
  },

  {
    identifier: 3,
    name: 'Bằng tốt nghiệp Đại học Y - Đa khoa',
    specialty: 'Đa khoa',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2008-06-15',
    expiredDate: undefined,
    physicianIdentifier: 2000000001,
  },

  // Nội khoa
  {
    identifier: 4,
    name: 'Bằng tốt nghiệp Đại học Y - Nội khoa',
    specialty: 'Nội khoa',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2009-07-20',
    expiredDate: undefined,
    physicianIdentifier: 3,
  },
  {
    identifier: 5,
    name: 'Chứng chỉ chuyên khoa Nội',
    specialty: 'Nội khoa',
    issuer: 'Bộ Y tế',
    type: 'Chứng chỉ',
    effectiveDate: '2013-09-11',
    expiredDate: undefined,
    physicianIdentifier: 3,
  },

  {
    identifier: 6,
    name: 'Bằng tốt nghiệp Đại học Y - Nội khoa',
    specialty: 'Nội khoa',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2009-07-20',
    expiredDate: undefined,
    physicianIdentifier: 3000000001,
  },

  // Ngoại khoa
  {
    identifier: 7,
    name: 'Bằng tốt nghiệp Đại học Y - Ngoại khoa',
    specialty: 'Ngoại khoa',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2007-05-18',
    expiredDate: undefined,
    physicianIdentifier: 3000000002,
  },
  {
    identifier: 8,
    name: 'Chứng chỉ phẫu thuật nâng cao',
    specialty: 'Ngoại khoa',
    issuer: 'Bộ Y tế',
    type: 'Chứng chỉ',
    effectiveDate: '2012-02-21',
    expiredDate: undefined,
    physicianIdentifier: 3000000002,
  },

  {
    identifier: 9,
    name: 'Bằng tốt nghiệp Đại học Y - Ngoại khoa',
    specialty: 'Ngoại khoa',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2007-05-18',
    expiredDate: undefined,
    physicianIdentifier: 3000000003,
  },

  // Sản phụ khoa
  {
    identifier: 10,
    name: 'Bằng tốt nghiệp Đại học Y - Sản phụ khoa',
    specialty: 'Sản phụ khoa',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2008-12-01',
    expiredDate: undefined,
    physicianIdentifier: 3000000004,
  },
  {
    identifier: 11,
    name: 'Chứng chỉ Sản phụ khoa nâng cao',
    specialty: 'Sản phụ khoa',
    issuer: 'Bộ Y tế',
    type: 'Chứng chỉ',
    effectiveDate: '2014-03-20',
    expiredDate: undefined,
    physicianIdentifier: 3000000004,
  },

  // Nhi khoa
  {
    identifier: 12,
    name: 'Bằng tốt nghiệp Đại học Y - Nhi khoa',
    specialty: 'Nhi khoa',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2009-04-12',
    expiredDate: undefined,
    physicianIdentifier: 3000000005,
  },

  // Tai Mũi Họng
  {
    identifier: 13,
    name: 'Bằng tốt nghiệp Đại học Y - Tai Mũi Họng',
    specialty: 'Tai Mũi Họng',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2008-09-09',
    expiredDate: undefined,
    physicianIdentifier: 3000000006,
  },

  // Mắt
  {
    identifier: 14,
    name: 'Bằng tốt nghiệp Đại học Y - Nhãn khoa',
    specialty: 'Mắt',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2009-03-14',
    expiredDate: undefined,
    physicianIdentifier: 3000000007,
  },

  // Răng Hàm Mặt
  {
    identifier: 15,
    name: 'Bằng tốt nghiệp ĐH Y - Răng Hàm Mặt',
    specialty: 'Răng Hàm Mặt',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2010-06-22',
    expiredDate: undefined,
    physicianIdentifier: 3000000008,
  },

  // Da liễu
  {
    identifier: 16,
    name: 'Bằng tốt nghiệp Đại học Y - Da liễu',
    specialty: 'Da liễu',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2011-01-18',
    expiredDate: undefined,
    physicianIdentifier: 3000000009,
  },

  // Thần kinh
  {
    identifier: 17,
    name: 'Bằng tốt nghiệp Đại học Y - Thần kinh',
    specialty: 'Thần kinh',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2008-08-12',
    expiredDate: undefined,
    physicianIdentifier: 3000000010,
  },

  // Tim mạch
  {
    identifier: 18,
    name: 'Bằng tốt nghiệp Đại học Y - Tim mạch',
    specialty: 'Tim mạch',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2008-03-17',
    expiredDate: undefined,
    physicianIdentifier: 3000000011,
  },

  // Hóa sinh
  {
    identifier: 19,
    name: 'Bằng tốt nghiệp Đại học Y - Hóa sinh',
    specialty: 'Hóa sinh',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2008-07-17',
    expiredDate: undefined,
    physicianIdentifier: 4,
  },
  {
    identifier: 20,
    name: 'Bằng tốt nghiệp Đại học Y - Hóa sinh',
    specialty: 'Hóa sinh',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2008-07-17',
    expiredDate: undefined,
    physicianIdentifier: 4000000001,
  },

  // Huyết học
  {
    identifier: 21,
    name: 'Bằng tốt nghiệp Đại học Y - Huyết học',
    specialty: 'Huyết học',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2009-06-10',
    expiredDate: undefined,
    physicianIdentifier: 4000000002,
  },

  // Huyết học lâm sàng
  {
    identifier: 22,
    name: 'Bằng tốt nghiệp Đại học Y - Huyết học lâm sàng',
    specialty: 'Huyết học lâm sàng',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2010-01-22',
    expiredDate: undefined,
    physicianIdentifier: 4000000003,
  },

  // Chẩn đoán hình ảnh
  {
    identifier: 23,
    name: 'Bằng tốt nghiệp Đại học Y - CĐHA',
    specialty: 'Chẩn đoán hình ảnh',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2007-11-05',
    expiredDate: undefined,
    physicianIdentifier: 5,
  },
  {
    identifier: 24,
    name: 'Bằng tốt nghiệp Đại học Y - CĐHA',
    specialty: 'Chẩn đoán hình ảnh',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2007-11-05',
    expiredDate: undefined,
    physicianIdentifier: 5000000001,
  },
];

// TODO: Dịch vụ
export const ServiceData = [
  // --- Khám sơ bộ ---
  {
    identifier: 1,
    type: 'Sơ bộ',
    name: 'Khám sơ bộ',
    detailDescription: '',
    price: 500,
    active: true,
    locationIdentifier: 9,
  },

  // --- Chuyên khoa ---
  {
    identifier: 3,
    type: 'Chuyên khoa',
    name: 'Khám Nội khoa',
    detailDescription: '',
    price: 1500,
    active: true,
    locationIdentifier: 11,
  },
  {
    identifier: 4,
    type: 'Chuyên khoa',
    name: 'Khám Ngoại khoa',
    detailDescription: '',
    price: 2000,
    active: true,
    locationIdentifier: 13,
  },
  {
    identifier: 5,
    type: 'Chuyên khoa',
    name: 'Khám Sản phụ khoa',
    detailDescription: '',
    price: 1800,
    active: true,
    locationIdentifier: 15,
  },
  {
    identifier: 6,
    type: 'Chuyên khoa',
    name: 'Khám Nhi khoa',
    detailDescription: '',
    price: 1500,
    active: true,
    locationIdentifier: 17,
  },
  {
    identifier: 7,
    type: 'Chuyên khoa',
    name: 'Khám Tai Mũi Họng',
    detailDescription: '',
    price: 1600,
    active: true,
    locationIdentifier: 19,
  },
  {
    identifier: 8,
    type: 'Chuyên khoa',
    name: 'Khám Mắt',
    detailDescription: '',
    price: 1600,
    active: true,
    locationIdentifier: 21,
  },
  {
    identifier: 9,
    type: 'Chuyên khoa',
    name: 'Khám Răng Hàm Mặt',
    detailDescription: '',
    price: 1700,
    active: true,
    locationIdentifier: 23,
  },
  {
    identifier: 10,
    type: 'Chuyên khoa',
    name: 'Khám Da liễu',
    detailDescription: '',
    price: 1500,
    active: true,
    locationIdentifier: 25,
  },
  {
    identifier: 11,
    type: 'Chuyên khoa',
    name: 'Khám Thần kinh',
    detailDescription: '',
    price: 1800,
    active: true,
    locationIdentifier: 27,
  },
  {
    identifier: 12,
    type: 'Chuyên khoa',
    name: 'Khám Tim mạch',
    detailDescription: '',
    price: 2000,
    active: true,
    locationIdentifier: 29,
  },

  // --- Xét nghiệm ---
  {
    identifier: 13,
    type: 'Xét nghiệm',
    name: 'Xét nghiệm hóa sinh máu',
    detailDescription: '',
    price: 1300,
    active: true,
    locationIdentifier: 31,
  },
  {
    identifier: 14,
    type: 'Xét nghiệm',
    name: 'Xét nghiệm huyết học',
    detailDescription: '',
    price: 1200,
    active: true,
    locationIdentifier: 32,
  },
  {
    identifier: 15,
    type: 'Xét nghiệm',
    name: 'Xét nghiệm sinh thiết tủy xương',
    detailDescription: '',
    price: 3000,
    active: true,
    locationIdentifier: 33,
  },
  {
    identifier: 16,
    type: 'Xét nghiệm',
    name: 'Điện não đồ (EEG)',
    detailDescription: '',
    price: 2500,
    active: true,
    locationIdentifier: 34,
  },
  {
    identifier: 17,
    type: 'Xét nghiệm',
    name: 'Đo chức năng hô hấp',
    detailDescription: '',
    price: 1800,
    active: true,
    locationIdentifier: 35,
  },

  // --- Chẩn đoán hình ảnh ---
  {
    identifier: 18,
    type: 'Chẩn đoán hình ảnh',
    name: 'Chụp X-quang',
    detailDescription: '',
    price: 2000,
    active: true,
    locationIdentifier: 36,
  },
  {
    identifier: 19,
    type: 'Chẩn đoán hình ảnh',
    name: 'Chụp cộng hưởng từ (MRI)',
    detailDescription: '',
    price: 8000,
    active: true,
    locationIdentifier: 37,
  },
];

// TODO: Lịch làm việc
/*
 * Tất cả các bác sĩ làm tất cả các ca trong tháng
 * Phải đúng chuyên khoa → đúng phòng → đúng dịch vụ
 */
export const ShiftData = [
  {
    identifier: 1,
    name: 'Ca sáng',
    startTime: '07:00:00',
    endTime: '11:30:00',
  },
  {
    identifier: 2,
    name: 'Ca chiều',
    startTime: '13:00:00',
    endTime: '17:00:00',
  },
  { identifier: 3, name: 'Ca tối', startTime: '17:00:00', endTime: '23:00:00' },
  {
    identifier: 4,
    name: 'Ca trực',
    startTime: '23:00:00',
    endTime: '07:00:00',
  },
];

export const WorkScheduleData = (() => {
  const data: {
    identifier: number;
    date: string;
    shiftIdentifier: number;
  }[] = [];

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let id = 1;
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    for (let shift = 1; shift <= 4; shift++) {
      data.push({ identifier: id++, date: dateStr, shiftIdentifier: shift });
    }
  }
  return data;
})();

const SPECIALTY_TO_ROOM: Record<number, number> = {
  1: 9,
  2: 11,
  3: 13,
  4: 15,
  5: 17,
  6: 19,
  7: 21,
  8: 23,
  9: 25,
  10: 27,
  11: 29,
  12: 31,
  13: 32,
  14: 33,
  15: 34,
  16: 35,
  17: 36,
};

export const StaffWorkScheduleData = (() => {
  const data: {
    identifier: number;
    duty: string;
    active: boolean;
    workScheduleIdentifier: number;
    locationIdentifier: number;
    staffIdentifier: number;
  }[] = [];

  let id = 1;

  const physicians = PhysicianData;

  for (const ws of WorkScheduleData) {
    for (const doctor of physicians) {
      const room = SPECIALTY_TO_ROOM[doctor.specialtyIdentifier];

      if (!room) {
        console.warn('Missing room for specialty:', doctor.specialtyIdentifier);
        continue;
      }

      if (doctor.identifier === 2 || doctor.identifier === 2000000001) {
        data.push({
          identifier: id++,
          duty: 'Khám sơ bộ',
          active: true,
          workScheduleIdentifier: ws.identifier,
          locationIdentifier: room,
          staffIdentifier: doctor.identifier,
        });
        continue;
      }

      if (doctor.identifier === 4 || doctor.identifier === 4000000001) {
        data.push({
          identifier: id++,
          duty: 'Xét nghiệm hoá sinh',
          active: true,
          workScheduleIdentifier: ws.identifier,
          locationIdentifier: room,
          staffIdentifier: doctor.identifier,
        });
        continue;
      }

      if (doctor.identifier === 4000000002) {
        data.push({
          identifier: id++,
          duty: 'Xét nghiệm huyết học',
          active: true,
          workScheduleIdentifier: ws.identifier,
          locationIdentifier: room,
          staffIdentifier: doctor.identifier,
        });
        continue;
      }

      if (doctor.identifier === 4000000003) {
        data.push({
          identifier: id++,
          duty: 'Xét nghiệm huyết học lâm sàng',
          active: true,
          workScheduleIdentifier: ws.identifier,
          locationIdentifier: room,
          staffIdentifier: doctor.identifier,
        });
        continue;
      }

      if (doctor.identifier === 5 || doctor.identifier === 5000000001) {
        data.push({
          identifier: id++,
          duty: 'Chụp X-Quang',
          active: true,
          workScheduleIdentifier: ws.identifier,
          locationIdentifier: room,
          staffIdentifier: doctor.identifier,
        });
        continue;
      }

      data.push({
        identifier: id++,
        duty: 'Khám chuyên khoa',
        active: true,
        workScheduleIdentifier: ws.identifier,
        locationIdentifier: room,
        staffIdentifier: doctor.identifier,
      });
    }
  }

  return data;
})();

// TODO: Tạo các chỉ số, thông tin cần hỏi cho form
export const AssessmentItemData = [
  // Khám sơ bộ
  {
    identifier: 1,
    name: 'Lí do vào viện',
    serviceIdentifier: 1,
    parentIdentifier: null,
  },
  {
    identifier: 2,
    name: 'Hỏi bệnh',
    serviceIdentifier: 1,
    parentIdentifier: null,
  },
  {
    identifier: 3,
    name: 'Quá trình bệnh lí',
    serviceIdentifier: 1,
    parentIdentifier: 2,
  },
  {
    identifier: 4,
    name: 'Tiền sử bệnh',
    serviceIdentifier: 1,
    parentIdentifier: 2,
  },
  {
    identifier: 5,
    name: 'Bản thân',
    serviceIdentifier: 1,
    parentIdentifier: 4,
  },
  {
    identifier: 6,
    name: 'Gia đình',
    serviceIdentifier: 1,
    parentIdentifier: 4,
  },
  {
    identifier: 7,
    name: 'Khám xét',
    serviceIdentifier: 1,
    parentIdentifier: null,
  },
  {
    identifier: 8,
    name: 'Toàn thân',
    serviceIdentifier: 1,
    parentIdentifier: 7,
  },
  {
    identifier: 9,
    name: 'Các bộ phận',
    serviceIdentifier: 1,
    parentIdentifier: 7,
  },
  {
    identifier: 10,
    name: 'Tóm tắt kết quả lâm sàng',
    serviceIdentifier: 1,
    parentIdentifier: 7,
  },
  {
    identifier: 11,
    name: 'Đã xử lí',
    serviceIdentifier: 1,
    parentIdentifier: 7,
  },
  { identifier: 12, name: 'Chú ý', serviceIdentifier: 1, parentIdentifier: 7 },

  // Chụp X-quang
  {
    identifier: 15,
    name: 'Kết quả chụp X-quang',
    serviceIdentifier: 18,
    parentIdentifier: null,
  },

  // Chụp cộng hưởng từ (MRI)
  {
    identifier: 16,
    name: 'Kết quả chụp cộng hưởng',
    serviceIdentifier: 19,
    parentIdentifier: null,
  },

  // Điện não đồ (EEG)
  {
    identifier: 19,
    name: 'Tình trạng người bệnh lúc điện não',
    serviceIdentifier: 16,
    parentIdentifier: null,
  },
  {
    identifier: 20,
    name: 'Kết quả điện não',
    serviceIdentifier: 16,
    parentIdentifier: null,
  },

  // Đo chức năng hô hấp
  {
    identifier: 21,
    name: 'Dung tích sống',
    serviceIdentifier: 17,
    parentIdentifier: null,
  },
  {
    identifier: 22,
    name: 'Dung tích thở ra tối đa',
    serviceIdentifier: 17,
    parentIdentifier: null,
  },
  {
    identifier: 23,
    name: 'Tỉ số Tiffenau',
    serviceIdentifier: 17,
    parentIdentifier: null,
  },
  {
    identifier: 24,
    name: 'Thông khí tối đa',
    serviceIdentifier: 17,
    parentIdentifier: null,
  },
  {
    identifier: 25,
    name: 'Khí dự trữ',
    serviceIdentifier: 17,
    parentIdentifier: null,
  },

  // Xét nghiệm huyết học
  {
    identifier: 26,
    name: 'Tế bào máu ngoại vi',
    serviceIdentifier: 14,
    parentIdentifier: null,
  },
  {
    identifier: 27,
    name: 'Số lượng HC',
    serviceIdentifier: 14,
    parentIdentifier: 26,
  },
  {
    identifier: 28,
    name: 'Huyết sắc tố',
    serviceIdentifier: 14,
    parentIdentifier: 26,
  },
  {
    identifier: 29,
    name: 'Hematocrit',
    serviceIdentifier: 14,
    parentIdentifier: 26,
  },
  { identifier: 30, name: 'MCV', serviceIdentifier: 14, parentIdentifier: 26 },
  { identifier: 31, name: 'MCH', serviceIdentifier: 14, parentIdentifier: 26 },
  { identifier: 32, name: 'MCHC', serviceIdentifier: 14, parentIdentifier: 26 },
  {
    identifier: 35,
    name: 'Số lượng tiểu cầu',
    serviceIdentifier: 14,
    parentIdentifier: 26,
  },
  {
    identifier: 37,
    name: 'Số lượng bạch cầu',
    serviceIdentifier: 14,
    parentIdentifier: 26,
  },
  {
    identifier: 45,
    name: 'Máu lắng giờ 1',
    serviceIdentifier: 14,
    parentIdentifier: 26,
  },
  {
    identifier: 46,
    name: 'Máu lắng giờ 2',
    serviceIdentifier: 14,
    parentIdentifier: 26,
  },
  {
    identifier: 47,
    name: 'Đông máu',
    serviceIdentifier: 14,
    parentIdentifier: null,
  },
  {
    identifier: 50,
    name: 'Nhóm máu',
    serviceIdentifier: 14,
    parentIdentifier: null,
  },
  {
    identifier: 51,
    name: 'Hệ ABO',
    serviceIdentifier: 14,
    parentIdentifier: 50,
  },
  {
    identifier: 52,
    name: 'Hệ Rh',
    serviceIdentifier: 14,
    parentIdentifier: 50,
  },

  // Xét nghiệm sinh thiết tủy xương
  {
    identifier: 53,
    name: 'Kết quả sinh thiết',
    serviceIdentifier: 15,
    parentIdentifier: null,
  },
  {
    identifier: 54,
    name: 'Kết luận',
    serviceIdentifier: 15,
    parentIdentifier: null,
  },
  {
    identifier: 55,
    name: 'Đề nghị',
    serviceIdentifier: 15,
    parentIdentifier: null,
  },

  // Xét nghiệm hóa sinh máu
  {
    identifier: 56,
    name: 'Urê',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 57,
    name: 'Glucose',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 58,
    name: 'Creatinin',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 59,
    name: 'Acid Uric',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 60,
    name: 'Bilirubin toàn phần (T.P)',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 61,
    name: 'Bilirubin trực tiếp (T.T)',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 62,
    name: 'Bilirubin gián tiếp (G.T)',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 63,
    name: 'Protein toàn phần (T.P)',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 64,
    name: 'Albumin',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 65,
    name: 'Globulin',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 66,
    name: 'Tỷ lệ A/G',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 67,
    name: 'Fibrinogen',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 68,
    name: 'Cholesterol',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 69,
    name: 'Triglycerid',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 70,
    name: 'HDL - Cholesterol',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 71,
    name: 'LDL - Cholesterol',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },

  // Khám Đa khoa
  { id: 72, name: 'Lý do khám', serviceIdentifier: 2, parentIdentifier: null },
  {
    id: 73,
    name: 'Triệu chứng hiện tại',
    serviceIdentifier: 2,
    parentIdentifier: null,
  },
  {
    id: 74,
    name: 'Tiền sử bệnh lý',
    serviceIdentifier: 2,
    parentIdentifier: null,
  },
  {
    id: 75,
    name: 'Khám lâm sàng toàn thân',
    serviceIdentifier: 2,
    parentIdentifier: null,
  },
  {
    id: 76,
    name: 'Định hướng chẩn đoán',
    serviceIdentifier: 2,
    parentIdentifier: null,
  },

  // Khám Nội khoa
  {
    id: 77,
    name: 'Triệu chứng cơ năng (ho, sốt, tức ngực...)',
    serviceIdentifier: 3,
    parentIdentifier: null,
  },
  {
    id: 78,
    name: 'Triệu chứng thực thể (tim–phổi–bụng)',
    serviceIdentifier: 3,
    parentIdentifier: null,
  },
  {
    id: 79,
    name: 'Bệnh lý mạn tính kèm theo',
    serviceIdentifier: 3,
    parentIdentifier: null,
  },
  {
    id: 80,
    name: 'Khám tim mạch – hô hấp – tiêu hoá',
    serviceIdentifier: 3,
    parentIdentifier: null,
  },
  {
    id: 81,
    name: 'Đánh giá ban đầu',
    serviceIdentifier: 3,
    parentIdentifier: null,
  },

  // Khám Ngoại khoa
  {
    id: 82,
    name: 'Vị trí và đặc điểm đau',
    serviceIdentifier: 4,
    parentIdentifier: null,
  },
  {
    id: 83,
    name: 'Tiền sử chấn thương/phẫu thuật',
    serviceIdentifier: 4,
    parentIdentifier: null,
  },
  {
    id: 84,
    name: 'Khám vết thương/khối u',
    serviceIdentifier: 4,
    parentIdentifier: null,
  },
  {
    id: 85,
    name: 'Dấu hiệu viêm/áp xe',
    serviceIdentifier: 4,
    parentIdentifier: null,
  },
  {
    id: 86,
    name: 'Hướng xử lý ngoại khoa',
    serviceIdentifier: 4,
    parentIdentifier: null,
  },

  // Sản phụ khoa
  {
    id: 87,
    name: 'Chu kỳ kinh nguyệt',
    serviceIdentifier: 5,
    parentIdentifier: null,
  },
  {
    id: 88,
    name: 'Tình trạng thai kỳ hiện tại',
    serviceIdentifier: 5,
    parentIdentifier: null,
  },
  {
    id: 89,
    name: 'Dịch âm đạo – bất thường',
    serviceIdentifier: 5,
    parentIdentifier: null,
  },
  {
    id: 90,
    name: 'Khám phụ khoa',
    serviceIdentifier: 5,
    parentIdentifier: null,
  },
  {
    id: 91,
    name: 'Chẩn đoán – tư vấn',
    serviceIdentifier: 5,
    parentIdentifier: null,
  },

  // Nhi khoa
  {
    id: 92,
    name: 'Tiền sử sinh – phát triển',
    serviceIdentifier: 6,
    parentIdentifier: null,
  },
  { id: 93, name: 'Tiêm chủng', serviceIdentifier: 6, parentIdentifier: null },
  {
    id: 94,
    name: 'Triệu chứng hiện tại',
    serviceIdentifier: 6,
    parentIdentifier: null,
  },
  {
    id: 95,
    name: 'Khám nhi tổng quát',
    serviceIdentifier: 6,
    parentIdentifier: null,
  },
  {
    id: 96,
    name: 'Theo dõi – điều trị',
    serviceIdentifier: 6,
    parentIdentifier: null,
  },

  // Tai Mũi Họng
  {
    id: 97,
    name: 'Triệu chứng tai',
    serviceIdentifier: 7,
    parentIdentifier: null,
  },
  {
    id: 98,
    name: 'Triệu chứng mũi',
    serviceIdentifier: 7,
    parentIdentifier: null,
  },
  {
    id: 99,
    name: 'Triệu chứng họng',
    serviceIdentifier: 7,
    parentIdentifier: null,
  },
  { id: 100, name: 'Khám TMH', serviceIdentifier: 7, parentIdentifier: null },
  {
    id: 101,
    name: 'Định hướng điều trị',
    serviceIdentifier: 7,
    parentIdentifier: null,
  },

  // Mắt
  {
    id: 102,
    name: 'Thị lực – tật khúc xạ',
    serviceIdentifier: 8,
    parentIdentifier: null,
  },
  {
    id: 103,
    name: 'Đỏ mắt – chảy nước mắt',
    serviceIdentifier: 8,
    parentIdentifier: null,
  },
  {
    id: 104,
    name: 'Khám đáy mắt',
    serviceIdentifier: 8,
    parentIdentifier: null,
  },
  { id: 105, name: 'Nhãn áp', serviceIdentifier: 8, parentIdentifier: null },
  {
    id: 106,
    name: 'Đánh giá thị lực tổng quát',
    serviceIdentifier: 8,
    parentIdentifier: null,
  },

  // Răng Hàm Mặt
  {
    id: 107,
    name: 'Đau răng – sâu răng',
    serviceIdentifier: 9,
    parentIdentifier: null,
  },
  {
    id: 108,
    name: 'Viêm lợi – nha chu',
    serviceIdentifier: 9,
    parentIdentifier: null,
  },
  {
    id: 109,
    name: 'Khám răng miệng tổng quát',
    serviceIdentifier: 9,
    parentIdentifier: null,
  },
  { id: 110, name: 'Khớp cắn', serviceIdentifier: 9, parentIdentifier: null },
  {
    id: 111,
    name: 'Hướng can thiệp răng hàm mặt',
    serviceIdentifier: 9,
    parentIdentifier: null,
  },

  // Da liễu
  {
    id: 112,
    name: 'Thời gian – tiến triển tổn thương',
    serviceIdentifier: 10,
    parentIdentifier: null,
  },
  {
    id: 113,
    name: 'Dạng tổn thương da',
    serviceIdentifier: 10,
    parentIdentifier: null,
  },
  {
    id: 114,
    name: 'Yếu tố dị ứng – kích ứng',
    serviceIdentifier: 10,
    parentIdentifier: null,
  },
  {
    id: 115,
    name: 'Khám da toàn thân',
    serviceIdentifier: 10,
    parentIdentifier: null,
  },
  {
    id: 116,
    name: 'Hướng chẩn đoán da liễu',
    serviceIdentifier: 10,
    parentIdentifier: null,
  },

  // Thần kinh
  {
    id: 117,
    name: 'Triệu chứng: đau đầu, chóng mặt…',
    serviceIdentifier: 11,
    parentIdentifier: null,
  },
  {
    id: 118,
    name: 'Rối loạn vận động – cảm giác',
    serviceIdentifier: 11,
    parentIdentifier: null,
  },
  {
    id: 119,
    name: 'Khám dây thần kinh',
    serviceIdentifier: 11,
    parentIdentifier: null,
  },
  {
    id: 120,
    name: 'Khám vận động – phản xạ',
    serviceIdentifier: 11,
    parentIdentifier: null,
  },
  {
    id: 121,
    name: 'Đánh giá thần kinh tổng quát',
    serviceIdentifier: 11,
    parentIdentifier: null,
  },

  // Tim mạch
  {
    id: 122,
    name: 'Khó thở – đau ngực – hồi hộp',
    serviceIdentifier: 12,
    parentIdentifier: null,
  },
  {
    id: 123,
    name: 'Tiền sử THA – bệnh tim',
    serviceIdentifier: 12,
    parentIdentifier: null,
  },
  {
    id: 124,
    name: 'Khám tim: mạch – huyết áp – tiếng tim',
    serviceIdentifier: 12,
    parentIdentifier: null,
  },
  {
    id: 125,
    name: 'Phù – tuần hoàn ngoại vi',
    serviceIdentifier: 12,
    parentIdentifier: null,
  },
  {
    id: 126,
    name: 'Nhận định ban đầu tim mạch',
    serviceIdentifier: 12,
    parentIdentifier: null,
  },
];

export const MeasurementItemData = [
  {
    identifier: 27,
    type: 'Số lượng HC (Hồng cầu) (Red Blood Cell Count)',
    unit: 'x 10^12/l',
    minimum: '4.0 (nam), 3.9 (nữ)',
    maximum: '5.8 (nam), 5.2 (nữ)',
  },
  {
    identifier: 28,
    type: 'Huyết sắc tố (Hemoglobin)',
    unit: 'g/l',
    minimum: '140 (nam), 125 (nữ)',
    maximum: '160 (nam), 145 (nữ)',
  },
  {
    identifier: 29,
    type: 'Hematocrit',
    unit: 'l/l',
    minimum: '0.38 (nam), 0.35 (nữ)',
    maximum: '0.50 (nam), 0.47 (nữ)',
  },
  {
    identifier: 30,
    type: 'MCV (Thể tích trung bình hồng cầu) (Mean Corpuscular Volume)',
    unit: 'fl',
    minimum: '83',
    maximum: '92',
  },
  {
    identifier: 31,
    type: 'MCH (Lượng huyết sắc tố trung bình hồng cầu) (Mean Corpuscular Hemoglobin)',
    unit: 'pg',
    minimum: '27',
    maximum: '32',
  },
  {
    identifier: 32,
    type: 'MCHC (Nồng độ huyết sắc tố trung bình hồng cầu) (Mean Corpuscular Hemoglobin Concentration)',
    unit: 'g/l',
    minimum: '320',
    maximum: '356',
  },
  {
    identifier: 35,
    type: 'Số lượng tiểu cầu (Platelet Count)',
    unit: 'x 10^9/l',
    minimum: '150',
    maximum: '400',
  },
  {
    identifier: 37,
    type: 'Số lượng BC (Bạch cầu) (White Blood Cell Count)',
    unit: 'x 10^9/l',
    minimum: '4',
    maximum: '10',
  },
  {
    identifier: 45,
    type: 'Máu lắng (Erythrocyte Sedimentation Rate) - giờ 1',
    unit: 'mm',
    minimum: '',
    maximum: '15',
  },
  {
    identifier: 46,
    type: 'Máu lắng (Erythrocyte Sedimentation Rate) - giờ 2',
    unit: 'mm',
    minimum: '',
    maximum: '20',
  },

  { identifier: 56, type: '', unit: 'mmol/L', minimum: '2.5', maximum: '7.5' }, // Urê
  { identifier: 57, type: '', unit: 'mmol/L', minimum: '3.9', maximum: '6.4' }, // Glucose
  {
    identifier: 58,
    type: '',
    unit: 'µmol/L',
    minimum: '62(nam), 53(nữ)',
    maximum: '120(nam), 100(nữ)',
  }, // Creatinin
  {
    identifier: 59,
    type: '',
    unit: 'µmol/L',
    minimum: '180(nam), 150(nữ)',
    maximum: '420(nam), 360(nữ)',
  }, // Acid uric
  { identifier: 60, type: '', unit: 'µmol/L', minimum: '', maximum: '17' }, // Bilirubin T.P
  { identifier: 61, type: '', unit: 'µmol/L', minimum: '', maximum: '4.3' }, // Bilirubin T.T
  { identifier: 62, type: '', unit: 'µmol/L', minimum: '', maximum: '12.7' }, // Bilirubin G.T
  { identifier: 63, type: '', unit: 'g/L', minimum: '65', maximum: '82' }, // Protein T.P
  { identifier: 64, type: '', unit: 'g/L', minimum: '35', maximum: '50' }, // Albumin
  { identifier: 65, type: '', unit: 'g/L', minimum: '24', maximum: '38' }, // Globulin
  { identifier: 66, type: '', unit: '', minimum: '1.3', maximum: '1.8' }, // Tỷ lệ A/G
  { identifier: 67, type: '', unit: 'g/L', minimum: '2', maximum: '4' }, // Fibrinogen
  { identifier: 68, type: '', unit: 'mmol/L', minimum: '3.9', maximum: '5.2' }, // Cholesterol
  {
    identifier: 69,
    type: '',
    unit: 'mmol/L',
    minimum: '0.46',
    maximum: '1.88',
  }, // Triglycerid
  { identifier: 70, type: '', unit: 'mmol/L', minimum: '0.9', maximum: '' }, // HDL
  { identifier: 71, type: '', unit: 'mmol/L', minimum: '', maximum: '3.4' }, // LDL
];

// TODO: Thuốc
export const MedicationData = [
  {
    identifier: 1,
    code: '385055001',
    name: 'Paracetamol',
    doseForm: 'Viên nén',
  },
  {
    identifier: 2,
    code: '66076007',
    name: 'Aspirin',
    doseForm: 'Viên nhai',
  },
  {
    identifier: 3,
    code: '385057009',
    name: 'Omeprazole',
    doseForm: 'Viên nang',
  },
  {
    identifier: 4,
    code: '385023001',
    name: 'Cefuroxime',
    doseForm: 'Dung dịch uống',
  },
  {
    identifier: 5,
    code: '385024007',
    name: 'Amoxicillin',
    doseForm: 'Hỗn dịch uống',
  },
  {
    identifier: 6,
    code: '385018001',
    name: 'Vitamin D',
    doseForm: 'Giọt uống',
  },
  {
    identifier: 7,
    code: '385219001',
    name: 'Insulin',
    doseForm: 'Dung dịch tiêm',
  },
  {
    identifier: 8,
    code: '385108007',
    name: 'Hydrocortisone',
    doseForm: 'Kem bôi',
  },
  {
    identifier: 9,
    code: '385100003',
    name: 'Neomycin',
    doseForm: 'Thuốc mỡ',
  },
  {
    identifier: 10,
    code: '385133007',
    name: 'Salbutamol',
    doseForm: 'Bột hít',
  },
];
