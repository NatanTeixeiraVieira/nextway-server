import { StateProps } from '@/shared/domain/entities/state.entity';

export interface StateQuery {
	getOneStateByName(name: string): Promise<StateProps | null>;
}
