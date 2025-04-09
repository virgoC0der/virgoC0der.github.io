---
title: "使用Go开发MCP并接入Claude Desktop：go-mcp库实践"
date: 2025-04-08T15:30:00+08:00
draft: false
tags: ["Go", "Claude", "MCP", "AI"]
categories: ["技术"]
---

## 引言

人工智能助手如Claude已经成为我们日常工作的重要工具，但其能力往往受限于预设功能。通过Model Completion Protocol (MCP)，我们可以显著扩展AI助手的能力边界，使其能够执行更多实用的任务。本文将详细介绍如何使用go-mcp开源库在Go语言环境下开发MCP服务，并将其成功接入Claude Desktop，实现与本地应用程序的交互。

## MCP协议简介

Model Completion Protocol (MCP)是一个允许AI助手与外部工具进行交互的协议。通过MCP，Claude等AI助手可以：

- 调用外部工具和API
- 访问本地系统资源
- 执行特定的计算任务
- 获取和处理实时数据

这使得Claude能够突破知识截止日期的限制，获取最新信息，并执行需要额外计算能力或系统访问权限的任务。

## go-mcp库介绍

[go-mcp](https://github.com/virgoC0der/go-mcp)是一个基于Go语言的MCP协议实现库，它提供了一套完整的API用于开发MCP服务。使用go-mcp，开发者可以轻松地创建自定义工具，并将这些工具无缝集成到Claude Desktop中。

该库的主要特点包括：

- 完整实现MCP协议规范
- 支持HTTP和stdio两种通信方式
- 灵活的服务端架构
- 内置请求验证和错误处理
- 类型安全的API设计

## 开发环境准备

在开始开发之前，我们需要准备以下环境：

```bash
# 安装Go (确保版本至少为1.18)
brew install go

# 克隆go-mcp仓库
git clone https://github.com/virgoC0der/go-mcp.git
cd go-mcp

# 安装依赖
go mod tidy
```

## 实现应用启动器MCP服务

参考go-mcp仓库中的examples/app-launcher示例，我们来实现一个应用启动器MCP服务，这个服务将允许Claude Desktop打开本地应用程序。

### 1. 创建项目结构

```bash
mkdir claude-app-launcher
cd claude-app-launcher
go mod init github.com/yourusername/claude-app-launcher
```

### 2. 实现服务结构

首先，让我们实现一个满足MCP协议要求的服务结构：

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/exec"
	"os/signal"
	"runtime"
	"sync"
	"syscall"

	"github.com/virgoC0der/go-mcp"

	"github.com/virgoC0der/go-mcp/internal/types"
	"github.com/virgoC0der/go-mcp/transport"
)

// AppLauncherServer implements the MCP service interface
type AppLauncherServer struct {
	prompts   []types.Prompt
	tools     []types.Tool
	resources []types.Resource
}

// NewAppLauncherServer creates a new app launcher server instance
func NewAppLauncherServer() *AppLauncherServer {
	s := &AppLauncherServer{
		// 定义支持的提示
		prompts: []types.Prompt{
			{
				Name:        "openApp",
				Description: "Open a macOS application",
				Arguments: []types.PromptArgument{
					{
						Name:        "appName",
						Description: "Name of the application to open",
						Required:    true,
					},
				},
			},
		},
		// 定义支持的工具
		tools: []types.Tool{
			{
				Name:        "openApp",
				Description: "Open a macOS application",
				InputSchema: map[string]interface{}{
					"type": "object",
					"properties": map[string]interface{}{
						"appName": map[string]interface{}{
							"type":        "string",
							"description": "Name of the application to open",
						},
					},
					"required": []string{"appName"},
				},
			},
		},
		// 定义支持的资源
		resources: []types.Resource{
			{
				URI:         "apps",
				Name:        "apps",
				Description: "List of common macOS applications",
				MimeType:    "application/json",
			},
		},
	}
	return s
}
```

### 3. 实现服务接口方法

接下来，我们需要实现MCP服务接口所需的各种方法：

```go
// Initialize implements the Server interface
func (s *AppLauncherServer) Initialize(ctx context.Context, options any) error {
	// 检查是否在macOS上运行
	if runtime.GOOS != "darwin" {
		return fmt.Errorf("this server is designed to run on macOS only, current OS: %s", runtime.GOOS)
	}
	return nil
}

// ListPrompts implements the Server interface
func (s *AppLauncherServer) ListPrompts(ctx context.Context, cursor string) (*types.PromptListResult, error) {
	return &types.PromptListResult{
		Prompts:    s.prompts,
		NextCursor: "",
	}, nil
}

// GetPrompt implements the Server interface
func (s *AppLauncherServer) GetPrompt(ctx context.Context, name string, args map[string]any) (*types.PromptResult, error) {
	if name != "openApp" {
		return nil, fmt.Errorf("unknown prompt: %s", name)
	}

	appName, ok := args["appName"].(string)
	if !ok || appName == "" {
		return nil, fmt.Errorf("missing or invalid argument: appName")
	}

	// 调用openApp工具
	result, err := s.CallTool(ctx, "openApp", args)
	if err != nil {
		return nil, err
	}

	// 创建响应消息
	var responseText string
	if result.IsError {
		responseText = fmt.Sprintf("Failed to open application '%s': %s", appName, result.Content[0].Text)
	} else {
		responseText = result.Content[0].Text
	}

	return &types.PromptResult{
		Description: "Application launcher result",
		Messages: []types.Message{
			{
				Role: "assistant",
				Content: types.Content{
					Type: "text",
					Text: responseText,
				},
			},
		},
	}, nil
}

// ListTools implements the Server interface
func (s *AppLauncherServer) ListTools(ctx context.Context, cursor string) (*types.ToolListResult, error) {
	return &types.ToolListResult{
		Tools:      s.tools,
		NextCursor: "",
	}, nil
}

// CallTool implements the Server interface
func (s *AppLauncherServer) CallTool(ctx context.Context, name string, args map[string]any) (*types.CallToolResult, error) {
	if name != "openApp" {
		return nil, fmt.Errorf("unknown tool: %s", name)
	}

	appName, ok := args["appName"].(string)
	if !ok || appName == "" {
		return nil, fmt.Errorf("missing or invalid argument: appName")
	}

	// 使用'open'命令打开应用程序
	cmd := exec.Command("open", "-a", appName)
	err := cmd.Run()

	if err != nil {
		// 返回错误结果
		return &types.CallToolResult{
			Content: []types.ToolContent{
				{
					Type: "text",
					Text: fmt.Sprintf("Error opening application: %v", err),
				},
			},
			IsError: true,
		}, nil
	}

	// 返回成功结果
	return &types.CallToolResult{
		Content: []types.ToolContent{
			{
				Type: "text",
				Text: fmt.Sprintf("Successfully opened application: %s", appName),
			},
		},
		IsError: false,
	}, nil
}

// ListResources implements the Server interface
func (s *AppLauncherServer) ListResources(ctx context.Context, cursor string) (*types.ResourceListResult, error) {
	return &types.ResourceListResult{
		Resources:  s.resources,
		NextCursor: "",
	}, nil
}

// ReadResource implements the Server interface
func (s *AppLauncherServer) ReadResource(ctx context.Context, uri string) (*types.ResourceContent, error) {
	if uri != "apps" {
		return nil, fmt.Errorf("unknown resource: %s", uri)
	}

	// 常见macOS应用程序列表
	apps := []string{
		"Safari",
		"Mail",
		"Calendar",
		"Notes",
		"Maps",
		"Photos",
		"Messages",
		"FaceTime",
		"Music",
		"App Store",
		"System Settings",
		"Terminal",
		"Calculator",
		"TextEdit",
		"Preview",
		"GoLand",
		"Edge",
		"Cursor",
		"Warp",
		"iTerm 2",
	}

	content, err := json.Marshal(apps)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal apps list: %w", err)
	}

	return &types.ResourceContent{
		URI:      uri,
		MimeType: "application/json",
		Text:     string(content),
	}, nil
}

// ListResourceTemplates implements the Server interface
func (s *AppLauncherServer) ListResourceTemplates(ctx context.Context) ([]types.ResourceTemplate, error) {
	return []types.ResourceTemplate{}, nil
}

// SubscribeToResource implements the Server interface
func (s *AppLauncherServer) SubscribeToResource(ctx context.Context, uri string) error {
	return fmt.Errorf("resource subscription not supported")
}

// Shutdown implements the Server interface
func (s *AppLauncherServer) Shutdown(ctx context.Context) error {
	return nil
}
```

### 4. 实现主函数

最后，我们需要实现主函数，同时启动HTTP和stdio两种服务模式：

```go
func main() {
	// 创建应用启动器服务
	service := NewAppLauncherServer()

	// 创建用于优雅关闭的上下文
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// 创建具有能力声明的HTTP服务器
	httpServer, err := mcp.NewServer(service, &types.ServerOptions{
		Address: ":8080",
		Capabilities: &types.ServerCapabilities{
			Tools: &types.ToolCapabilities{
				ListChanged: true,
			},
			Prompts: &types.PromptCapabilities{
				ListChanged: true,
			},
			Resources: &types.ResourceCapabilities{
				ListChanged: true,
			},
		},
	})
	if err != nil {
		log.Fatal(err)
	}

	// 初始化HTTP服务器
	if err := httpServer.Initialize(ctx, nil); err != nil {
		log.Fatalf("Failed to initialize HTTP server: %v", err)
	}

	// 创建stdio服务器
	// 由于StdioServer期望types.Server但我们的服务是types.MCPService，
	// 我们需要使用HTTP服务器作为stdio的服务器实现
	stdioServer := transport.NewStdioServer(httpServer)

	// 使用WaitGroup管理goroutine
	wg := sync.WaitGroup{}
	wg.Add(2) // 一个用于HTTP服务器，一个用于stdio服务器

	// 启动HTTP服务器
	go func() {
		defer wg.Done()
		log.Printf("Starting HTTP server on :8080")
		if err := httpServer.Start(); err != nil {
			log.Printf("HTTP server error: %v", err)
			cancel()
		}
	}()

	// 启动stdio服务器
	go func() {
		defer wg.Done()
		log.Printf("Starting stdio server")
		if err := stdioServer.Start(); err != nil {
			log.Printf("Stdio server error: %v", err)
			cancel()
		}
	}()

	// 处理中断信号
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// 等待关闭信号或错误
	shutdownCh := make(chan struct{})
	go func() {
		select {
		case <-sigChan:
			log.Println("Received shutdown signal")
		case <-ctx.Done():
			log.Println("Server error occurred")
		}
		close(shutdownCh)
	}()

	<-shutdownCh

	// 优雅关闭
	log.Println("Shutting down servers...")

	// 停止stdio服务器
	if err := stdioServer.Stop(); err != nil {
		log.Printf("Stdio server shutdown error: %v", err)
	}

	// 关闭HTTP服务器
	if err := httpServer.Shutdown(ctx); err != nil {
		log.Printf("HTTP server shutdown error: %v", err)
	}

	// 等待服务器完成
	wg.Wait()
	log.Println("All servers stopped")
}
```

### 5. 构建和运行

完成代码编写后，我们可以构建并运行我们的应用：

```bash
go build -o claude-app-launcher
./claude-app-launcher
```

这将同时启动HTTP服务器（监听8080端口）和stdio服务器。

## 在Claude Desktop中配置MCP工具

要将MCP工具接入Claude Desktop，我们需要编辑Claude Desktop的配置文件：

1. 打开Claude Desktop
2. 进入设置 (Settings) > 开发者选项 (Developer) > 编辑配置 (Edit Config)
3. 在配置文件中添加以下内容：

```json
{
  "mac-app-opener": {
    "args": [],
    "command": "/path/to/your/claude-app-launcher"
  }
}
```

其中，`/path/to/your/claude-app-launcher`是您的MCP工具的完整路径。保存配置后，Claude Desktop将能够使用您开发的MCP工具。

## go-mcp库的MCP服务架构

go-mcp库实现了完整的MCP服务架构，主要包括以下几个核心组件：

### 1. 服务接口

`types.MCPService`接口定义了MCP服务需要实现的所有方法，包括：

- 工具管理：`ListTools`、`CallTool`
- 提示管理：`ListPrompts`、`GetPrompt`
- 资源管理：`ListResources`、`ReadResource`等

### 2. 服务器实现

该库提供了两种服务器实现：

- **HTTP服务器**：通过HTTP协议提供服务，适合网络通信和调试
- **Stdio服务器**：通过标准输入/输出提供服务，适合与Claude Desktop直接集成

### 3. 类型系统

库提供了丰富的类型定义，确保API调用的类型安全：

- `Tool`：表示一个可调用的工具
- `Prompt`：表示一个可使用的提示
- `Resource`：表示一个可访问的资源
- 以及各种结果类型和内容类型

## Stdio与HTTP服务器对比

go-mcp库同时支持HTTP和stdio两种通信方式，它们各有优缺点：

| 特性 | Stdio模式 | HTTP模式 |
|------|----------|---------|
| 安全性 | 更高（无网络通信） | 较低（需要考虑网络安全） |
| 配置复杂度 | 更简单（直接指向可执行文件） | 较复杂（需要配置URL和端口） |
| 资源占用 | 更低（按需启动） | 较高（需要常驻运行HTTP服务器） |
| 调试便利性 | 较低（难以直接测试） | 更高（可以使用curl等工具直接测试） |
| 并发处理 | 单一请求流 | 支持并发请求 |

在我们的实现中，同时提供了这两种模式，用户可以根据自己的需求选择合适的连接方式。

## 扩展MCP服务功能

我们可以扩展应用启动器服务，增加更多功能：

### 1. 添加更多工具

例如，添加一个文件操作工具：

```go
// 在NewAppLauncherServer中添加
tools: []types.Tool{
    // 保留原有的openApp工具
    {
        Name:        "openApp",
        Description: "Open a macOS application",
        InputSchema: map[string]interface{}{
            // ...原有定义...
        },
    },
    // 添加新的fileOperations工具
    {
        Name:        "fileOperations",
        Description: "Read or write files",
        InputSchema: map[string]interface{}{
            "type": "object",
            "properties": map[string]interface{}{
                "operation": map[string]interface{}{
                    "type":        "string",
                    "enum":        []string{"read", "write"},
                    "description": "Operation type: read or write",
                },
                "path": map[string]interface{}{
                    "type":        "string",
                    "description": "File path",
                },
                "content": map[string]interface{}{
                    "type":        "string",
                    "description": "File content for write operation",
                },
            },
            "required": []string{"operation", "path"},
        },
    },
},
```

然后添加对应的CallTool处理逻辑：

```go
// CallTool实现中添加
if name == "fileOperations" {
    operation, _ := args["operation"].(string)
    path, _ := args["path"].(string)
    content, _ := args["content"].(string)
    
    if path == "" {
        return nil, fmt.Errorf("missing or invalid argument: path")
    }
    
    switch operation {
    case "read":
        data, err := os.ReadFile(path)
        if err != nil {
            return &types.CallToolResult{
                Content: []types.ToolContent{
                    {
                        Type: "text",
                        Text: fmt.Sprintf("Error reading file: %v", err),
                    },
                },
                IsError: true,
            }, nil
        }
        return &types.CallToolResult{
            Content: []types.ToolContent{
                {
                    Type: "text",
                    Text: string(data),
                },
            },
            IsError: false,
        }, nil
        
    case "write":
        if content == "" {
            return nil, fmt.Errorf("missing or invalid argument: content")
        }
        
        err := os.WriteFile(path, []byte(content), 0644)
        if err != nil {
            return &types.CallToolResult{
                Content: []types.ToolContent{
                    {
                        Type: "text",
                        Text: fmt.Sprintf("Error writing file: %v", err),
                    },
                },
                IsError: true,
            }, nil
        }
        return &types.CallToolResult{
            Content: []types.ToolContent{
                {
                    Type: "text",
                    Text: fmt.Sprintf("Successfully wrote %d bytes to %s", len(content), path),
                },
            },
            IsError: false,
        }, nil
        
    default:
        return nil, fmt.Errorf("unknown operation: %s", operation)
    }
}
```

### 2. 支持提示功能

MCP协议的提示功能允许Claude更自然地调用工具，我们可以为新增的文件操作工具添加对应的提示：

```go
// 在NewAppLauncherServer中添加
prompts: []types.Prompt{
    // 保留原有的openApp提示
    {
        Name:        "openApp",
        Description: "Open a macOS application",
        Arguments: []types.PromptArgument{
            // ...原有定义...
        },
    },
    // 添加新的readFile提示
    {
        Name:        "readFile",
        Description: "Read the content of a file",
        Arguments: []types.PromptArgument{
            {
                Name:        "path",
                Description: "Path to the file",
                Required:    true,
            },
        },
    },
    // 添加新的writeFile提示
    {
        Name:        "writeFile",
        Description: "Write content to a file",
        Arguments: []types.PromptArgument{
            {
                Name:        "path",
                Description: "Path to the file",
                Required:    true,
            },
            {
                Name:        "content",
                Description: "Content to write",
                Required:    true,
            },
        },
    },
},
```

然后实现GetPrompt方法中对应的处理逻辑。

## 安全性与最佳实践

在开发MCP服务时，安全性是一个重要的考虑因素。以下是一些最佳实践：

1. **参数验证**：始终验证所有输入参数，特别是文件路径等敏感信息。
2. **权限控制**：限制MCP服务的操作范围，例如只允许访问特定目录下的文件。
3. **错误处理**：提供清晰的错误信息，但避免泄露敏感的系统信息。
4. **日志记录**：记录所有操作，便于审计和调试。
5. **优雅关闭**：确保服务可以优雅地处理关闭信号，避免资源泄漏。

示例安全检查函数：

```go
// 路径安全检查
func isPathSafe(path string) bool {
    // 转换为绝对路径
    absPath, err := filepath.Abs(path)
    if err != nil {
        return false
    }
    
    // 定义允许访问的目录
    allowedDirs := []string{
        "/tmp",
        os.Getenv("HOME") + "/Documents",
    }
    
    for _, dir := range allowedDirs {
        if strings.HasPrefix(absPath, dir) {
            return true
        }
    }
    
    return false
}
```

## 在Claude Desktop中使用MCP工具

一旦我们配置好了MCP工具，就可以在Claude Desktop中使用它了。使用非常简单，只需要在对话中告诉Claude你想做什么：

```
请帮我打开Safari浏览器
```

Claude将识别这个请求，并调用我们的openApp工具来启动Safari。

更复杂的例子：

```
请帮我读取我的待办事项列表（~/Documents/todo.txt）
```

如果我们实现了文件操作功能，Claude将调用fileOperations工具来读取指定文件的内容。

## 结论

通过go-mcp库，我们可以轻松地为Claude Desktop开发定制的MCP服务，极大地扩展AI助手的功能。库的灵活架构和双重通信模式（HTTP和stdio）为开发者提供了丰富的选择，可以根据实际需求和使用场景选择最合适的方式。

go-mcp库完整实现了MCP协议规范，提供了类型安全的API和完善的错误处理机制，使得开发过程变得简单而高效。通过本文介绍的应用启动器示例，我们展示了如何快速开发和部署一个MCP服务，并将其与Claude Desktop集成。

随着AI技术的不断发展，MCP协议将在AI助手的能力扩展中扮演越来越重要的角色，go-mcp库为Go开发者提供了一个便捷的工具来参与这一生态系统的建设。

## 参考资料

- [go-mcp GitHub仓库](https://github.com/virgoC0der/go-mcp)
- [MCP协议文档](https://docs.anthropic.com/claude/docs/model-completion-protocol)
- [Claude Desktop官方文档](https://www.anthropic.com/claude-desktop)
- [Go语言官方文档](https://golang.org/doc/)
