export const ErrorMessages = {
	EMAIL_NOT_INFORMED: 'Email não informado',
	NAME_NOT_INFORMED: 'Nome não informado',
	PASSWORD_NOT_INFORMED: 'Senha não informada',
	INVALID_EMAIL: 'Email inválido',
	INVALID_PASSWORD: 'Senha inválida',
	INVALID_NAME: 'Nome inválido',
	INVALID_CPF: 'CPF inválido',
	INVALID_TOKEN: 'Token inválido',
	INVALID_PHONE: 'Telefone inválido',
	USER_NOT_FOUND: 'Usuário não encontrado',
	EMAIL_ALREADY_EXISTS: 'Email já em uso',
	CNPJ_ALREADY_EXISTS: 'CNPJ já em uso',
	SLUG_ALREADY_EXISTS: 'Slug já em uso',
	INVALID_CREDENTIALS: 'Email ou senha inválidos',
	INVALID_REFRESH_TOKEN: 'Refresh token inválido',
	INACTIVE_USER: 'Usuário não ativo',
	INVALID_CHANGE_PASSWORD_TOKEN: 'Token de troca de senha inválido',
	FILE_LIMIT_EXCEEDED: 'Tamanho máximo do arquivo excedido',

	userNotFoundByEmail: (email: string) =>
		`Usuário não encontrado pelo email ${email}`,

	invalidMimetype: (mimetype: string) => `Mimetype ${mimetype} inválido`,

	stateNotFound: (state: string) => `Estado ${state} não encontrado`,

	cityNotFound: (city: string) => `Cidade ${city} não encontrada`,

	weekdayNotFound: (id: string) =>
		`Dia da semana  não encontrado pelo ID ${id}`,
} as const;
