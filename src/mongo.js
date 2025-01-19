import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/LoginForm')
  .then(() => {
    console.log('mongoose connected');
  })
  .catch((error) => {
    console.log('Connection failed:', error);
  });

const logInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const LogInCollection = mongoose.model('LogInCollection', logInSchema);

export default LogInCollection;
