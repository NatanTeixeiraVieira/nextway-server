import { Entity } from '@/shared/domain/entities/entity';

export type OpeninHoursProps = {
	weekdayName: string;
	weekdayShortName: string;
	start: string;
	end: string;
};

export type RegisterOpeningHoursProps = {
	weekdayName: string;
	weekdayShortName: string;
	start: string;
	end: string;
};

export class OpeningHours extends Entity<OpeninHoursProps> {}
