# Data File Examples & Structure

This file contains all the example YAML frontmatter and markdown structures for the personal website data files.

## **`src/data/personal.md`**

```yaml
---
name: "Your Full Name"
title: "Data Solutions Architect"
company: "Netflix"
tagline: "Astronomer turned data solutions architect"
location: "San Francisco, CA"
timezone: "PST"
email: "your.email@example.com"
phone: "+1 (555) 123-4567"
linkedin: "https://linkedin.com/in/yourprofile"
github: "https://github.com/yourusername"
resume: "/resume.pdf"
---
```

## **`src/data/about.md`**

```yaml
---
lead: "Astronomer turned data solutions architect."
description: |
  I specialize in building scalable data infrastructure that protects millions of customers and drives strategic decisions years ahead. From telescope control systems to streaming analytics platforms, I solve complex problems at the intersection of engineering and science.

  My background spans astronomy research, where I published on galaxy evolution and built automated survey pipelines, to developing real-time fraud detection systems and partner growth analytics that directly impact business outcomes.
highlights:
  - "Built fraud detection systems protecting millions of Netflix customers"
  - "Developed partner growth analytics driving strategic decisions"
  - "Published research on galaxy evolution using large-scale data analysis"
  - "Led observatory optimization projects reducing operational overhead by 20%"
---
```

## **`src/data/experience.md`**

```yaml
---
positions:
  - id: "netflix-data-architect"
    title: "Senior Data Solutions Architect"
    company: "Netflix"
    companyLogo: "/images/companies/netflix-logo.svg"
    location: "Los Angeles, CA"
    startDate: "2022-01"
    endDate: "Present"
    duration: "2+ years"
    type: "Full-time"
    description: "Lead data infrastructure projects protecting millions of customers through real-time fraud detection and partner growth analytics."
    achievements:
      - "Built real-time fraud detection system processing 100M+ daily events"
      - "Developed partner growth analytics platform driving $50M+ strategic decisions"
      - "Led cross-functional teams delivering critical business infrastructure"
    technologies: ["Spark", "PySpark", "Trino", "Python", "Real-time Analytics"]

  - id: "carnegie-princeton-astronomer"
    title: "Postdoctoral Research Fellow"
    company: "Carnegie Observatories & Princeton University"
    companyLogo: "/images/companies/carnegie-logo.svg"
    secondaryLogo: "/images/companies/princeton-logo.svg"
    location: "Pasadena, CA / Princeton, NJ"
    startDate: "2019-09"
    endDate: "2021-12"
    duration: "2.5 years"
    type: "Research"
    description: "Conducted galaxy evolution research using large-scale astronomical surveys and developed automated data processing pipelines."
    achievements:
      - "Published 3 first-author papers in top-tier astronomy journals"
      - "Built automated data quality pipeline reducing manual review by 85%"
      - "Led international collaboration analyzing 50,000+ galaxy spectra"
    technologies:
      ["Python", "SQL", "Data Pipelines", "Statistical Analysis", "HPC"]

  - id: "mmt-observatory-engineer"
    title: "Systems Engineer & Observer"
    company: "MMT Observatory"
    companyLogo: "/images/companies/mmt-observatory-logo.svg"
    location: "Mount Hopkins, AZ"
    startDate: "2017-06"
    endDate: "2019-08"
    duration: "2 years"
    type: "Engineering"
    description: "Managed telescope operations and developed optimization systems for world-class astronomical facility."
    achievements:
      - "Implemented queue scheduling system improving throughput by 20%"
      - "Led night operations for $50M research facility"
      - "Developed performance monitoring and predictive maintenance systems"
    technologies:
      ["Python", "Control Systems", "Optimization", "Performance Monitoring"]
---
```

## **`src/data/tech-stack.md`**

```yaml
---
categories:
  - name: "Data & Analytics"
    technologies:
      - name: "Python"
        icon: "/images/tech-icons/python.svg"
        tooltip: "Primary language for data engineering and analysis"
      - name: "Spark"
        icon: "/images/tech-icons/spark.svg"
        tooltip: "Large-scale data processing and ETL pipelines"
      - name: "PySpark"
        icon: "/images/tech-icons/pyspark.svg"
        tooltip: "Python API for Apache Spark"
      - name: "Trino"
        icon: "/images/tech-icons/trino.svg"
        tooltip: "Distributed SQL query engine"
      - name: "Pandas"
        icon: "/images/tech-icons/pandas.svg"
        tooltip: "Data manipulation and analysis"
      - name: "Scikit-learn"
        icon: "/images/tech-icons/sklearn.svg"
        tooltip: "Machine learning and statistical modeling"

  - name: "Databases & Storage"
    technologies:
      - name: "PostgreSQL"
        icon: "/images/tech-icons/postgresql.svg"
        tooltip: "Relational database management"
      - name: "Druid"
        icon: "/images/tech-icons/druid.svg"
        tooltip: "Real-time analytics database"

  - name: "Web Development"
    technologies:
      - name: "React"
        icon: "/images/tech-icons/react.svg"
        tooltip: "Frontend UI development"
      - name: "Node.js"
        icon: "/images/tech-icons/nodejs.svg"
        tooltip: "Backend JavaScript runtime"
      - name: "TypeScript"
        icon: "/images/tech-icons/typescript.svg"
        tooltip: "Type-safe JavaScript development"

  - name: "Visualization & BI"
    technologies:
      - name: "D3.js"
        icon: "/images/tech-icons/d3.svg"
        tooltip: "Custom data visualizations"
      - name: "Tableau"
        icon: "/images/tech-icons/tableau.svg"
        tooltip: "Business intelligence and dashboards"
---
```

## **`src/data/projects.md`**

```yaml
---
featuredProjects:
  - id: "device-quality-prediction"
    title: "Device Quality Prediction Platform"
    company: "Netflix"
    type: "ML Platform"
    impact: "15% improvement in customer experience"
    description: "Real-time ML pipeline analyzing device performance signals to predict and prevent streaming quality issues before they impact customers."
    technologies:
      ["PySpark", "ML Pipeline", "Real-time Processing", "Feature Engineering"]
    featured: true

  - id: "partner-launch-monitoring"
    title: "Partner Launch Growth Analytics"
    company: "Netflix"
    type: "Analytics Platform"
    impact: "$50M+ strategic decision support"
    description: "Comprehensive analytics platform tracking partner performance metrics across markets, enabling data-driven expansion strategies."
    technologies:
      ["Spark", "Trino", "Dashboard Development", "Statistical Analysis"]
    featured: true

  - id: "observatory-queue-optimization"
    title: "Observatory Queue Scheduling"
    company: "MMT Observatory"
    type: "Scheduling/Modeling"
    impact: "~20% overhead reduction"
    description: "Queue scheduling system guided by logistic regression and performance metrics. Increased throughput and improved operational efficiency."
    technologies: ["Python", "Stats/Modeling", "Optimization"]
    featured: true
---
```

## **`src/data/publications.md`**

```yaml
---
publications:
  - id: "galaxy-evolution-spiral-2020"
    title: "Environmental Quenching and the Evolution of Spiral Galaxy Morphology"
    authors: ["Your Name", "Co-Author A", "Co-Author B", "Senior Author"]
    date: "2020-03"
    publication: "The Astrophysical Journal"
    volume: "892"
    issue: "2"
    pages: "123"
    doi: "10.3847/1538-4357/ab7b8c"
    arxiv: "2001.12345"
    adsabs: "2020ApJ...892..123Y"
    url: "https://iopscience.iop.org/article/10.3847/1538-4357/ab7b8c"
    abstract: "We present a comprehensive study of environmental effects on spiral galaxy morphology using a sample of 15,000 galaxies from the Sloan Digital Sky Survey..."

  - id: "stellar-formation-rates-2019"
    title: "Star Formation Efficiency in High-Redshift Galaxy Clusters"
    authors: ["Co-Author C", "Your Name", "Co-Author D"]
    date: "2019-11"
    publication: "Monthly Notices of the Royal Astronomical Society"
    volume: "489"
    issue: "3"
    pages: "3456-3471"
    doi: "10.1093/mnras/stz2345"
    arxiv: "1909.87654"
    adsabs: "2019MNRAS.489.3456C"
    url: "https://academic.oup.com/mnras/article/489/3/3456/5555555"
    abstract: "We investigate star formation rates in galaxy clusters at z > 1.5, finding significant suppression compared to field galaxies..."

  - id: "data-pipeline-astronomy-2021"
    title: "Automated Data Quality Assessment for Large Astronomical Surveys"
    authors: ["Your Name", "Engineering Collaborator", "Observatory Director"]
    date: "2021-07"
    publication: "Publications of the Astronomical Society of the Pacific"
    volume: "133"
    issue: "1025"
    pages: "074501"
    doi: "10.1088/1538-3873/ac0123"
    url: "https://iopscience.iop.org/article/10.1088/1538-3873/ac0123"
    abstract: "We present a machine learning framework for automated quality assessment of astronomical imaging data, reducing manual review time by 85%..."
    featured: true # Highlight data engineering work
---
```

## **`src/data/side-projects.md`**

```yaml
---
sideProjects:
  - id: "habits-coach"
    title: "Habits Coach (Mobile)"
    status: "In development"
    type: "Personal app"
    description: "Lightweight habits and reminders coach with an uncluttered interface and offline‑first sync."
    technologies: ["React Native", "Expo", "TypeScript"]
    github: "https://github.com/yourname/habits-coach" # optional
    demo: "" # optional
    featured: true

  - id: "meal-planner"
    title: "Meal Planner"
    status: "Archived prototype"
    type: "Web app"
    description: "Weekly meal planning with auto grocery lists and simple recipe capture."
    technologies: ["Next.js", "Prisma", "Postgres"]
    github: ""
    demo: ""
    featured: false

  - id: "trail-finder"
    title: "Local Trail Finder"
    status: "In exploration"
    type: "Web map"
    description: "Minimal map UI to surface nearby hiking trails with filters for distance and elevation."
    technologies: ["Mapbox", "Node API", "TypeScript"]
    github: ""
    demo: ""
    featured: true
---
```

## **`src/data/community-impact.md`**

```yaml
---
communityProjects:
  - id: "helpline-operations"
    title: "Helpline Operations & Reporting"
    organization: "Community Recovery Organization"
    type: "Volunteer · Scheduling & Analytics · Anonymized"
    description: "Coordinated scheduling and onboarding for a community recovery helpline. Built monthly engagement reporting and training materials to improve coverage and service quality."
    technologies: ["Workflow Design", "Reporting", "Ops"]
    anonymous: true

  - id: "membership-survey"
    title: "Membership Survey Analytics"
    organization: "Community Recovery Organization"
    type: "Volunteer · Survey ETL & Dashboards · Anonymized"
    description: "Led survey design and data processing; created dashboards to analyze year‑over‑year trends and inform program priorities while preserving participant anonymity."
    technologies: ["Survey Design", "ETL", "Dashboards"]
    anonymous: true
---
```

## **`src/data/skills.md`**

```yaml
---
skillCategories:
  - name: "Data Engineering"
    skills:
      - name: "Apache Spark"
        level: "Expert"
        years: 4
      - name: "PySpark"
        level: "Expert"
        years: 4
      - name: "SQL/Trino"
        level: "Expert"
        years: 6
      - name: "Python"
        level: "Expert"
        years: 8
      - name: "ETL Pipelines"
        level: "Advanced"
        years: 5

  - name: "Analytics & ML"
    skills:
      - name: "Statistical Analysis"
        level: "Expert"
        years: 8
      - name: "Machine Learning"
        level: "Advanced"
        years: 4
      - name: "Data Visualization"
        level: "Advanced"
        years: 6
      - name: "A/B Testing"
        level: "Advanced"
        years: 3

  - name: "Infrastructure"
    skills:
      - name: "Real-time Systems"
        level: "Advanced"
        years: 3
      - name: "Distributed Computing"
        level: "Advanced"
        years: 4
      - name: "Performance Optimization"
        level: "Advanced"
        years: 5

  - name: "Web Development"
    skills:
      - name: "React"
        level: "Intermediate"
        years: 2
      - name: "Node.js"
        level: "Intermediate"
        years: 2
      - name: "TypeScript"
        level: "Intermediate"
        years: 2
---
```
