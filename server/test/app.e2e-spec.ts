import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * Boots the whole app, so it needs the configured Postgres and Redis to be
 * reachable. It covers the two routes that are deliberately unauthenticated
 * plus a spot check that the global auth guard is actually protecting the
 * rest.
 */
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // The global AuthGuard protects every route that isn't explicitly @Public(),
  // including the root greeting. /health is the unauthenticated probe.
  it('GET / requires authentication', () => {
    return request(app.getHttpServer()).get('/').expect(401);
  });

  it('GET /health reports liveness without auth', async () => {
    const response = await request(app.getHttpServer())
      .get('/health')
      .expect(200);

    const body = response.body as {
      status: string;
      uptime: number;
      timestamp: string;
    };
    expect(body.status).toBe('ok');
    expect(typeof body.uptime).toBe('number');
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
  });

  it('protects everything else by default', () => {
    return request(app.getHttpServer()).get('/user/profile').expect(401);
  });
});
