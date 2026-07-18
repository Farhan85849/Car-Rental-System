import { User } from '../models/User';

export class UserRepository {
  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async create(data: any) {
    const user = new User(data);
    await user.save();
    return user;
  }

  async findById(id: string) {
    return User.findById(id);
  }
}

export const userRepository = new UserRepository();
