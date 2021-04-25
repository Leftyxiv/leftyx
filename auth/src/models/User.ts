import mongoose from 'mongoose';

interface UserAttrs {
  email: String;
  password: String;
}

// user model interface
interface UserModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): any;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false
  }
})
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}

const User = mongoose.model<any, UserModel>('User', userSchema);


export { User };