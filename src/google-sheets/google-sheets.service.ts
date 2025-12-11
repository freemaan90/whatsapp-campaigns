import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class GoogleSheetsService {
  constructor(private configService: ConfigService) {}

  private sheets = google.sheets('v4');
  private async addRowtoSheet(
    auth: any,
    spreadsheetId: string,
    values: string,
  ) {
    const request = {
      spreadsheetId,
      range: 'reservas',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [values],
      },
      auth,
    };

    try {
      const response = (await this.sheets.spreadsheets.values.append(request))
        .data;
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  async appendToSheets(data: any) {
    try {
      const credentials = JSON.parse(
        Buffer.from(
          this.configService.get('GOOGLE_CREDENTIALS'),
          'base64',
        ).toString(),
      );
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const autClient = await auth.getClient();
      const spreadsheetId = '1sC0Vn7bTHfDevOWIfbc2XSIUrE3OEmEoUG2dfGPYh5I';
      await this.addRowtoSheet(autClient, spreadsheetId, data);
      return 'Datos correctamente agregados.';
    } catch (error) {
      console.error(error);
    }
  }
}
