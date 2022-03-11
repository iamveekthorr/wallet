import bcrypt from 'bcrypt';
import mongooseService from '../common/mongoose.service';
import AuthRoles from '../auth/auth-roles.enum';
import AuthCredentialsDTO from '../auth/dto/auth-credentials.dto';

class UserModel {
  private Schema = mongooseService.getMongoose().Schema;

  private userSchema = new this.Schema({
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
  });

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
}

export default new UserModel();
