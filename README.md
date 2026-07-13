# JEE CBT Simulator

A comprehensive Computer-Based Test (CBT) simulator for JEE Main examinations built with React, TypeScript, and Tailwind CSS.

## Features

### 📋 Exam Management
- Create or import mock tests from JSON
- Support for Physics, Chemistry, and Mathematics subjects
- Flexible question types: Multiple Choice (MCQ) and Numerical
- Customizable marks and negative marking

### ⏱️ Exam Engine
- Real-time countdown timer (150 minutes)
- Auto-save functionality every 30 seconds
- Question navigation with previous/next buttons
- Subject-wise question filtering
- Question palette with visual status indicators
  - ✓ Answered (Green)
  - ✗ Not Answered (Red)
  - ! Marked for Review (Yellow)
  - V Visited (Blue)

### 📊 Results & Analytics
- Detailed score analysis
- Subject-wise performance breakdown
- Accuracy calculations
- Answer review and explanations
- Visual charts and statistics

### 🎨 UI/UX
- Dark mode support
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Accessible components
- Clean and modern interface

### 💾 Data Persistence
- Local storage for exams and attempts
- Auto-save during exam
- Attempt history tracking
- Result persistence

## Project Structure

```
src/
├── components/
│   ├── exam/              # Exam engine components
│   │   ├── Timer.tsx
│   │   ├── QuestionDisplay.tsx
│   │   ├── QuestionPalette.tsx
│   │   ├── SubjectSwitcher.tsx
│   │   └── index.ts
│   ├── layout/            # Layout components
│   │   ├── Layout.tsx
│   │   └── index.ts
│   └── ui/                # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Alert.tsx
│       ├── ProgressBar.tsx
│       ├── Tabs.tsx
│       ├── Input.tsx
│       └── index.ts
├── pages/
│   ├── DashboardPage.tsx  # Dashboard with stats
│   ├── ExamsPage.tsx      # Exam listing and creation
│   ├── ExamPage.tsx       # Main exam interface
│   ├── ResultsPage.tsx    # Results and analytics
│   └── index.ts
├── store/                 # Zustand store
│   └── index.ts
├── hooks/                 # Custom React hooks
│   └── index.ts
├── utils/                 # Utility functions
│   └── index.ts
├── types/                 # TypeScript types
│   └── index.ts
├── App.tsx                # Main app component with routing
└── index.tsx              # Entry point
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/jee-cbt-simulator.git
cd jee-cbt-simulator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build

```bash
npm run build
```

## Usage

### Creating a Mock Test

1. Navigate to the Exams page
2. Click "New Exam"
3. Choose to create a sample exam or import from JSON
4. For JSON import, provide exam data in this format:

```json
{
  "name": "JEE Main Mock Test #1",
  "description": "Full length mock test",
  "duration": 150,
  "totalMarks": 300,
  "questions": [
    {
      "id": "q1",
      "subject": "PHYSICS",
      "question": "What is the SI unit of force?",
      "type": "MCQ",
      "marks": 4,
      "negativeMarks": 1,
      "options": [
        { "id": "a", "text": "Newton" },
        { "id": "b", "text": "Joule" },
        { "id": "c", "text": "Pascal" },
        { "id": "d", "text": "Watt" }
      ],
      "correctAnswer": "a",
      "explanation": "The SI unit of force is Newton (N)"
    }
  ]
}
```

### Taking an Exam

1. Go to Exams page
2. Select an exam and click "Start Exam"
3. Navigate through questions using:
   - Previous/Next buttons
   - Question palette on the right
   - Subject switcher
4. Mark questions for review if needed
5. Clear responses if you want to change answers
6. Click "Review and Submit" to submit the exam

### Viewing Results

1. After submitting an exam, you'll be redirected to the results page
2. View overall score and accuracy
3. Analyze subject-wise performance
4. Review detailed statistics and charts

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **Recharts** - Charts and analytics
- **Lucide Icons** - Icons
- **Vite** - Build tool

## Features Roadmap

- [ ] Backend API integration
- [ ] User authentication
- [ ] Question bank database
- [ ] Advanced analytics and reports
- [ ] Practice mode with hints
- [ ] Discussion forum
- [ ] Mobile app
- [ ] Video explanations
- [ ] Performance tracking
- [ ] Leaderboards

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@jee-cbt.com or open an issue in the repository.

## Acknowledgments

- JEE Main exam pattern and guidelines
- React and open-source community
- All contributors and testers

---

**Made with ❤️ for JEE aspirants**
