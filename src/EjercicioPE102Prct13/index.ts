import {User} from './models/user';
import {UserCRUD} from './UserCRUD';
import './db/mongoose';

const user = new User({
  name: 'Marc',
  surname: ['Carbonell', 'González de Chaves'],
  age: 20,
  email: 'alu0101323282@ull.edu.es',
  password: 'Contraseña1234',
});

const update = {
  name: 'Antonio',
  surname: ['Pérez', 'López'],
  age: 34,
  email: 'antonioperez@gmail.com',
  password: 'Password5678',
};

UserCRUD.postUser(user);
UserCRUD.getUser('alu0101323282@ull.edu.es');
UserCRUD.patchUser('alu0101323282@ull.edu.es', update);
UserCRUD.deleteUser('antonioperez@gmail.com');