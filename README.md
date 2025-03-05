# 浏阳西乡话字表
- 本仓库[镇头话](./浏阳镇头.tsv)作为原始表，经过脚本转换处理，生成以下浏阳西乡相关地区方音表：
    - [浏阳镇头.tsv](./output/浏阳镇头.tsv)
    - [浏阳官桥.tsv](./output/浏阳官桥.tsv)
    - [浏阳田坪.tsv](./output/浏阳田坪.tsv)
- 修改仓库根目录下的[浏阳镇头.tsv](./浏阳镇头.tsv)并提交到仓库，会触发脚本自动生成上述的表

## 手动生成
```bash
npm run transform
```