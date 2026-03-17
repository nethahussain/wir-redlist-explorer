# Toolforge Deployment Guide

The tool is hosted at: **https://wir-redlist-explorer.toolforge.org/**

GitHub Pages (nethahussain.github.io/wir-redlist-explorer) redirects to Toolforge.

## Initial setup (one time)

### 1. Create the tool on Toolforge

Go to https://toolsadmin.wikimedia.org/tools/create and create a tool named `wir-redlist-explorer`.

### 2. SSH and deploy

```bash
# SSH into Toolforge
ssh your-username@login.toolforge.org

# Become the tool account
become wir-redlist-explorer

# Create the static web directory
mkdir -p ~/www/static

# Download the tool from GitHub
curl -sL https://raw.githubusercontent.com/nethahussain/wir-redlist-explorer/main/tool.html -o ~/www/static/index.html

# Start the web service
webservice start
```

The tool should now be live at https://wir-redlist-explorer.toolforge.org/

## Updating

To deploy a new version after pushing changes to GitHub:

```bash
ssh your-username@login.toolforge.org
become wir-redlist-explorer
curl -sL https://raw.githubusercontent.com/nethahussain/wir-redlist-explorer/main/tool.html -o ~/www/static/index.html
```

No restart needed — static files are served immediately.

## File structure on Toolforge

```
~/www/static/
└── index.html    ← the tool (from tool.html in the GitHub repo)
```

## File structure in the GitHub repo

```
index.html     ← redirect to Toolforge (served by GitHub Pages)
tool.html      ← the actual tool (deployed to Toolforge)
```
