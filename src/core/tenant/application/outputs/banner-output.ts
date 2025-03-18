import { Audit } from '@/shared/domain/entities/entity';

export type BannerOutput = {
	id: string;
	active: boolean;
	imagePath: string;
	audit: Audit;
};
