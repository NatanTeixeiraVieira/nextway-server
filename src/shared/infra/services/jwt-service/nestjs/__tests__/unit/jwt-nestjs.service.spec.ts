import { JwtService } from '@nestjs/jwt';
import { JwtNestjsService } from '../../jwt-nestjs.service';

describe('JwtNestjsService unit tests', () => {
	const payload = {
		sub: 'c68ce367-f85b-4da7-a6cb-e9719432f552',
		email: 'test@email.com',
	};
	const secret = 'secret';

	let sut: JwtNestjsService;
	let jwtService: JwtService;

	beforeEach(() => {
		jwtService = new JwtService({
			global: true,
		});
		sut = new JwtNestjsService(jwtService);
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	it('should generate JWT', async () => {
		const result = await sut.generateJwt(payload, {
			expiresIn: 86400,
			secret: 'secret',
		});

		expect(Object.keys(result)).toEqual(['token']);
		expect(result.token).toBeTruthy();
		expect(typeof result.token).toEqual('string');
	});

	it('should verify a jwt', async () => {
		const result = await sut.generateJwt(payload, { expiresIn: 86400, secret });

		const validToken = await sut.verifyJwt(result.token, { secret });
		expect(validToken).toBeTruthy();

		const invalidToken = await sut.verifyJwt('fake', { secret });
		expect(invalidToken).toBeFalsy();

		const invalidWithJwtToken = await sut.verifyJwt(
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
			{ secret },
		);
		expect(invalidWithJwtToken).toBeFalsy();
	});

	it('should decode JWT', async () => {
		const result = await sut.generateJwt(payload, {
			expiresIn: 86400,
			secret: 'secret',
		});

		const decodedJwt = await sut.decodeJwt<typeof payload>(result.token);

		expect(decodedJwt.sub).toBe(payload.sub);
		expect(decodedJwt.email).toBe(payload.email);
	});
});
