# hero

## To do list
1. 点赞功能
2. 添加新人物功能
3. 首页按赞数排序
4. 网页艺术设计 css样式设计 
5. 匿名讨论区
6. 基于repo的后台管理功能

## 讨论组
https://2047.name/t/7158

## 1 榜单排名网页工具
- 首页的表格显示可以用 [bootstrap sortable table](https://mdbootstrap.com/docs/jquery/tables/sort/)

## 2 榜单排名数据说明

| 名字  | keyword |Google  | Twitter  | Youtube  | Reddit  | Matters  | Vote  |
|---|---|---|---|---|---|---|---|
| 许章润 | 教授  | 1,860,000  | 8,750  |   |   |   | 1 |
| 张千帆  | 教授  |   |   |   |   |   | 1 |
| 蔡霞  | 教授  |   |   |   |   |   | 1 |
| 郑也夫  | 教授  |   |   |   |   |   |  |
| 李文亮  | 医生  |   |   |   |   |   | |
| 艾芬  | 医生  |   |   |   |   |   |  |
| 陈秋实  | 律师  |   |   |   |   |   | |
| 王全璋  | 律师  |   |   |   |   |   | |
| 蔡伟  | 端点星  |   |   |   |   |   | |
| 陈玫  | 端点星  |   |   |   |   |   | |


表格说明
- keyword 用于Google搜索时帮助筛选相关项
- Google数字为搜索`名字+keyword`时返回的条目数量
- Twitter, Google 搜索 `名字 site:twitter.com` 返回的条目数量，其余类似
- Vote, 本站投票数量
- 表格数据可存储在`index.json` 文件中