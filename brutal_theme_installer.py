import os
import sys

# 定义主题名称和路径
THEME_NAME = "brutal"
THEME_DIR = os.path.join("themes", THEME_NAME)

# 确保在 Hugo 根目录运行
if not os.path.exists("config.toml") and not os.path.exists("hugo.toml"):
    print("⚠️  未检测到 hugo.toml 或 config.toml。请确保你在 Hugo 站点的根目录下运行此脚本。")
    # 询问是否继续 (为了方便测试，允许强制继续，但在实际使用中应在根目录)
    confirm = input("是否继续生成主题文件？(y/n): ")
    if confirm.lower() != 'y':
        sys.exit()

# 创建目录结构
dirs = [
    f"{THEME_DIR}/layouts/_default",
    f"{THEME_DIR}/layouts/partials",
    f"{THEME_DIR}/assets/css",
    f"{THEME_DIR}/static/images",
]

for d in dirs:
    os.makedirs(d, exist_ok=True)
    print(f"✅ Created directory: {d}")

# --- SVG 图标定义 (内联 SVG 以避免依赖) ---
ICONS = {
    "menu": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>',
    "x": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    "arrow-right": '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    "github": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
    "twitter": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>',
    "terminal": '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
    "code": '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    "coffee": '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>'
}

# --- 文件内容定义 ---

# 1. head.html
file_head = """
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} | {{ .Site.Title }}{{ end }}</title>
{{ $style := resources.Get "css/main.css" | resources.PostCSS }}
<link rel="stylesheet" href="{{ $style.RelPermalink }}">
<meta name="description" content="{{ if .IsHome }}{{ .Site.Params.description }}{{ else }}{{ .Summary }}{{ end }}">
"""

# 2. header.html (Navbar)
file_header = f"""
<nav class="sticky top-0 z-50 border-b-2 border-black bg-[#F3F1E5]" x-data="{{{{ open: false }}}}">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
            <a href="{{{{ .Site.BaseURL }}}}" class="flex-shrink-0 flex items-center cursor-pointer group decoration-0">
                <div class="w-10 h-10 bg-black text-white flex items-center justify-center border-2 border-black mr-3 group-hover:bg-[#1d4aff] transition-colors">
                    <span class="font-black text-xl">B</span>
                </div>
                <span class="font-black text-2xl tracking-tight text-black">BRUTAL<span class="text-[#1d4aff]">.LOG</span></span>
            </a>

            <div class="hidden md:flex items-center space-x-8">
                {{{{ range .Site.Menus.main }}}}
                <a href="{{{{ .URL }}}}" class="text-black font-bold hover:text-[#1d4aff] hover:underline decoration-2 underline-offset-4 transition-all">
                    {{{{ .Name }}}}
                </a>
                {{{{ end }}}}
                <a href="{{{{ .Site.Params.github }}}}" target="_blank" class="relative px-6 py-2 font-bold border-2 border-black bg-[#1d4aff] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 active:top-[2px] active:left-[2px] active:shadow-none">
                    Subscribe
                </a>
            </div>

            <div class="md:hidden flex items-center">
                <button @click="open = !open" class="text-black">
                    <span x-show="!open">{ICONS['menu']}</span>
                    <span x-show="open" x-cloak>{ICONS['x']}</span>
                </button>
            </div>
        </div>
    </div>

    <div x-show="open" x-cloak class="md:hidden border-t-2 border-black bg-[#F3F1E5] p-4 space-y-4">
        {{{{ range .Site.Menus.main }}}}
        <a href="{{{{ .URL }}}}" class="block w-full text-left font-bold text-xl py-2 border-b border-black/10 text-black">
            {{{{ .Name }}}}
        </a>
        {{{{ end }}}}
    </div>
</nav>
"""

# 3. footer.html
file_footer = f"""
<footer class="bg-black text-[#F3F1E5] py-16 px-4 mt-auto">
    <div class="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div class="col-span-1 md:col-span-2">
            <div class="font-black text-3xl mb-6">BRUTAL<span class="text-[#1d4aff]">.LOG</span></div>
            <p class="max-w-sm text-gray-400 mb-6">
                {{{{ .Site.Params.footer_bio | default "Designed with inspiration from PostHog. Built with Hugo & Tailwind." }}}}
            </p>
            <div class="flex gap-4">
                {{{{ with .Site.Params.github }}}}
                <a href="{{{{ . }}}}" target="_blank" class="w-10 h-10 bg-[#333] text-white flex items-center justify-center rounded hover:bg-[#1d4aff] cursor-pointer transition-colors">
                    {ICONS['github']}
                </a>
                {{{{ end }}}}
                {{{{ with .Site.Params.twitter }}}}
                <a href="{{{{ . }}}}" target="_blank" class="w-10 h-10 bg-[#333] text-white flex items-center justify-center rounded hover:bg-[#1d4aff] cursor-pointer transition-colors">
                    {ICONS['twitter']}
                </a>
                {{{{ end }}}}
            </div>
        </div>
        
        <div>
            <h5 class="font-bold text-lg mb-6 text-white border-b border-gray-700 pb-2 inline-block">Sitemap</h5>
            <ul class="space-y-3 text-gray-400">
                {{{{ range .Site.Menus.main }}}}
                <li><a href="{{{{ .URL }}}}" class="hover:text-white cursor-pointer">{{{{ .Name }}}}</a></li>
                {{{{ end }}}}
            </ul>
        </div>

        <div>
            <h5 class="font-bold text-lg mb-6 text-white border-b border-gray-700 pb-2 inline-block">Stay Updated</h5>
             <p class="text-gray-400 text-sm mb-4">Get the latest raw thoughts directly to your inbox.</p>
            <div class="flex">
                <input type="email" placeholder="Email" class="bg-[#222] border border-[#444] px-3 py-2 text-white w-full focus:outline-none focus:border-[#1d4aff]" />
                <button class="bg-[#1d4aff] px-3 py-2 text-white font-bold border border-[#1d4aff] hover:bg-blue-600">
                    {ICONS['arrow-right']}
                </button>
            </div>
        </div>
    </div>
</footer>
<script src="//unpkg.com/alpinejs" defer></script>
"""

# 4. baseof.html (Master Template)
file_baseof = f"""
<!DOCTYPE html>
<html lang="{{{{ .Site.Language.Lang }}}}">
<head>
    {{{{ partial "head.html" . }}}}
</head>
<body class="min-h-screen font-sans text-black bg-[#F3F1E5] selection:bg-[#f59e0b] selection:text-black flex flex-col">
    {{{{ partial "header.html" . }}}}
    <main class="flex-grow">
        {{{{ block "main" . }}}}{{{{ end }}}}
    </main>
    {{{{ partial "footer.html" . }}}}
</body>
</html>
"""

# 5. index.html (Homepage - Hero + Bento + List)
file_index = f"""
{{{{ define "main" }}}}
<!-- Hero Section -->
<section class="relative py-20 px-4 overflow-hidden">
    <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div class="z-10">
            <div class="inline-block bg-[#f59e0b] border-2 border-black px-3 py-1 font-bold text-xs mb-6 transform -rotate-2">
                {{{{ .Site.Params.hero_badge | default "FULL STACK DEVELOPER" }}}}
            </div>
            <h1 class="text-5xl md:text-7xl font-black leading-[0.9] mb-6 tracking-tighter">
                {{{{ .Site.Params.hero_title_1 | default "BUILDING" }}}} <br/>
                <span class="text-[#1d4aff] bg-white px-2 border-2 border-black inline-block transform rotate-1">{{{{ .Site.Params.hero_highlight | default "LOUD" }}}}</span> 
                <br/> {{{{ .Site.Params.hero_title_2 | default "DIGITAL THINGS." }}}}
            </h1>
            <p class="text-xl font-medium text-gray-800 mb-8 max-w-lg leading-relaxed border-l-4 border-black pl-4">
                {{{{ .Content }}}}
            </p>
            <div class="flex flex-wrap gap-4">
                <a href="/posts" class="relative px-6 py-3 font-bold border-2 border-black bg-[#1d4aff] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 active:top-[2px] active:left-[2px] active:shadow-none">
                    Read the Blog {ICONS['arrow-right']}
                </a>
                <a href="{{{{ .Site.Params.github }}}}" target="_blank" class="relative px-6 py-3 font-bold border-2 border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50 hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 active:top-[2px] active:left-[2px] active:shadow-none">
                    Github
                </a>
            </div>
        </div>
        
        <!-- Decorative -->
        <div class="relative hidden md:block">
            <div class="relative w-full aspect-square">
                <div class="absolute top-0 right-0 w-3/4 h-3/4 bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center z-20">
                   <span class="text-black">{ICONS['terminal']}</span>
                </div>
                <div class="absolute bottom-0 left-0 w-2/3 h-2/3 bg-[#1d4aff] border-4 border-black z-10"></div>
                <div class="absolute top-10 left-10 w-20 h-20 bg-[#f59e0b] rounded-full border-4 border-black z-30 flex items-center justify-center text-white">
                    {ICONS['code']}
                </div>
                <div class="absolute bottom-10 right-20 w-32 h-4 bg-black transform -rotate-12"></div>
            </div>
        </div>
    </div>
</section>

<!-- Bento Grid -->
<section class="py-16 px-4 max-w-7xl mx-auto">
    <h2 class="text-4xl font-black mb-12 flex items-center gap-4">
        <span class="bg-black text-white px-4 py-1 transform -rotate-1">EXPLORE</span>
        THE STACK
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6">
        <!-- Main Feature -->
        <div class="md:col-span-2 md:row-span-2 flex flex-col justify-between bg-[#FFFAE5] border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-rotate-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div>
                <div class="flex items-center justify-between mb-4">
                    {ICONS['coffee']}
                    <span class="font-bold text-sm bg-white border border-black px-2 py-1">NOW PLAYING</span>
                </div>
                <h3 class="text-3xl font-black mb-4 leading-tight">{{{{ .Site.Params.project_title | default "Building a new SaaS starter." }}}}</h3>
                <p class="font-medium text-gray-700">
                    {{{{ .Site.Params.project_desc | default "Trying to fit Supabase, Stripe and Tailwind into a tiny box." }}}}
                </p>
            </div>
            <div class="mt-8 pt-8 border-t-2 border-black border-dashed flex gap-2">
                <span class="inline-block px-3 py-1 text-sm font-bold border border-black rounded-full bg-blue-200 mr-2 mb-2">#Typescript</span>
                <span class="inline-block px-3 py-1 text-sm font-bold border border-black rounded-full bg-green-200 mr-2 mb-2">#Supabase</span>
            </div>
        </div>

        <!-- Github Box -->
        <a href="{{{{ .Site.Params.github }}}}" class="md:col-span-1 bg-[#1d4aff] text-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-rotate-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] block">
            <div class="h-full flex flex-col items-center justify-center text-center">
                <div class="mb-2">{ICONS['github']}</div>
                <h4 class="text-2xl font-black">GitHub</h4>
                <p class="text-sm opacity-90">Check my messy code</p>
            </div>
        </a>

        <!-- Twitter Box -->
        <a href="{{{{ .Site.Params.twitter }}}}" class="md:col-span-1 bg-[#f59e0b] text-black border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-rotate-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] block">
            <div class="h-full flex flex-col items-center justify-center text-center">
                <div class="mb-2">{ICONS['twitter']}</div>
                <h4 class="text-2xl font-black">Twitter</h4>
                <p class="text-sm font-bold">Rants & Thoughts</p>
            </div>
        </a>

        <!-- Tools -->
        <div class="md:col-span-2 flex flex-col justify-center border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h4 class="font-black text-xl mb-4 uppercase tracking-wider">Favorite Tools</h4>
            <div class="flex flex-wrap gap-3">
                {{{{ range .Site.Params.tools }}}}
                <span class="px-3 py-1 border-2 border-black font-bold hover:bg-black hover:text-white cursor-default transition-colors">
                    {{{{ . }}}}
                </span>
                {{{{ end }}}}
            </div>
        </div>
    </div>
</section>

<!-- Latest Writing -->
<section class="py-16 px-4 bg-white border-y-2 border-black">
    <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-end mb-12 border-b-4 border-black pb-4">
            <h2 class="text-5xl font-black uppercase tracking-tight">Latest<br/>Writing</h2>
        </div>

        <div class="space-y-8">
            {{{{ range first 5 (where .Site.RegularPages "Type" "posts") }}}}
            <div class="group relative border-b-2 border-gray-200 pb-8 last:border-0">
                <div class="grid md:grid-cols-12 gap-6">
                    <div class="md:col-span-3">
                        <span class="block font-mono font-bold text-gray-500 mb-1">{{{{ .Date.Format "2006-01-02" }}}}</span>
                        {{{{ with .Params.categories }}}}
                        <span class="inline-block px-2 py-0.5 border border-black text-xs font-bold uppercase bg-gray-100">
                            {{{{ index . 0 }}}}
                        </span>
                        {{{{ end }}}}
                    </div>
                    <div class="md:col-span-9">
                        <h3 class="text-2xl md:text-3xl font-black mb-3 group-hover:text-[#1d4aff] transition-colors">
                            <a href="{{{{ .RelPermalink }}}}">{{{{ .Title }}}}</a>
                        </h3>
                        <p class="text-lg text-gray-700 mb-4 leading-relaxed">
                            {{{{ .Summary | truncate 120 }}}}
                        </p>
                        <div class="flex items-center justify-between">
                            <div class="flex flex-wrap">
                                {{{{ range .Params.tags }}}}
                                <span class="text-sm font-bold mr-3 text-gray-500">#{{{{ . }}}}</span>
                                {{{{ end }}}}
                            </div>
                            <a href="{{{{ .RelPermalink }}}}" class="font-bold flex items-center gap-2 border-b-2 border-transparent hover:border-[#1d4aff] hover:text-[#1d4aff] transition-all">
                                Read Post {ICONS['arrow-right']}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {{{{ end }}}}
        </div>
    </div>
</section>
{{{{ end }}}}
"""

# 6. list.html (Generic List)
file_list = f"""
{{{{ define "main" }}}}
<section class="py-16 px-4 bg-white min-h-screen">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-6xl font-black uppercase tracking-tight mb-12 border-b-4 border-black pb-4">{{{{ .Title }}}}</h1>
        <div class="space-y-8">
            {{{{ range .Paginator.Pages }}}}
            <div class="group relative border-b-2 border-gray-200 pb-8">
                <h3 class="text-3xl font-black mb-2 group-hover:text-[#1d4aff] transition-colors">
                    <a href="{{{{ .RelPermalink }}}}">{{{{ .Title }}}}</a>
                </h3>
                <div class="flex gap-4 text-sm font-bold text-gray-500 mb-4">
                    <span>{{{{ .Date.Format "Jan 02, 2006" }}}}</span>
                    <span>{{{{ .ReadingTime }}}} min read</span>
                </div>
                <p class="text-lg text-gray-700 mb-4">{{{{ .Summary }}}}</p>
            </div>
            {{{{ end }}}}
        </div>
        <!-- Pagination -->
        <div class="mt-12 flex justify-center gap-4 font-bold">
            {{{{ if .Paginator.HasPrev }}}}
            <a href="{{{{ .Paginator.Prev.URL }}}}" class="px-4 py-2 border-2 border-black hover:bg-black hover:text-white">&larr; Prev</a>
            {{{{ end }}}}
            {{{{ if .Paginator.HasNext }}}}
            <a href="{{{{ .Paginator.Next.URL }}}}" class="px-4 py-2 border-2 border-black hover:bg-black hover:text-white">Next &rarr;</a>
            {{{{ end }}}}
        </div>
    </div>
</section>
{{{{ end }}}}
"""

# 7. single.html (Post View)
file_single = f"""
{{{{ define "main" }}}}
<article class="max-w-3xl mx-auto py-16 px-4 min-h-screen">
    <a href="/" class="mb-8 font-bold flex items-center gap-2 hover:-translate-x-1 transition-transform text-gray-600 hover:text-black decoration-0">
       &larr; Back to Home
    </a>
    
    <div class="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">
        <div class="flex gap-3 mb-6 flex-wrap">
            {{{{ range .Params.tags }}}}
            <span class="inline-block px-3 py-1 text-sm font-bold border border-black rounded-full bg-yellow-200 mb-2">#{{{{ . }}}}</span>
            {{{{ end }}}}
        </div>
        <h1 class="text-4xl md:text-6xl font-black leading-tight mb-6">{{{{ .Title }}}}</h1>
        <div class="flex items-center gap-4 text-sm font-bold text-gray-500 border-b-2 border-gray-100 pb-8 mb-8">
            <span class="flex items-center gap-1">Alex</span>
            <span>•</span>
            <span>{{{{ .Date.Format "Jan 02, 2006" }}}}</span>
            <span>•</span>
            <span>{{{{ .ReadingTime }}}} min read</span>
        </div>
        
        <!-- Content -->
        <div class="prose prose-lg prose-headings:font-black prose-a:text-[#1d4aff] prose-img:border-2 prose-img:border-black text-black max-w-none">
            {{{{ .Content }}}}
        </div>

        <div class="mt-12 pt-8 border-t-2 border-black flex flex-col md:flex-row justify-between items-center gap-4">
            <span class="font-bold">Share this article:</span>
            <div class="flex gap-2">
                <a href="https://twitter.com/intent/tweet?text={{{{ .Title }}}}" target="_blank" class="px-4 py-2 border-2 border-black bg-white hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all font-bold text-sm">
                    Twitter
                </a>
            </div>
        </div>
    </div>
</article>
{{{{ end }}}}
"""

# 8. CSS & Tailwind Setup
file_css = """
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply antialiased;
  }
}
"""

# 写入文件
files = [
    (f"{THEME_DIR}/layouts/_default/baseof.html", file_baseof),
    (f"{THEME_DIR}/layouts/_default/list.html", file_list),
    (f"{THEME_DIR}/layouts/_default/single.html", file_single),
    (f"{THEME_DIR}/layouts/index.html", file_index),
    (f"{THEME_DIR}/layouts/partials/head.html", file_head),
    (f"{THEME_DIR}/layouts/partials/header.html", file_header),
    (f"{THEME_DIR}/layouts/partials/footer.html", file_footer),
    (f"{THEME_DIR}/assets/css/main.css", file_css),
]

for path, content in files:
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"📄 Generated: {path}")

print("\n✨ 主题文件生成完毕！")
print("--------------------------------------------------")
print("👉 接下来你需要做的事情：")
print("1. 确保安装了 Tailwind CSS (Hugo 内置了 PostCSS 支持，但你需要安装依赖)")
print("   npm init -y")
print("   npm install -D tailwindcss postcss autoprefixer")
print("2. 初始化 Tailwind 配置:")
print("   npx tailwindcss init")
print("3. 修改 tailwind.config.js，确保 content 包含主题目录:")
print(f"""
   module.exports = {{
     content: ["./layouts/**/*.html", "./themes/{THEME_NAME}/layouts/**/*.html"],
     theme: {{
       extend: {{}},
     }},
     plugins: [require('@tailwindcss/typography')],
   }}
""")
print("4. 在 hugo.toml 中启用主题:")
print(f'   theme = "{THEME_NAME}"')
print("--------------------------------------------------")