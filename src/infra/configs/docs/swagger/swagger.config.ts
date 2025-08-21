import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerConfig {
  static config(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('Task Cluster API')
      .setDescription('Task Cluster Docs Api')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
}
