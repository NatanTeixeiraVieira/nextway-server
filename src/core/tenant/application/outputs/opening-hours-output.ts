import { Audit } from '@/shared/domain/entities/entity';

export type OpeningHoursOutput = {
	id: string;
	weekdayName: string;
	weekdayShortName: string;
	start: string;
	end: string;
	audit: Audit;
};
