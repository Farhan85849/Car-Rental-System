import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository';

export class AuthService {
  private signToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey', {
      expiresIn: '30d',
    });
  }

  async register(data: any) {
    const { firstName, lastName, email, password } = data;
    
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    
    const token = this.signToken(user.id);
    return { token, user: { id: user.id, firstName, lastName, email, role: user.role } };
  }

  async login(data: any) {
    const { email, password } = data;
    
    if (!email || !password) {
      throw new Error('Please provide email and password');
    }
    
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    const token = this.signToken(user.id);
    return { token, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email, role: user.role } };
  }
}

export const authService = new AuthService();
