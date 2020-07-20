import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './user-avatar.reducer';
import { IUserAvatar } from 'app/shared/model/user-avatar.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IUserAvatarDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UserAvatarDetail = (props: IUserAvatarDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { userAvatarEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="avatarApp.userAvatar.detail.title">UserAvatar</Translate> [<b>{userAvatarEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="avatarApp.userAvatar.name">Name</Translate>
            </span>
          </dt>
          <dd>{userAvatarEntity.name}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="avatarApp.userAvatar.description">Description</Translate>
            </span>
          </dt>
          <dd>{userAvatarEntity.description}</dd>
          <dt>
            <span id="avatar">
              <Translate contentKey="avatarApp.userAvatar.avatar">Avatar</Translate>
            </span>
          </dt>
          <dd>
            {userAvatarEntity.avatar ? (
              <div>
                {userAvatarEntity.avatarContentType ? (
                  <a onClick={openFile(userAvatarEntity.avatarContentType, userAvatarEntity.avatar)}>
                    <img
                      src={`data:${userAvatarEntity.avatarContentType};base64,${userAvatarEntity.avatar}`}
                      style={{ maxHeight: '30px' }}
                    />
                  </a>
                ) : null}
                <span>
                  {userAvatarEntity.avatarContentType}, {byteSize(userAvatarEntity.avatar)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="uploaded">
              <Translate contentKey="avatarApp.userAvatar.uploaded">Uploaded</Translate>
            </span>
          </dt>
          <dd>
            {userAvatarEntity.uploaded ? <TextFormat value={userAvatarEntity.uploaded} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="avatarApp.userAvatar.user">User</Translate>
          </dt>
          <dd>{userAvatarEntity.user ? userAvatarEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/user-avatar" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/user-avatar/${userAvatarEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ userAvatar }: IRootState) => ({
  userAvatarEntity: userAvatar.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserAvatarDetail);
