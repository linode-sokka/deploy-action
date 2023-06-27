import { exec, ExecOptions } from '@actions/exec';
import * as core from '@actions/core';
import * as auth from '@actions/http-client/lib/auth';
import * as httpm from '@actions/http-client';

export async function get_configuration(args: string[]): Promise<string> {
    try {

        let compose_configuration = '';

        const options: ExecOptions = { silent: true };
        options.listeners = {
            stdout: (data: Buffer) => {
                compose_configuration += data.toString();
            },
        };

        await exec('docker', ['compose'].concat(args, ['config']), options);

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
    try {
        const token = core.getInput('token');
        const endpoint = getEndpoint(project);
        const bearer = new auth.BearerCredentialHandler(token);


        const http: httpm.HttpClient = new httpm.HttpClient('linode-sokka-github-actions-deploy', [
            bearer
        ])

        const response = await http.post(endpoint, configuration);

        if (response.message.statusCode !== 202) {
            await response.readBody().then((body) => {
                core.error(`Failed to upload configuration: ${response.message.statusMessage}` + body)
            });
            core.setFailed(`Failed to upload configuration: ${response.message.statusMessage}`);
            throw new Error(`Failed to upload configuration: ${response.message.statusMessage}`);
        }

    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message);
        throw error;
    }
}

export async function push_images(args: string[]) {
    try {

        await exec('docker', ['compose'].concat(args, ['build']));
        await exec('docker', ['compose'].concat(args, ['push']));

    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message);
        throw error;
    }
}
