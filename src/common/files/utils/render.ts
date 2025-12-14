import {MeasurementItem} from '@modules/assessments/entities/measurement-item.entity';
import ejs from 'ejs';
import fs from 'fs';
import {unlink} from 'fs/promises';
import {PDFDocument} from 'pdf-lib';
import * as puppeteer from 'puppeteer';

export interface MappedItem {
    id?: number;
    name: string;
    value?: string;
    measurementItem: MeasurementItem | null;
    children?: MappedItem[];
    _firstSeen?: number; // internal: order
}

export function renderAssessmentItemsHTML(
    items: MappedItem[],
    level = 0,
): string {
    let html = '';

    const romanOrNumberRe = /^\s*(?:[IVXLCDM]+\.|\d+\.)/i;

    for (const item of items) {
        const children = item.children ?? [];
        const hasChildren = children.length > 0;

        const indicatorChildren = children.filter((c) => !!c.measurementItem);
        const textChildren = children.filter((c) => !c.measurementItem);

        const trimmed = item.name?.trim() ?? '';

        // Chỉ La Mã hoặc số thì không indent
        const noIndent = romanOrNumberRe.test(trimmed);
        const paddingStyle = noIndent
            ? 'padding-left:0;'
            : `padding-left:${level * 16}px;`;

        if (hasChildren) {
            html += `<div style="margin-bottom:4px; ${paddingStyle}">\n`;
            html += `<div style="font-weight:600; margin-top:${level === 0 ? '10px' : '5px'};">${item.name}</div>`;

            if (item.value) {
                html += `<span style="white-space:pre-wrap;">: ${item.value}</span>\n`;
            }

            if (textChildren.length > 0) {
                html += `<div style="${paddingStyle}">\n`;
                html += renderAssessmentItemsHTML(textChildren, level + 1);
                html += `</div>\n`;
            }

            if (indicatorChildren.length > 0) {
                html += `
        <table style="width:100%; border-collapse:collapse; margin-top:4px; text-align:center">
          <thead style="background:#f5f5f5;">
            <tr>
              <th style="border:1px solid #ccc; padding:2px;">Chỉ số xét nghiệm</th>
              <th style="border:1px solid #ccc; padding:2px;">Chỉ số bình thường</th>
              <th style="border:1px solid #ccc; padding:2px;">Kết quả</th>
              <th style="border:1px solid #ccc; padding:2px;">Đơn vị</th>
            </tr>
          </thead>
          <tbody>
            ${indicatorChildren
                    .map(
                        (child) => `
            <tr>
              <td style="border:1px solid #ccc; padding:2px; vertical-align:middle; text-align:left;">
                ${child.name}
              </td>
              <td style="border:1px solid #ccc; padding:2px; vertical-align:middle; text-align:left;">
                ${
                            child.measurementItem
                                ? `<p>Tối thiểu: ${child.measurementItem.minimum}</p>` +
                                `<p>Tối đa: ${child.measurementItem.maximum}</p>`
                                : '-'
                        }
              </td>
              <td style="border:1px solid #ccc; padding:2px; vertical-align:middle;">
                ${child.value ?? '-'}
              </td>
              <td style="border:1px solid #ccc; padding:2px; vertical-align:middle;">
                ${child.measurementItem?.unit ?? '-'}
              </td>
            </tr>
            `,
                    )
                    .join('')}
          </tbody>
        </table>\n`;
            }

            html += `</div>\n`;
        } else {
            html += `<div style="margin-bottom:8px; ${paddingStyle}">`;
            html += `<span style="font-weight:600;">${item.name}</span>`;

            if (item.value) {
                html += `<span style="white-space:pre-wrap;">: ${item.value}</span>`;
            }

            html += `</div>\n`;
        }
    }

    return html;
}

export async function htmlToPdf(
    templatePath: string,
    pdfPath: string,
    data: any,
) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const html = await ejs.renderFile(templatePath, data);
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
        ],
    });

    const page = await browser.newPage();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await page.setContent(html, {waitUntil: 'networkidle0'});
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {top: '15mm', bottom: '15mm', left: '10mm', right: '10mm'},
    });

    await browser.close();
}

export async function mergeFiles(paths: string[], targetPath: string) {
    const mergedPdf = await PDFDocument.create();

    for (const path of paths) {
        const pdfBytes = fs.readFileSync(path);
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();

    fs.writeFileSync(targetPath, mergedPdfBytes);
}

export async function deleteFiles(paths: string[]): Promise<void> {
    for (const filePath of paths) {
        try {
            await unlink(filePath);
        } catch (err) {
            console.error(`Failed to delete ${filePath}:`, err);
        }
    }
}
