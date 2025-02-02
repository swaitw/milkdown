/* Copyright 2021, Milkdown by Mirone. */
import { Decoration, EditorView, Mark, Node } from '@milkdown/prose';
import React from 'react';

type NodeContext = {
    node: Node | Mark;
    view: EditorView;
    getPos: boolean | (() => number);
    decorations: Decoration[];
};

const nodeContext = React.createContext<NodeContext>({
    node: undefined,
    view: undefined,
    getPos: undefined,
    decorations: undefined,
} as unknown as NodeContext);

export const ReactNodeContainer: React.FC<NodeContext> = ({ node, view, getPos, decorations, children }) => {
    return <nodeContext.Provider value={{ node, view, getPos, decorations }}>{children}</nodeContext.Provider>;
};

export const useNodeCtx = () => React.useContext(nodeContext);

export const Content: React.FC<{ isMark?: boolean; dom?: HTMLElement | null }> = ({ dom, isMark }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const { current } = containerRef;
        if (!current || !dom) return;

        current.appendChild(dom);
    }, [dom]);

    if (isMark) {
        return <span className="content-dom-wrapper" ref={containerRef} />;
    }

    return <div className="content-dom-wrapper" ref={containerRef} />;
};
