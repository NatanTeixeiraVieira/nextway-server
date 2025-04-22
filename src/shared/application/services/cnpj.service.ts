export type GetInfosByCnpjResponse = {
	corporateReason: string;
};

export interface CnpjService {
	getInfosByCnpj(cnpj: string): Promise<GetInfosByCnpjResponse | null>;
}
