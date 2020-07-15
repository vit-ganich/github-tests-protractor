const config = require('../config.json');
const Helper = require('./helpers/helper');
const EC = protractor.ExpectedConditions;

describe('GitHub create repository test', function () {
  const helper = new Helper.Helper();

  describe('Login to GitHub account', function () {
    it('should be able to open GitHub page', function () {
      browser.get(config.url);
      expect(browser.getTitle()).toEqual('The world’s leading software development platform · GitHub');
    });

    it('should be able to log in', function () {
      element(by.css('a[href="/login"]')).click();
      element(by.css('#login_field')).sendKeys(config.user.userName);
      element(by.css('#password')).sendKeys(config.user.password);
      element(by.css("input[name='commit']")).click();
      expect(browser.getTitle()).toEqual('GitHub');
    });
  });

  describe('Create a new repository', function () {
    it('should be able to open a new repository page', function () {
      element(by.css('.Header-link .dropdown-caret')).click();
      element(by.css('a[href="/new"]')).click();
      expect(browser.getTitle()).toEqual('Create a New Repository');
    });

    it('should be able to create a new repository', function () {
      element(by.css('#repository_name')).sendKeys(config.repository);
      element(by.css('#repository_auto_init')).click();

      let error = element(by.css('dd.error'));
      browser.wait(EC.invisibilityOf(error), 3000);

      let submitBtn = element(by.css('button[data-disable-with="Creating repository…"]'));
      helper.scrollIntoView(submitBtn);
      submitBtn.submit();

      expect(browser.getTitle()).toEqual(config.user.userName + '/' + config.repository);
    });
  });

  describe('Verify the reposiroty was created', function () {
    it('should be able to open Your Repositories page', function () {
      element(by.css('summary[aria-label="View profile and more"]')).click();
      element(by.css('a[href*="tab=repositories"]')).click();
      expect(browser.getTitle()).toEqual("Your Repositories");
    });

    it('should be able to see the created repository in the list', function () {
      const newRepo = element(by.css(`a[href='/${config.user.userName}/${config.repository}']`));
      expect(newRepo.isPresent()).toBeTruthy();
    });

    it('open the newly created repository', function () {
      const newRepo = element(by.css(`a[href='/${config.user.userName}/${config.repository}']`));
      newRepo.click();
      expect(browser.getTitle()).toEqual(`${config.user.userName}/${config.repository}`);
    });
  });
  
  describe('Verify the repository is private and delete it', function () {
    it('should be able to open Settings page', function () {
      element(by.css('span[data-content="Settings"]')).click();
      browser.wait(EC.titleIs("Options"), 5000);
    });

    it('should be able to make the repository private', function () {
      let changeVisibility = element(by.xpath("//summary[contains(text(),'Change visibility')]"));
      helper.scrollIntoView(changeVisibility);
      changeVisibility.click();

      element(by.css("input[value='private']")).click();
      element(by.css("input[aria-label*='to change the visibility']")).sendKeys(config.user.userName + '/' + config.repository);
      submitBtn = element(by.xpath("//button[contains(text(),'I understand, change repository visibility.')]"));

      browser.wait(EC.elementToBeClickable(submitBtn));
      submitBtn.submit();
      browser.wait(EC.titleIs("Options"), 5000);
    });

    it('verify the repository was marked as Private', function(){
      element(by.css('summary[aria-label="View profile and more"]')).click();
      element(by.css('a[href*="tab=repositories"]')).click();
      browser.wait(EC.titleIs("Your Repositories"), 5000);

      let privateRepo = element(by.xpath(
        `//a[@href='/${config.user.userName}/${config.repository}']/following-sibling::span[text()='Private']`));
      expect(privateRepo.isPresent()).toBeTruthy();
    });

    it('should be able to delete the repository', function(){
      const newRepo = element(by.css(`a[href='/${config.user.userName}/${config.repository}']`));
      newRepo.click();

      element(by.css('span[data-content="Settings"]')).click();
      browser.wait(EC.titleIs("Options"), 5000);

      let deleteRepo = element(by.xpath("//summary[contains(text(),'Delete this repository')]"));
      browser.executeScript('arguments[0].scrollIntoView(true)', deleteRepo.getWebElement());
      deleteRepo.click();

      element(by.css("input[aria-label*='to delete this repository']")).sendKeys(config.user.userName + '/' + config.repository);
      
      submitBtn = element(by.xpath("//button[contains(text(),'I understand the consequences, delete this repository')]"));
      browser.wait(EC.elementToBeClickable(submitBtn));
      submitBtn.submit();

      browser.wait(EC.titleIs("GitHub"), 5000);
      
      console.log('Have a good day!');
    });
  });
});
