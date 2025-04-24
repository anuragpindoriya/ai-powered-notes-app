# ✨ AI-Powered Notes App

A modern note-taking application with AI-powered summarization capabilities. Built with Next.js, Supabase, and Hugging
Face.

## 🚀 Features

### 1. 🔐 Authentication

- Secure login and signup system
- Google OAuth integration
- Protected routes for authenticated users
- Session management with Supabase Auth

### 2. 📝 Note Management

- Create, edit, and delete notes
- Real-time updates
- Clean and intuitive interface
- Responsive design for all devices

### 3. 🤖 AI-Powered Summarization

- Summarize long notes with a single click
- Powered by Hugging Face's BART model
- Fast and accurate results
- Preserves key information

## 🛠️ Setup Guide

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm package manager
- Git
- Google Cloud Console account
- Supabase account
- Hugging Face account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/anuragpindoriya/ai-powered-notes-app.git
cd ai-powered-notes-app
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file:

```bash
cp .env.example .env
```

### 🔑 Environment Setup

#### 1. Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once created, go to Project Settings > API
3. Copy the following values:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Create the notes table:

```sql
-- Create notes table
CREATE TABLE notes
(
    id         UUID                     DEFAULT gen_random_uuid() PRIMARY KEY,
    title      TEXT                                                          NOT NULL,
    content    TEXT                                                          NOT NULL,
    user_id    UUID REFERENCES auth.users (id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


```

#### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add authorized JavaScript origins:
   ```plaintext
   # Development
   http://localhost:3000
   
   # Production
   https://your-production-domain.com
   https://your-supabase-project.supabase.co
   ```

7. Add authorized redirect URIs:
   ```plaintext
   # Development
   http://localhost:3000/auth/callback
   http://localhost:3000/api/auth/callback
   https://your-supabase-project.supabase.co/auth/v1/callback
   
   # Production
   https://your-production-domain.com/auth/callback
   https://your-production-domain.com/api/auth/callback
   https://your-supabase-project.supabase.co/auth/v1/callback
   ```

8. Copy the Client ID and Client Secret

9. In Google console:
    - Go to Authentication > Providers
    - Enable Google provider
    - Paste the Client ID and Client Secret
    - Add the following redirect URLs:
      ```plaintext
      # Development
      http://localhost:3000/auth/callback
      http://localhost:3000/api/auth/callback
      
      # Production
      https://your-production-domain.com/auth/callback
      https://your-production-domain.com/api/auth/callback
      ```
    - Save the changes

10. Get your Supabase Project URL:
    - Go to your Supabase project dashboard
    - Click on "Project Settings" in the sidebar
    - Under "API", you'll find your Project URL
    - It should look like: `https://[project-ref].supabase.co`

#### 3. Hugging Face Setup

1. Create an account at [Hugging Face](https://huggingface.co)
2. Go to Settings > Access Tokens
3. Create a new token with read access
4. Copy the token

#### 4. Environment Variables

Add the following to your `.env` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Hugging Face
NEXT_PUBLIC_HUGGINGFACE_API_KEY=your_huggingface_api_key
```

## 🎯 Getting Started

1. Start the development server:

```bash
pnpm dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Create an account or log in with Google to get started

## 📱 Usage Guide

### Creating Notes

1. Click the "Add Note" button in the header
2. Enter a title and content
3. Click "Add Note" to save

### Editing Notes

1. Click the "Edit" button on any note
2. Modify the title or content
3. Click "Update Note" to save changes

### Summarizing Notes

1. Open a note for editing
2. Click the "Summarize" button
3. Wait for the AI to process your content
4. The content will be replaced with a concise summary

### Deleting Notes

1. Click the "Delete" button on any note
2. Confirm the deletion in the popup dialog

## 🛡️ Security Features

- End-to-end encryption for note content
- Secure authentication with Supabase and Google OAuth
- Protected API routes
- Rate limiting for AI summarization
- Input validation and sanitization
- Row Level Security (RLS) for database access

## 🧩 Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase
- **Authentication**: Supabase Auth, Google OAuth
- **AI**: Hugging Face BART model
- **Deployment**: Vercel (recommended)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) for the amazing framework
- [Supabase](https://supabase.com) for the backend services
- [Hugging Face](https://huggingface.co) for the AI models
- [shadcn/ui](https://ui.shadcn.com) for the beautiful components
- [Google](https://cloud.google.com) for OAuth services

---

Made with ❤️ by AN-UNKNOWN
