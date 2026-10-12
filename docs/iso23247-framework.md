# ISO 23247 DT Framework 与牙科映射

状态：初步研究草案；2026-10-12。

## 1. 标准参考与边界

ISO 23247 面向制造业。本项目参考其架构进行牙科领域映射。原始标准概念、项目映射和待确认扩展应分开记录。以下名称参考公开 ISO 页面和 NIST 说明；NIST 2021 报告讨论的是 ISO/DIS 版本，最终术语及要求仍须对照正式标准。

可观测制造域在 DT framework 边界之外，为其提供现实上下文；不能把五个主要实体理解成五个域。

## 2. 五个主要实体

| 缩写 | 名称 | 职责 |
|---|---|---|
| OME | Observable Manufacturing Element | 可观测现实对象 |
| DCDCE | Data Collection and Device Control Entity | 数据采集与设备控制 |
| CE | Core Entity | 数字表示、运行管理、应用与服务 |
| UE | User Entity | 人员或外部系统与孪生交互 |
| CSE | Cross-System Entity | 跨域数据转换、数据保障、安全支持 |

## 3. OME：八类，而非固定八个实例

| 标准类别 | 中文 | 牙科映射草案 |
|---|---|---|
| Personnel | 人员 | 牙医、牙科技师、护理人员 |
| Equipment | 设备 | 口扫仪、影像设备、铣削机、3D 打印机 |
| Material | 材料 | 氧化锆、树脂、钛、印模材料 |
| Process | 过程 | 检查、扫描、治疗、设计、制造、随访 |
| Facility | 设施 | 诊室、技工室、消毒设施 |
| Environment | 环境 | 诊室或制造环境温度、湿度等 |
| Product | 产品 | 牙冠、牙桥、义齿、矫治器、种植修复体 |
| Supporting document | 支持文档 | 操作规程、材料说明、设计要求、质量记录 |

每类可有多个实例。上述牙科例子为项目建议，不是 ISO 中的牙科定义；是否纳入取决于用例。

## 4. 临床领域扩展：待确认

患者、天然牙齿、口腔组织不直接归为制造业产品。拟考虑 Patient 与 Anatomical structure 等临床概念，并明确其与 OME 的映射或扩展关系。尚未确定本体继承结构，不将建议当作标准要求。

## 5. Ontology 的作用

定义类别、属性、关系与约束；知识图谱承载具体实例。保持测量事实、临床判断、模型预测的区别。后续记录对象身份、时间、来源、单位、版本及证据关系。

Ontology 不替代几何模型、行为模型或同步机制，具体集成位置待各实体职责确定后设计。

## 6. 下一步

1. 逐项确认八类 OME 的牙科对象、边界及可观测属性。
2. 明确患者与解剖结构的建模方案。
3. 展开 DCDCE、CE、UE、CSE 的子实体与功能。
4. 确定最小验证用例及本体能力问题。

## 参考资料

- ISO 23247-1:2021：https://www.iso.org/standard/75066.html
- ISO 23247-2:2021：https://committee.iso.org/standard/78743.html
- NIST AMS 400-2, Use Case Scenarios for Digital Twin Implementation Based on ISO 23247：https://doi.org/10.6028/NIST.AMS.400-2
