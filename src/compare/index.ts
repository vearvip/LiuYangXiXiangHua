
import fs from 'fs'
import path from 'path'
import { extractHanzi } from '@vearvip/hanzi-utils' 
import { removeCharAndFollowingBracketContent, simplized, traditionalized } from '../utils'

const referTsv = [
  '訓詁諧音.tsv',
  '湘音檢字.tsv',
  '',
  '新長沙.tsv',
  '南縣.tsv'
][4]


function getCharList(tsvPath: string): [string, string[]] {
  const tsvText = fs.readFileSync(tsvPath, 'utf8')
  // 提取汉字
  const charList: string[] = [... new Set([...extractHanzi(tsvText.replace(/\[[^\]]*\]/g, ''))])]
  return [tsvText, charList]  
}

// 镇头字表、田坪字表
// const [,originCharList] = getCharList(path.resolve(__dirname, `../${process.argv[2]}`))
const [,originCharList] = getCharList(path.resolve(__dirname, `../../浏阳镇头.tsv`))
// 對比字表
const [referStr,referCharList] = getCharList(path.resolve(__dirname, `../../refer/${referTsv}`))

// console.log({
//   originCharList,
//   referCharList
// })

try {
  const [omissionList, includeList]: string[][] = referCharList.reduce((ret: string[][], char: string) => {
    if (!Array.isArray(ret[0])) {
      ret[0] = []
    }
    if (!Array.isArray(ret[1])) {
      ret[1] = []
    }
    if (
      !originCharList.map(traditionalized).includes(char)
      && !originCharList.map(simplized).includes(char)
    ) {
      ret[0].push(char)
    } else {
      ret[1].push(char)
    }
    return ret
  }, [])
  console.log(`✅ 對比結束，漏了${omissionList.length}個字：`, omissionList)
  let resultStr =  referStr.replace(/\[[^\]]*\]/g, '')
  
  includeList.forEach(char => {
    resultStr = removeCharAndFollowingBracketContent(resultStr, char)
  })
  fs.writeFileSync(path.resolve(__dirname, `../../omission/${referTsv}`), resultStr)
} catch (error) {
  console.error(`⚠️ 對比失敗：`, error)
}

 