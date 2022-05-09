const fs = require('fs')
const path = require('path')

const rnothtmlwhite = /[^\x20\t\r\n\f]+/
// const reg = /(?<quotes>'|"|`).*?(?<content>[\u4e00-\u9fa5]+).*\k<quotes>/g
const reg = /(?<quotes>'|"|`).*?(?<content>[\u4e00-\u9fa5].*?)\k<quotes>/g
const reg2 = /(?<left>\>).*?(?<content>[\u4e00-\u9fa5].*?)(?<right>\<)/g
const zn = /(?<before>\/\/\x20)(?<content>[\u4e00-\u9fa5]+)/g
const quotes = /'|"|`/

function resolve(url) {
  return path.resolve(__dirname, url);
}

const file = fs.readFileSync(resolve("./mock/index.jsx"), {
  encoding: 'utf8',
})/* .then((file) => {
  debugger;
  console.log("file:", file);
}); */
// console.log("file:", file);

/**
 * 1. 替换掉中文, 有道翻译. 可以根据规则替换
 * 2. 查找是否引入了 useIntl.
 *    2.1 引入了, 查找最近的 FC 组件. 判断是否定义了 const intl = useIntl();
 *        没有定义, 则定义???.
 *    2.2 没有引入, 则引入. 最近查找 FC, 并且定义 const intl = useIntl();
 */
/**
 * 单纯替换文本
 */
// let t, zt
// while (t = reg.exec(file)) {
//   console.log('t:', t, t.groups.content)
//   debugger
//   while ((zt = zn.exec(t.groups.content))) {
//     console.log('zt:', zt, zt.groups.content)
//     debugger
//     // 替换掉中文, 替换规则
//   }
// }

// 修改字符串中的中文
// let ret = file.replace(reg, (...rest) => {
//   const groups = rest.pop();
//   return `${groups.quotes}${groups.content.replace(zn, (...rest) => {
//     return `[===${rest.pop().content}===]`
//   })}${groups.quotes}`
// })
// console.log(111)
// ret = ret.replace(/(?<left>\>)[\s\S]*?(?<content>[\u4e00-\u9fa5][\s\S]*?)(?<right>\<)/g, (...rest) => {
//   const groups = rest.pop();
//   const ret = `${groups.left}${groups.content.replace(zn, (...rest2) => {
//     const groups2 = rest2.pop();
//     const content = rest2.pop();
//     debugger
//     return `[===${rest2.pop().content}===]`
//   })}${groups.right}`
//   console.log('xxx', groups.content, ret)
//   return ret
// })
// debugger

const hasIntl = /import\s+\{[\s\S]*useIntl[\s\S]*\}\s+from\s+(?<quotes>['|"])umi\k<quotes>/.test(file);
debugger

// import { useIntl } from "umi";
/**
 * from
 * to
 * i18n
 * find: 查找中文, 不需要
 */
