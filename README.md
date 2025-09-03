# Tusitala - Content Creator Platform

A comprehensive content creation and marketing management platform built with Next.js, TypeScript, and PostgreSQL. Manage your content strategy across multiple channels with a professional, shadcn/ui-powered interface.

## ✨ Features

### **Content Management**
- 📝 Rich content editor with toolbar
- 📅 Post scheduling system
- 🏷️ Campaign organization
- 📊 Multi-channel publishing
- 💾 Draft auto-save

### **Dashboard & Analytics**
- 📈 Real-time stats and metrics
- 🔥 Recent activity feed  
- 🎯 Quick action buttons
- 📋 Campaign overview

### **Channel Integration** 
- 🐦 Twitter/X support
- 💼 LinkedIn publishing
- 📷 Instagram posts
- 📧 Email campaigns
- 🌐 Blog publishing
- 🎵 TikTok integration

### **User Experience**
- 📱 Mobile-responsive design
- 🎨 Professional shadcn/ui components
- 🔐 User authentication (mock)
- 👤 Role-based access control
- 🌙 Dark/light mode support

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **UI Components:** shadcn/ui with Lucide icons
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** CSS Variables design system
- **Icons:** Lucide React

## 📁 Project Structure

```
tusitala/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   └── dashboard/
│   │   │       ├── page.tsx          # Dashboard overview
│   │   │       ├── posts/
│   │   │       │   ├── page.tsx      # Posts list
│   │   │       │   └── new/page.tsx  # Post editor
│   │   │       ├── campaigns/page.tsx
│   │   │       └── channels/page.tsx
│   │   ├── api/
│   │   │   ├── posts/route.ts        # Posts API
│   │   │   ├── campaigns/route.ts    # Campaigns API
│   │   │   └── dashboard/route.ts    # Dashboard stats
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   │   └── button.tsx           # Base UI components
│   │   ├── app-sidebar.tsx          # Main navigation
│   │   ├── sidebar-shell.tsx        # Layout wrapper
│   │   ├── content-editor.tsx       # Rich text editor
│   │   ├── user-nav.tsx            # User menu
│   │   └── mobile-nav.tsx          # Mobile navigation
│   └── lib/
│       ├── prisma.ts               # Database client
│       ├── auth.ts                 # Authentication
│       └── utils.ts                # Utility functions
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── seed.ts                     # Sample data
└── components.json                 # shadcn/ui config
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### **Installation**

1. **Clone and setup:**
```bash
cd tusitala
npm install
```

2. **Database setup:**
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your PostgreSQL connection string
# DATABASE_URL="postgresql://user:password@localhost:5432/tusitala"

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed sample data (optional)
npm run db:seed
```

3. **Start development server:**
```bash
npm run dev
```

4. **Visit the app:**
Open [http://localhost:3000](http://localhost:3000)

### **Production Setup**

```bash
npm run build
npm start
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed sample data
- `npx prisma studio` - Database GUI

## 🎯 Usage Examples

### **Creating a Post**
1. Navigate to Dashboard → Posts
2. Click "New Post" 
3. Write content in the rich editor
4. Select channels to publish
5. Save as draft or publish immediately

### **Managing Campaigns**
1. Go to Dashboard → Campaigns
2. Create campaign with objectives and timeline
3. Associate posts with campaigns
4. Track campaign performance

### **Channel Setup**
1. Visit Dashboard → Channels
2. Connect your social media accounts
3. Configure publishing settings
4. Test connections

## 🔧 Configuration

### **shadcn/ui Customization**
Edit `components.json` to customize the design system:

```json
{
  "style": "default",
  "rsc": true,
  "tailwind": {
    "baseColor": "slate",
    "cssVariables": true
  }
}
```

### **Database Schema**
The Prisma schema includes:
- **Users** with role-based access
- **Posts** with rich content and status tracking  
- **Campaigns** for organized marketing
- **Channels** for multi-platform publishing
- **Relationships** for complex workflows

## 🚧 Roadmap

### **Next Features to Implement**
- [ ] Real authentication (NextAuth.js)
- [ ] Social media API integrations
- [ ] Advanced analytics dashboard
- [ ] Content scheduling queue
- [ ] Team collaboration features
- [ ] Content templates
- [ ] AI writing assistance
- [ ] Performance tracking
- [ ] Advanced rich text editor
- [ ] File upload and media management

### **API Integrations**
- [ ] Twitter API v2
- [ ] LinkedIn Publishing API
- [ ] Instagram Graph API
- [ ] Facebook Pages API
- [ ] Email service providers (SendGrid, Mailchimp)

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Tusitala** - *Samoan word meaning "writer of stories"*
