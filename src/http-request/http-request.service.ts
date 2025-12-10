import { Injectable, Logger, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';

@Injectable()
export class HttpRequestService {
  private readonly logger = new Logger(HttpRequestService.name);

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
      this.handleError(error as AxiosError, url);
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
      this.handleError(error as AxiosError, url);
    }
  }

  async delete<T = any>(
    url: string,
    headers: Record<string, string> = {},
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.http.axiosRef.delete(url, {
        headers,
      });
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError, url);
    }
  }

  async patch<T = any>(
    url: string,
    data: any,
    headers: Record<string, string> = {},
  ): Promise<T> {
        try {
      const response: AxiosResponse<T> = await this.http.axiosRef.patch(
        url,
        data,
        { headers },
      );
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError, url);
    }
  }

  private handleError(error: AxiosError, url: string): never {
    if (error.response) {
      const status = error.response.status;
      const data: any = error.response.data;

      this.logger.error(
        `Error en petición a ${url}: ${status} - ${JSON.stringify(data)}`,
      );

      // Si es un error de Meta/WhatsApp, formateamos la respuesta
      if (data?.error) {
        throw new HttpException(
          {
            statusCode: status,
            message: data.error.error_user_msg || data.error.message,
            error: data.error.error_user_title || data.error.type,
            code: data.error.code,
            subcode: data.error.error_subcode,
            fbtrace_id: data.error.fbtrace_id,
          },
          status,
        );
      }

      // Si no hay estructura conocida, devolvemos el mensaje genérico
      throw new HttpException(
        {
          statusCode: status,
          message: data?.message || 'Error en petición externa',
        },
        status,
      );
    } else if (error.request) {
      this.logger.error(`Sin respuesta del servidor en ${url}`);
      throw new HttpException(
        { statusCode: 504, message: 'Sin respuesta del servidor externo' },
        504,
      );
    } else {
      this.logger.error(
        `Error configurando petición a ${url}: ${error.message}`,
      );
      throw new HttpException(
        { statusCode: 500, message: 'Error configurando petición' },
        500,
      );
    }
  }
}
