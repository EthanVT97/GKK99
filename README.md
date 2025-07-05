# GKK99 Landing Page with Supabase Backend

မြန်မာ AI ချတ်ဘော့ဝန်ဆောင်မှု GKK99 အတွက် landing page နှင့် admin dashboard

## Features

### Frontend
- 🎨 Modern responsive design with Tailwind CSS
- 🌏 Myanmar language support (Unicode)
- 📱 Mobile-first responsive design
- ⚡ Fast loading with Vite
- 🔐 Admin authentication system
- 📊 Content management dashboard

### Backend (Supabase)
- 🗄️ PostgreSQL database
- 🔒 Row Level Security (RLS)
- 🔑 JWT-based authentication
- ⚡ Edge Functions for API
- 📈 Real-time capabilities

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create a `.env` file based on `.env.example`:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the migration file: `supabase/migrations/create_admin_system.sql`

This will create:
- `admin_users` table with default admin accounts
- `site_content` table with default content
- `user_sessions` table for authentication
- Proper RLS policies and indexes

### 3. Edge Functions Setup

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref your-project-ref
```

4. Deploy edge functions:
```bash
supabase functions deploy auth-admin
supabase functions deploy admin-api
```

### 4. Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

## Default Admin Accounts

After running the migration, these accounts will be available:

- **Main Admin**: `admin` / `gkk99admin2024`
- **Sub Admin 1**: `subadmin1` / `gkk99sub2024`
- **Sub Admin 2**: `subadmin2` / `gkk99sub2024`

## Project Structure

```
src/
├── components/          # React components
│   ├── AdminDashboard.tsx
│   ├── AdminLogin.tsx
│   ├── ErrorMessage.tsx
│   └── LoadingSpinner.tsx
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useContent.ts
│   ├── usePublicContent.ts
│   └── useUsers.ts
├── lib/                # Utilities
│   └── supabase.ts
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript types
│   └── index.ts
└── App.tsx             # Main app component

supabase/
├── functions/          # Edge Functions
│   ├── auth-admin/
│   └── admin-api/
└── migrations/         # Database migrations
    └── create_admin_system.sql
```

## API Endpoints

### Authentication
- `POST /auth-admin/login` - Admin login
- `GET /auth-admin/verify` - Verify token
- `POST /auth-admin/logout` - Logout

### Admin API
- `GET /admin-api/users` - Get all users (main admin only)
- `PATCH /admin-api/users/:id/status` - Update user status
- `GET /admin-api/content` - Get site content
- `PUT /admin-api/content` - Update site content

## Security Features

- Row Level Security (RLS) enabled on all tables
- JWT-based authentication with session management
- Role-based access control (main_admin vs sub_admin)
- Secure password handling
- CORS protection
- Input validation

## Deployment

### Frontend (Netlify)
```bash
npm run build
```

Deploy the `dist` folder to Netlify.

### Backend (Supabase)
Edge functions are automatically deployed to Supabase's global edge network.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

Copyright © 2024 GKK99. All rights reserved.