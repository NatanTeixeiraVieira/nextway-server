type GetInfosByCnpj = {
	corporateReason: string;
};

export interface CnpjService {
	getInfosByCnpj(cnpj: string): Promise<GetInfosByCnpj>;
}
