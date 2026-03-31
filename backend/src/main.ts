import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

  console.log(`Servidor corriendo en: ${await app.getUrl()}`);
}
bootstrap();
