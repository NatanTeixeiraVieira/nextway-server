export interface MessagingService {
	publish(topic: string, message: unknown): Promise<void>;
	subscribe(topic: string, callback: (message: unknown) => void): Promise<void>;
}
