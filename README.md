# Figma MCP Server for Antigravity (Flutter)

This is a Node.js based Model Context Protocol (MCP) server that connects Antigravity to Figma. It enables Antigravity to fetch direct design data from Figma, ensuring 100% accurate Flutter code generation.

## 🚀 How to Setup

Follow these steps to get the MCP server running on your local machine:

### 1. Prerequisites (Pre-installed)

Before cloning, ensure you have **Node.js (v18 or higher)** installed on your operating system:

#### **🪟 Windows**
- Download and run the installer from [nodejs.org](https://nodejs.org/).
- Alternatively, using PowerShell (Chocolatey): `choco install nodejs`

#### **🍎 macOS**
- Using Homebrew: `brew install node`
- Or download the `.pkg` installer from [nodejs.org](https://nodejs.org/).

#### **🐧 Linux**

- **Ubuntu / Debian / Kali:**
  ```bash
  sudo apt update
  sudo apt install nodejs npm
  ```

- **Fedora / CentOS / RHEL:**
  ```bash
  sudo dnf install nodejs npm
  ```

- **Arch Linux / Manjaro:**
  ```bash
  sudo pacman -S nodejs npm
  ```

- **Universal (Recommended) - NVM:**
  If you want to manage multiple versions easily on any Linux:
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  nvm install 20
  ```

### 2. Clone the Repository
```bash
git clone <your-repository-url>
cd antigravity_figma
```

### 2. Install Dependencies
Make sure you have [Node.js](https://nodejs.org/) installed, then run:
```bash
npm install
```

### 3. Configure Environment (.env)
You need a **Figma Personal Access Token** to fetch design data.
1.  Go to your Figma **Account Settings**.
2.  Find the **Personal access tokens** section.
3.  Generate a new token (e.g., "Antigravity-MCP").
4.  Copy the [.env.example](file:///home/shawon/storage/ai_agent_rules/antigravity_figma/.env.example) to `.env`:
    ```bash
    cp .env.example .env
    ```
5.  Open the [.env](file:///home/shawon/storage/ai_agent_rules/antigravity_figma/.env) file and paste your token:
    ```env
    FIGMA_TOKEN=figd_your_actual_token_here
    PORT=3845
    ```

### 4. Start the Server
```bash
npm start
```
The server will start at `http://localhost:3845/sse`.

---

## 🛠 MCP Tools for Antigravity

- **`get_figma_design`**: Fetches JSON design data. Use this when you want Antigravity to write Flutter code from a Figma URL.
- **`get_figma_image_url`**: Fetches high-quality PNG exports of design nodes.
- **`ping`**: Quickly check if Antigravity is successfully connected to the MCP server.

## 💡 Flutter UI Autocomplete
Once connected, you can simply tell Antigravity:
> "Look at this figma URL [URL] and implement the UI in Flutter."

Antigravity will use this MCP to pull the exact colors, dimensions, and hierarchy to generate production-ready Flutter code.
