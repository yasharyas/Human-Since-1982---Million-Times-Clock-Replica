# A Million Times - Clock Animation

This is a web based implementation of the **[A Million Times](https://www.humanssince1982.com/en-int)** clock animation project. Inspired by the original art installation by Humans Since 1982, this version runs a grid of animated clocks using WebGL and canvas to simulate beautiful formations, numbers, and transitions.

## ✨ Features

- Grid of animated clocks (configurable rows & columns)
- Dynamic transitions and formations (time, waves, magnet, lines)
- Customizable visual styles and debug options
- WebGL-based renderer
- Lightweight and fast

## 🚀 Demo


**[Project Demo](https://yasharyas.github.io/Human-Since-1982---Million-Times-Clock-Replica/)**

![Demo](https://drive.google.com/uc?export=view&id=1QuCSisvW5GHCj4Gsd3KmUSo1WdVBi1AO)

  
Runs locally at: `http://localhost:8080/`

## 📦 Installation

Clone the repository or copy the files into your project directory.

```bash
git clone https://github.com/yasharyas/a-million-times-clone.git
cd a-million-times-clone
npm install
```

If you're using Yarn:

```bash
yarn install
```

## 🛠 Usage

To start the development server:

```bash
npm start
```

This will:
- Launch the Webpack dev server
- Compile the code and serve it from `http://localhost:8080`
- Watch for changes and live-reload the app

## 🧩 Project Structure

```plaintext
.
├── src/
│   ├── formations/          # Clock formations (Time, Magnet, Lines, etc.)
│   ├── runners/             # Animation runners (Noise, MoveTo, StopAt, etc.)
│   ├── util/                # Utility functions (Velocities, helpers)
│   ├── renderer/            # Renderer setup (Canvas/WebGL)
│   ├── createApp.js         # Main app logic
│   └── main.js              # Entry point
├── index.html
├── webpack.config.js
└── package.json
```

## 🧪 Customization

You can modify grid size, color themes, or formations in `main.js`:

```js
const columns = 24;
const rows = 12;
```

Or change the order of animations:

```js
const runners = [
    createDelay(2000),
    createSimplexNoise(columns, rows),
    createStopAtFormation(createMagnet(columns, rows)),
    ...
];
```

## 🧠 Credits

- Original concept by [Humans Since 1982](https://www.humanssince1982.com/)


## 📄 License

MIT — feel free to use, fork, and modify.




