import fs from "fs";
import path from "path";
import csvParser from "csv-parser";

export const YinBiao = "YinBiao";
export const ShengDiao = "ShengDiao";
export const ShiYi = "ShiYi";

export type CharList = Array<{
  [YinBiao]: string;
  [ShengDiao]: string;
  [ShiYi]: string;
}>;

// 手动定义表头
export const headers = [YinBiao, ShengDiao, ShiYi]; // 根据你的实际情况修改

export function readTsv(filePath: string): Promise<CharList> {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath);
    const dataArray: CharList = [];

    stream
      .pipe(
        csvParser({
          separator: "\t",
          headers: headers, // 手动指定表头，不从文件读取
          skipLines: 0, // 确保不跳过任何行
        })
      )
      .on("data", (row) => {
        dataArray.push(row);
      })
      .on("end", () => {
        resolve(dataArray);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

export function saveTsv(data: CharList, fileName: string) {
  // 定义 TSV 文件的路径
  const outputFilePath = path.join(__dirname, `../../output/${fileName}`);

  // 将 JSON 数组转换为 TSV 格式字符串
  const tsvData = [
    // headers.join('\t'), // 添加表头行
    // ...data
    ...mergeDuplicateItems(data)
      .filter((ele) => ele[ShiYi])
      .map((row) => headers.map((header) => row[header]).join("\t")), // 添加数据行
  ].join("\n");

  // 写入 TSV 文件
  fs.writeFile(outputFilePath, tsvData, (err) => {
    if (err) {
      console.error("Error writing file:", err.message);
    } else {
      console.log("File has been saved as", outputFilePath);
    }
  });
}

export function mergeDuplicateItems(data: CharList) {
  // data = JSON.parse(JSON.stringify(data));
  let yinBiaoShengDiaoList: string[] = [];
  let shiYiList: string[] = [];
  data.forEach((ele) => {
    const yinBiaoShengDiaoStr = ele[YinBiao] + "-" + ele[ShengDiao];
    if (yinBiaoShengDiaoList.includes(yinBiaoShengDiaoStr)) {
      shiYiList[yinBiaoShengDiaoList.indexOf(yinBiaoShengDiaoStr)] +=
        ele[ShiYi];
    } else {
      yinBiaoShengDiaoList.push(yinBiaoShengDiaoStr);
      shiYiList[yinBiaoShengDiaoList.length - 1] = ele[ShiYi];
    }
  });

  return yinBiaoShengDiaoList.map((yinBiaoShengDiao, index) => {
    return {
      [YinBiao]: yinBiaoShengDiao.split("-")[0],
      [ShengDiao]: yinBiaoShengDiao.split("-")[1],
      [ShiYi]: shiYiList[index],
    };
  });
}
