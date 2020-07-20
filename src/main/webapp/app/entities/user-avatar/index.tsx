import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import UserAvatar from './user-avatar';
import UserAvatarDetail from './user-avatar-detail';
import UserAvatarUpdate from './user-avatar-update';
import UserAvatarDeleteDialog from './user-avatar-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={UserAvatarUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={UserAvatarUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={UserAvatarDetail} />
      <ErrorBoundaryRoute path={match.url} component={UserAvatar} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={UserAvatarDeleteDialog} />
  </>
);

export default Routes;
