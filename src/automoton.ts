import { exec, ExecOptions } from '@actions/exec';
import * as core from '@actions/core';
import * as auth from '@actions/http-client/lib/auth';
import * as httpm from '@actions/http-client';

export async function get_configuration(args: string[], name: string): Promise<string> {
    try {

        let compose_configuration = '';

        const options: ExecOptions = { silent: true };
        options.listeners = {
            stdout: (data: Buffer) => {
                compose_configuration += data.toString();
            },
        };

        await exec('docker', ['compose', '--project-name', name].concat(args, ['config', '--no-path-resolution']), options);

        return compose_configuration;
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message);
        throw error;
    }
}

export function getEndpoint(project: string): string {
    var base = core.getInput('url');

    if (base.endsWith('/')) {
        base = base.slice(0, -1);
    }

    return `${base}/api/v1/project/${project}/configuration`;
}

export async function upload_configuration(project: string, configuration: string) {
    const token = core.getInput('token');
    const endpoint = getEndpoint(project);
    const bearer = new auth.BearerCredentialHandler(token);


    const http: httpm.HttpClient = new httpm.HttpClient('linode-sokka-github-actions-deploy', [
        bearer
    ])

    const response = await http.post(endpoint, configuration);
    let statusCode = response.message.statusCode ?? 0;

    if (!(statusCode >= 200 && statusCode < 300)) {
        core.setFailed(`Failed to upload configuration: ${response.message.statusMessage}`);
    }


}

