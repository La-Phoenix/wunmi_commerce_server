import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../Schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file



@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private jwtService: JwtService,) {}

    async register(name: string, password: string, email: string): Promise<User> {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new this.userModel({ name, email, password: hashedPassword });
            await newUser.save()    
            return newUser;
        } catch (error) {
            return error.message;
        }
    }

    async findUserByEmail(email: string) {
        try {
            const user = await this.userModel.findOne({ email });
            return user;
        } catch (error) {
            return error.message;
        }
      }

    async validateUser(email: string, password: string): Promise<User> {
        try {
            const user = await this.userModel.findOne({ email });
            if (user && await bcrypt.compare(password, user.password)) {
                return user;
            }
            return null;
        } catch (error) {
            return error;
        }
    }

    async generateToken(user: User & { _id: string}) :Promise<string>{
        const payload = { email: user.email, name: user.name, id: user._id };
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1h',
        });
      }

    async validateGoogleUser(profile: {email: string, name: string}): Promise<User> {
        const { email, name } = profile;
        try {
            let user = await this.userModel.findOne({ email });
            if (!user) {
                user = await this.userModel.create({
                    email,
                    name,
                    password: null,
                });
            }
            return user;
        } catch (error) {
            return error;
        }
      }
      
}
