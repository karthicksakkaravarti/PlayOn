# PlayOn

PlayOn is a React Native mobile application that allows users to discover, book, and participate in sports activities and games.

## Features

- **Phone Authentication**: Secure user authentication using Firebase phone authentication
- **User Profiles**: User profile management and customization
- **Modern UI**: Clean and intuitive interface with consistent theming

## Getting Started

### Prerequisites

- Node.js (v16.13.2 or newer recommended)
- npm or yarn
- React Native development environment set up
- Firebase project with phone authentication enabled

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/PlayOn.git
cd PlayOn
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Update the Firebase configuration values with your Firebase project details
   ```bash
   cp .env.example .env
   ```

4. Configure Firebase
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Phone Authentication in the Authentication section
   - Add test phone numbers in the Firebase console if you're using the Firebase emulator
   - Copy the Firebase configuration details to your `.env` file

5. Start the development server
```bash
npm start
# or
yarn start
```

6. Run the app on a device or emulator
```bash
# Android
npm run android
# or
yarn android

# iOS
npm run ios
# or
yarn ios
```

## Firebase Authentication Setup

1. **Create a Firebase Project**:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard

2. **Enable Phone Authentication**:
   - In your Firebase project, go to "Authentication" section
   - Click on "Sign-in method" and enable "Phone"

3. **Add Test Phone Numbers** (For Development):
   - In the Firebase Authentication section, go to "Phone" sign-in method
   - Scroll down to "Phone numbers for testing" and add your test numbers

4. **Get Firebase Configuration**:
   - In your Firebase project settings, find the Firebase SDK configuration
   - Copy these values to your `.env` file

5. **Configure reCAPTCHA Verification**:
   - For Android: Add your SHA-1 and SHA-256 certificates in the Firebase project settings
   - For iOS: No additional setup required for development

## Known Issues

### Firebase reCAPTCHA Warning

You may see the following warning in the console:
```
Error: FirebaseRecaptcha: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead
```

This warning is related to the `expo-firebase-recaptcha` package and will be fixed in future releases. The warning doesn't affect functionality and can be safely ignored for now. Our implementation has been updated to mitigate this warning as much as possible.

## Project Structure

```
src/
├── assets/         # Images, fonts, and other static assets
├── components/     # Reusable UI components
├── constants/      # Theme, configuration constants
├── context/        # Context providers (Auth, etc.)
├── hooks/          # Custom React hooks
├── navigation/     # Navigation configuration
├── screens/        # App screens
├── services/       # Firebase and other external services
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 