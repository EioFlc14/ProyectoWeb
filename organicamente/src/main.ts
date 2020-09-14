import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const express = require('express')
const multer  = require('multer');
async function bootstrap() {
  const app = await NestFactory.create(AppModule) as any;
  //const session = require('express-sesion')
  const secret = '5 a 0 te acuerdas y te duele'
  app.set('view engine', 'ejs');
  app.use(express.static('publico'))
  //app.use(multer({ dest: '/imagenes'}));
  await app.listen(3001);
}
bootstrap()
