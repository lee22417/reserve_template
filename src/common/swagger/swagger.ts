import { INestApplication } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Injectable()
export class Swagger {
  static setupSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('API Docs')
      .setDescription('REST API List')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Token',
          in: 'header',
          description: 'JWT 토큰',
        },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);
  }
}
