// 使用 ES Module 语法导入必要的模块 
import path from 'path'; 
import { readTsv } from './util';
import { genTianPing, genGuanQiao } from './convert';


// 定义TSV文件的路径
const filePath = path.join(__dirname, '../../浏阳镇头.tsv');


async function main() {
  const data = await readTsv(filePath)
  // 生成 田坪字表
  genTianPing(data) 
  // 生成 官桥字表
  genGuanQiao(data)

}

main()