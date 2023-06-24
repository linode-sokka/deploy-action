import { expect, test, jest, describe } from '@jest/globals';
import { getEndpoint } from '../src/automoton';
import * as core from '@actions/core';

describe('automoton-core', () => {


    test('endpoint automatically compresses slashses', async () => {
        process.env['INPUT_URL'] = 'https://my-host.com/';
        const endpoint = getEndpoint('special-project');
        expect(endpoint).toEqual('https://my-host.com/api/v1/project/special-project/configuration');

    });
});
