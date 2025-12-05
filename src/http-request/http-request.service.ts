import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';

@Injectable()
export class HttpRequestService {
  private readonly logger = new Logger();
  constructor(private readonly http: HttpService) {}
  async post<T = any>(
    url: string,
    data: any,
    headers: Record<string, string> = {},
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.http.axiosRef.post(
        url,
        data,
        { headers },
      );
      return response.data;
    } catch (error) {
      this.handleError(error, url);
      throw error; // re-lanza para que el caller decida qué hacer
    }
  }

  async get<T = any>(
    url: string,
    headers: Record<string, string> = {},
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.http.axiosRef.get(url, {
        headers,
      });
      return response.data;
    } catch (error) {
      this.handleError(error, url);
      throw error;
    }
  }

  private handleError(error: AxiosError, url: string) {
    if (error.response) {
      this.logger.error(
        `Error en petición a ${url}: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
      );
    } else if (error.request) {
      this.logger.error(`Sin respuesta del servidor en ${url}`);
    } else {
      this.logger.error(
        `Error configurando petición a ${url}: ${error.message}`,
      );
    }
  }
}
