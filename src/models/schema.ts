import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public age!: number;

  public generatePasswordHash() {
    const saltRounds = 10;
    return bcrypt.hash(this.password, saltRounds);
  }

  public generateJWT() {
    const secretKey = 'secretkey';
    const expiresIn = '1d';

    return jwt.sign({ id: this.id }, secretKey, { expiresIn });
  }

  public validatePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

// User.belongsToMany(User, {
//     as: 'followers',
//     through: 'followers',
//     foreignKey: 'followingId',
//   });
  
//   User.belongsToMany(User, {
//     as: 'following',
//     through: 'followers',
//     foreignKey: 'followerId',
//   });
