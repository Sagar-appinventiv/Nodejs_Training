import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/database';

export class Follower extends Model {
  public id!: number;
  public followerId!: number;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
    follower: any;
}

Follower.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Follower',
  }
);
Follower.sync({force: false});
// Follower.belongsTo(User, { foreignKey: 'followerId' });
// Follower.belongsTo(User, { foreignKey: 'userId' });

// export default Follower;
