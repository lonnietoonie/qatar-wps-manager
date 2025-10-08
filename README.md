# Qatar WPS Manager

> A privacy-first, browser-based tool for managing Qatar WPS (Wage Protection System) payroll files

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://lovable.dev/projects/50952490-6762-4193-aced-98205f4c0293)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 📋 Overview

Qatar WPS Manager is a free, open-source web application designed to simplify the creation and management of WPS (Wage Protection System) SIF (Standard Interchange Format) files for Qatar-based employers. All data processing happens entirely in your browser - nothing is sent to any server, ensuring complete privacy and security.

**Key Highlight**: 🔒 **100% Privacy** - All your employee and payroll data stays on your device. No data is ever transmitted to external servers.

## ✨ Key Features

- 🔐 **Complete Privacy**: All data stays in your browser's local storage
- 📊 **Employee Management**: Add, edit, and manage employee records with ease
- 💰 **Flexible Payroll**: Support for allowances, deductions, extra hours, and various payment types
- 📄 **SIF File Generation**: Generate Qatar WPS-compliant SIF CSV files instantly
- 📥 **Import/Export**: Import existing SIF files and export your data
- 🌓 **Dark Mode**: Built-in dark mode support for comfortable viewing
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🚀 **No Installation Required**: Access instantly via your web browser

## 🚀 Quick Start

### Option 1: Use the Hosted Version (Recommended)

Simply visit the live application:
**[https://lovable.dev/projects/50952490-6762-4193-aced-98205f4c0293](https://lovable.dev/projects/50952490-6762-4193-aced-98205f4c0293)**

No installation, no setup - just start managing your WPS files immediately!

### Option 2: Self-Hosting

#### Prerequisites
- Node.js (v18 or higher)
- npm or bun package manager

#### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/qatar-wps-manager.git

# Navigate to the project directory
cd qatar-wps-manager

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

#### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 💼 How It Works

### 1. **Configure Employer Settings** (Start Page)
- Enter your company's WPS registration details
- Set your bank information and IBAN
- Configure SIF version and employer ID

### 2. **Manage Employees** (People Page)
- Add employees with their personal and banking details
- Set salary frequency (Monthly/Bi-weekly)
- Configure allowances (housing, food, transportation, etc.)
- Manage deductions with proper reason codes

### 3. **Generate WPS Files** (WPS Page)
- Select payroll month and year
- Review all employee records in the payroll table
- Generate SIF-compliant CSV files
- Download for submission to Qatar banks

### 4. **Import Existing Files**
- Upload previously generated SIF files
- Automatically populate employee and employer data
- Continue editing or generate updated files

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Management**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **State Management**: React Context API
- **Theme**: next-themes (light/dark mode)
- **Icons**: Lucide React

## 📝 SIF File Format

The application generates Standard Interchange Format (SIF) files compliant with Qatar's WPS requirements. The SIF file includes:

### Header Record (EDH)
- File type, employer ID, bank information
- Salary year/month, creation date/time
- Record and employee counts

### Employee Records (EDB)
- Employee identification (QID, Visa ID, IBAN)
- Salary components (basic, allowances, deductions)
- Payment type and frequency
- Working days and extra hours

### Supported Payment Types
- Normal Payment
- Settlement Payment
- Partial Payment
- Delayed Payment
- Final Settlement

### Deduction Reason Codes
1. Working hours related
2. Work arrangements
3. Harm or damage
4. Advances
99. Other

## 📁 Project Structure

```
qatar-wps-manager/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AppShell.tsx    # Main layout component
│   │   ├── EmployeeTable.tsx
│   │   └── EmployeeFormDrawer.tsx
│   ├── context/            # React context providers
│   │   └── AppContext.tsx  # Global state management
│   ├── pages/              # Route pages
│   │   ├── Start.tsx       # Employer settings
│   │   ├── People.tsx      # Employee management
│   │   └── Wps.tsx         # Payroll & SIF generation
│   ├── types/              # TypeScript type definitions
│   │   └── employee.ts
│   ├── utils/              # Utility functions
│   │   ├── sif.ts          # SIF file generation/parsing
│   │   ├── storage.ts      # Local storage helpers
│   │   └── validation.ts   # Form validation schemas
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
└── README.md              # This file
```

## 🔒 Privacy & Security

- **No Server Communication**: All data processing happens locally in your browser
- **Local Storage Only**: Data is stored in your browser's local storage
- **No Tracking**: No analytics, cookies, or tracking scripts
- **Open Source**: Full transparency - review the code yourself
- **No Account Required**: No sign-up, no login, no personal information collection

**Important**: Since data is stored locally, clearing your browser data will delete all stored information. Always export and backup your SIF files regularly.

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Local Storage Keys

The application uses the following local storage keys:
- `qatar-wps-employees`: Employee records
- `qatar-wps-employer`: Employer settings
- `qatar-wps-payroll`: Payroll run configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues & Roadmap

### Current Limitations
- Data is stored locally (browser storage only)
- No multi-user or cloud sync capabilities
- Manual backup required (export SIF files)

### Planned Features
- [ ] PDF payslip generation
- [ ] Multiple company profiles
- [ ] Historical payroll records
- [ ] Employee import from Excel/CSV
- [ ] Bulk edit capabilities
- [ ] Print-friendly payroll summaries

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/qatar-wps-manager/issues) page
2. Create a new issue with detailed information
3. Visit the [Lovable Community](https://discord.com/channels/1119885301872070706/1280461670979993613) for discussions

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev) - AI-powered web app creation
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons by [Lucide](https://lucide.dev)

---

**Made with ❤️ for Qatar's business community**

*Note: This is an independent tool and is not officially affiliated with Qatar's Ministry of Labour or any banking institution.*