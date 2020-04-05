import {promises as fs} from 'fs';

import {log} from './console';
import {Project, assertProject} from './types/Project';

export default async function readProject(path: string): Promise<Project> {
    log.debug(`Reading project configuration: ${path}`);

    const json = await fs.readFile(path, 'utf8');

    const project = JSON.parse(json);

    try {
        assertProject(project);
    } catch (error) {
        throw new Error(`${error.message} in ${path}`);
    }

    return project;
}
