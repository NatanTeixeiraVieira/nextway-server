import { applyDecorators } from '@nestjs/common';
import { Transactional as TypeOrmTransactional } from 'typeorm-transactional';

export function Transactional() {
	return applyDecorators(TypeOrmTransactional());
}
