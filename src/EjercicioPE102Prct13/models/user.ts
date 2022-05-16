import {Document, model, Schema} from 'mongoose';
import validator from 'validator';

/**
 * Document interface for users
 */
export interface UserDocumentInterface extends Document {
    name: string,
    surname: string[],
    age: number,
    email: string,
    password: string
}

/**
 * User Mongoose Schema
 */
export const UserSchema = new Schema<UserDocumentInterface>({
  name: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Name must start with a capital letter');
      } else if (!validator.isAlpha(value)) {
        throw new Error('Name must contain alphabetic characters only');
      }
    },
  },
  surname: {
    type: [String],
    required: true,
    validate: (value: string[]) => {
      if (value.length === 0) {
        throw new Error('Users must have at least one surname');
      }
      value.forEach((element: string) => {
        if (!validator.isAlpha( element, 'es-ES', {'ignore': ' -'})) {
          throw new Error('Surnames must contain alphabetic characters only');
        } else if (!element.match(/^[A-Z]/)) {
          throw new Error('Name must start with a capital letter');
        }
      });
    },
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: (value: string) => {
      if (!validator.isEmail(value)) {
        throw new Error('Email not valid');
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length < 8) {
        throw new Error('Password must have at least 8 characters');
      } else if (!value.match(/^[A-Z]/)) {
        throw new Error('Password must start with a capital letter');
      }
    },
  },
});

/**
 * User Mongoose model
 */
export const User = model<UserDocumentInterface>('User', UserSchema);