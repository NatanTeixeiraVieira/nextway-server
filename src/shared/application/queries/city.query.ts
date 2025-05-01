import { CityProps } from '@/shared/domain/entities/city.entity';

export interface CityQuery {
	getOneCityByName(name: string): Promise<CityProps | null>;
}
