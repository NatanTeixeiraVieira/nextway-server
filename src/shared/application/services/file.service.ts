type UploadResponse = {
	directory: string;
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
	upload(file: UploadFile): Promise<UploadResponse>;
}
