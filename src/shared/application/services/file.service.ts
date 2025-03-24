export type UploadResponse = {
	fullPath: string;
};

export type UploadFile = {
	fieldname: string;
	originalname: string;
	encoding: string;
	mimetype: string;
	buffer: Buffer;
	size: number;
};

export interface FileService {
	upload(
		file: UploadFile,
		path: string,
		name?: string,
	): Promise<UploadResponse>;
}
