import { Project } from "contentlayer/generated";

/**
 * Returns random published projects
 */
export function getRandomProjects(projects: Project[], limit: number = 3) {
    return projects
        .filter((p) => p.published)
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);
} 