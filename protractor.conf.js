const failFast = require('protractor-fail-fast');

exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['spec/**/*.spec.js'],
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: [
                '--disable-web-security',
                '--disable-gpu',
                '--no-sandbox'
            ]
        }
    },
    plugins: [
        failFast.init(),
    ],
    jasmineNodeOpts: {
        realtimeFailure: true,
        stopSpecOnExpectationFailure: true
    },
    onPrepare: function () {
        browser.waitForAngularEnabled(false);
        browser.manage().timeouts().pageLoadTimeout(5000);
        browser.manage().window().maximize();
        return browser.manage().timeouts().implicitlyWait(5000);
    },
    afterLaunch: function() {
        failFast.clean(); // Removes the fail file once all test runners have completed.
      }
}