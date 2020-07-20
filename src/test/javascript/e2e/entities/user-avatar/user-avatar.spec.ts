import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import UserAvatarComponentsPage from './user-avatar.page-object';
import UserAvatarUpdatePage from './user-avatar-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../util/utils';
import path from 'path';

const expect = chai.expect;

describe('UserAvatar e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let userAvatarComponentsPage: UserAvatarComponentsPage;
  let userAvatarUpdatePage: UserAvatarUpdatePage;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.loginWithOAuth('admin', 'admin');
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  beforeEach(async () => {
    await browser.get('/');
    await waitUntilDisplayed(navBarPage.entityMenu);
    userAvatarComponentsPage = new UserAvatarComponentsPage();
    userAvatarComponentsPage = await userAvatarComponentsPage.goToPage(navBarPage);
  });

  it('should load UserAvatars', async () => {
    expect(await userAvatarComponentsPage.title.getText()).to.match(/User Avatars/);
    expect(await userAvatarComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete UserAvatars', async () => {
    const beforeRecordsCount = (await isVisible(userAvatarComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(userAvatarComponentsPage.table);
    userAvatarUpdatePage = await userAvatarComponentsPage.goToCreateUserAvatar();
    await userAvatarUpdatePage.enterData();

    expect(await userAvatarComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(userAvatarComponentsPage.table);
    await waitUntilCount(userAvatarComponentsPage.records, beforeRecordsCount + 1);
    expect(await userAvatarComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await userAvatarComponentsPage.deleteUserAvatar();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(userAvatarComponentsPage.records, beforeRecordsCount);
      expect(await userAvatarComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(userAvatarComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
