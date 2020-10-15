"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const secret = '5 a 0 te acuerdas y te duele';
    app.set('view engine', 'ejs');
    app.use(express.static('publico'));
    app.use(session({
        name: 'server-session-id',
        secret: secret,
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false },
        store: new FileStore(),
    }));
    await app.listen(3001);
}
bootstrap();
//# sourceMappingURL=main.js.map