# VocabLog 📚

A beautiful, modern vocabulary learning application built with React, TypeScript, and Supabase. VocabLog helps users discover, save, and practice new words with an intuitive interface and powerful features.

![VocabLog Screenshot](https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

### 🔍 **Word Discovery**
- Look up word definitions using a free dictionary API
- Get comprehensive information including:
  - Multiple definitions and parts of speech
  - Example sentences
  - Synonyms and antonyms
  - Pronunciation guides

### 📖 **Personal Vocabulary**
- Save unlimited words to your personal collection
- Organize words with detailed information
- Track when words were added
- Delete words you no longer need

### 🎯 **Interactive Learning**
- **Flashcard Practice**: Test your knowledge with interactive flashcards
- **Shuffle Mode**: Randomize word order for better learning
- **Progress Tracking**: See correct/incorrect answers in real-time
- **Smart Examples**: Kid-friendly example sentences for better understanding

### 👤 **User Management**
- Secure email/password authentication
- Personal user accounts with data isolation
- Email confirmation for new accounts
- Secure sign-out functionality

### 💎 **Premium Features**
- **Free Tier**: Up to 50 words, basic flashcards
- **Premium Tier** (£2.99 one-time): 
  - Unlimited word storage
  - Advanced flashcard modes
  - Progress tracking and analytics
  - Export vocabulary lists
  - Priority support

### 🔒 **Security & Privacy**
- Row Level Security (RLS) for data protection
- JWT-based authentication
- Secure payment processing with Stripe
- GDPR-compliant data handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Stripe account (for payments)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd vocablog
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup
The database schema includes:
- `words` - User vocabulary storage
- `stripe_customers` - Stripe customer mapping
- `stripe_subscriptions` - Subscription management
- `stripe_orders` - One-time purchase tracking

All tables have Row Level Security enabled for data protection.

### 4. Stripe Configuration
Update `src/stripe-config.ts` with your Stripe price IDs:
```typescript
export const stripeProducts: StripeProduct[] = [
  {
    id: 'your_product_id',
    priceId: 'your_stripe_price_id',
    name: 'VocabLog Premium',
    description: 'Unlock premium features',
    mode: 'payment',
    price: '£2.99'
  }
]
```

### 5. Edge Functions Setup
The app includes two Supabase Edge Functions:
- `stripe-checkout` - Creates Stripe checkout sessions
- `stripe-webhook` - Processes Stripe webhook events

Set these environment variables in your Supabase dashboard:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 6. Run the Application
```bash
npm run dev
```

Visit `http://localhost:5173` to see your application!

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

### Backend Stack
- **Supabase** for database and authentication
- **PostgreSQL** with Row Level Security
- **Supabase Edge Functions** for serverless API endpoints

### Payment Processing
- **Stripe** for secure payment processing
- **Webhook verification** for security
- **One-time payments** for premium features

### Key Components
```
src/
├── components/
│   ├── Auth.tsx              # Authentication forms
│   ├── Header.tsx            # Navigation header
│   ├── WordLookup.tsx        # Dictionary search
│   ├── WordList.tsx          # Vocabulary display
│   ├── Flashcards.tsx        # Learning interface
│   ├── PricingSection.tsx    # Premium upgrade
│   ├── SuccessPage.tsx       # Payment success
│   └── UserSubscriptionStatus.tsx
├── services/
│   ├── dictionaryService.ts  # External API integration
│   └── stripeService.ts      # Payment processing
├── lib/
│   └── supabase.ts          # Database client
└── types/
    └── index.ts             # TypeScript definitions
```

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Quality
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Strict mode** enabled

### Database Migrations
Database schema changes are managed through Supabase migrations in the `supabase/migrations/` directory.

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradient (`from-purple-600 to-teal-500`)
- **Success**: Green (`green-500`)
- **Error**: Red (`red-500`)
- **Neutral**: Gray scale

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Mobile-first approach

### Components
- **Rounded corners**: Consistent 8px-16px border radius
- **Shadows**: Subtle elevation with `shadow-lg`
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-optimized layouts

## 🔐 Security

### Authentication
- Email/password authentication via Supabase Auth
- JWT tokens for API authentication
- Email confirmation for new accounts
- Secure session management

### Data Protection
- Row Level Security (RLS) on all tables
- User data isolation
- Secure API endpoints
- HTTPS enforcement

### Payment Security
- PCI-compliant payment processing
- Webhook signature verification
- Secure customer data handling
- No sensitive data storage

## 📱 Responsive Design

VocabLog is fully responsive and optimized for:
- **Mobile phones** (320px+)
- **Tablets** (768px+)
- **Desktop** (1024px+)
- **Large screens** (1440px+)

## 🚀 Deployment

### Frontend Deployment
The app can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- Supabase Hosting

### Backend Services
- **Database**: Supabase (managed PostgreSQL)
- **Authentication**: Supabase Auth
- **Edge Functions**: Supabase Functions
- **File Storage**: Supabase Storage (if needed)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write descriptive commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Email**: Contact support@vocablog.com for premium support

## 🙏 Acknowledgments

- [Dictionary API](https://dictionaryapi.dev/) for word definitions
- [Supabase](https://supabase.com/) for backend infrastructure
- [Stripe](https://stripe.com/) for payment processing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for beautiful icons

---

**Built with ❤️ for language learners everywhere**