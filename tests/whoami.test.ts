import { expect, test, describe } from '@jest/globals';
import { get_configuration } from '../src/automoton';

describe('whoami', () => {
    test('whoami can collect configuration', async () => {
        const configuration = await get_configuration(['-f', 'tests/whoami.docker-compose.yml'], 'whatami');
        expect(configuration).toContain('VIRTUAL_HOST: whoami.alexrudy.test');
        expect(configuration).toContain('name: whatami');
    });


});
