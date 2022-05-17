import merge from 'lodash/merge';
import youdao from '../service/youdao';

const defaultOptions = {
  to: 'en',
  translateService: 'youdao',
};

class Token {
  constructor(zh, options = {}) {
    this.literal = zh;
    this.options = merge({}, defaultOptions, options);
  }

  translate() {
    return youdao({
      q: this.literal,
      to: 'en',
    });
  }
}

export default Token;
