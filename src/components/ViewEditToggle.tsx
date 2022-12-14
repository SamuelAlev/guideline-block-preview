import { useEffect } from 'react';

import { useBlockState } from '../states';
import { isMac, merge } from '../utils';
import { useSetEditingShortcut } from '../hooks';

export const ViewEditToggle = () => {
    const { isEditing, setIsEditing } = useBlockState();

    useEffect(() => {
        document.body.classList[isEditing ? 'add' : 'remove']('editor-enabled');
    }, [isEditing]);

    useSetEditingShortcut();

    return (
        <div className="flex gap-2 items-center justify-center">
            <button
                className={merge([
                    'p-2 flex items-center justify-center rounded',
                    !isEditing ? 'bg-[#424747] text-white' : 'hover:bg-[#eaebeb]',
                ])}
                onClick={() => setIsEditing(false)}
                title={`Switch to view mode (${isMac ? '⌘+e' : 'ctrl+e'})`}
            >
                <div className="i-octicon-eye-16" />
            </button>
            <button
                className={merge([
                    'p-2 flex items-center justify-center rounded',
                    isEditing ? 'bg-[#424747] text-white' : 'hover:bg-[#eaebeb]',
                ])}
                onClick={() => setIsEditing(true)}
                title={`Switch to edit mode (${isMac ? '⌘+e' : 'ctrl+e'})`}
            >
                <div className="i-octicon-pencil-16" />
            </button>
        </div>
    );
};
