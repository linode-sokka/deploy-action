import * as core from '@actions/core'
import { get_configuration, upload_configuration } from './automoton'

function parseArgs(args: string): string[] {
    const parsed = args.split(' ');
    return parsed
}

async function run(): Promise<void> {
    const args = parseArgs(core.getInput('compose'))
    const project = get_project_name();
    const configuration = await get_configuration(args, project);
    if (core.getInput('deploy') == 'true') {
        await upload_configuration(project, configuration);
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
