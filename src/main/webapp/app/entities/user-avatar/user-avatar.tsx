import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { openFile, byteSize, Translate, ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './user-avatar.reducer';
import { IUserAvatar } from 'app/shared/model/user-avatar.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IUserAvatarProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const UserAvatar = (props: IUserAvatarProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const { userAvatarList, match, loading } = props;
  return (
    <div>
      <h2 id="user-avatar-heading">
        <Translate contentKey="avatarApp.userAvatar.home.title">User Avatars</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="avatarApp.userAvatar.home.createLabel">Create new User Avatar</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {userAvatarList && userAvatarList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="global.field.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="avatarApp.userAvatar.name">Name</Translate>
                </th>
                <th>
                  <Translate contentKey="avatarApp.userAvatar.description">Description</Translate>
                </th>
                <th>
                  <Translate contentKey="avatarApp.userAvatar.avatar">Avatar</Translate>
                </th>
                <th>
                  <Translate contentKey="avatarApp.userAvatar.uploaded">Uploaded</Translate>
                </th>
                <th>
                  <Translate contentKey="avatarApp.userAvatar.user">User</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {userAvatarList.map((userAvatar, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${userAvatar.id}`} color="link" size="sm">
                      {userAvatar.id}
                    </Button>
                  </td>
                  <td>{userAvatar.name}</td>
                  <td>{userAvatar.description}</td>
                  <td>
                    {userAvatar.avatar ? (
                      <div>
                        {userAvatar.avatarContentType ? (
                          <a onClick={openFile(userAvatar.avatarContentType, userAvatar.avatar)}>
                            <img src={`data:${userAvatar.avatarContentType};base64,${userAvatar.avatar}`} style={{ maxHeight: '30px' }} />
                            &nbsp;
                          </a>
                        ) : null}
                        <span>
                          {userAvatar.avatarContentType}, {byteSize(userAvatar.avatar)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>{userAvatar.uploaded ? <TextFormat type="date" value={userAvatar.uploaded} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{userAvatar.user ? userAvatar.user.login : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${userAvatar.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${userAvatar.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${userAvatar.id}/delete`} color="danger" size="sm">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="avatarApp.userAvatar.home.notFound">No User Avatars found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ userAvatar }: IRootState) => ({
  userAvatarList: userAvatar.entities,
  loading: userAvatar.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserAvatar);
