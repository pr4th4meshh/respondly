# Respondly

Respondly is a modern, AI-powered customer support chatbot built with Next.js 13, Typescript, and MongoDB with Mongoose. It provides an intuitive interface for users to get answers to their questions, and receive support for various topics.

## Features

- **AI-Powered Chatbot [Coming soon]**: Utilizes OpenAI's GPT-3.5 model to provide intelligent and context-aware responses.
- **Mobile Responsive**: Fully responsive design that works well on desktop and mobile devices.
- **Dark Mode**: Supports both light and dark themes for user preference.
- **Loading States**: Provides visual feedback during API calls with loading indicators.
- **Error Handling**: Gracefully handles and displays errors to users.
- **Environment Variable Configuration**: Secure configuration using environment variables.

## Tech Stack

- Next.js 13
- TypeScript
- Tailwind CSS
- MongoDB
- Mongoose
- NextAuth
- OpenAI API [**Coming Soon**]
- Vercel Deployment

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- OpenAI API key [**Coming Soon**]

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pr4th4meshh/respondly.git
   cd respondly
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   NEXT_PUBLIC_MONGODB_URI=your_api_key_here
   ```
      ```
   NEXTAUTH_URL=your_api_key_here
   ```
      ```
   NEXTAUTH_SECRET=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Type your question or message in the input field at the bottom of the chat interface.
2. Press Enter or click the Send button to submit your message.
3. The AI will process your input and provide a response, which will be displayed in the chat.
4. Continue the conversation as needed.

## Deployment

This project is ready to be deployed on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy your application.

Make sure to set the `OPENAI_API_KEY` environment variable in your Vercel project settings.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- OpenAI for providing the GPT-3.5 model
- Vercel for the Next.js framework
- The open-source community for various libraries and tools used in this project