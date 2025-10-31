# 🌍 Blue Marble Pinpoint

Interactive web application for searching and visualizing addresses on NASA's Blue Marble satellite imagery. Built with React, TypeScript, and Leaflet.js.

![Blue Marble Pinpoint](https://via.placeholder.com/800x400/0066CC/FFFFFF?text=Blue+Marble+Pinpoint)

## ✨ Features

- 🔍 **Address Search**: Search for any address worldwide
- 📍 **Precise Pinpointing**: Drop markers on exact locations
- 🛰️ **NASA Imagery**: Beautiful Blue Marble satellite imagery from NASA GIBS
- 🗺️ **Interactive Map**: Powered by Leaflet.js with smooth animations
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎯 **Coordinate Support**: Enter coordinates directly (lat,lng format)
- ♿ **Accessible**: ARIA labels and keyboard navigation support

## 🚀 Live Demo

Visit the live application: **[https://[username].github.io/blue-marble-pinpoint](https://[username].github.io/blue-marble-pinpoint)**

## 🛠️ Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Mapping**: Leaflet.js 1.9+ with React-Leaflet
- **Geocoding**: OpenCage Data API
- **Imagery**: NASA GIBS (Global Imagery Browse Services)
- **Build Tool**: Vite
- **Deployment**: GitHub Pages

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- OpenCage API key (free tier available)
- Git

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/[username]/blue-marble-pinpoint.git
cd blue-marble-pinpoint
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Get OpenCage API Key

1. Visit [OpenCage Data](https://opencagedata.com)
2. Sign up for a free account
3. Create a new API key (free tier: 2,500 requests/day)

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenCage API key:

```env
VITE_OPENCAGE_API_KEY=your_api_key_here
```

### 5. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 📦 Building for Production

```bash
npm run build
```

The optimized build will be in the `dist` folder.

## 🚢 Deployment

### Deploy to GitHub Pages

1. Update `homepage` in `package.json`:
   ```json
   {
     "homepage": "https://[your-username].github.io/blue-marble-pinpoint"
   }
   ```

2. Update `base` in `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/blue-marble-pinpoint/'
   })
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

The application will be live at `https://[your-username].github.io/blue-marble-pinpoint`

## 📖 Usage

### Basic Search

1. Enter an address in the search bar (e.g., "Eiffel Tower, Paris")
2. Press Enter or click the search button
3. The map will fly to the location and drop a marker

### Coordinate Search

Enter coordinates in `lat,lng` format:
```
48.8584, 2.2945
```

### Examples

Try searching for:
- **Landmarks**: "Statue of Liberty", "Great Wall of China"
- **Addresses**: "1600 Pennsylvania Avenue NW, Washington, DC"
- **Cities**: "Tokyo, Japan"
- **Coordinates**: "40.7128, -74.0060" (New York City)

## 🗂️ Project Structure

```
blue-marble-pinpoint/
├── src/
│   ├── components/          # React components
│   │   ├── MapView.tsx      # Main map component
│   │   ├── SearchBar.tsx    # Search interface
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── services/            # API services
│   │   ├── geocoding.ts     # OpenCage integration
│   │   └── mapConfig.ts     # Map configuration
│   ├── types/               # TypeScript types
│   │   ├── location.ts
│   │   └── api.ts
│   ├── hooks/               # Custom React hooks
│   │   └── useGeocoding.ts
│   ├── utils/               # Utility functions
│   │   ├── validators.ts
│   │   └── formatters.ts
│   ├── styles/              # CSS files
│   │   ├── global.css
│   │   └── map.css
│   ├── App.tsx              # Root component
│   └── index.tsx            # Entry point
├── public/
├── .env.example             # Environment template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Customization

### Change Default Map View

Edit `src/services/mapConfig.ts`:

```typescript
export const DEFAULT_CENTER: LatLngExpression = [40.7128, -74.0060]; // NYC
export const DEFAULT_ZOOM = 4;
```

### Adjust Search Result Zoom

```typescript
export const SEARCH_RESULT_ZOOM = 10; // Closer zoom
```

### Modify Color Scheme

Edit CSS variables in `src/styles/global.css`:

```css
:root {
  --primary-color: #0066CC;
  --secondary-color: #00A6A6;
  /* ... */
}
```

## 🔒 API Rate Limits

**OpenCage Free Tier**:
- 2,500 requests/day
- 1 request/second
- No credit card required

**NASA GIBS**:
- No API key required
- Public WMTS service
- No rate limits

## ⚠️ Known Limitations

1. **Zoom Level**: NASA Blue Marble imagery limited to zoom level 9
2. **Rate Limits**: Free tier has 2,500 daily requests
3. **Ambiguous Addresses**: May require more specific input
4. **Tile Loading**: First load may be slow on slow connections

## 🐛 Troubleshooting

### Map Not Loading

- Check browser console for errors
- Verify API key is set correctly in `.env`
- Ensure Leaflet CSS is loaded

### Geocoding Errors

- Verify internet connection
- Check API key validity at [OpenCage Dashboard](https://opencagedata.com/dashboard)
- Ensure you haven't exceeded rate limits

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA GIBS** - Blue Marble satellite imagery
- **OpenCage** - Geocoding API
- **Leaflet.js** - Interactive mapping library
- **React** - UI framework
- **Vite** - Build tool

## 📞 Support

- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/[username]/blue-marble-pinpoint/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/[username]/blue-marble-pinpoint/discussions)

## 📊 Roadmap

- [ ] Autocomplete address suggestions
- [ ] Reverse geocoding (click map to get address)
- [ ] Save multiple pins
- [ ] Export pins to JSON/CSV
- [ ] CSV batch import
- [ ] Dark mode
- [ ] Share location URLs
- [ ] Offline map caching

---

**Made with ❤️ using React, TypeScript, and NASA satellite imagery**
