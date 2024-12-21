import { Repository } from '@/shared/domain/repositories/repository';
import { User } from '../entities/user.entity';

export interface UserRepository extends Repository<User> {}
