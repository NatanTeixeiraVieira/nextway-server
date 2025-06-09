export interface MessagingService {
	publish(topic: string, message: unknown): Promise<void>;
	handleErrors<T>(exec: () => Promise<T>): Promise<T | null>;
}
