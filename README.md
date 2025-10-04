# Surf & Turf Coffee - Location Website

A beautiful, mobile-responsive website for Surf & Turf Coffee that displays the coffee shop name and an interactive map showing the location.

## Features

- **Modern Design**: Clean, attractive UI with gradient backgrounds and smooth animations
- **Interactive Map**: Uses OpenStreetMap with Leaflet for reliable, free mapping
- **Mobile Responsive**: Optimized for QR code access on mobile devices
- **Location Services**: Click-to-get-directions functionality
- **Fast Loading**: Lightweight and optimized for quick access

## Files

- `index.html` - Main HTML structure
- `styles.css` - Modern CSS styling with responsive design
- `script.js` - JavaScript for map integration and interactivity

## Setup Instructions

### 1. Update Location Coordinates

Edit the `script.js` file and update the `coffeeShopLocation` object with your actual coordinates:

```javascript
const coffeeShopLocation = {
    lat: YOUR_LATITUDE,     // Replace with your actual latitude
    lng: YOUR_LONGITUDE,    // Replace with your actual longitude
    name: "Surf & Turf Coffee",
    address: "YOUR_ACTUAL_ADDRESS"
};
```

### 2. Host the Website

You can host this website using any of these free options:

#### Option A: GitHub Pages (Recommended)
1. Create a GitHub repository
2. Upload all files to the repository
3. Go to Settings > Pages
4. Select "Deploy from a branch" and choose "main"
5. Your site will be available at `https://yourusername.github.io/repository-name`

#### Option B: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Get your free URL

#### Option C: Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your project
3. Deploy with one click

### 3. Generate QR Code

Once your website is live:

1. Copy your website URL
2. Use any QR code generator:
   - [QR Code Generator](https://www.qr-code-generator.com/)
   - [QRCode Monkey](https://www.qrcode-monkey.com/)
   - Google "QR code generator"

3. Paste your URL and generate the QR code
4. Download and print the QR code for your coffee shop

## Customization

### Colors
The website uses a purple gradient theme. To change colors, edit the CSS variables in `styles.css`:
- Primary gradient: `#667eea` to `#764ba2`
- Text color: `#2c3e50`
- Accent color: `#7f8c8d`

### Content
- Update the coffee shop name in `index.html`
- Modify the address and hours in the HTML
- Change the tagline "Where Ocean Meets Caffeine"

### Map Style
The map uses OpenStreetMap tiles. You can change to different tile providers by modifying the tile layer URL in `script.js`.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Free to use and modify for your coffee shop needs!

