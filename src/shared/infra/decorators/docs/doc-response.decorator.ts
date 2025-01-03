import { applyDecorators } from '@nestjs/common';
import {
	ApiOperation,
	ApiOperationOptions,
	ApiResponse,
	ApiResponseOptions,
} from '@nestjs/swagger';

type DocResponseOptions = {
	operation: ApiOperationOptions;
	success: ApiResponseOptions;
	responses?: ApiResponseOptions[];
};

export function DocResponse({
	operation,
	success,
	responses = [],
}: DocResponseOptions) {
	return applyDecorators(
		ApiOperation(operation),
		ApiResponse(success),
		ApiResponse({
			status: 500,
			description: 'Unknown error (Internal server error)',
		}),
		...responses.map((response) => ApiResponse(response)),
	);
}
