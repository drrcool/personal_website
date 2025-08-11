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

export interface ExperiencePosition {
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
}
export interface ExperienceData {
  positions: ExperiencePosition[];
}

export interface Project {
  id: string;
  title: string;
  company: string;
  type: string;
  impact: string;
  description: string;
  technologies: string[];
  featured: boolean;
}
export interface ProjectsData {
  featuredProjects: Project[];
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

export interface AboutData {
  lead: string;
  description: string;
}

export interface TechStackData {
  technologies: string[];
}

// Function to load YAML data safely
export function loadYamlData<T>(filename: string): T {
  try {
    const filePath = path.join(process.cwd(), "src", "data", filename);
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Use safe loading to prevent code execution attacks
    const data = yaml.load(fileContents, {
      onWarning: (warning) => {
        // eslint-disable-next-line no-console
        console.warn(`YAML warning in ${filename}:`, warning.message);
      },
      // Use failsafe schema to prevent code execution
      schema: yaml.FAILSAFE_SCHEMA,
    });

    if (!data) {
      throw new Error(`Empty or invalid YAML content in ${filename}`);
    }

    return data as T;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error loading ${filename}:`, error);

    // Provide more specific error messages
    if (error instanceof yaml.YAMLException) {
      throw new Error(`YAML parsing error in ${filename}: ${error.message}`);
    }

    throw new Error(
      `Failed to load ${filename}: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// Specific data loading functions
export function loadPersonalData(): PersonalData {
  return loadYamlData<PersonalData>("personal.yml");
}

export function loadAboutData(): AboutData {
  return loadYamlData<AboutData>("about.yml");
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

export function loadTechStackData(): TechStackData {
  return loadYamlData<TechStackData>("tech-stack.yml");
}
