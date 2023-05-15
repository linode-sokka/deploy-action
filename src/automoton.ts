import { exec, ExecOptions } from '@actions/exec';
import * as core from '@actions/core';
import * as auth from '@actions/http-client/lib/auth';
import * as httpm from '@actions/http-client';

export async function get_configuration(args: string[]): Promise<string> {
    try {

        let compose_configuration = '';

        const options: ExecOptions = {};
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

export async function upload_configuration(project: string, configuration: string) {
    try {
        const token = core.getInput('token');
        const base = core.getInput('url');
        const endpoint = `${base}/api/v1/project/${project}/configuration`;

        const bearer = new auth.BearerCredentialHandler(token);


        const http: httpm.HttpClient = new httpm.HttpClient('http-client-tests', [
            bearer
        ])

        await http.post(endpoint, configuration);

    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message);
        throw error;
    }
}

export async function push_images(args: string[]) {
    try {
        const options: ExecOptions = {};
        options.listeners = {
            stdout: (data: Buffer) => {
                core.info(data.toString());
            },
        };
        await exec('docker', ['compose'].concat(args, ['build']), options);
        await exec('docker', ['compose'].concat(args, ['push']), options);

    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message);
        throw error;
    }
}
