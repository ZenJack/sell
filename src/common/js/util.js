/**
 * 解析url参数
 * 例如：?id=100&d=32
 * @return Object {id:100, d: 32}
 */
export function urlParse () {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  if (arr) {
    arr.forEach((item) => {
      let temp = item.slice(1).split('=');
      let key = decodeURIComponent(temp[0]);
      let value = decodeURIComponent(temp[1]);
      obj[key] = value;
    });
    return obj;
  }
}
