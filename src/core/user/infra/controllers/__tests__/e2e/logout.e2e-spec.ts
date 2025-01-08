import { CookiesName } from '@/shared/application/constants/cookies';
import { appFastifyConfigTest } from '@/testing/app-config-test';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';

describe('UserController userLogout e2e tests', () => {
	let app: NestFastifyApplication;

	beforeAll(async () => {
		const { fastifyApp } = await appFastifyConfigTest();
		app = fastifyApp;
	});

	afterAll(async () => {
		await app.close();
	});

	it('should do user logout', async () => {
		// Setar os cookies antes da requisição de logout
		const agent = request.agent(app.getHttpServer());
		agent.jar.setCookie(`${CookiesName.ACCESS_TOKEN}=accessToken`);
		agent.jar.setCookie(`${CookiesName.REFRESH_TOKEN}=refreshToken`);

		const response = await request(app.getHttpServer())
			.post('/api/user/v1/logout')
			.expect(200);

		const cookiesHeader = response.headers['set-cookie'];
		expect(cookiesHeader).toBeDefined();

		const cookies = Array.isArray(cookiesHeader)
			? cookiesHeader
			: [cookiesHeader];
		expect(cookies.length).toBeGreaterThan(0);

		expect(cookies[0]).toContain(`${CookiesName.ACCESS_TOKEN}=;`);
		expect(cookies[0]).toContain('SameSite=Strict');

		expect(cookies[1]).toContain(`${CookiesName.REFRESH_TOKEN}=;`);
		expect(cookies[1]).toContain('SameSite=Strict');
	});
});
