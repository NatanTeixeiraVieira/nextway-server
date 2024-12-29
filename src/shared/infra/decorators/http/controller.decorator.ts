import { applyDecorators, Controller as NestController } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

type ControllerOptions = {
	name: string;
	version?: string;
};

function createControllerFromString(name: string): ClassDecorator {
	return applyDecorators(ApiTags(name), NestController(`/api/${name}/v1`));
}

function createControllerFromOptions({
	name,
	version = 'v1',
}: ControllerOptions): ClassDecorator {
	return applyDecorators(
		ApiTags(name),
		NestController(`/api/${name}/${version}`),
	);
}

export function Controller(arg: string | ControllerOptions): ClassDecorator {
	if (typeof arg === 'string') {
		return createControllerFromString(arg);
	}
	return createControllerFromOptions(arg);
}
