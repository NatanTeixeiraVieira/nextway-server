import { Entity } from '@/shared/domain/entities/entity';

export type OpeninHoursProps = {
	weekday: string;
	start: string;
	end: string;
};

export type RegisterOpeningHoursProps = {
	weekday: string;
	start: string;
	end: string;
};

export class OpeningHours extends Entity<OpeninHoursProps> {}
