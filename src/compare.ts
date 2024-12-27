
import fs from 'fs'
import path from 'path'
import { extractHanzi } from '@vearvip/hanzi-utils'

const referCharList = []
// 镇头字表、田坪字表路径
const tsvPath = path.resolve(__dirname, `../${process.argv[2]}`) 
const originTsvText = fs.readFileSync(tsvPath, 'utf8')
// 提取汉字
const originCharList = [... new Set([...extractHanzi(originTsvText.replace(/$.*?$/g, ''))])]
console.log('originCharList', originCharList)

const resultList: string[] = []
referCharList.forEach(char => {
  if (!originCharList.includes(char)) {
    resultList.push(char)
  }
})