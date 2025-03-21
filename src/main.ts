import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import * as passport from 'passport';
import { Pool } from 'pg';
import * as PgSession from 'connect-pg-simple';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const sessionSecret = configService.get<string>('SESSION_SECRET');

  /** Session Store in PostgreSQL */
  const pgPool = new Pool({
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    user: configService.get<string>('DATABASE_USERNAME'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_DB'),
    ssl: process.env.NODE_ENV === 'prod' && { rejectUnauthorized: false }, // SSL connection
  });

  // Create session table if not exists
  createSessionTable(pgPool);

  // CORS settings for Next.js frontend
  app.enableCors({
    origin: 'https://umbkosa.org',
    credentials: true,
  });

  // Proxy settings for AWS
  app.use((req, res, next) => {
    req.app.set('trust proxy', 1);
    next();
  });

  app.use(
    session({
      store: new (PgSession(session))({
        pool: pgPool,
        tableName: 'session',
      }),
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      // 30 days
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'prod',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        sameSite: 'none', // CORS settings for Next.js frontend
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Delete Columns that are not defined in DTO
      forbidNonWhitelisted: true, // Return Error when Columns that are not defined in DTO
      transform: true,
    }),
  );

  await app.listen(process.env.SERVER_PORT);
}

async function createSessionTable(pgPool: Pool) {
  // Session table creation
  try {
    const client = await pgPool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL PRIMARY KEY,
        "sess" json NOT NULL,
        "expire" timestamp NOT NULL
      );
    `);
    client.release();
  } catch (error) {
    console.error('Failed to create session table:', error);
  }
}
bootstrap();
