import { CharList, saveTsv, ShengDiao, YinBiao } from "./util"


// 生成浏阳镇头.tsv
export function genZhenTou(data: CharList) {
  const charList: CharList = JSON.parse(JSON.stringify(data)) 
  saveTsv(charList, `浏阳镇头.tsv`)
}
// 生成浏阳田坪.tsv
export function genTianPing(data: CharList) {
  const charList: CharList = JSON.parse(JSON.stringify(data))
  charList.forEach(ele => {
    if (
      (Number(ele[ShengDiao]) === 2 || Number(ele[ShengDiao]) === 6) && ele[YinBiao].includes('ʰ')
    ) {
      ele[YinBiao] = ele[YinBiao].replace('ʰ', '')
    }
  })
  saveTsv(charList, `浏阳田坪.tsv`)
}

// 生成浏阳官桥.tsv
export function genGuanQiao(data: CharList) {
  const charList: CharList = JSON.parse(JSON.stringify(data))
  charList.forEach(ele => {
    if ( // 混淆c 和 ts 为 tɕ
      (ele[YinBiao].includes('c') || ele[YinBiao].includes('ts'))
      && (ele[YinBiao].includes('i') || ele[YinBiao].includes('y'))
    ) {
      ele[YinBiao] = ele[YinBiao].replace('c', 'tɕ')
      ele[YinBiao] = ele[YinBiao].replace('ts', 'tɕ')
    }
    if ( // 混淆cʰ 和 tsʰ 为 tɕʰ
      (ele[YinBiao].includes('cʰ') || ele[YinBiao].includes('tsʰ'))
      && (ele[YinBiao].includes('i') || ele[YinBiao].includes('y'))
    ) {
      ele[YinBiao] = ele[YinBiao].replace('cʰ', 'tɕʰ')
      ele[YinBiao] = ele[YinBiao].replace('tsʰ', 'tɕʰ')
    }
    if ( // 混淆ç 和 s 为 ɕ
      (ele[YinBiao].includes('ç') || ele[YinBiao].includes('s'))
      && (ele[YinBiao].includes('i') || ele[YinBiao].includes('y'))
    ) {
      ele[YinBiao] = ele[YinBiao].replace('ç', 'ɕ')
      ele[YinBiao] = ele[YinBiao].replace('s', 'ɕ')
    }

    // 转换ɲ 为 ȵ
    ele[YinBiao] = ele[YinBiao].replace('ɲ', 'ȵ')


  })
  saveTsv(charList, `浏阳官桥.tsv`)
}
