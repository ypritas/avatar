import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import UserAvatarUpdatePage from './user-avatar-update.page-object';

const expect = chai.expect;
export class UserAvatarDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('avatarApp.userAvatar.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-userAvatar'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class UserAvatarComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('user-avatar-heading'));
  noRecords: ElementFinder = element(by.css('#app-view-container .table-responsive div.alert.alert-warning'));
  table: ElementFinder = element(by.css('#app-view-container div.table-responsive > table'));

  records: ElementArrayFinder = this.table.all(by.css('tbody tr'));

  getDetailsButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-info.btn-sm'));
  }

  getEditButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-primary.btn-sm'));
  }

  getDeleteButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-danger.btn-sm'));
  }

  async goToPage(navBarPage: NavBarPage) {
    await navBarPage.getEntityPage('user-avatar');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateUserAvatar() {
    await this.createButton.click();
    return new UserAvatarUpdatePage();
  }

  async deleteUserAvatar() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const userAvatarDeleteDialog = new UserAvatarDeleteDialog();
    await waitUntilDisplayed(userAvatarDeleteDialog.deleteModal);
    expect(await userAvatarDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/avatarApp.userAvatar.delete.question/);
    await userAvatarDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(userAvatarDeleteDialog.deleteModal);

    expect(await isVisible(userAvatarDeleteDialog.deleteModal)).to.be.false;
  }
}
