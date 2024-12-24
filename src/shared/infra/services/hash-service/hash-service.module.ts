import { Module } from '@nestjs/common';
import { HashBcryptService } from './bcrypt/hash-bcrypt.service';

@Module({
	imports: [],
	providers: [HashBcryptService],
	exports: [HashBcryptService],
})
export class HashServiceModule {}
