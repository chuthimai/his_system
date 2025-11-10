import { AssessmentItem } from '@modules/assessments/entities/assessment-item.entity';
import { AssessmentResult } from '@modules/assessments/entities/assessment-result.entity';
import { MeasurementItem } from '@modules/assessments/entities/measurement-item.entity';
import { Prescription } from '@modules/medicines/entities/prescription.entity';
import { DiagnosisReport } from '@modules/reports/entities/diagnosis-report.entity';
import { ImagingReport } from '@modules/reports/entities/imaging-report.entity';
import { LaboratoryReport } from '@modules/reports/entities/laboratory-report.entity';
import { GENDER, METADATA, SERVICE_TYPES } from 'src/common/constants/others';
import { ReturnDocument } from 'typeorm';

import {
  formatVnDateWithoutText,
  formatVnDateWithText,
  formatVnFullDateTime,
  renderAssessmentItemsHTML,
} from './render';

interface MappedItem {
  id?: number;
  name: string;
  value?: string;
  measurementItem: MeasurementItem | null;
  children?: MappedItem[];
  _firstSeen?: number; // internal: order
}

export function buildTree(data: AssessmentResult[]): MappedItem[] {
  const nodes = new Map<number, MappedItem>();
  const parentLinks = new Map<number, number | null>();

  function ensureChain(item: AssessmentItem, firstSeenOrder: number) {
    if (nodes.has(item.identifier)) return;
    nodes.set(item.identifier, {
      id: item.identifier,
      name: item.name,
      measurementItem: null,
      children: [],
      _firstSeen: firstSeenOrder,
    });
    parentLinks.set(item.identifier, item.parentIdentifier ?? null);
    if (item.parent) ensureChain(item.parent, firstSeenOrder);
  }

  let idx = 0;
  for (const r of data) {
    idx++;
    ensureChain(r.assessmentItem, idx);
    const node = nodes.get(r.assessmentItem.identifier)!;
    node.value = r.value;
    // Gắn thêm measurementItem nếu có
    if (
      r.assessmentItem.measurementItem?.unit ||
      r.assessmentItem.measurementItem?.minimum ||
      r.assessmentItem.measurementItem?.maximum
    ) {
      node.measurementItem = {
        unit: r.assessmentItem.measurementItem?.unit ?? null,
        minimum: r.assessmentItem.measurementItem?.minimum ?? null,
        maximum: r.assessmentItem.measurementItem?.maximum ?? null,
      } as MeasurementItem;
    }
    node._firstSeen = Math.min(node._firstSeen ?? idx, idx);
  }

  for (const node of nodes.values()) {
    const parentId = parentLinks.get(node.id!) ?? null;
    if (parentId !== null) {
      const parentNode = nodes.get(parentId)!;
      parentNode.children!.push(node);
    }
  }

  const roots = Array.from(nodes.values()).filter(
    (n) => parentLinks.get(n.id!) == null,
  );

  function sortChildrenRecursively(arr: MappedItem[]) {
    arr.sort((a, b) => (a._firstSeen ?? 0) - (b._firstSeen ?? 0));
    for (const n of arr) {
      if (n.children) sortChildrenRecursively(n.children);
    }
  }
  sortChildrenRecursively(roots);

  function toRoman(num: number): string {
    const map: [number, string][] = [
      [10, 'X'],
      [9, 'IX'],
      [5, 'V'],
      [4, 'IV'],
      [1, 'I'],
    ];
    let res = '',
      n = num;
    for (const [v, s] of map)
      while (n >= v) {
        res += s;
        n -= v;
      }
    return res;
  }

  function cleanAndPrefix(nodesArr: MappedItem[], level = 1) {
    for (let i = 0; i < nodesArr.length; i++) {
      const node = nodesArr[i];
      let prefix = '';
      if (level === 1) prefix = `${toRoman(i + 1)}. `;
      else if (level === 2) prefix = `${i + 1}. `;
      else if (level === 3) prefix = '- ';
      else prefix = '+ ';
      node.name = prefix + node.name;
      if (node.children && node.children.length > 0) {
        cleanAndPrefix(node.children, level + 1);
      } else {
        delete node.children; // node lá giữ measurementItem và value
      }
      delete node._firstSeen;
      delete node.id;
    }
  }

  cleanAndPrefix(roots, 1);
  return roots;
}

export function convertDataForInitialReport(data: DiagnosisReport): any {
  const {
    serviceReport: {
      service: { location, ...serviceRest },
      assessmentResults,
      performer,
      patientRecord: { patient, ...restPatientRecord },
      ...restServiceReport
    },
  } = data;

  return {
    departmentOfHealth: METADATA.DEPARTMENT,
    hospitalName: METADATA.HOSPITAL,
    recordNumber: METADATA.RECORD_NUMBER,

    serviceName: 'Khám ' + SERVICE_TYPES.GENERAL_CONSULTATION,
    specialization:
      serviceRest.type === SERVICE_TYPES.GENERAL_CONSULTATION
        ? 'Không'
        : performer.specialty.name,
    locationName: location?.name,

    patientName: patient.name,
    patientBirth: formatVnDateWithoutText(patient.birthDate),
    patientGender: patient.gender ? GENDER.MALE : GENDER.FEMALE,
    patientAddress: patient.address,
    patientTelecom: patient.telecom,
    havingHealthInsurance: restPatientRecord.havingHealInsurance,

    reportContent: renderAssessmentItemsHTML(buildTree(assessmentResults)),
    reportConclusion: data.conclusion,
    reportCreatedTime: formatVnFullDateTime(restServiceReport.effectiveTime),
    reportResultTime: formatVnDateWithText(restServiceReport.recordedTime),

    generalDoctor: performer.name,
  };
}

export function convertDataForSpecialReport(data: DiagnosisReport): any {
  const {
    serviceReport: {
      service: { location, ...serviceRest },
      // assessmentResults,
      performer,
      requester,
      patientRecord: { patient },
      ...restServiceReport
    },
  } = data;

  return {
    departmentOfHealth: METADATA.DEPARTMENT,
    hospitalName: METADATA.HOSPITAL,
    recordNumber: METADATA.RECORD_NUMBER,

    serviceName: serviceRest.name,
    specialization: performer.specialty.name,
    locationName: location?.name,

    patientName: patient.name,
    patientBirth: formatVnDateWithoutText(patient.birthDate),
    patientGender: patient.gender ? GENDER.MALE : GENDER.FEMALE,
    patientAddress: patient.address,

    request: serviceRest.name,
    requestTime: formatVnDateWithText(restServiceReport.effectiveTime),
    reportCreatedTime: formatVnFullDateTime(restServiceReport.effectiveTime),
    reportResultTime: formatVnDateWithText(restServiceReport.recordedTime),

    severity: data.severity,
    conclusion: data.conclusion,

    performDoctor: performer.name,
    specialDoctor: requester.name,
  };
}

export function convertDataForLaboratoryReport(data: LaboratoryReport): any {
  const {
    serviceReport: {
      service: { location, ...restService },
      assessmentResults,
      performer,
      requester,
      patientRecord: { patient },
      ...restServiceReport
    },
    interpretation,
  } = data;

  return {
    departmentOfHealth: METADATA.DEPARTMENT,
    hospitalName: METADATA.HOSPITAL,
    recordNumber: METADATA.RECORD_NUMBER,

    serviceName: restService.name,
    specialization: performer.specialty.name,
    locationName: location?.name,

    patientName: patient.name,
    patientBirth: formatVnDateWithoutText(patient.birthDate),
    patientGender: patient.gender ? GENDER.MALE : GENDER.FEMALE,
    patientAddress: patient.address,

    request:
      restServiceReport.request !== ''
        ? restServiceReport.request
        : restService.name,
    requestTime: formatVnDateWithText(restServiceReport.effectiveTime),

    reportContent: renderAssessmentItemsHTML(buildTree(assessmentResults)),
    reportInterpretation: interpretation,
    reportResultTime: formatVnDateWithText(restServiceReport.recordedTime),

    performDoctor: performer.name,
    specialDoctor: requester.name,
  };
}

export function convertDataForImagingReport(data: ImagingReport): any {
  const {
    serviceReport: {
      service: { location, ...restService },
      assessmentResults,
      performer,
      requester,
      patientRecord: { patient },
      ...restServiceReport
    },
    interpretation,
  } = data;

  return {
    departmentOfHealth: METADATA.DEPARTMENT,
    hospitalName: METADATA.HOSPITAL,
    recordNumber: METADATA.RECORD_NUMBER,

    serviceName: restService.name,
    specialization: performer.specialty.name,
    locationName: location?.name,

    patientName: patient.name,
    patientBirth: formatVnDateWithoutText(patient.birthDate),
    patientGender: patient.gender ? GENDER.MALE : GENDER.FEMALE,
    patientAddress: patient.address,

    media: data.images.map((image) => image.endpoint),

    request:
      restServiceReport.request !== ''
        ? restServiceReport.request
        : restService.name,
    requestTime: formatVnDateWithText(restServiceReport.effectiveTime),
    reportContent: renderAssessmentItemsHTML(buildTree(assessmentResults)),
    reportInterpretation: interpretation,
    reportResultTime: formatVnDateWithText(restServiceReport.recordedTime),

    performDoctor: performer.name,
    specialDoctor: requester.name,
  };
}

export function convertDataForExportPrescription(data: Prescription): any {
  const {
    patientRecord: { patient },
    prescribedMedications,
    ...restPrescription
  } = data;

  return {
    departmentOfHealth: METADATA.DEPARTMENT,
    hospitalName: METADATA.HOSPITAL,
    hospitalPhone: METADATA.PHONE,
    recordNumber: METADATA.RECORD_NUMBER,

    identifier: restPrescription.identifier,
    patientName: patient.name,
    patientBirth: formatVnDateWithoutText(patient.birthDate),
    patientGender: patient.gender ? GENDER.MALE : GENDER.FEMALE,
    patientAddress: patient.address,

    prescribedMedications: prescribedMedications,
    note: restPrescription.advice,

    issueDate: formatVnDateWithText(restPrescription.createdTime),
    doctor: restPrescription.physician.name,
  };
}
