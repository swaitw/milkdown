/* Copyright 2021, Milkdown by Mirone. */
import { AtomList, createPlugin } from '@milkdown/utils';

import type { Config } from './config';
import { defaultConfig } from './config';
import { createSlashPlugin } from './prose-plugin';

export { Config, CursorConfig, defaultActions, defaultConfig } from './config';
export { createDropdownItem, nodeExists } from './utility';

export type Options = {
    config: Config;
};

export const slashPlugin = createPlugin<string, Options>((utils, options) => {
    const slashConfig = options?.config ?? defaultConfig;

    return {
        prosePlugins: (_, ctx) => {
            const config = slashConfig(ctx);

            const plugin = createSlashPlugin(utils, config);

            return [plugin];
        },
    };
});

export const slash = AtomList.create([slashPlugin()]);
