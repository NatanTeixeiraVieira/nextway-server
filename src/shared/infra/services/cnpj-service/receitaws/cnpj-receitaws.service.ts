import { EnvConfig } from '@/shared/application/env-config/env-config';
import {
	CnpjService,
	GetInfosByCnpjResponse,
} from '@/shared/application/services/cnpj.service';
import { HttpService } from '@/shared/application/services/http.service';

type CnpjResponse = {
	abertura: string;
	situacao: string;
	tipo: string;
	nome: string;
	porte: string;
	natureza_juridica: string;
	atividade_principal: MainActivity[];
	atividades_secundarias: SecondaryActivity[];
	qsa: Qsa[];
	logradouro: string;
	numero: string;
	complemento: string;
	municipio: string;
	bairro: string;
	uf: string;
	cep: string;
	email: string;
	telefone: string;
	data_situacao: string;
	cnpj: string;
	ultima_atualizacao: string;
	status: string;
	fantasia: string;
	efr: string;
	motivo_situacao: string;
	situacao_especial: string;
	data_situacao_especial: string;
	capital_social: string;
	simples: Simple;
	simei: Simei;
	extra: Extra;
	billing: Billing;
};

type MainActivity = {
	code: string;
	text: string;
};

type SecondaryActivity = {
	code: string;
	text: string;
};

type Qsa = {
	nome: string;
	qual: string;
	nome_rep_legal?: string;
	qual_rep_legal?: string;
};

type Simple = {
	optante: boolean;
	data_opcao: string;
	data_exclusao: string;
	ultima_atualizacao: string;
};

type Simei = {
	optante: boolean;
	data_opcao: string;
	data_exclusao: string;
	ultima_atualizacao: string;
};

type Extra = {};

type Billing = {
	free: boolean;
	database: boolean;
};

export class CnpjReceitawsService implements CnpjService {
	constructor(
		private readonly httpService: HttpService,
		private readonly envCofigService: EnvConfig,
	) {}

	async getInfosByCnpj(cnpj: string): Promise<GetInfosByCnpjResponse> {
		const apiUrl = this.envCofigService.getZipcodeApiBaseUrl();
		const response = await this.httpService.get<CnpjResponse>(
			`${apiUrl}/${cnpj}`,
		);

		const { nome } = response.data;

		return {
			corporateReason: nome,
		};
	}
}
