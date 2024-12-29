import { Body, Controller, Post } from '@/shared/infra/decorators';
import { RegisterUseCase } from '../../application/usecases/register.usecase';
import { UserRegisterDocResponse } from '../decorators/user-register-doc-response.decorator';
import { RegisterDto } from '../dtos/register.dto';
import { RegisterPresenter } from '../presenters/register.presenter';

@Controller('user')
export class UserController {
	constructor(private readonly registerUseCase: RegisterUseCase) {}

	@UserRegisterDocResponse()
	@Post('/register')
	async registerUser(
		@Body() registerDto: RegisterDto,
	): Promise<RegisterPresenter> {
		const output = await this.registerUseCase.execute(registerDto);
		return new RegisterPresenter(output);
	}
}
