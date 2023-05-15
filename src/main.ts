import * as core from '@actions/core'
import { push_images, get_configuration, upload_configuration } from './automoton'

function parseArgs(args: string): string[] {
    const parsed = args.split(' ');
    return parsed
}

async function run(): Promise<void> {
    try {
        const args = parseArgs(core.getInput('compose'))
        await push_images(args);
        const configuration = await get_configuration(args);
        const project = get_project_name();
        if (core.getInput('deploy') == 'true') {
            await upload_configuration(project, configuration);
        }
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

function get_project_name(): string {
    let project = core.getInput('project');
    if (project == '') {
        project = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
    }
    return project;
}

run()
