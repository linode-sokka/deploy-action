import { expect, test, jest, describe } from '@jest/globals';
import { get_configuration, push_images } from '../src/automoton';
import * as core from '@actions/core';

describe('whoami', () => {
    test('whoami can collect configuration', async () => {
        const configuration = await get_configuration(['-f', 'tests/whoami.docker-compose.yml']);
        expect(configuration).toContain('VIRTUAL_HOST: whoami.alexrudy.test');
    });

    test('whoami build and push no-op', async () => {
        const logSpy = jest.spyOn(process.stdout, 'write');
        await push_images(['-f', 'tests/whoami.docker-compose.yml']);

        let utf8Encode = new TextEncoder();
        const bytes = Buffer.from(utf8Encode.encode(" whoami Skipped \n"));

        expect(logSpy).toHaveBeenCalledWith(bytes);

    });
});
