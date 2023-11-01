import { User } from '../models/user.model';
import { Session } from '../models/session.model';
import { Notification } from '../models/notification.model';
import { Like } from '../models/like.model';
import { ArchivedUser } from '../models/archivedUser.model';
import { ChatModel } from './chat.model';
import { Match } from './match.model';

export const syncModelsSequentially = async ()=> {
  try {
    await User.sync({ alter: true });
    await Session.sync({ alter: true });
    await Like.sync({ alter: true });
    await Match.sync({ alter: true });
    await Notification.sync({ alter: true });
    await ChatModel.sync({ alter: true });
    await ArchivedUser.sync({ alter: true });
    console.log('------- Tables synchronized successfully -------');
  } catch (error) {
    console.error('!!! Error synchronizing tables:', error);
  }
}
