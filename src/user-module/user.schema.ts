import bcrypt from 'bcrypt';
import mongooseService from '../common/mongoose.service';
import AuthRoles from '../auth-module/auth-roles.enum';
import AuthCredentialsDTO from '../auth-module/dto/auth-credentials.dto';
import UserDTO from './dto/user.dto';
import AppError from '../common/app-error.service';

class UserModel {
  private Schema = mongooseService.getMongoose().Schema;

  private userSchema = new this.Schema<UserDTO>(
    {
      firstName: {
        type: String,
        required: [true, 'first name is required'],
        trim: true,
      },
      lastName: {
        type: String,
        required: [true, 'last name is required'],
        trim: true,
      },
      role: {
        type: String,
        enum: AuthRoles,
        trim: true,
        default: AuthRoles.USER,
      },
      password: {
        type: String,
        required: [true, 'Please provide a password'],
        // minlength: [8, 'Your password should have more than 7 characters'],
        trim: true,
        select: false,
      },
      email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        trim: true,
      },
    },
    {
      toJSON: {
        virtuals: true,
      },
      toObject: {
        virtuals: true,
      },
      timestamps: true,
    }
  );

  private User = mongooseService.getMongoose().model('Users', this.userSchema);

  public async createUser(
    authCredentialsDTO: AuthCredentialsDTO
  ): Promise<void> {
    const { password } = authCredentialsDTO;

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password, salt);
    await this.User.create({
      ...authCredentialsDTO,
      password: hashedPassword,
    });
  }

  public async getUserByEmail(email: string): Promise<UserDTO> {
    const user = await this.User.findOne({ email }).select('+password');
    if (!user) throw new AppError(`User ${email} not found`, 400);
    return user;
  }

  public async getUserById(id: string) {
    return this.User.findById(id, { password: 0 });
  }

  public async getAllUsers(): Promise<UserDTO[]> {
    return this.User.find();
  }

  public async validatePassword(
    enteredPassword: string,
    candidatePassword: string
  ): Promise<boolean> {
    return bcrypt.compare(enteredPassword, candidatePassword);
  }
}

export default new UserModel();
