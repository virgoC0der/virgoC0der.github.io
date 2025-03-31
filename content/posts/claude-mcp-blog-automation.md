---
title: "Claude+MCP一键生成博客：AI助力内容创作与自动化部署"
date: 2025-03-31T10:00:00+08:00
draft: false
tags: ["AI", "Claude", "MCP", "自动化", "博客"]
categories: ["技术"]
---

# Claude+MCP一键生成博客：AI助力内容创作与自动化部署

在这个信息爆炸的时代，高效地创建和发布内容已成为许多创作者的迫切需求。今天，我想分享一个结合了AI大语言模型Claude和Model Context Protocol (MCP)的强大工作流，它可以让你以惊人的速度从创意到发布完成整个博客创作过程。

## 工作流概述

这个一键式博客生成和部署流程包含三个主要步骤：

1. 使用Claude生成高质量的博客内容并保存为Markdown文件
2. 通过MCP desktop-commander自动推送到GitHub仓库并触发GitHub Actions
3. 利用MCP playwright自动检查部署结果

这个过程完全自动化，从内容创建到部署验证，几乎不需要人工干预。

## 配置MCP工具

要开始使用这个工作流，首先需要在Claude客户端中配置MCP工具。步骤如下：

1. 打开Claude客户端
2. 点击Settings -> Developer -> Edit Config
3. 输入以下配置：

```json
{
  "mcpServers": {
    "fileSystme": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "YOUR PATH"
      ]
    },
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ]
    },
    "desktop-commander": {
      "command": "npx",
      "args": [
        "-y",
        "@smithery/cli@latest",
        "run",
        "@wonderwhy-er/desktop-commander",
        "--key",
        "YOUR PERSONAL KEY"
      ]
    }
  }
}
```

这个配置告诉Claude如何与三个关键MCP工具通信：
- **fileSystem**：让Claude能够读写你电脑上的文件，需要将`YOUR PATH`替换为你要授权访问的文件系统路径
- **playwright**：让Claude能够控制网页浏览器
- **desktop-commander**：让Claude能够执行系统命令，需要将`YOUR PERSONAL KEY`替换为你的个人密钥

## 第一步：Claude生成博客内容

Claude是Anthropic开发的一款强大的大语言模型，具有出色的写作能力和上下文理解能力。在这个工作流中，你只需要：

1. 向Claude提供博客主题和要点
2. Claude生成完整的博客文章，包括标题、正文、标签等
3. Claude使用系统文件访问功能将文章保存为Markdown文件到你的博客仓库目录

我只需要在Claude客户端中输入以下提示：

```
你是一个精通技术的编程大师，又擅长写博客，按照用户给你的指令生成博客，
将博客文章以markdown文件保存到/Users/yourname/blog/content/posts目录下。

帮我写一篇博客文章：[主题]
1. [要点1]
2. [要点2]
3. [要点3]
```

Claude会根据提供的主题和要点生成完整的博客文章，并通过其文件系统访问能力直接将文章保存到指定目录，无需任何代码或API调用。

## 第二步：使用MCP desktop-commander推送到GitHub

在Claude客户端中配置好MCP desktop-commander工具后，Claude可以直接执行Git操作：

1. 将新创建的Markdown文件添加到Git仓库
2. 提交更改
3. 推送到GitHub，自动触发GitHub Actions

整个过程只需在提示中添加以下指令：

```
现在使用MCP desktop-commander将文件推送到GitHub：
1. 将新创建的markdown文件添加到git
2. 提交更改，使用描述性的commit信息
3. 推送到main分支
```

在GitHub仓库中，已配置了GitHub Actions工作流来自动部署博客：

```yaml
# .github/workflows/deploy.yml
name: Deploy Blog

on:
  push:
    branches: [ main ]
    
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.92.0'
          
      - name: Build
        run: hugo --minify
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

## 第三步：使用MCP playwright验证部署

最后，我利用Claude的MCP playwright功能自动检查博客是否成功部署。在同一会话中，我只需添加以下指令：

```
请使用MCP playwright打开浏览器，检查博客是否成功发布：
1. 导航到博客文章URL
2. 确认页面标题包含博客标题
3. 截取页面截图以验证部署
```

Claude会使用playwright自动打开浏览器，导航到指定URL，验证页面内容，并返回结果，让我立即知道部署是否成功。

## 完整自动化流程的优势

这套基于Claude和MCP的工作流程带来了诸多优势：

1. **简单直接**：整个流程都在Claude客户端内完成，无需编写脚本或使用多个工具
2. **时间效率**：从创意到发布验证，整个过程可以在几分钟内完成
3. **一致性**：自动化流程确保每次发布都遵循相同的标准
4. **专注创造**：减少技术操作，让你能够更专注于内容创意
5. **错误减少**：自动化减少了人为错误的可能性
6. **即时反馈**：自动验证让你立即知道部署是否成功

## 实施建议

如果你想搭建类似的工作流，以下是一些建议：

1. **配置MCP工具**：确保在Claude客户端中正确配置playwright和desktop-commander这两个MCP工具
2. **创建提示模板**：为不同类型的博客创建Claude提示模板，方便重复使用
3. **设置GitHub Actions**：配置GitHub仓库的自动部署工作流
4. **审核流程**：在推送到GitHub前添加内容审核步骤，确保质量

## 结语

Claude+MCP的博客自动化工作流程代表了内容创作与技术自动化的完美结合。利用Claude的强大语言能力和MCP工具的系统集成能力，你可以在单一界面完成从内容创建到部署验证的全流程。

这种方法不仅提高了效率，还为创作者提供了更多关注内容质量和创意的空间，而无需处理复杂的技术细节。

随着AI技术和MCP工具的不断发展，这种自动化工作流将变得更加智能和高效，为内容创作者开启更多可能性。

你有什么关于这个工作流的想法或改进建议吗？欢迎在评论区分享！
