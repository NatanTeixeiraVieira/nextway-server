import { WeekdayProps } from './weekday.entity';

export type OpeningHoursProps = {
	weekday: WeekdayProps;
	start: string;
	end: string;
};

export type RegisterTenantOpeningHoursProps = {
	weekday: {
		id: string;
		name: string;
		shortName: string;
	};
	start: string;
	end: string;
};
