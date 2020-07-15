Object.defineProperty(exports, "__esModule", { value: true });

class Helper {
    scrollIntoView (element) {
        return browser.executeScript('arguments[0].scrollIntoView(true)', element.getWebElement());
    };
}

exports.Helper = Helper;
