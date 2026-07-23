# DermAware - Frontend

React web application for classifying skin lesions using AI models.

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm start
```

Frontend runs at `http://localhost:3000`

## Configuration

### .env File
```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

Set `REACT_APP_API_URL` to your backend server address.

## Components

### App.jsx
Main application component handling:
- Model selection
- Image upload
- Prediction requests
- Results display

### ImageUpload.jsx
Image upload interface featuring:
- Drag-and-drop upload
- Click-to-browse fallback
- File validation (type, size)
- Upload requirements display
- Preview thumbnail

### ModelSelector.jsx
Model selection interface for:
- Choosing between HAM10000 and DDI models
- Displaying model information
- Dataset details

### PredictionResult.jsx
Results display showing:
- Classification (Benign/Malignant)
- Confidence score with progress bar
- Detailed predictions for each class
- Medical disclaimer
- Reset button for new predictions

## Features

 **Supported Formats**
- JPEG/JPG
- PNG
- GIF
- WebP

 **Image Requirements**
- Maximum: 4.5MB
- Clear, well-lit dermoscopy image preferred

 **User Experience**
- Drag-and-drop upload
- Real-time file validation
- Loading spinner during prediction
- Color-coded results (green=benign, red=malignant)
- Responsive design (mobile-friendly)
- Professional medical UI

## Styling

Components use CSS modules for scoped styling:
- `App.css` - Main app layout
- `components/*.css` - Component-specific styles
- `index.css` - Global styles

### Color Scheme
- Primary: `#667eea` to `#764ba2` (gradient)
- Success: `#51cf66` (benign)
- Error: `#ff6b6b` (malignant)
- Background: `#f9f9f9`

### Responsive Design
- Breakpoint: 768px (tablet)
- Desktop: 2-column layout
- Mobile: 1-column layout

## API Integration

The app communicates with the FastAPI backend:

### Endpoints Used

**GET /api/models**
```javascript
// Fetch available models on app load
const response = await axios.get(`${API_URL}/models`);
```

**POST /api/predict**
```javascript
// Upload image and get prediction
const formData = new FormData();
formData.append('file', imageFile);
formData.append('model', selectedModel);
const response = await axios.post(`${API_URL}/predict`, formData);
```

## Development

### Project Structure
```
src/
├── App.jsx              # Main app
├── App.css              # App styles
├── index.js             # Entry point
├── index.css            # Global styles
└── components/
    ├── ImageUpload.jsx
    ├── ImageUpload.css
    ├── ModelSelector.jsx
    ├── ModelSelector.css
    ├── PredictionResult.jsx
    └── PredictionResult.css
```

### Building for Production
```bash
npm run build
```

Creates optimized build in `build/` directory.

### Running Tests
```bash
npm test
```

## Troubleshooting

**Cannot connect to backend**
```
Check REACT_APP_API_URL in .env
Verify backend is running: http://localhost:8000/api/health
```

**CORS errors in console**
```
Backend CORS_ORIGINS may need updating
Add frontend URL to backend .env CORS_ORIGINS
```

**Image upload fails**
```
- Check file format (JPEG, PNG, GIF, WebP)
- Verify file size < 5MB
- Try different image
- Check browser console (F12) for details
```

**Slow predictions**
```
- First request loads model (~10-30s)
- Subsequent requests are faster (~200-800ms)
- Check system RAM (4GB+ recommended)
```

## Performance Optimization

- Lazy loading of predictions
- CSS animations use GPU acceleration
- Image preview optimization
- Efficient re-renders with React hooks

## Accessibility

 **WCAG 2.1 AA Compliance**
- Semantic HTML
- ARIA labels on inputs
- Keyboard navigation support
- Color contrast ratios > 4.5:1
- Focus indicators

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

### Core
- `react@18.2.0` - UI library
- `react-dom@18.2.0` - DOM rendering
- `axios@1.5.0` - HTTP client

### Development
- `react-scripts@5.0.1` - Build tools

## Environment Variables

### Development
```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

### Production
```
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENV=production
```

## License

Educational use only.

## Support

Check browser developer tools (F12):
- Console for error messages
- Network tab for API requests
- Application tab for environment variables

## References

- React Documentation: https://react.dev
- Axios Documentation: https://axios-http.com
- MDN Web Docs: https://developer.mozilla.org

---

Built with  for dermatology education and research.
