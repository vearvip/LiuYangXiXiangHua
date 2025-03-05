
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

export const YinBiao = 'YinBiao'
export const ShengDiao = 'ShengDiao'
export const ShiYi = 'ShiYi'

export type CharList = Array<{
  [YinBiao]: string;
  [ShengDiao]: string;
  [ShiYi]: string;
}>

// 手动定义表头
export const headers = [YinBiao, ShengDiao, ShiYi]; // 根据你的实际情况修改

export function readTsv(filePath: string): Promise<CharList> {
  return new Promise((resolve, reject) => {

    // 创建一个可读流，指向你的 TSV 文件
    const stream = fs.createReadStream(filePath);

    // 创建一个空数组用于存储所有的数据行
    const dataArray: CharList = [];

    // 使用 csv-parser 来解析数据，指定分隔符为制表符，并使用自定义表头
    stream
      .pipe(csvParser({
        separator: '\t',
        mapHeaders: ({ header, index }) => headers[index], // 使用预定义的表头
      }))
      .on('data', (row) => {
        // 将每一行的数据添加到dataArray中
        dataArray.push(row);
      })
      .on('end', () => {
        // 数据处理完毕后，输出整个dataArray或进行其他操作
        // console.log(JSON.stringify(dataArray, null, 2)); // 输出格式化的对象数组
        // 或者在这里继续处理dataArray...
        resolve(dataArray)
      })
      .on('error', (error) => {
        // console.error('Error occurred:', error.message); // 错误处理
        reject(error)
      });
  })
}
export function saveTsv(data: CharList, fileName: string) {

  // 定义 TSV 文件的路径
  const outputFilePath = path.join(__dirname, `../../output/${fileName}`);

  // 将 JSON 数组转换为 TSV 格式字符串
  const tsvData = [
    ...data.map(row => headers.map(header => row[header]).join('\t')) // 添加数据行
  ].join('\n');

  // 写入 TSV 文件
  fs.writeFile(outputFilePath, tsvData, (err) => {
    if (err) {
      console.error('Error writing file:', err.message);
    } else {
      console.log('File has been saved as', outputFilePath);
    }
  });
}