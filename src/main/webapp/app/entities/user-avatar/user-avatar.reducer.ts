import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IUserAvatar, defaultValue } from 'app/shared/model/user-avatar.model';

export const ACTION_TYPES = {
  FETCH_USERAVATAR_LIST: 'userAvatar/FETCH_USERAVATAR_LIST',
  FETCH_USERAVATAR: 'userAvatar/FETCH_USERAVATAR',
  CREATE_USERAVATAR: 'userAvatar/CREATE_USERAVATAR',
  UPDATE_USERAVATAR: 'userAvatar/UPDATE_USERAVATAR',
  DELETE_USERAVATAR: 'userAvatar/DELETE_USERAVATAR',
  SET_BLOB: 'userAvatar/SET_BLOB',
  RESET: 'userAvatar/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IUserAvatar>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type UserAvatarState = Readonly<typeof initialState>;

// Reducer

export default (state: UserAvatarState = initialState, action): UserAvatarState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_USERAVATAR_LIST):
    case REQUEST(ACTION_TYPES.FETCH_USERAVATAR):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_USERAVATAR):
    case REQUEST(ACTION_TYPES.UPDATE_USERAVATAR):
    case REQUEST(ACTION_TYPES.DELETE_USERAVATAR):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_USERAVATAR_LIST):
    case FAILURE(ACTION_TYPES.FETCH_USERAVATAR):
    case FAILURE(ACTION_TYPES.CREATE_USERAVATAR):
    case FAILURE(ACTION_TYPES.UPDATE_USERAVATAR):
    case FAILURE(ACTION_TYPES.DELETE_USERAVATAR):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_USERAVATAR_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_USERAVATAR):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_USERAVATAR):
    case SUCCESS(ACTION_TYPES.UPDATE_USERAVATAR):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_USERAVATAR):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.SET_BLOB: {
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType,
        },
      };
    }
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/user-avatars';

// Actions

export const getEntities: ICrudGetAllAction<IUserAvatar> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_USERAVATAR_LIST,
  payload: axios.get<IUserAvatar>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IUserAvatar> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_USERAVATAR,
    payload: axios.get<IUserAvatar>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IUserAvatar> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_USERAVATAR,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IUserAvatar> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_USERAVATAR,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IUserAvatar> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_USERAVATAR,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType,
  },
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
