import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { flattenValidationErrors } from './common/utils/validation/flatten-validation-errors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:3001",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // lanza error si llegan props extra
      transform: true, // transforma payloads a instancias de clase
      exceptionFactory: (errors) => {
        const messages = flattenValidationErrors(errors);
        return new BadRequestException(messages);
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
