import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import sha256 from 'crypto-js/sha256';
import encHex from 'crypto-js/enc-hex';
import qs from 'qs';
import merge from 'lodash/merge';
import lowerCase from 'lodash/lowerCase';

// const appKey = "1b938c8ee553b3df";
// const key = "onFkMmvTI2XaTiJPjcEeqOesScUK4Z3t";
const appKey = process.env.YOUDAO_APPKEY;
const key = process.env.YOUDAO_KEY;
const defaultOptions = {
  from: 'en',
  to: 'zh-CHS',
  appKey,
  signType: 'v3',
  strict: true,
};

function truncate(q) {
  let len = q.length;
  if (len <= 20) return q;
  return q.substring(0, 10) + len + q.substring(len - 10, len);
}

function parse(result, { q }) {
  const {
    data: { web, translation },
  } = result;
  if (lowerCase(web.at(0)?.key) === lowerCase(q)) {
    return web.at(0).value.at(0);
  }
  return translation[0];
}

export default function youdao(options) {
  const curtime = Math.round(new Date().getTime() / 1000);
  const salt = uuidv4();
  const q = typeof options === 'string' ? options : options.q;
  const signString = appKey + truncate(q) + salt + curtime + key;
  const data = merge(
    {
      sign: sha256(signString).toString(encHex),
      salt,
      curtime,
    },
    defaultOptions,
    options
  );

  return axios
    .get(`https://openapi.youdao.com/api?${qs.stringify(data)}`)
    .then((result) => {
      return parse(result, data);
    });
}
