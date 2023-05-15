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
        await upload_configuration(core.getInput('project'), configuration);

    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

run()
