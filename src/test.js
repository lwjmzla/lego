import { reduce, without, pick } from 'lodash-es';
// const obj = {
//   a: '1',
//   b: '2'
// };
// const obj1 = reduce(obj, (result, value, key) => {
//   if (key === 'a') {
//     result[key] = {
//       name: 'lwj',
//       age: 18
//     };
//   }
//   return result;
// }, {});
// console.log(obj1);

const obj = {
  a: '1',
  b: '2',
  c: '3'
};

const arr = without(Object.keys(obj), 'a', 'c'); // ['b'] 排除数组里的a、c得到b

console.log(pick(obj, arr)); // {b: "2"}   从一个对象pick出只含数组属性的对象
