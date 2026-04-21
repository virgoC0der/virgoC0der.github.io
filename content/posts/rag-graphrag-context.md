---
title: "RAG 技术深度解析：从基础到 GraphRAG，以及大 Context 时代的思考"
title_en: "A deep dive into RAG, GraphRAG, Graphiti, and the long-context era"
date: 2025-11-05T10:00:00+08:00
draft: false
description: "从 RAG 的基础原理讲起，聊聊 GraphRAG、Graphiti 这些进化版本，以及在 1M context 时代，RAG 到底会不会被淘汰。"
tags: ["AI", "RAG", "GraphRAG", "LLM", "Claude"]
categories: ["AI"]
---

## RAG 基础原理

### 什么是 RAG

RAG (Retrieval-Augmented Generation) 检索增强生成，是一种结合了信息检索和大语言模型生成能力的技术范式。其核心思想是：

```text
用户查询 → 检索相关文档 → 将文档作为上下文 → LLM 生成答案
```

### 为什么需要 RAG

在 RAG 出现之前，LLM 面临几个核心问题：

1. **知识截止日期**：模型训练数据有时效性，无法获取最新信息
2. **幻觉问题**：模型可能生成看似合理但实际错误的内容
3. **领域知识局限**：对特定领域的深度知识覆盖不足
4. **无法访问私有数据**：企业内部文档、数据库无法被预训练模型学习
5. **Context Window 大小受限**：Context Window 不足以塞下全部文档内容，用户提问时 window 就塞满了

### RAG 的基本架构

```text
┌─────────────┐
│  文档语料库  │
└──────┬──────┘
       │ 离线处理
       ▼
┌─────────────┐
│  文档切块    │ (Chunking)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  向量化      │ (Embedding)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  向量数据库  │ (Vector DB)
└──────┬──────┘
       │
       │ 在线查询
       │
┌──────┴──────┐
│  用户查询    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  查询向量化  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  相似度检索  │ (Top-K)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  重排序      │ (可选)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  构建 Prompt │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  LLM 生成    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  返回答案    │
└─────────────┘
```

### 关键技术组件

#### 1. 文档切块 (Chunking)

切块策略直接影响检索质量。

**固定大小切块**：

```python
def fixed_size_chunking(text, chunk_size=512, overlap=50):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks
```

**语义切块**：

- 按段落、章节分割
- 使用 NLP 模型识别语义边界
- 保持完整句子/段落

**问题**：

- Chunk 太小：上下文不足，信息碎片化
- Chunk 太大：检索精度下降，噪音增加

#### 2. 向量嵌入 (Embedding)

将文本转换为高维向量表示：

```text
# 常用 Embedding 模型
- OpenAI text-embedding-3-large (3072 维)
- Cohere embed-v3
- BGE-large (1024 维)
- text2vec
```

**Embedding 质量决定检索效果**：

- 语义相似度是否准确
- 是否能捕捉领域特定语义
- 多语言支持能力

#### 3. 向量数据库

| 数据库      | 类型             | 特点                      |
| ----------- | ---------------- | ------------------------- |
| Pinecone    | 云服务           | 易用，全托管              |
| Weaviate    | 开源             | 支持混合检索，GraphQL     |
| Milvus      | 开源             | 高性能，分布式            |
| Qdrant      | 开源             | Rust 实现，高性能         |
| Chroma      | 开源             | 轻量级，易集成            |
| pgvector    | PostgreSQL 扩展  | 利用现有数据库基础设施    |

#### 4. 检索策略

**向量检索**（Semantic Search）：

```python
# 余弦相似度
similarity = cosine_similarity(query_vector, doc_vectors)
top_k_docs = get_top_k(similarity, k=5)
```

**混合检索**（Hybrid Search）：

```python
# 结合关键词检索和向量检索
bm25_score = bm25_search(query, documents)
vector_score = vector_search(query_embedding, doc_embeddings)
final_score = alpha * vector_score + (1 - alpha) * bm25_score
```

**重排序**（Re-ranking）：

```python
# 使用更强的模型对初检结果重新排序
initial_results = vector_search(query, top_k=20)
reranked_results = reranker_model(query, initial_results, top_k=5)
```

---

## 传统 RAG 的问题

### 1. 信息孤岛问题

传统 RAG 将文档切成独立的 chunks，**丢失了文档之间的关联关系**：

- 多个文档共同讨论一个主题，但 chunk 间无联系
- 跨文档的因果关系、时间线无法被捕捉
- 实体在不同文档中的不同描述无法关联

**示例场景**：

```text
文档 A: "张三是项目经理，负责 X 项目"
文档 B: "X 项目在 2024 年 Q2 完成"
文档 C: "项目经理向李四汇报"

用户问题: "X 项目的负责人向谁汇报？"
传统 RAG: 可能检索到 A 和 B，但缺少 C，无法完整回答
```

### 2. 复杂查询能力不足

**多跳推理**（Multi-hop Reasoning）：

```text
问题: "Claude Sonnet 4.5 的开发公司的 CEO 是谁？"
需要：
1. 找到 Claude Sonnet 4.5 → Anthropic
2. 找到 Anthropic → CEO 是 Dario Amodei
```

传统 RAG 往往只能处理单跳查询。

### 3. Chunk 边界问题

关键信息可能被切分到不同 chunks：

```text
Chunk 1: "...该算法的时间复杂度取决于"
Chunk 2: "输入数据的规模，当 n > 10000 时..."
```

检索可能只返回其中一个，导致信息不完整。

### 4. 检索噪音与精度

- **高召回低精度**：检索出很多不相关内容
- **低召回高精度**：遗漏关键信息
- **上下文污染**：不相关内容占用 token，影响生成质量

### 5. 缺乏全局理解

传统 RAG 是"自底向上"的：

- 先检索局部 chunks
- 再生成答案

无法进行"自顶向下"的全局推理：

- 文档集合的整体主题是什么？
- 关键概念之间的关系网络是什么？
- 信息的层次结构如何？

---

## GraphRAG：知识图谱驱动的检索增强

### 核心思想

GraphRAG 由 Microsoft Research 提出，核心创新是**先构建知识图谱，再基于图谱进行检索和推理**。

```text
文档 → 实体/关系抽取 → 知识图谱 → Community 检测 → Community 摘要 → 多层次检索
```

### 架构详解

#### 第一阶段：知识图谱构建

```python
def build_knowledge_graph(documents):
    entities = []
    relationships = []
    for doc in documents:
        # 使用 LLM 提取实体和关系
        extracted = llm_extract(
            doc,
            prompt="""
            提取文档中的：
            1. 实体（人物、组织、概念、事件等）
            2. 实体之间的关系（类型、方向、强度）
            """,
        )
        entities.extend(extracted.entities)
        relationships.extend(extracted.relationships)

    # 实体消解（Entity Resolution）
    unified_entities = entity_resolution(entities)

    # 构建图
    graph = build_graph(unified_entities, relationships)
    return graph
```

**提取的知识图谱示例**：

```text
实体:
- Claude Sonnet 4 (产品)
- Anthropic (公司)
- Dario Amodei (人物)
- LLM (技术概念)

关系:
- Claude Sonnet 4 --[开发商]--> Anthropic
- Dario Amodei --[CEO_OF]--> Anthropic
- Claude Sonnet 4 --[类型]--> LLM
- Anthropic --[专注于]--> AI 安全
```

#### 第二阶段：Community 检测

使用图算法（如 Leiden 算法）将知识图谱划分为**语义 Community**：

```python
communities = leiden_algorithm(graph)

# 示例结果
# Community 1: [Claude, Anthropic, Dario Amodei, AI 安全]
# Community 2: [RAG, 向量数据库, Embedding]
# Community 3: [GraphRAG, 知识图谱, 实体抽取]
```

每个 Community 代表一组**语义紧密关联的实体集合**。

#### 第三阶段：生成 Community 摘要

```python
def generate_community_summary(community, graph):
    entities = community.entities
    relationships = get_relationships(entities, graph)
    summary = llm_summarize(
        entities,
        relationships,
        prompt="总结这个 Community 的核心主题和关键信息",
    )
    return summary
```

**Community 摘要示例**：

> 本 Community 主要讨论 Anthropic 公司及其产品。Anthropic 是一家专注于 AI 安全的公司，由 Dario Amodei 担任 CEO。其主要产品是 Claude 系列大语言模型，包括最新的 Claude Sonnet 4。

#### 第四阶段：多层次检索

GraphRAG 支持两种查询模式：

**1. 局部查询（Local Search）**：

```python
def local_search(query, graph):
    query_entities = extract_entities(query)
    located_entities = graph.find_entities(query_entities)
    subgraph = graph.get_neighbors(located_entities, hops=2)
    context = subgraph.to_context()
    return llm_generate(query, context)
```

**2. 全局查询（Global Search）**：

```python
def global_search(query, communities):
    relevant_communities = retrieve_communities(
        query,
        [c.summary for c in communities],
        top_k=10,
    )
    global_context = combine_summaries(relevant_communities)
    return llm_generate(query, global_context)
```

### GraphRAG 的优势

#### 1. 多跳推理能力

```text
问题: "Anthropic CEO 负责的产品支持哪些功能？"

Graph 路径:
Dario Amodei --[CEO_OF]--> Anthropic
            --[开发]--> Claude Sonnet 4
            --[支持]--> [函数调用, 视觉理解, ...]
```

#### 2. 全局理解

Community 摘要提供了**自顶向下的全局视角**：

```text
传统 RAG:
Query → 检索 chunks → 拼接上下文 → 生成

GraphRAG:
Query → 确定相关 Community → 获取 Community 摘要 → 理解全局主题 → 细化检索 → 生成
```

#### 3. 实体去重与统一

```text
文档 A: "Claude is an AI assistant"
文档 B: "克劳德是一个 AI 助手"
文档 C: "Claude AI can help with..."

GraphRAG: 将这三个表述统一为同一实体 "Claude"
```

#### 4. 关系推理

可以回答关系型问题：

- "X 和 Y 之间有什么联系？"
- "哪些实体和 Z 有类似的关系？"
- "A 影响了哪些实体？"

### 一个典型场景：漏洞情报知识图谱

在安全领域，漏洞信息具有几个鲜明特点：

1. **高度关联性**：CVE、CWE、受影响组件、补丁、攻击向量相互关联
2. **时效性强**：新漏洞不断被发现和披露
3. **复杂关系**：漏洞之间存在利用链、依赖关系
4. **多维度查询**：需要从不同角度检索

传统 RAG 在这类数据上有明显局限：关系丢失、多跳推理困难、新数据更新难以与现有知识整合。GraphRAG 则天然适合 —— 图结构可以精确表达 "CVE-2024-XXXX 影响 OpenSSL 1.1.1 到 1.1.1k 版本"。

**一个简化的图结构示例**：

```text
节点类型：
  Vulnerability (CVE)
  Software / Version
  WeaknessType (CWE)
  AttackVector
  Exploit (PoC)
  Patch

边 / 关系：
  (CVE)-[AFFECTS]->(Software)-[HAS_VERSION]->(Version)
  (CVE)-[CLASSIFIED_AS]->(CWE)
  (CVE)-[HAS_EXPLOIT]->(Exploit)
  (CVE)-[FIXED_BY]->(Patch)
  (CVE)-[CHAIN_WITH]->(CVE)   // 利用链
```

几种典型查询：

```cypher
// 1. 某个版本受哪些高危漏洞影响
MATCH (cve:Vulnerability)-[:AFFECTS]->(:Software {name: "OpenSSL"})
      -[:HAS_VERSION]->(v:VersionRange)
WHERE "1.1.1k" >= v.min_version AND "1.1.1k" <= v.max_version
  AND cve.cvss_score >= 7.0
RETURN cve.id, cve.description, cve.cvss_score
ORDER BY cve.cvss_score DESC;

// 2. 可组合利用的漏洞链（多跳推理）
MATCH path = (cve1:Vulnerability)-[:CHAIN_WITH*1..3]->(cve2:Vulnerability)
WHERE cve1.id = "CVE-2024-XXXX" AND cve2 <> cve1
RETURN path, length(path) AS chain_length
ORDER BY chain_length
LIMIT 10;

// 3. 相似漏洞历史分析（用于预测）
MATCH (cve:Vulnerability {id: "CVE-2024-XXXX"})-[:CLASSIFIED_AS]->(cwe)
      <-[:CLASSIFIED_AS]-(similar:Vulnerability)
WHERE similar.published_date < cve.published_date
RETURN similar.id, similar.description, cwe.name
ORDER BY similar.published_date DESC
LIMIT 20;
```

在这种数据形态下，GraphRAG 能做传统 RAG 做不到的事：

- 按 CVSS、CWE、软件版本等任意维度组合查询
- 多跳推理（从入口漏洞到 RCE 的攻击路径）
- 增量更新高效（新 CVE 只需添加节点与边）
- 可解释性好 —— 查询路径本身就是推理过程

实践中有几个需要注意的点：

- **实体抽取准确性**：安全公告格式多样，LLM 抽取可能不一致。解法是 few-shot + 后处理校验，规范化字段（CVE ID、CWE ID、软件名）用正则预处理
- **图规模控制**：CVE 库体量大，实际部署时通常做时间分片（近几年详细图谱 + 历史归档）+ 热点字段索引
- **更新延迟**：用消息队列处理情报流，增量更新优先于全量重建
- **成本控制**：规范化数据走规则提取，只在复杂分析时调用 LLM

### GraphRAG 的挑战

#### 1. 构建成本高

- 需要多次 LLM 调用进行实体/关系抽取
- 计算量大，时间长
- **实战经验**：规范化数据（结构化的 CVE、产品目录）用规则提取，只有需要理解的文本才调用 LLM

#### 2. 实体抽取质量

- LLM 抽取可能不准确或不一致
- 实体消解（同一实体的不同表述）困难
- 关系定义的粒度难以把握
- **实战经验**：建立"黄金标准"数据集，few-shot learning 提升准确率；关键字段用正则预处理

#### 3. 图的维护

- 文档更新时如何增量更新图？
- 如何处理冲突信息？
- 图规模增长的性能问题
- **实战经验**：消息队列处理增量更新；冲突信息保留多版本（带时间戳）；定期归档旧数据

#### 4. 查询复杂度

- 图查询可能比向量检索慢
- 需要图数据库支持
- 多跳查询需要深度限制（通常 ≤ 5 跳）+ 查询缓存

---

## Graphiti：新一代时序知识图谱

### 什么是 Graphiti

Graphiti 是由 Zep AI 开源的**时序知识图谱框架**（2025 年 1 月发布研究论文），专注于：

1. **时间感知**：双时序模型 - 追踪事件发生时间和数据摄入时间
2. **增量更新**：支持持续学习和知识演进，无需重新计算整个图谱
3. **混合检索**：结合语义搜索、BM25 全文搜索、图遍历等多维度
4. **实时性**：支持流式数据处理，适合动态环境中的 AI Agent

**性能表现**（2025 年 1 月论文数据）：

- Deep Memory Retrieval (DMR) benchmark: 94.8% (vs MemGPT 93.4%)
- LongMemEval benchmark: 准确率提升高达 18.5%，延迟降低 90%

### 核心特性

#### 1. 双时序模型（Bi-temporal Model）

Graphiti 的核心创新是其双时序追踪机制：

```python
class Edge:
    valid_at: datetime          # 事件实际发生的时间
    created_at: datetime        # 数据被系统摄入的时间
    invalidated_at: Optional[datetime]  # 事实失效的时间

# 示例：员工职位变更
Edge(
    source="张三",
    target="技术总监",
    relation="WORKS_AS",
    valid_at="2024-01-01",
    created_at="2024-01-15",       # 15 天后才录入系统
    invalidated_at="2024-06-01",   # 6 月 1 日升职，此关系失效
)
```

这使得 Graphiti 能够：

- **时间点查询**：“2024 年 3 月时，张三的职位是什么？”
- **演变分析**：“张三的职位是如何随时间变化的？”
- **延迟处理**：即使数据延迟到达，也能正确维护时间线

#### 2. 混合检索策略

```python
class GraphitiRetrieval:
    def search(self, query, strategy="hybrid"):
        vector_results = self.semantic_search(query)    # 语义搜索 (BGE-m3)
        bm25_results = self.fulltext_search(query)      # 全文搜索 (Lucene)
        graph_results = self.graph_traverse(query)      # 图遍历 (BFS)
        community_results = self.community_search(query)  # Community 搜索

        all_results = vector_results + bm25_results + graph_results
        return self.rerank(all_results, query)
```

**搜索对象类型**：

- **边（Edges）**：搜索 fact 字段（实体间的关系）
- **节点（Nodes）**：搜索 entity name（实体名称）
- **Community**：搜索 community name（关键词聚合）

#### 3. 事件驱动更新

```python
def on_new_document(doc):
    new_facts = extract_facts(doc)
    for fact in new_facts:
        existing = graph.find_fact(fact.subject, fact.predicate)
        if existing:
            graph.update_fact(fact, timestamp=now())
        else:
            graph.add_fact(fact, timestamp=now())
    vector_db.update(doc)
```

#### 4. 自动化 Schema 学习

与 GraphRAG 不同，Graphiti 可以自动学习和演进 schema：

```python
graph.add_relationship(
    source="Claude Sonnet 4",
    target="Anthropic",
    type=auto_infer_relationship_type(source, target, context),
)
# 系统自动聚合相似关系类型
# "developed_by", "created_by", "made_by" → "CREATOR_OF"
```

### 使用场景对比

```text
传统 RAG:
  ✓ 简单 Q&A
  ✓ 文档检索
  ✓ 静态知识库

GraphRAG:
  ✓ 复杂推理
  ✓ 关系查询
  ✓ 全局理解
  ✗ 实时更新
  ✗ 时序分析

Graphiti:
  ✓ 复杂推理
  ✓ 关系查询
  ✓ 全局理解
  ✓ 实时更新
  ✓ 时序分析
  ✓ 知识演进
```

---

## 大 Context Window 时代的思考

### 当前趋势

2024–2025 年，LLM 的 context window 经历了爆炸式增长：

| 模型              | Context Window       | 发布时间   | 价格 (Input / Output per 1M tokens)      |
| ----------------- | -------------------- | ---------- | ---------------------------------------- |
| GPT-4             | 8K / 32K             | 2023-03    | 已淘汰                                   |
| Claude 2          | 100K                 | 2023-07    | 已淘汰                                   |
| GPT-4 Turbo       | 128K                 | 2023-11    | 已淘汰                                   |
| Gemini 1.5 Pro    | 1M (2M 可用)         | 2024-02    | $1.25 / $10 (≤200K), $2.50 / $15 (>200K) |
| Claude 3          | 200K                 | 2024-03    | 已淘汰                                   |
| Claude Sonnet 4   | 200K (支持 1M 扩展)  | 2024-05    | $3 / $15 (≤200K), $6 / $22.50 (>200K)    |
| Claude Sonnet 4.5 | 200K (支持 1M 扩展)  | 2024-09    | $3 / $15 (≤200K), $6 / $22.50 (>200K)    |
| Gemini 2.5 Pro    | 1M                   | 2025-03    | $1.25 / $10 (≤200K), $2.50 / $15 (>200K) |
| GPT-5             | 400K (API)           | 2025-08    | $1.25 / $10                              |
| GPT-4.1           | 1M (仅 API)          | 2025       | -                                        |

### RAG 是否会被淘汰？

这是一个非常重要的问题。让我们从多个角度分析。

#### 观点一：RAG 会被边缘化

**支持论据**：

1. **成本下降**：把所有文档扔进 context 可能比维护 RAG 系统更便宜
2. **更简单的架构**：`query + all_docs → LLM`
3. **更好的理解**：LLM 可以直接阅读完整文档，不会因为切块丢失信息
4. **无需提前索引**：动态文档、实时数据可以直接使用

**适用场景**：

- 文档总量 < 500K tokens
- 需要完整上下文理解
- 文档更新频繁，索引成本高
- 对检索精度要求不高的探索性分析

#### 观点二：RAG 依然不可替代

**支持论据**：

1. **规模问题**

   ```text
   1M tokens ≈ 750K 英文单词 ≈ 1,500 页文档
   ```

   大部分企业数据（Notion 笔记、代码库、客服记录）都远超 1M tokens。

2. **成本问题**（大规模场景）

   场景：10M tokens 的文档库，1000 次查询 / 天

   ```text
   RAG 方式:
   - 一次性 Embedding: $1.3 (OpenAI text-embedding-3)
   - 每次检索返回 10K tokens
   - LLM 成本 (Claude Sonnet 4.5): $3 × 10K × 1000 / 1M = $30/天

   Long Context 方式 (Claude Sonnet 4, 1M context):
   - 每次查询处理 10M tokens (>200K 价格区间)
   - LLM 成本: $6 × 10M × 1000 / 1M = $60,000/天

   RAG 便宜 2000 倍
   ```

3. **延迟问题**：处理 1M tokens 可能需要 30–60 秒，RAG 检索 10K tokens 总延迟 < 10 秒

4. **精度问题**："Lost in the Middle" — 大 context 中间的信息容易被忽略；即使模型支持大 context，性能会随 context 增大而下降

5. **动态知识**：数据库实时数据、API 返回的动态内容、权限受控的文档，无法预先放入 context

6. **可解释性**：RAG 可以明确显示引用了哪些文档；Long context 是黑盒

#### 观点三：混合架构才是未来

现实是：不同场景需要不同策略。

```python
def choose_strategy(data_size, query_type, update_frequency):
    # 小规模 + 静态 = Long Context
    if data_size < 200_000 and update_frequency == "low":
        return "long_context"
    # 大规模 = 必须 RAG
    if data_size > 1_000_000:
        return "rag"
    # 需要精确引用 = RAG
    if query_type == "fact_lookup":
        return "rag"
    # 需要全局理解 = Long Context
    if query_type == "global_analysis":
        return "long_context"
    # 中等规模 = 混合
    return "hybrid"
```

### 具体场景分析

#### 场景 1：客户服务知识库

中等规模 (10 万文档)、高频查询、需要精确引用 → **RAG**

#### 场景 2：法律文档分析

单个案件文档 (50–200 页)、需要深度理解、低频查询 → **Long Context**

#### 场景 3：漏洞情报管理

大规模漏洞数据库、高度关联、多跳推理、实时更新 → **GraphRAG**

典型查询：

- "OpenSSL 1.1.1k 有哪些高危漏洞？"
- "CVE-2024-XXXX 是否有公开利用代码？"
- "从 XSS 到 RCE 的可能攻击路径？"（多跳推理）

#### 场景 4：代码库问答

超大规模、需要跟踪依赖关系、代码持续更新 → **GraphRAG + Graphiti 混合**

代码天然是图结构（函数调用、类继承、模块依赖），Graphiti 可以追踪代码演进历史。

#### 场景 5：团队文档管理

中等规模、频繁更新、需要追踪版本 → **Graphiti + RAG**

支持 "上周五关于 XX 项目的决策是什么？" 这类时间点查询。

#### 场景 6：研究论文总结

单篇论文、一次性任务 → **Long Context**

#### 场景 7：企业数据库查询

海量数据、动态变化、结构化数据 → **Text-to-SQL + RAG (schema)**

---

## 实践建议与架构选择

### 决策框架

```text
开始
  │
  ├─ 数据规模 < 100K tokens?
  │    ├─ 是 → 考虑 Long Context
  │    │      ├─ 静态文档 → Long Context ✓
  │    │      └─ 动态更新 → 轻量 RAG
  │    │
  │    └─ 否 → 继续评估
  │
  ├─ 数据规模 > 10M tokens?
  │    └─ 是 → 必须 RAG ✓
  │
  ├─ 查询频率 > 1000 次/天?
  │    └─ 是 → RAG (成本考虑) ✓
  │
  ├─ 需要精确引用?
  │    └─ 是 → RAG ✓
  │
  ├─ 需要关系推理?
  │    └─ 是 → GraphRAG ✓
  │
  ├─ 需要时序分析?
  │    └─ 是 → Graphiti ✓
  │
  └─ 其他 → 混合方案
```

---

## 总结与展望

### 核心要点

1. **RAG 的本质**：检索最相关信息，减少 LLM 需要处理的数据量
2. **GraphRAG 的价值**：通过知识图谱实现结构化推理和全局理解
3. **Graphiti 的创新**：时序知识管理，支持知识演进
4. **Long Context 的影响**：改变了 RAG 的适用场景，但没有取代 RAG
5. **未来方向**：自适应混合系统，根据场景动态选择最优策略

### 技术选型建议

| 场景         | 数据规模         | 推荐方案       | 原因                  |
| ------------ | ---------------- | -------------- | --------------------- |
| 简单 Q&A     | < 100K tokens    | Long Context   | 简单直接              |
| 企业知识库   | 1M–100M tokens   | RAG            | 成本效益              |
| 漏洞情报管理 | 大量关联数据     | GraphRAG       | 关系推理、多跳查询    |
| 代码理解     | 任意             | GraphRAG       | 关系推理              |
| 对话记忆     | 增长型           | Graphiti       | 时序管理              |
| 法律分析     | 单文档           | Long Context   | 深度理解              |
| 实时数据     | 动态             | RAG + API      | 无法预加载            |

### 最后的思考

**RAG 会消失吗？** 不会。但它会：

- **演进**：从简单的向量检索到智能的多模态检索
- **分化**：不同场景有不同的最优解
- **融合**：与 Long Context 结合，而非对立

**我们应该怎么做？**

1. **理解本质**：不要盲从技术趋势，理解每种技术的适用场景
2. **灵活架构**：设计可以轻松切换策略的系统
3. **持续监控**：通过数据驱动决策，不断优化
4. **成本意识**：在质量和成本之间找到平衡

---

## 参考资源

### 论文

- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401) (RAG 原论文, 2020)
- [From Local to Global: A Graph RAG Approach to Query-Focused Summarization](https://arxiv.org/abs/2404.16130) (Microsoft GraphRAG, 2024)
- [LazyGraphRAG: Setting a New Standard for Quality and Cost](https://www.microsoft.com/en-us/research/blog/lazygraphrag-setting-a-new-standard-for-quality-and-cost/) (Microsoft, 2025)
- [Zep: A Temporal Knowledge Graph Architecture for Agent Memory](https://arxiv.org/abs/2501.13956) (Graphiti 论文, 2025)
- [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172) (2023)

### 开源项目

- **LangChain**: <https://github.com/langchain-ai/langchain>
- **LlamaIndex**: <https://github.com/run-llama/llama_index>
- **GraphRAG (Microsoft)**: <https://github.com/microsoft/graphrag>
- **Graphiti (Zep)**: <https://github.com/getzep/graphiti>
