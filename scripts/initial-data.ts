export const QualificationData = [
  {
    identifier: 1,
    name: 'Bằng tốt nghiệp Đại học Y - Đa khoa',
    specialty: 'Đa khoa',
    issuer: 'Bộ Y tế',
    type: 'Bằng cấp',
    effectiveDate: '2008-06-15',
    expiredDate: undefined,
    physicianIdentifier: 1120000001,
  },
  {
    identifier: 2,
    name: 'Chứng chỉ hành nghề Bác sĩ - Đa khoa',
    specialty: 'Đa khoa',
    issuer: 'Bộ Y tế',
    type: 'Chứng chỉ',
    effectiveDate: '2011-03-22',
    expiredDate: undefined,
    physicianIdentifier: 1120000001,
  },
  {
    identifier: 3,
    name: 'Chứng chỉ chuyên khoa Đa khoa - Nâng cao',
    specialty: 'Đa khoa',
    issuer: 'Bộ Y tế',
    type: 'Chứng chỉ',
    effectiveDate: '2014-10-05',
    expiredDate: undefined,
    physicianIdentifier: 1120000001,
  },
];

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

// 5 Phòng xét nghiệm, 5 Phòng chẩn đoán hình ảnh
export const LocationData = [
  {
    identifier: 1001,
    type: 'Tòa nhà',
    name: 'Tòa A',
    parentIdentifier: null as unknown as number,
  },
  {
    identifier: 1002,
    type: 'Tòa nhà',
    name: 'Tòa B',
    parentIdentifier: null as unknown as number,
  },

  {
    identifier: 2001,
    type: 'Tầng',
    name: 'Tầng 1',
    parentIdentifier: 1001,
  },
  {
    identifier: 2002,
    type: 'Tầng',
    name: 'Tầng 2',
    parentIdentifier: 1001,
  },
  {
    identifier: 2003,
    type: 'Tầng',
    name: 'Tầng 3',
    parentIdentifier: 1001,
  },
  {
    identifier: 2004,
    type: 'Tầng',
    name: 'Tầng 1',
    parentIdentifier: 1002,
  },
  {
    identifier: 2005,
    type: 'Tầng',
    name: 'Tầng 2',
    parentIdentifier: 1002,
  },
  {
    identifier: 2006,
    type: 'Tầng',
    name: 'Tầng 3',
    parentIdentifier: 1002,
  },
  {
    identifier: 3001,
    type: 'Phòng',
    name: 'Phòng Đa khoa 1',
    parentIdentifier: 2001,
  },
  {
    identifier: 3002,
    type: 'Phòng',
    name: 'Phòng Đa khoa 2',
    parentIdentifier: 2001,
  },
  {
    identifier: 3003,
    type: 'Phòng',
    name: 'Phòng Nội khoa 1',
    parentIdentifier: 2001,
  },
  {
    identifier: 3004,
    type: 'Phòng',
    name: 'Phòng Nội khoa 2',
    parentIdentifier: 2001,
  },

  {
    identifier: 3005,
    type: 'Phòng',
    name: 'Phòng Ngoại khoa 1',
    parentIdentifier: 2002,
  },
  {
    identifier: 3006,
    type: 'Phòng',
    name: 'Phòng Ngoại khoa 2',
    parentIdentifier: 2002,
  },

  {
    identifier: 3007,
    type: 'Phòng',
    name: 'Phòng Sản phụ khoa 1',
    parentIdentifier: 2003,
  },
  {
    identifier: 3008,
    type: 'Phòng',
    name: 'Phòng Sản phụ khoa 2',
    parentIdentifier: 2003,
  },

  {
    identifier: 3009,
    type: 'Phòng',
    name: 'Phòng Nhi khoa 1',
    parentIdentifier: 2004,
  },
  {
    identifier: 3010,
    type: 'Phòng',
    name: 'Phòng Nhi khoa 2',
    parentIdentifier: 2004,
  },

  {
    identifier: 3011,
    type: 'Phòng',
    name: 'Phòng Tai Mũi Họng 1',
    parentIdentifier: 2005,
  },
  {
    identifier: 3012,
    type: 'Phòng',
    name: 'Phòng Tai Mũi Họng 2',
    parentIdentifier: 2005,
  },

  {
    identifier: 3013,
    type: 'Phòng',
    name: 'Phòng Mắt 1',
    parentIdentifier: 2006,
  },
  {
    identifier: 3014,
    type: 'Phòng',
    name: 'Phòng Mắt 2',
    parentIdentifier: 2006,
  },

  {
    identifier: 3015,
    type: 'Phòng',
    name: 'Phòng Răng Hàm Mặt 1',
    parentIdentifier: 2001,
  },
  {
    identifier: 3016,
    type: 'Phòng',
    name: 'Phòng Răng Hàm Mặt 2',
    parentIdentifier: 2001,
  },

  {
    identifier: 3017,
    type: 'Phòng',
    name: 'Phòng Da liễu 1',
    parentIdentifier: 2002,
  },
  {
    identifier: 3018,
    type: 'Phòng',
    name: 'Phòng Da liễu 2',
    parentIdentifier: 2002,
  },

  {
    identifier: 3019,
    type: 'Phòng',
    name: 'Phòng Thần kinh 1',
    parentIdentifier: 2003,
  },
  {
    identifier: 3020,
    type: 'Phòng',
    name: 'Phòng Thần kinh 2',
    parentIdentifier: 2003,
  },

  {
    identifier: 3021,
    type: 'Phòng',
    name: 'Phòng Tim mạch 1',
    parentIdentifier: 2004,
  },
  {
    identifier: 3022,
    type: 'Phòng',
    name: 'Phòng Tim mạch 2',
    parentIdentifier: 2004,
  },

  {
    identifier: 3023,
    type: 'Phòng',
    name: 'Phòng Xét nghiệm 1',
    parentIdentifier: 2005,
  },
  {
    identifier: 3024,
    type: 'Phòng',
    name: 'Phòng Xét nghiệm 2',
    parentIdentifier: 2005,
  },
  {
    identifier: 3025,
    type: 'Phòng',
    name: 'Phòng Xét nghiệm 3',
    parentIdentifier: 2005,
  },
  {
    identifier: 3026,
    type: 'Phòng',
    name: 'Phòng Xét nghiệm 4',
    parentIdentifier: 2005,
  },
  {
    identifier: 3027,
    type: 'Phòng',
    name: 'Phòng Xét nghiệm 5',
    parentIdentifier: 2005,
  },
  {
    identifier: 3028,
    type: 'Phòng',
    name: 'Phòng Chẩn đoán hình ảnh 1',
    parentIdentifier: 2006,
  },
  {
    identifier: 3029,
    type: 'Phòng',
    name: 'Phòng Chẩn đoán hình ảnh 2',
    parentIdentifier: 2006,
  },
  {
    identifier: 3030,
    type: 'Phòng',
    name: 'Phòng Chẩn đoán hình ảnh 3',
    parentIdentifier: 2006,
  },
  {
    identifier: 3031,
    type: 'Phòng',
    name: 'Phòng Chẩn đoán hình ảnh 4',
    parentIdentifier: 2006,
  },
  {
    identifier: 3032,
    type: 'Phòng',
    name: 'Phòng Chẩn đoán hình ảnh 5',
    parentIdentifier: 2006,
  },
];

// 9 Bệnh nhân, 53 Bác sĩ các chuyên khoa (5 Bác sĩ chẩn đoán hình ảnh)
export const UserData = [
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
    identifier: 1119375248,
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
    identifier: 1115639482,
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
    identifier: 1118293647,
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
    identifier: 1112469358,
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
    identifier: 1113958274,
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
    identifier: 1116284937,
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
    identifier: 1119472638,
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
    identifier: 1112849673,
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
    identifier: 1117532891,
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

  // Đa khoa
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
    identifier: 1120000002,
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
  {
    identifier: 1120000003,
    name: 'Lê Văn Cường',
    email: 'cuong.le@his.vn',
    telecom: '0911000003',
    birthDate: '1985-03-03',
    gender: true,
    address: '14 Lê Lợi, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'GENERAL_PHYSICIAN',
  },

  // Nội khoa
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
    identifier: 1134287196,
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
  {
    identifier: 1134287197,
    name: 'Lê Văn Nam',
    email: 'nam.le@his.vn',
    telecom: '0912345680',
    birthDate: '1981-06-10',
    gender: true,
    address: '18 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'INTERNAL_PHYSICIAN',
  },

  // Ngoại khoa
  {
    identifier: 1139751608,
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
    identifier: 1139751609,
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
  {
    identifier: 1139751610,
    name: 'Nguyễn Thị Hạnh',
    email: 'hanh.nguyen@his.vn',
    telecom: '0905123458',
    birthDate: '1980-05-20',
    gender: false,
    address: '49 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'SURGICAL_PHYSICIAN',
  },

  // Sản phụ khoa
  {
    identifier: 1131847632,
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
  {
    identifier: 1131847633,
    name: 'Nguyễn Thị Mai',
    email: 'mai.nguyen@his.vn',
    telecom: '0978456124',
    birthDate: '1986-02-20',
    gender: false,
    address: '25 Hai Bà Trưng, Quận 1, TP.HCM',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'OBSTETRIC_PHYSICIAN',
  },
  {
    identifier: 1131847634,
    name: 'Trần Thị Hồng',
    email: 'hong.tran@his.vn',
    telecom: '0978456125',
    birthDate: '1984-09-10',
    gender: false,
    address: '27 Hai Bà Trưng, Quận 1, TP.HCM',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'OBSTETRIC_PHYSICIAN',
  },

  // Nhi khoa
  {
    identifier: 1136014297,
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
  {
    identifier: 1136014298,
    name: 'Lê Hoàng Anh',
    email: 'anh.le@his.vn',
    telecom: '0909789124',
    birthDate: '1984-03-10',
    gender: true,
    address: '58 Trần Hưng Đạo, Quận 5, TP.HCM',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'PEDIATRIC_PHYSICIAN',
  },
  {
    identifier: 1136014299,
    name: 'Nguyễn Thanh Bình',
    email: 'binh.nguyen@his.vn',
    telecom: '0909789125',
    birthDate: '1985-07-22',
    gender: true,
    address: '60 Trần Hưng Đạo, Quận 5, TP.HCM',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'PEDIATRIC_PHYSICIAN',
  },

  // Tai Mũi Họng
  {
    identifier: 1135178420,
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
  {
    identifier: 1135178421,
    name: 'Trần Thị Hương',
    email: 'huong.tran@his.vn',
    telecom: '0932346790',
    birthDate: '1982-08-15',
    gender: false,
    address: '91 Nguyễn Văn Linh, Đà Nẵng',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'ENT_PHYSICIAN',
  },
  {
    identifier: 1135178422,
    name: 'Lê Văn Duy',
    email: 'duy.le@his.vn',
    telecom: '0932346791',
    birthDate: '1983-02-28',
    gender: true,
    address: '93 Nguyễn Văn Linh, Đà Nẵng',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'ENT_PHYSICIAN',
  },

  // Mắt
  {
    identifier: 1132946715,
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
  {
    identifier: 1132946716,
    name: 'Lê Thị Bích',
    email: 'bich.le@his.vn',
    telecom: '0945345679',
    birthDate: '1987-06-15',
    gender: false,
    address: '103 Cách Mạng Tháng 8, Quận 3, TP.HCM',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'OPHTHALMOLOGY_PHYSICIAN',
  },
  {
    identifier: 1132946717,
    name: 'Nguyễn Văn Hòa',
    email: 'hoa.nguyen@his.vn',
    telecom: '0945345680',
    birthDate: '1985-12-20',
    gender: true,
    address: '105 Cách Mạng Tháng 8, Quận 3, TP.HCM',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'OPHTHALMOLOGY_PHYSICIAN',
  },

  // Răng Hàm Mặt
  {
    identifier: 1138309452,
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
  {
    identifier: 1138309453,
    name: 'Nguyễn Thị Thanh',
    email: 'thanh.nguyen@his.vn',
    telecom: '0923456124',
    birthDate: '1985-05-21',
    gender: false,
    address: '36 Pasteur, Quận 1, TP.HCM',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'DENTAL_PHYSICIAN',
  },
  {
    identifier: 1138309454,
    name: 'Trần Văn Khoa',
    email: 'khoa.tran@his.vn',
    telecom: '0923456125',
    birthDate: '1983-11-09',
    gender: true,
    address: '38 Pasteur, Quận 1, TP.HCM',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'DENTAL_PHYSICIAN',
  },

  // Da liễu
  {
    identifier: 1137684029,
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
  {
    identifier: 1137684030,
    name: 'Nguyễn Thị Lan',
    email: 'lan.nguyen@his.vn',
    telecom: '0968234568',
    birthDate: '1988-07-15',
    gender: false,
    address: '80 Lạch Tray, Ngô Quyền, Hải Phòng',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'DERMATOLOGY_PHYSICIAN',
  },
  {
    identifier: 1137684031,
    name: 'Trần Văn Sơn',
    email: 'son.tran@his.vn',
    telecom: '0968234569',
    birthDate: '1986-03-10',
    gender: true,
    address: '82 Lạch Tray, Ngô Quyền, Hải Phòng',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'DERMATOLOGY_PHYSICIAN',
  },

  // Thần kinh
  {
    identifier: 1139461750,
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
  {
    identifier: 1139461751,
    name: 'Hoàng Thị Lan',
    email: 'lan.hoang@his.vn',
    telecom: '0987456321',
    birthDate: '1988-12-03',
    gender: false,
    address: '90 Nguyễn Huệ, Quận 1, TP.HCM',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'NEUROLOGY_PHYSICIAN',
  },
  {
    identifier: 1139461752,
    name: 'Phan Đức Toàn',
    email: 'toan.phan@his.vn',
    telecom: '0911223344',
    birthDate: '1982-08-22',
    gender: true,
    address: '12 Tôn Thất Tùng, Đống Đa, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'NEUROLOGY_PHYSICIAN',
  },

  // Tim mạch
  {
    identifier: 1134126953,
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
  {
    identifier: 1134126954,
    name: 'Nguyễn Văn Hòa',
    email: 'hoa.nguyen@his.vn',
    telecom: '0987456322',
    birthDate: '1985-05-10',
    gender: true,
    address: '92 Nguyễn Huệ, Quận 1, TP.HCM',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'CARDIOLOGY_PHYSICIAN',
  },
  {
    identifier: 1134126955,
    name: 'Lê Thị Thu',
    email: 'thu.le@his.vn',
    telecom: '0987456323',
    birthDate: '1987-11-18',
    gender: false,
    address: '94 Nguyễn Huệ, Quận 1, TP.HCM',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'CARDIOLOGY_PHYSICIAN',
  },
  // Xét nghiệm hóa sinh
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
    identifier: 1140003002,
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
  {
    identifier: 1140003003,
    name: 'Trần Thị Kim Oanh',
    email: 'oanh.tran@his.vn',
    telecom: '0905003003',
    birthDate: '1987-10-18',
    gender: false,
    address: '15 Nguyễn Du, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'BIOCHEMISTRY_PHYSICIAN',
  },

  // Xét nghiệm huyết học
  {
    identifier: 1140004001,
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
  {
    identifier: 1140004002,
    name: 'Nguyễn Thị Hồng',
    email: 'hong.nguyen@his.vn',
    telecom: '0905004002',
    birthDate: '1986-04-15',
    gender: false,
    address: '42 Hai Bà Trưng, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'HEMATOLOGY_PHYSICIAN',
  },
  {
    identifier: 1140004003,
    name: 'Phạm Quốc Huy',
    email: 'huy.pham@his.vn',
    telecom: '0905004003',
    birthDate: '1981-12-22',
    gender: true,
    address: '60 Nguyễn Văn Cừ, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'HEMATOLOGY_PHYSICIAN',
  },

  // Xét nghiệm huyết học lâm sàng
  {
    identifier: 1140005001,
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
  {
    identifier: 1140005002,
    name: 'Trương Văn Hải',
    email: 'hai.truong@his.vn',
    telecom: '0905005002',
    birthDate: '1980-08-10',
    gender: true,
    address: '80 Nguyễn Trãi, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'CLINICAL_HEMATOLOGY_PHYSICIAN',
  },
  {
    identifier: 1140005003,
    name: 'Phan Thị Dung',
    email: 'dung.phan@his.vn',
    telecom: '0905005003',
    birthDate: '1987-02-14',
    gender: false,
    address: '82 Lý Thường Kiệt, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'CLINICAL_HEMATOLOGY_PHYSICIAN',
  },
  // Sinh lý thần kinh
  {
    identifier: 1140006001,
    name: 'Nguyễn Văn Trí',
    email: 'tri.nguyen@his.vn',
    telecom: '0905003001',
    birthDate: '1985-02-11',
    gender: true,
    address: '15 Tôn Thất Tùng, Đống Đa, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'NEURO_PHYSIOLOGY_PHYSICIAN',
  },
  {
    identifier: 1140006002,
    name: 'Trần Thị Kim Oanh',
    email: 'oanh.tran@his.vn',
    telecom: '0905003002',
    birthDate: '1986-06-20',
    gender: false,
    address: '22 Nguyễn Lương Bằng, Đống Đa, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'NEURO_PHYSIOLOGY_PHYSICIAN',
  },
  {
    identifier: 1140006003,
    name: 'Phạm Đức Long',
    email: 'long.pham@his.vn',
    telecom: '0905003003',
    birthDate: '1983-09-18',
    gender: true,
    address: '27 Trần Hưng Đạo, Hải Phòng',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'NEURO_PHYSIOLOGY_PHYSICIAN',
  },

  // Sinh lý hô hấp
  {
    identifier: 1140007001,
    name: 'Vũ Thị Hằng',
    email: 'hang.vu@his.vn',
    telecom: '0905004001',
    birthDate: '1987-04-07',
    gender: false,
    address: '30 Láng Hạ, Ba Đình, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'RESPIRATORY_PHYSIOLOGY_PHYSICIAN',
  },
  {
    identifier: 1140007002,
    name: 'Nguyễn Hữu Dũng',
    email: 'dung.nguyen@his.vn',
    telecom: '0905004002',
    birthDate: '1984-11-02',
    gender: true,
    address: '42 Trần Phú, Quận 5, TP.HCM',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'RESPIRATORY_PHYSIOLOGY_PHYSICIAN',
  },
  {
    identifier: 1140007003,
    name: 'Lê Minh Tâm',
    email: 'tam.le@his.vn',
    telecom: '0905004003',
    birthDate: '1985-12-15',
    gender: true,
    address: '50 Nguyễn Văn Linh, Đà Nẵng',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'RESPIRATORY_PHYSIOLOGY_PHYSICIAN',
  },

  // Chẩn đoán hình ảnh
  {
    identifier: 5,
    name: 'Lê Thị Hoa',
    email: 'hoa.le@his.vn',
    telecom: '0904002001',
    birthDate: '1981-08-19',
    gender: false,
    address: '12 Lê Lợi, Đống Đa, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'RADIOLOGY_PHYSICIAN',
  },
  {
    identifier: 1140008002,
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
    identifier: 1140008003,
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
  {
    identifier: 1140008004,
    name: 'Phạm Thị Ngọc',
    email: 'ngoc.pham@his.vn',
    telecom: '0904002004',
    birthDate: '1986-06-30',
    gender: false,
    address: '21 Trần Khánh Dư, Hà Nội',
    photo: '',
    password: '$2b$10$5lK7R1eg.s/NV1Aw6BPkh.DDxOnX0LFbMDM4ZLMbb8ovnyyytGEYu',
    role: 'RADIOLOGY_PHYSICIAN',
  },
  {
    identifier: 1140008005,
    name: 'Đặng Văn Hải',
    email: 'hai.dang@his.vn',
    telecom: '0904002005',
    birthDate: '1980-09-08',
    gender: true,
    address: '75 Hai Bà Trưng, Hà Nội',
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

export const PhysicianData = UserData.filter(
  (user) => user.role !== 'PATIENT',
).map((user, index) =>
  index < 16 * 3
    ? {
        identifier: user.identifier,
        specialtyIdentifier: Math.floor(index / 3) + 1,
      }
    : {
        identifier: user.identifier,
        specialtyIdentifier: 17,
      },
);

export const ServiceData = [
  {
    identifier: 1,
    type: 'Sơ bộ',
    name: 'Khám sơ bộ',
    detailDescription: '',
    price: 50000,
    active: true,
    locationIdentifier: 3001,
  },
  {
    identifier: 2,
    type: 'Chuyên khoa',
    name: 'Khám Chuyên khoa',
    detailDescription: '',
    price: 150000,
    active: true,
    locationIdentifier: 3003,
  },
  {
    identifier: 3,
    type: 'Chuyên khoa',
    name: 'Khám Nội khoa',
    detailDescription: '',
    price: 150000,
    active: true,
    locationIdentifier: 3003,
  },
  {
    identifier: 4,
    type: 'Chuyên khoa',
    name: 'Khám Ngoại khoa',
    detailDescription: '',
    price: 200000,
    active: true,
    locationIdentifier: 3005,
  },
  {
    identifier: 5,
    type: 'Chuyên khoa',
    name: 'Khám Sản phụ khoa',
    detailDescription: '',
    price: 180000,
    active: true,
    locationIdentifier: 3007,
  },
  {
    identifier: 6,
    type: 'Chuyên khoa',
    name: 'Khám Nhi khoa',
    detailDescription: '',
    price: 150000,
    active: true,
    locationIdentifier: 3009,
  },
  {
    identifier: 7,
    type: 'Chuyên khoa',
    name: 'Khám Tai Mũi Họng',
    detailDescription: '',
    price: 160000,
    active: true,
    locationIdentifier: 3011,
  },
  {
    identifier: 8,
    type: 'Chuyên khoa',
    name: 'Khám Mắt',
    detailDescription: '',
    price: 160000,
    active: true,
    locationIdentifier: 3013,
  },
  {
    identifier: 9,
    type: 'Chuyên khoa',
    name: 'Khám Răng Hàm Mặt',
    detailDescription: '',
    price: 170000,
    active: true,
    locationIdentifier: 3015,
  },
  {
    identifier: 10,
    type: 'Chuyên khoa',
    name: 'Khám Da liễu',
    detailDescription: '',
    price: 150000,
    active: true,
    locationIdentifier: 3017,
  },
  {
    identifier: 11,
    type: 'Chuyên khoa',
    name: 'Khám Thần kinh',
    detailDescription: '',
    price: 180000,
    active: true,
    locationIdentifier: 3019,
  },
  {
    identifier: 12,
    type: 'Chuyên khoa',
    name: 'Khám Tim mạch',
    detailDescription: '',
    price: 200000,
    active: true,
    locationIdentifier: 3021,
  },
  {
    identifier: 13,
    type: 'Xét nghiệm',
    name: 'Xét nghiệm hóa sinh máu',
    detailDescription: '',
    price: 130000,
    active: true,
    locationIdentifier: 3024,
  },
  {
    identifier: 14,
    type: 'Xét nghiệm',
    name: 'Xét nghiệm huyết học',
    detailDescription: '',
    price: 120000,
    active: true,
    locationIdentifier: 3023,
  },
  {
    identifier: 15,
    type: 'Xét nghiệm',
    name: 'Xét nghiệm sinh thiết tủy xương',
    detailDescription: '',
    price: 300000,
    active: true,
    locationIdentifier: 3025,
  },
  {
    identifier: 16,
    type: 'Xét nghiệm',
    name: 'Điện não đồ (EEG)',
    detailDescription: '',
    price: 250000,
    active: true,
    locationIdentifier: 3028,
  },
  {
    identifier: 17,
    type: 'Xét nghiệm',
    name: 'Đo chức năng hô hấp',
    detailDescription: '',
    price: 180000,
    active: true,
    locationIdentifier: 3030,
  },
  {
    identifier: 18,
    type: 'Chẩn đoán hình ảnh',
    name: 'Chụp X-quang',
    detailDescription: '',
    price: 200000,
    active: true,
    locationIdentifier: 3026,
  },
  {
    identifier: 19,
    type: 'Chẩn đoán hình ảnh',
    name: 'Chụp cộng hưởng từ (MRI)',
    detailDescription: '',
    price: 800000,
    active: true,
    locationIdentifier: 3027,
  },
];

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
    for (let shift = 1; shift <= ShiftData.length; shift++) {
      data.push({ identifier: id++, date: dateStr, shiftIdentifier: shift });
    }
  }
  return data;
})();

export const StaffWorkScheduleData = (() => {
  const data: {
    identifier: number;
    duty: string;
    active: boolean;
    workScheduleIdentifier: number;
    locationIdentifier: number;
    staffIdentifier: number;
  }[] = [];

  let tmpIndex = 1;
  // For sơ bộ và chuyên khoa
  {
    for (let specialtyIndex = 0; specialtyIndex < 11; specialtyIndex++) {
      const specialty = SpecialtyData[specialtyIndex];
      const specialPhysicians = PhysicianData.filter(
        (physician) => physician.specialtyIdentifier === specialty.identifier,
      );
      const locationIdentifier = LocationData.find((location) =>
        location.name.startsWith('Phòng ' + specialty.name),
      )!.identifier;

      WorkScheduleData.forEach((workSchedule, index) => {
        if (workSchedule.shiftIdentifier === 4) {
          return;
        }

        const specialtyPhysicianIdentifier =
          specialPhysicians[index % specialPhysicians.length].identifier;

        data.push({
          identifier: tmpIndex,
          duty: 'Khám ' + specialty.name,
          active: true,
          workScheduleIdentifier: workSchedule.identifier,
          locationIdentifier: locationIdentifier,
          staffIdentifier: specialtyPhysicianIdentifier,
        });
        tmpIndex++;
      });
    }
  }

  // For xét nghiệm
  {
    const labPhysicians = PhysicianData.filter(
      (physician) =>
        physician.specialtyIdentifier > 11 &&
        physician.specialtyIdentifier < 17,
    );

    const locationsForLab = LocationData.filter((location) =>
      location.name.startsWith('Phòng Xét nghiệm'),
    ).slice(0, 5);

    const dutyForLab = ServiceData.filter(
      (service) => service.type == 'Xét nghiệm',
    ).map((service) => service.name);

    locationsForLab.forEach((location, locIndex) => {
      const labPhysiciansForThisLocation = labPhysicians.slice(
        locIndex * 3,
        (locIndex + 1) * 3,
      );

      WorkScheduleData.forEach((workSchedule, index) => {
        if (workSchedule.shiftIdentifier === 4) {
          return;
        }

        data.push({
          identifier: tmpIndex,
          duty: dutyForLab[locIndex],
          active: true,
          workScheduleIdentifier: workSchedule.identifier,
          locationIdentifier: location.identifier,
          staffIdentifier: labPhysiciansForThisLocation[index % 3].identifier,
        });
        tmpIndex++;
      });
    });
  }

  // For chẩn đoán hình ảnh
  {
    const imagePhysicians = PhysicianData.filter(
      (physician) => physician.specialtyIdentifier === 17,
    ).slice(0, 4);

    const locationsForImaging = LocationData.filter((location) =>
      location.name.startsWith('Phòng Chẩn đoán hình ảnh'),
    ).slice(0, 2);

    const dutyForImaging = ServiceData.filter(
      (service) => service.type == 'Chẩn đoán hình ảnh',
    ).map((service) => service.name);

    WorkScheduleData.forEach((workSchedule, index) => {
      data.push({
        identifier: tmpIndex,
        duty: dutyForImaging[0],
        active: true,
        workScheduleIdentifier: workSchedule.identifier,
        locationIdentifier: locationsForImaging[0].identifier,
        staffIdentifier: imagePhysicians[index % 2 == 0 ? 0 : 1].identifier,
      });
      tmpIndex++;

      data.push({
        identifier: tmpIndex,
        duty: dutyForImaging[1],
        active: true,
        workScheduleIdentifier: workSchedule.identifier,
        locationIdentifier: locationsForImaging[1].identifier,
        staffIdentifier: imagePhysicians[index % 2 == 0 ? 2 : 3].identifier,
      });
      tmpIndex++;
    });
  }

  return data;
})();

export const AssessmentItemData = [
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
  {
    identifier: 12,
    name: 'Chú ý',
    serviceIdentifier: 1,
    parentIdentifier: 7,
  },
  {
    identifier: 15,
    name: 'Kết quả chụp X-quang',
    serviceIdentifier: 18,
    parentIdentifier: null,
  },
  {
    identifier: 16,
    name: 'Kết quả chụp cộng hưởng',
    serviceIdentifier: 19,
    parentIdentifier: null,
  },
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
    identifier: 33,
    name: 'Hồng cầu có nhân',
    serviceIdentifier: 14,
    parentIdentifier: 26,
  },
  {
    identifier: 34,
    name: 'Hồng cầu lưới',
    serviceIdentifier: 14,
    parentIdentifier: 26,
  },
  {
    identifier: 35,
    name: 'Số lượng tiểu cầu',
    serviceIdentifier: 14,
    parentIdentifier: 26,
  },
  {
    identifier: 36,
    name: 'Ký sinh trùng sốt rét',
    serviceIdentifier: 14,
    parentIdentifier: 26,
  },
  {
    identifier: 37,
    name: 'Số lượng bạch cầu (BC)',
    serviceIdentifier: 14,
    parentIdentifier: 26,
  },
  {
    identifier: 38,
    name: 'Thành phần bạch cầu (%)',
    serviceIdentifier: 14,
    parentIdentifier: 26,
  },
  {
    identifier: 39,
    name: 'Đoạn trung tính',
    serviceIdentifier: 14,
    parentIdentifier: 26,
  },
  {
    identifier: 40,
    name: 'Đoạn ưa a xít',
    serviceIdentifier: 14,
    parentIdentifier: 26,
  },
  {
    identifier: 41,
    name: 'Đoạn ưa ba zơ',
    serviceIdentifier: 14,
    parentIdentifier: 26,
  },
  { identifier: 42, name: 'Mono', serviceIdentifier: 14, parentIdentifier: 26 },
  {
    identifier: 43,
    name: 'Lympho',
    serviceIdentifier: 14,
    parentIdentifier: 26,
  },
  {
    identifier: 44,
    name: 'Tế bào bất thường',
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
    identifier: 48,
    name: 'Thời gian máu chảy',
    serviceIdentifier: 14,
    parentIdentifier: 47,
  },
  {
    identifier: 49,
    name: 'Thời gian máu đông',
    serviceIdentifier: 14,
    parentIdentifier: 47,
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
  {
    identifier: 72,
    name: 'Na⁺ (Natri)',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 73,
    name: 'K⁺ (Kali)',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 74,
    name: 'Cl⁻ (Clo)',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 75,
    name: 'Canxi (Calci)',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 76,
    name: 'Canxi ion hoá',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 77,
    name: 'Phospho',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 78,
    name: 'Sắt',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 79,
    name: 'Magie',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 80,
    name: 'AST (GOT)',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 81,
    name: 'ALT (GPT)',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 82,
    name: 'Amylase',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 83,
    name: 'CK',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 84,
    name: 'CK-MB',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 85,
    name: 'LDH',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 86,
    name: 'GGT',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 87,
    name: 'Cholinesterase',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 88,
    name: 'Phosphatase kiềm',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 89,
    name: 'pH động mạch',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 90,
    name: 'pCO₂',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 91,
    name: 'pO₂ động mạch',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 92,
    name: 'HCO₃⁻ chuẩn',
    serviceIdentifier: 13,
    parentIdentifier: null,
  },
  {
    identifier: 93,
    name: 'Kiềm dư',
    serviceIdentifier: 13,
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
    identifier: 33,
    type: 'Hồng cầu có nhân (Nucleated Red Blood Cells)',
    unit: 'x 10^9/l',
    minimum: '0',
    maximum: '0',
  },
  {
    identifier: 34,
    type: 'Hồng cầu lưới (Reticulocytes)',
    unit: '%',
    minimum: '0.1',
    maximum: '0.5',
  },
  {
    identifier: 35,
    type: 'Số lượng tiểu cầu (Platelet Count)',
    unit: 'x 10^9/l',
    minimum: '150',
    maximum: '400',
  },
  {
    identifier: 36,
    type: 'KSV sốt rét (Malaria Parasite Screen)',
    unit: '',
    minimum: '',
    maximum: '',
  },
  {
    identifier: 37,
    type: 'Số lượng BC (Bạch cầu) (White Blood Cell Count)',
    unit: 'x 10^9/l',
    minimum: '4',
    maximum: '10',
  },
  {
    identifier: 38,
    type: 'Thành phần bạch cầu (%) (Differential White Blood Cell Count)',
    unit: '%',
    minimum: '',
    maximum: '',
  },
  {
    identifier: 39,
    type: 'Đoạn trung tính (Neutrophils)',
    unit: '',
    minimum: '',
    maximum: '',
  },
  {
    identifier: 40,
    type: 'Đoạn ưa a xít (Eosinophils)',
    unit: '',
    minimum: '',
    maximum: '',
  },
  {
    identifier: 41,
    type: 'Đoạn ưa ba zơ (Basophils)',
    unit: '',
    minimum: '',
    maximum: '',
  },
  {
    identifier: 42,
    type: 'Mono (Monocytes)',
    unit: '',
    minimum: '',
    maximum: '',
  },
  {
    identifier: 43,
    type: 'Lympho (Lymphocytes)',
    unit: '',
    minimum: '',
    maximum: '',
  },
  {
    identifier: 44,
    type: 'Tế bào bất thường (Abnormal Cells)',
    unit: '',
    minimum: '',
    maximum: '',
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
  { identifier: 72, type: '', unit: 'mmol/L', minimum: '135', maximum: '145' }, // Na+
  { identifier: 73, type: '', unit: 'mmol/L', minimum: '3.5', maximum: '5.5' }, // K+
  { identifier: 74, type: '', unit: 'mmol/L', minimum: '98', maximum: '106' }, // Cl-
  { identifier: 75, type: '', unit: 'mmol/L', minimum: '2.15', maximum: '2.6' }, // Calci
  { identifier: 76, type: '', unit: 'mmol/L', minimum: '', maximum: '' }, // Calci ion hoá
  { identifier: 77, type: '', unit: 'mmol/L', minimum: '0.9', maximum: '1.5' }, // Phospho
  {
    identifier: 78,
    type: '',
    unit: 'µmol/L',
    minimum: '11(nam), 7(nữ)',
    maximum: '27(nam), 26(nữ)',
  }, // Sắt
  { identifier: 79, type: '', unit: 'mmol/L', minimum: '0.8', maximum: '1.0' }, // Magiê
  { identifier: 80, type: '', unit: 'U/L', minimum: '', maximum: '37' }, // AST (GOT)
  { identifier: 81, type: '', unit: 'U/L', minimum: '', maximum: '40' }, // ALT (GPT)
  { identifier: 82, type: '', unit: '', minimum: '', maximum: '' }, // Amylase
  {
    identifier: 83,
    type: '',
    unit: 'U/L',
    minimum: '24(nam), 24(nữ)',
    maximum: '190(nam), 167(nữ)',
  }, // CK
  { identifier: 84, type: '', unit: 'U/L', minimum: '', maximum: '24' }, // CK-MB
  { identifier: 85, type: '', unit: 'U/L', minimum: '230', maximum: '460' }, // LDH
  {
    identifier: 86,
    type: '',
    unit: 'U/L',
    minimum: '11(nam), 7(nữ)',
    maximum: '50(nam), 32(nữ)',
  }, // GGT
  { identifier: 87, type: '', unit: 'U/L', minimum: '5300', maximum: '12900' }, // Cholinesterase
  { identifier: 88, type: '', unit: '', minimum: '', maximum: '' }, // Phosphatase kiềm
  { identifier: 89, type: '', unit: '', minimum: '7.37', maximum: '7.45' }, // pH động mạch
  {
    identifier: 90,
    type: '',
    unit: 'mmHg',
    minimum: '35(nữ), 32(nam)',
    maximum: '46(nữ), 43(nam)',
  }, // pCO2
  { identifier: 91, type: '', unit: 'mmHg', minimum: '71', maximum: '104' }, // pO2
  { identifier: 92, type: '', unit: 'mmol/L', minimum: '21', maximum: '26' }, // HCO3-
  { identifier: 93, type: '', unit: 'mmol/L', minimum: '-2', maximum: '+3' }, // Kiềm dư
];

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
