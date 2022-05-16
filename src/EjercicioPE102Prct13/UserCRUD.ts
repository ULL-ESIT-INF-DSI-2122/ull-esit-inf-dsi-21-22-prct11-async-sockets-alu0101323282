import {User} from './models/user';

/**
 * Class for users database CRUD operations
 */
export class UserCRUD {
  /**
   * Adds an user to the database
   * @param user User to add
   */
  public static postUser(user) {
    user.save().then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Gets an user from the database
   * @param email Email of the user to get
   */
  public static getUser(email: string) {
    const filter = {email: email};
    User.find(filter).then((users) => {
      if (users.length !== 0) {
        console.log(users);
      } else {
        console.log('User not found');
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Updates a database user
   * @param email Email of the user to update
   * @param update User propieties to update
   */
  public static patchUser(email: string, update) {
    const filter = {email: email};
    User.findOneAndUpdate(filter, {
      name: 'Antonio',
      surname: ['Pérez', 'López'],
      age: 34,
      email: 'antonioperez@gmail.com',
      password: 'Password5678',
    }, {
      new: true,
      runValidators: true,
    }).then((user) => {
      if (!user) {
        console.log('User not found');
      } else {
        console.log(user);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Deletes an user from the database
   * @param email Email of the user to delete
   */
  public static deleteUser(email: string) {
    const filter = {email: email};
    User.findOneAndDelete(filter).then((user) => {
      if (!user) {
        console.log('User not found');
      } else {
        console.log(user);
      }
    }).catch((error) => {
      console.log(error);
    });
  }
}