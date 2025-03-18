import { Entity } from '@/shared/domain/entities/entity';

export type BannerProps = {
	imagePath: string;
	active: boolean;
};

export type RegisterTenantBannerProps = {
	active: boolean;
	imagePath: string;
};

export class Banner extends Entity<BannerProps> {}
