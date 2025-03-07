import { parseString, ParseStringResultList, removeLetters } from "../utils";
import { CharList, saveTsv, ShengDiao, ShiYi, YinBiao } from "./util";
import TshetUinh from "tshet-uinh";
import fs from "fs";

// 生成浏阳镇头.tsv
export function genZhenTou(data: CharList) {
  const charList: CharList = JSON.parse(JSON.stringify(data));
  saveTsv(charList, `浏阳镇头.tsv`);
}
// 生成浏阳田坪.tsv
export function genTianPing(data: CharList) {
  const charList: CharList = JSON.parse(JSON.stringify(data));
  charList.forEach((ele) => {
    if (
      (Number(ele[ShengDiao]) === 2 || Number(ele[ShengDiao]) === 6) &&
      ele[YinBiao].includes("ʰ")
    ) {
      ele[YinBiao] = ele[YinBiao].replace("ʰ", "");
    }
  });
  saveTsv(charList, `浏阳田坪.tsv`);
}

// 生成浏阳官桥.tsv
export function genGuanQiao(data: CharList) {
  let charList: CharList = JSON.parse(JSON.stringify(data));
  let eiList: ParseStringResultList = [],
    ouList: ParseStringResultList = [],
    enList: ParseStringResultList = [],
    ienList: ParseStringResultList = [];
  charList.forEach((ele) => {
    if (
      // 加入 容融绒 3个白读
      ele[YinBiao] === "in" &&
      Number(ele[ShengDiao]) === 2
    ) {
      ele[ShiYi] += "容-融-绒-";
    }
    if (
      // 混淆c 和 ts 为 tɕ
      (ele[YinBiao].includes("c") || ele[YinBiao].includes("ts")) &&
      (ele[YinBiao].includes("i") || ele[YinBiao].includes("y"))
    ) {
      ele[YinBiao] = ele[YinBiao].replace("c", "tɕ");
      ele[YinBiao] = ele[YinBiao].replace("ts", "tɕ");
    }
    if (
      // 混淆cʰ 和 tsʰ 为 tɕʰ
      (ele[YinBiao].includes("cʰ") || ele[YinBiao].includes("tsʰ")) &&
      (ele[YinBiao].includes("i") || ele[YinBiao].includes("y"))
    ) {
      ele[YinBiao] = ele[YinBiao].replace("cʰ", "tɕʰ");
      ele[YinBiao] = ele[YinBiao].replace("tsʰ", "tɕʰ");
    }
    if (
      // 混淆ç 和 s 为 ɕ
      (ele[YinBiao].includes("ç") || ele[YinBiao].includes("s")) &&
      (ele[YinBiao].includes("i") || ele[YinBiao].includes("y"))
    ) {
      ele[YinBiao] = ele[YinBiao].replace("ç", "ɕ");
      ele[YinBiao] = ele[YinBiao].replace("s", "ɕ");
    }

    // 转换ɲ 为 ȵ
    ele[YinBiao] = ele[YinBiao].replace("ɲ", "ȵ");
    // 转换oŋ 为 əŋ
    ele[YinBiao] = ele[YinBiao].replace("oŋ", "əŋ");

    // 转换əu 为 ei 塞到 ouList 和 eiList
    if (ele[YinBiao].includes("əu") && !ele[YinBiao].includes("i")) {
      const charArr = parseString(ele[ShiYi]);

      charArr.forEach((item) => {
        const queryInfoList = TshetUinh.資料.query字頭(item.zi);
        let needOuToEiConvert = false;
        queryInfoList.forEach((queryInfo) => {
          if (
            (queryInfo["音韻地位"].等 === "三" && queryInfo["音韻地位"].韻 === "尤")
            || (queryInfo["音韻地位"].等 === "一" && queryInfo["音韻地位"].韻 === "侯")
          ) {
            needOuToEiConvert = true;
          }
        });
        // 在這裡處理 Ou to Ei
        if (needOuToEiConvert) {
          eiList.push({ ...item, [ShengDiao]: ele[ShengDiao], [YinBiao]: ele[YinBiao].replace("əu", "ei"), });
        } else {
          ouList.push({ ...item, [ShengDiao]: ele[ShengDiao], [YinBiao]: ele[YinBiao], });
        }
      });
    }

    // 转换en 为 ien 塞到 enList 和 ienList
    if (ele[YinBiao].includes("ən") && !ele[YinBiao].includes("u") && !ele[YinBiao].includes("y")) {
      const charArr = parseString(ele[ShiYi]);

      charArr.forEach((item) => {
        const queryInfoList = TshetUinh.資料.query字頭(item.zi);
        let needEnToIenConvert = false;
        queryInfoList.forEach((queryInfo) => {
          if (
            (queryInfo["音韻地位"].等 === "一" && queryInfo["音韻地位"].韻 === "痕")
            || (queryInfo["音韻地位"].等 === "一" && queryInfo["音韻地位"].韻 === "登")
            || (queryInfo["音韻地位"].等 === "三" && queryInfo["音韻地位"].韻 === "庚")
            || (queryInfo["音韻地位"].等 === "二" && queryInfo["音韻地位"].韻 === "耕")
          ) {
            needEnToIenConvert = true;
          }
        });

        // 在這裡處理 En to Ien
        if (needEnToIenConvert) {
          ienList.push({ ...item, [ShengDiao]: ele[ShengDiao], [YinBiao]: ele[YinBiao].replace("ən", "iẽ"), });
        } else {
          enList.push({ ...item, [ShengDiao]: ele[ShengDiao], [YinBiao]: ele[YinBiao], });
        }
      });
    }
  });
  // 去重函數
  const filterDuplicate = (list: ParseStringResultList): ParseStringResultList => [...new Set(list.map((ele) => JSON.stringify(ele)))].map((ele) =>
    JSON.parse(ele)
  )
  // 可能有重复，这里去重
  eiList = filterDuplicate(eiList);
  ouList = filterDuplicate(ouList);
  enList = filterDuplicate(enList);
  ienList = filterDuplicate(ienList); 

  // 回填əu 和 en
  charList.forEach((ele) => {
    // 回填əu
    if (ele[YinBiao].includes("əu") && !ele[YinBiao].includes("i")) {
      ele[ShiYi] = ouList
        .filter((ouItem) => {
          return (
            ouItem[YinBiao] == ele[YinBiao] &&
            ouItem[ShengDiao] == ele[ShengDiao]
          );
        })
        .map((ouItem) => {
          return (
            ouItem.zi +
            (ouItem.baiDu ? "-" : "") +
            (ouItem.wenDu ? "=" : "") +
            ouItem.shiYi
          );
        })
        .join("");
    }
    // 回填en
    if (ele[YinBiao].includes("ən") && !ele[YinBiao].includes("u") && !ele[YinBiao].includes("y")) {
      ele[ShiYi] = enList
        .filter((ouItem) => {
          return (
            ouItem[YinBiao] == ele[YinBiao] &&
            ouItem[ShengDiao] == ele[ShengDiao]
          );
        })
        .map((ouItem) => {
          return (
            ouItem.zi +
            (ouItem.baiDu ? "-" : "") +
            (ouItem.wenDu ? "=" : "") +
            ouItem.shiYi
          );
        })
        .join("");
    }
  });

  // 回补指定的List
  const fixRelatedList = (charList: CharList, list: ParseStringResultList) => {

    // 👇🏻👇🏻👇🏻👇🏻👇🏻 回补ei
    list.forEach((item, itemIndex) => {
      charList.forEach((ele, eleIndex) => {
        if (
          item[YinBiao] == ele[YinBiao] &&
          item[ShengDiao] == ele[ShengDiao]
        ) {
          charList[eleIndex][ShiYi] +=
            item.zi +
            (item.baiDu ? "-" : "") +
            (item.wenDu ? "=" : "") +
            item.shiYi;
          // @ts-ignore
          list[itemIndex] = false;
        }
      });
    });
    // 這裡是未回补到已有行的ei
    const otherList = list.filter((ei) => ei);
    let otherCharObj = {};
    otherList.forEach((item) => {
      const yinBiaoShengDiao = item[YinBiao] + "-" + item[ShengDiao];
      if (otherCharObj[yinBiaoShengDiao]) {
        otherCharObj[yinBiaoShengDiao] +=
          item.zi +
          (item.baiDu ? "-" : "") +
          (item.wenDu ? "=" : "") +
          item.shiYi;
      } else {
        otherCharObj[yinBiaoShengDiao] =
          item.zi +
          (item.baiDu ? "-" : "") +
          (item.wenDu ? "=" : "") +
          item.shiYi;
      }
    });
    // 現在回填掉未补在已有行末尾的ei
    const otherChartList = Object.keys(otherCharObj).map((yinBiaoShengDiao) => {
      return {
        [YinBiao]: yinBiaoShengDiao.split("-")[0],
        [ShengDiao]: yinBiaoShengDiao.split("-")[1],
        [ShiYi]: otherCharObj[yinBiaoShengDiao],
      };
    });
    return [...charList, ...otherChartList]
    // 👆🏻👆🏻👆🏻👆🏻👆🏻 完成回补ei

  }

  // 👇🏻👇🏻👇🏻👇🏻👇🏻 回补ei
  charList = fixRelatedList(charList, eiList) 

  // 👇🏻👇🏻👇🏻👇🏻👇🏻 回补ien
  charList = fixRelatedList(charList, ienList) 

  saveTsv(charList, `浏阳官桥.tsv`);
}
