import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { getMonthName } from '../models/date-range';

@Injectable({
  providedIn: 'root',
})
export class PdfmakeService {
  constructor() {
    (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  public generatePdf(documentDefinition: any, action = 'open'): void {
    switch (action) {
      case 'open':
        pdfMake.createPdf(documentDefinition).open();
        break;
      case 'print':
        pdfMake.createPdf(documentDefinition).print();
        break;
      case 'download':
        pdfMake.createPdf(documentDefinition).download();
        break;
      default:
        pdfMake.createPdf(documentDefinition).open();
        break;
    }
  }

  public async getHeaderDefinition(reportName: string): Promise<any> {
    return {
      columns: [
        {
          image: await this._getBase64LogoTRD(),
          height: 30,
          width: 50,
        },
        [
          {
            text: 'Cadena de Tiendas CARIBE',
            fontSize: 14,
            bold: true,
            alignment: 'center',
          },
          {
            text: reportName,
            fontSize: 14,
            bold: true,
            alignment: 'center',
          },
        ],
      ],
    };
  }

  public getFooterDefinition(page: string, pages: string): any {
    return {
      margin: [40, 0, 40, 0],
      // height: 30,
      columns: [
        {
          text: 'SISCO',
        },
        {
          alignment: 'center',
          text: moment().format('DD/MM/YYYY hh:mm:ss a'),
        },
        {
          alignment: 'right',
          text: [
            'Página ',
            { text: page.toString(), italics: true },
            ' de ',
            { text: pages.toString(), italics: true },
          ],
        },
      ],
    };
  }

  private _getBase64LogoTRD(): any {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = './assets/img/CT_Caribe.png';
    });
  }

  public getPeriodoDefinition(periodo: number, año: string): any {
    return {
      text: `Período: ${getMonthName(periodo)}/${año}`,
      bold: true,
      margin: [0, 10, 0, 0],
    };
  }
}
