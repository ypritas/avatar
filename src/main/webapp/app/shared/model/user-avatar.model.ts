import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';

export interface IUserAvatar {
  id?: number;
  name?: string;
  description?: any;
  avatarContentType?: string;
  avatar?: any;
  uploaded?: string;
  user?: IUser;
}

export const defaultValue: Readonly<IUserAvatar> = {};
