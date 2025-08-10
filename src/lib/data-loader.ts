import fs from "fs";
import path from "path";

import yaml from "js-yaml";

// Types for your data
export interface PersonalData {
  name: string;
  title: string;
  company: string;
  tagline: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  resume: string;
}

export interface ExperienceData {
  positions: Array<{
    id: string;
    title: string;
    company: string;
    companyLogo: string;
    location: string;
    startDate: string;
    endDate: string;
    duration: string;
    type: string;
    description: string;
    achievements: string[];
    technologies: string[];
  }>;
}

export interface ProjectsData {
  featuredProjects: Array<{
    id: string;
    title: string;
    company: string;
    type: string;
    impact: string;
    description: string;
    technologies: string[];
    featured: boolean;
  }>;
}

export interface SkillsData {
  skillCategories: Array<{
    name: string;
    skills: Array<{
      name: string;
      level: string;
      years: number;
    }>;
  }>;
}

// Function to load YAML data
export function loadYamlData<T>(filename: string): T {
  try {
    const filePath = path.join(process.cwd(), "src", "data", filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    return yaml.load(fileContents) as T;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error loading ${filename}:`, error);
    throw new Error(`Failed to load ${filename}`);
  }
}

// Specific data loading functions
export function loadPersonalData(): PersonalData {
  return loadYamlData<PersonalData>("personal.yml");
}

export function loadExperienceData(): ExperienceData {
  return loadYamlData<ExperienceData>("experience.yml");
}

export function loadProjectsData(): ProjectsData {
  return loadYamlData<ProjectsData>("projects.yml");
}

export function loadSkillsData(): SkillsData {
  return loadYamlData<SkillsData>("skills.yml");
}

// Load all data at once (useful for pages that need multiple data sources)
export function loadAllData() {
  return {
    personal: loadPersonalData(),
    experience: loadExperienceData(),
    projects: loadProjectsData(),
    skills: loadSkillsData(),
  };
}
