---
title: "在Mac Mini上部署私有化大语言模型"
description: "手把手教你使用Ollama+Open WebUI在macOS系统搭建本地LLM服务"
date: 2025-03-24T15:56:48+08:00
draft: false
images: ["ollama-webui-demo.png"]
author: "VirgoC0der"
categories: ["Technical","Tutorial"]
tags: ["AI Deployment","Ollama","Open WebUI"]
keywords: ["macOS","LLM部署","Ollama","Open WebUI"]
---

## 环境准备

1. 系统要求：
   - macOS Monterey 12.3 或更高版本
   - 至少16GB内存（推荐32GB）
   - 安装Homebrew包管理器

```bash
# 安装Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## 安装部署

### 1. 安装Ollama

```bash
# 通过curl直接安装
curl -fsSL https://ollama.com/install.sh | sh

# 启动ollama服务
ollama serve
```

### 2. 部署Open WebUI

```bash
# 使用Docker运行webui容器
docker run -d -p 3000:8080 \
  -v ollama:/root/.ollama \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```

## 模型加载

```bash
# 下载llama3模型（根据需求替换模型名称）
ollama pull llama3

# 查看已安装模型
ollama list
```

## 访问验证

1. 打开浏览器访问：
   - Ollama管理界面：http://localhost:11434
   - WebUI界面：http://localhost:3000

2. 在WebUI界面选择模型即可开始对话

## 注意事项

1. 确保3000/11434端口未被占用
2. 首次下载模型需要较长时间（取决于网络环境）
3. 建议配合Ngrok实现内网穿透
4. 使用GPU加速需要额外配置Metal后端

