import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, sheets_v4 } from 'googleapis';
import { AnyAuthClient, AuthClient, GoogleAuth, JWT, OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleSheetsService {
  private readonly logger = new Logger(GoogleSheetsService.name);
  private sheets: sheets_v4.Sheets;

  constructor(private readonly configService: ConfigService) {
    this.sheets = google.sheets('v4');
  }

  private async getAuthClient(): Promise<AnyAuthClient> {
    const credentials = JSON.parse(
      Buffer.from(this.configService.get<string>('GOOGLE_CREDENTIALS')!, 'base64').toString(),
    );

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return auth.getClient();
  }

  async addRowToSheet(
    auth: any,
    spreadsheetId: string,
    values: string[],
  ): Promise<sheets_v4.Schema$AppendValuesResponse> {
    const request = {
      spreadsheetId,
      range: 'reservas',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [values], // cada fila es un array de strings
      },
      auth,
    };

    try {
      const response = await this.sheets.spreadsheets.values.append(request);
      return response.data;
    } catch (error) {
      this.logger.error('Error adding row to sheet', error);
      throw error;
    }
  }

  async appendToSheets(values: string[]): Promise<string> {
    try {
      const authClient = await this.getAuthClient();
      const spreadsheetId = this.configService.get<string>('SPREADSHEET_ID')!
      await this.addRowToSheet(authClient, spreadsheetId, values);
      return 'Datos correctamente agregados.';
    } catch (error) {
      this.logger.error('Error appending to sheet', error);
      throw error;
    }
  }
}