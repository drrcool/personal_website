# Personal Website Design Plan

## Project Overview

A professional website serving as both a source-of-truth for business legitimacy and a developer portfolio for an Analytics Engineer role. The site focuses on business problem-solving with subtle astronomy theming as a differentiator.

## Core Objectives

1. **Business Legitimacy**: Professional presence for platform verification
2. **Recruitment Tool**: 30-60s recruiter assessment capability
3. **Portfolio Showcase**: Demonstrate technical skills and business impact
4. **Personal Branding**: Highlight unique astronomy → data science journey

## Positioning Strategy

**Primary Positioning**: "Data solutions architect who solves complex business problems at scale"

**Tagline Options**:
- "Transforming complex data into business impact"
- "Building data solutions that drive decisions and growth"
- "End-to-end analytics that connect data to business value"

**Differentiation**: Not "former astronomer who does data science" but "data architect who brings scientific rigor to business problems"

## Tech Stack Recommendation

### Frontend: Next.js 14 with TypeScript
- SEO optimization for recruiter discoverability
- Server-side rendering for fast load times
- React ecosystem alignment
- Professional Netlify hosting integration
- TypeScript for code quality demonstration

### UI Components: shadcn/ui + Tailwind CSS
- Copy-paste component approach (no vendor lock-in)
- Built on Radix UI + Tailwind CSS for accessibility and customization
- Elegant defaults that match the minimalist design aesthetic
- TypeScript-first with excellent developer experience
- Only includes components actually used (minimal bundle size)

### Styling & Animation: Tailwind CSS + Framer Motion
- Rapid, responsive design development
- Smooth animations and micro-interactions
- Professional aesthetic with full design control
- Custom CSS variables for dark theme implementation

### Data Visualization: D3.js + React
- Showcase data visualization skills directly in the site
- Custom business-themed visualizations
- Interactive elements demonstrating technical capability

### Content Management: MDX
- Markdown for project case studies
- Embedded interactive React components
- Easy maintenance and updates

### Hosting & Deployment
- **Netlify**: Professional hosting with automatic SSL and edge functions
- **Custom Domain**: yourname.com for credibility
- **Analytics**: Netlify Analytics for visitor insights and engagement tracking
- **CI/CD**: Automatic deployments from Git repository

## **File Structure & Organization**

```
personal_website/
├── README.md
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── .env.local
├── .gitignore
│
├── public/
│   ├── images/
│   │   ├── banner/
│   │   │   └── astronomy-banner.jpg
│   │   ├── profile/
│   │   │   └── professional-headshot.jpg
│   │   ├── companies/
│   │   │   ├── netflix-logo.svg
│   │   │   ├── mmt-observatory-logo.svg
│   │   │   ├── carnegie-logo.svg
│   │   │   └── princeton-logo.svg
│   │   └── tech-icons/
│   │       ├── python.svg
│   │       ├── react.svg
│   │       ├── spark.svg
│   │       └── [...other-tech-icons].svg
│   ├── resume.pdf
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── publications/
│   │   │   └── page.tsx
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── badge.tsx
│   │   │   └── dialog.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── banner.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── navigation.tsx
│   │   │   └── main-layout.tsx
│   │   │
│   │   ├── sections/
│   │   │   ├── about-section.tsx
│   │   │   ├── experience-section.tsx
│   │   │   ├── projects-section.tsx
│   │   │   ├── side-projects-section.tsx
│   │   │   ├── community-impact-section.tsx
│   │   │   └── resume-publications-section.tsx
│   │   │
│   │   ├── shared/
│   │   │   ├── tech-icon.tsx
│   │   │   ├── project-card.tsx
│   │   │   ├── experience-item.tsx
│   │   │   ├── company-logo.tsx
│   │   │   └── section-title.tsx
│   │   │
│   │   └── providers/
│   │       └── theme-provider.tsx
│   │
│   ├── data/
│   │   ├── personal.md              # Name, tagline, contact info
│   │   ├── about.md                 # About section content
│   │   ├── experience.md            # Work experience entries
│   │   ├── projects.md              # Featured projects
│   │   ├── side-projects.md         # Personal side projects
│   │   ├── community-impact.md      # Volunteer work (anonymized)
│   │   ├── publications.md          # Academic publications
│   │   ├── tech-stack.md            # Technology stack with tooltips
│   │   └── skills.md                # Skills and expertise
│   │
│   ├── lib/
│   │   ├── utils.ts                 # Utility functions (cn, etc.)
│   │   ├── data-parser.ts           # Parse markdown data files
│   │   ├── validation.ts            # Data validation schemas (Zod)
│   │   └── constants.ts             # App constants and config
│   │
│   ├── types/
│   │   ├── index.ts                 # Main type definitions
│   │   ├── experience.ts            # Experience-related types
│   │   ├── projects.ts              # Project-related types
│   │   └── content.ts               # Content structure types
│   │
│   └── styles/
│       ├── globals.css              # Global styles and CSS variables
│       └── components.css           # Component-specific styles
│
├── content/                         # Alternative: MDX files for rich content
│   └── projects/
│       ├── device-quality-prediction.mdx
│       ├── partner-launch-monitoring.mdx
│       └── observatory-optimization.mdx
│
└── docs/
    ├── setup.md
    ├── content-management.md
    └── deployment.md
```

## **Data File Structure & Content Management**

### **Markdown Data Files (`src/data/`)**

Each `.md` file contains structured frontmatter and optional content. For detailed YAML examples and data structures, see `data-examples.md`.

### **Publication Page Component Structure**

The publications page (`src/app/publications/page.tsx`) will include:

#### **Publication List Features:**
- **Chronological sorting** (newest first)
- **Filter by publication type** (journal articles, conference papers, etc.)
- **Search functionality** (title, authors, keywords)
- **Citation export** (BibTeX, APA, etc.)
- **External link integration** (DOI, arXiv, ADS)

#### **Publication Card Component:**
```typescript
// Example component structure
interface Publication {
  id: string;
  title: string;
  authors: string[];
  date: string;
  publication: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  arxiv?: string;
  adsabs?: string;
  url?: string;
  abstract?: string;
  featured?: boolean;
}

// Component renders:
// - Formatted citation
// - Author list (highlighting your name)
// - Publication venue and date
// - External links (DOI, arXiv, etc.)
// - Expandable abstract
// - Copy citation button
```

### **Content Management Strategy**

1. **Static Data**: Stored in markdown files with YAML frontmatter
2. **Rich Content**: Use MDX files in `/content/` for detailed project descriptions only
3. **Publications**: Single list in `publications.md` with structured metadata
4. **Assets**: Organized by type in `/public/images/`
5. **Type Safety**: Zod schemas in `/src/lib/validation.ts` validate data structure
6. **Parsing**: Custom parser in `/src/lib/data-parser.ts` handles markdown files
7. **Updates**: Simple markdown editing for content changes, no database required

## Site Architecture

```
/
├── / (Landing)
├── /about
├── /projects
│   ├── /projects/[slug] (Individual project pages)
├── /experience
├── /skills
├── /research (Academic work)
├── /resume
└── /contact
```

## Target User Flow (30-60s Recruiter Journey)

```
Landing Page (10s) → Skills Overview (15s) → Project Deep-dive (20s) → Contact (5s)
```

## Landing Page Content Strategy

### Hero Section
- Professional photo with subtle astronomy background
- **Primary Headline**: "Data Solutions Architect"
- **Subheading**: "I build end-to-end analytics that turn complex data into business impact"
- **Key Metrics Bar**:
  - "3B+ daily records processed"
  - "Millions of customers protected"
  - "0.5 FTE hours saved annually"

### Business Impact Preview
1. **Cost Reduction**: Alert classification reducing false positives
2. **Risk Mitigation**: Early firmware issue detection
3. **Efficiency Gains**: Observatory automation (20% overhead reduction)
4. **Revenue Protection**: Device quality monitoring preventing churn

### Skills Section (Business-Framed)
- **Data Engineering**: "Building pipelines that handle Netflix-scale data"
- **Analytics**: "Creating insights that drive executive decision-making"
- **Machine Learning**: "Predictive models that prevent business impact"
- **Full-Stack Development**: "Custom tools that make complex data accessible"

## Creative Elements (Business-Focused with Subtle Astronomy)

### 1. Data Pipeline Visualization (Hero)
- **Business Context**: Raw Business Data → Processing → Actionable Insights
- **Astronomy Touch**: Telescope imagery as the "data collection" metaphor
- **Focus**: Speed, scale, reliability of data transformation
- **Interactive**: Show real business metrics flowing through the pipeline

### 2. Business Impact Dashboard
- **Primary Focus**: Netflix member impact, cost savings, efficiency gains
- **Metrics**: Quantified business outcomes with professional styling
- **Astronomy Reference**: Subtle visual aesthetic elements only
- **Real-time Style**: Professional dashboard showing measurable impact

### 3. Problem-Solution Showcase
- **Structure**: Business Challenge → Technical Solution → Measurable Impact
- **Visual**: Before/after metrics, ROI calculations
- **Focus**: Business value and technical execution

### 4. Skills Matrix (Business-Relevant)
- **Categories**: Data Engineering | Analytics | ML/AI | Full-Stack Development
- **Business Context**: Each skill tied to business outcomes
- **Proficiency Indicators**: Years of experience + impact scale
- **Subtle Astronomy**: Constellation-like connecting lines between related skills

## Project Case Studies Framework

### Project 1: Device Quality Prediction
- **Business Problem**: Manual alert triage consuming engineering resources
- **Solution**: ML classification model with 85% accuracy
- **Impact**: 0.5 FTE hours saved annually, faster issue resolution
- **Tech Stack**: Python, Spark, React dashboard

### Project 2: Partner Launch Monitoring
- **Business Problem**: Firmware issues could impact millions of customers
- **Solution**: Real-time alerting framework with early detection
- **Impact**: Critical issues caught in early deployment stages
- **Tech Stack**: Druid, JavaScript dashboards, automated alerting

### Project 3: Observatory Operations Optimization
- **Business Problem**: Inefficient observation scheduling reducing research output
- **Solution**: Queue scheduling system with logistic regression
- **Impact**: 20% reduction in overhead, quantified operational savings
- **Tech Stack**: Python, statistical modeling, process automation

## Handling Sensitive Work Projects

1. **Abstract Case Studies**: Focus on technical approach, scale, and impact without revealing company-specific details
2. **Metrics-Focused**: Emphasize quantifiable improvements and scale
3. **Problem-Solution Framework**: Describe challenges and technical solutions
4. **Visual Mockups**: Create generalized versions of dashboards/tools

## 12-Step Recovery Presentation (Anonymity-Safe)

- **Focus on Skills**: Leadership, data analysis, survey design
- **Organizational Impact**: Use terms like "volunteer coordination" and "membership analytics"
- **Generic Description**: "Community organization focused on health and wellness"
- **Emphasize Transferable Skills**: Training, reporting, stakeholder communication

## Portfolio Project Ideas (Business-Focused)

### 1. Business Metrics Dashboard Generator
- **Business Value**: Companies can quickly create executive dashboards
- **Problem Solved**: Time-consuming manual dashboard creation
- **Skills Shown**: React, data visualization, business intelligence

### 2. Alert Fatigue Reduction Tool
- **Business Value**: Any team dealing with alert overload can benefit
- **Problem Solved**: False positive alerts consuming team resources
- **Skills Shown**: ML classification, workflow optimization

### 3. Data Quality Monitoring System
- **Business Value**: Automated data quality checks for any organization
- **Problem Solved**: Manual data validation processes
- **Skills Shown**: Data engineering, automation, monitoring

### 4. ROI Calculator for Data Projects
- **Business Value**: Helps justify data science investments
- **Problem Solved**: Difficulty quantifying data project value
- **Skills Shown**: Business acumen, analytical thinking

### 5. Survey Analysis Automation
- **Business Value**: Organizations can analyze feedback more efficiently
- **Problem Solved**: Manual survey analysis bottlenecks
- **Skills Shown**: Statistical analysis, automation, visualization

## Visual Identity

### Color Palette (Professional + Subtle Space Theme)
- **Primary**: Deep Navy (#1a365d) - professional, trustworthy
- **Secondary**: Bright Blue (#3182ce) - data, technology
- **Accent**: Silver/White (#f7fafc) - clean, modern
- **Highlight**: Subtle gold (#fbb64e) - astronomy nod, premium feel

### Typography & Aesthetics
- **Modern, Clean Sans-serif**: Professional readability
- **Subtle Astronomy Elements**:
  - Connecting lines between elements (like constellation lines)
  - Subtle star field background (very muted)
  - Telescope silhouette in hero section only
- **Business-First Visuals**: Charts, graphs, metrics prominently displayed

## Key Messaging Framework

### For Recruiters (30-second scan)
1. **Clear Role**: "Data Solutions Architect"
2. **Business Impact**: Specific, quantified outcomes
3. **Technical Depth**: Full-stack capabilities with scale experience
4. **Unique Background**: Astronomy experience as proof of handling complex data

### For Hiring Managers (60-second review)
1. **Problem-Solver**: Each project shows business problem → technical solution → measurable impact
2. **Scale Experience**: Netflix-level data volumes and user impact
3. **End-to-End Capability**: From data engineering to user-facing tools
4. **Leadership**: Cross-functional collaboration and training others

## Implementation Phases

### Phase 1: MVP (Week 1-2)
- Basic Next.js setup with responsive design
- Landing page with hero section and contact form
- About page with experience timeline
- Basic project showcase page

### Phase 2: Enhanced Content (Week 3-4)
- Detailed project case studies
- Skills visualization
- Resume/experience section
- Research publications integration

### Phase 3: Interactive Elements (Week 5-6)
- Business-focused animations
- Interactive data visualizations
- Project filtering and search
- Contact form with analytics

### Phase 4: Performance & SEO (Week 7)
- Performance optimization
- SEO metadata and structured data
- Analytics implementation
- Final testing and deployment

## Success Metrics

1. **Recruiter Engagement**: Time on site > 60 seconds
2. **Contact Conversion**: Resume downloads, contact form submissions
3. **Technical Demonstration**: Interactive element engagement
4. **Professional Credibility**: LinkedIn profile views, professional inquiries

## Assets Needed

- Professional photo
- Astronomy image with credit
- Company logos
- Resume/CV document
- Project screenshots/mockups
- Academic publication links

## Content Sources

- LinkedIn About Section (provided)
- Detailed work history (provided)
- Academic background and research
- Professional publications
- Quantified achievements and metrics

---

*This plan creates a professional, memorable website that serves dual purposes while showcasing unique background and technical skills. The astronomy theme provides subtle differentiation while maintaining focus on business problem-solving and impact.*
