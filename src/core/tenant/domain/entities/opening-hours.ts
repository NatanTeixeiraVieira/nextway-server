import { Entity } from '@/shared/domain/entities/entity';

export type OpeningHoursProps = {
	weekdayName: string;
	weekdayShortName: string;
	start: string;
	end: string;
};

export type RegisterTenantOpeningHoursProps = {
	weekdayName: string;
	weekdayShortName: string;
	start: string;
	end: string;
};

export class OpeningHours extends Entity<OpeningHoursProps> {}
