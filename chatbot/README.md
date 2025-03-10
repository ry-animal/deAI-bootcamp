# AI Chatbot with Next.js and OpenAI

This is a simple chatbot application built with Next.js that uses OpenAI's API to generate responses.

## Features

- Clean, modern UI with responsive design
- Real-time chat interface
- Integration with OpenAI's API
- Loading states and error handling
- Automatic scrolling to new messages
- Dark/light mode support
- Automated CI/CD deployment

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- An OpenAI API key (get one at [OpenAI's website](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the `.env.local` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

1. The frontend sends user messages to the `/api/chat` Next.js API route
2. The API route validates the request and forwards it to OpenAI
3. OpenAI generates a response, which is sent back to the frontend
4. The frontend displays the response in the chat interface

## Customization

You can customize the OpenAI model and parameters in the `app/api/chat/route.ts` file:

```typescript
// Change the model
model: 'gpt-3.5-turbo', // or 'gpt-4', etc.

// Adjust temperature for more/less randomness
temperature: 0.7,
```

## Continuous Integration/Deployment

This project uses GitHub Actions for automated CI/CD:

- **Trigger**: Any push to the `main` branch
- **Process**:
  1. Checkout code
  2. Setup Node.js
  3. Install dependencies
  4. Build the application
  5. Deploy to Vercel

### Secrets Required for Deployment

To enable automatic deployment, add these secrets to your GitHub repository:

- `OPENAI_API_KEY`: Your OpenAI API key for the build process
- `VERCEL_TOKEN`: Your Vercel authentication token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

You can get your Vercel credentials by running:

```bash
vercel login
vercel link
```

### Manual Deployment

You can also trigger the deployment workflow manually from the "Actions" tab in your GitHub repository.

## License

This project is MIT licensed.
