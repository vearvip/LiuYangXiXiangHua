import { parseString, parseStringObject, removeLetters } from "../utils";
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
  const charList: CharList = JSON.parse(JSON.stringify(data));
  let eiList: parseStringObject = [],
    ouList: parseStringObject = [];
  charList.forEach((ele) => {
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

    // 转换əu 为 ei
    if (ele[YinBiao].includes("əu") && !ele[YinBiao].includes("i")) {
      const charArr = parseString(ele[ShiYi]);

      charArr.forEach((item) => {
        const queryInfoList = TshetUinh.資料.query字頭(item.zi);
        queryInfoList.forEach((queryInfo) => {
          // console.log('queryInfo["音韻地位"]', {
          //   母: queryInfo["音韻地位"].母,
          //   呼: queryInfo["音韻地位"].呼,
          //   等: queryInfo["音韻地位"].等,
          //   類: queryInfo["音韻地位"].類,
          //   韻: queryInfo["音韻地位"].韻,
          //   聲: queryInfo["音韻地位"].聲,
          // });

          if (
            (queryInfo["音韻地位"].等 === "三" &&
              queryInfo["音韻地位"].韻 === "尤") ||
            (queryInfo["音韻地位"].等 === "一" &&
              queryInfo["音韻地位"].韻 === "侯")
          ) {
            eiList.push({
              ...item,
              [ShengDiao]: ele[ShengDiao],
              [YinBiao]: ele[YinBiao],
            });
          } else {
            ouList.push({
              ...item,
              [ShengDiao]: ele[ShengDiao],
              [YinBiao]: ele[YinBiao],
            });
          }
        });
      });
    }
  });

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
    // 回填əu
    if (ele[YinBiao].includes("ei")) {
      ele[ShiYi] += eiList
        .filter((eiItem) => {
          return (
            eiItem[YinBiao].replace("əu", "ei") == ele[YinBiao] &&
            eiItem[ShengDiao] == ele[ShengDiao]
          );
        })
        .map((eiItem) => {
          return (
            eiItem.zi +
            (eiItem.baiDu ? "-" : "") +
            (eiItem.wenDu ? "=" : "") +
            eiItem.shiYi
          );
        })
        .join("");
    }
  });
  saveTsv(charList, `浏阳官桥.tsv`);
  saveTsv(eiList, `浏阳官桥2.tsv`);
  // fs.writeFile("./xx.json", JSON.stringify(eiList), (err) => {});
}
