import { createNode } from '@milkdown/utils';
import { textblockTypeInputRule } from 'prosemirror-inputrules';
import { setBlockType } from 'prosemirror-commands';
import { SupportedKeys } from '../supported-keys';
import { createCmdKey, createCmd } from '@milkdown/core';
import { createShortcut } from '@milkdown/utils';

const headingIndex = Array(5)
    .fill(0)
    .map((_, i) => i + 1);

type Keys =
    | SupportedKeys['H1']
    | SupportedKeys['H2']
    | SupportedKeys['H3']
    | SupportedKeys['H4']
    | SupportedKeys['H5']
    | SupportedKeys['H6'];

const id = 'heading';

export const TurnIntoHeading = createCmdKey<number>();

export const heading = createNode<Keys>((_, utils) => ({
    id,
    schema: {
        content: 'inline*',
        group: 'block',
        attrs: {
            level: {
                default: 1,
            },
        },
        parseDOM: headingIndex.map((x) => ({ tag: `h${x}`, attrs: { level: x } })),
        toDOM: (node) => [
            `h${node.attrs.level}`,
            { class: utils.getClassName(node.attrs, `heading h${node.attrs.level}`) },
            0,
        ],
    },
    parser: {
        match: ({ type }) => type === id,
        runner: (state, node, type) => {
            const depth = node.depth as number;
            state.openNode(type, { level: depth });
            state.next(node.children);
            state.closeNode();
        },
    },
    serializer: {
        match: (node) => node.type.name === id,
        runner: (state, node) => {
            state.openNode('heading', undefined, { depth: node.attrs.level });
            state.next(node.content);
            state.closeNode();
        },
    },
    inputRules: (nodeType) =>
        headingIndex.map((x) =>
            textblockTypeInputRule(new RegExp(`^(#{1,${x}})\\s$`), nodeType, () => ({
                level: x,
            })),
        ),
    commands: (nodeType) => [createCmd(TurnIntoHeading, (level = 1) => setBlockType(nodeType, { level }))],
    shortcuts: {
        [SupportedKeys.H1]: createShortcut(TurnIntoHeading, 'Mod-Alt-1', 1),
        [SupportedKeys.H2]: createShortcut(TurnIntoHeading, 'Mod-Alt-2', 2),
        [SupportedKeys.H3]: createShortcut(TurnIntoHeading, 'Mod-Alt-3', 3),
        [SupportedKeys.H4]: createShortcut(TurnIntoHeading, 'Mod-Alt-4', 4),
        [SupportedKeys.H5]: createShortcut(TurnIntoHeading, 'Mod-Alt-5', 5),
        [SupportedKeys.H6]: createShortcut(TurnIntoHeading, 'Mod-Alt-6', 6),
    },
}));