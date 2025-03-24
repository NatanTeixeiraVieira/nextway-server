import { EnvConfig } from '@/shared/application/env-config/env-config';
import {
	FileService,
	UploadFile,
	UploadResponse,
} from '@/shared/application/services/file.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class FileSupabaseService implements FileService {
	private readonly supabase: SupabaseClient<any, 'public', any>;

	constructor(envConfigService: EnvConfig) {
		const supabaseUrl = envConfigService.getStorageUrl();
		const supabaseApiKey = envConfigService.getStorageApiKey();
		this.supabase = createClient(supabaseUrl, supabaseApiKey);
	}

	async upload(
		file: UploadFile,
		path: string,
		name = crypto.randomUUID().toString(),
	): Promise<UploadResponse> {
		const imageFullPath = `${path}/${name}`;
		const { data } = await this.supabase.storage
			.from('nextway')
			.upload(imageFullPath, file.buffer);

		return {
			fullPath: data?.fullPath ?? '',
		};
	}
}
