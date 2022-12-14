import { useCallback, useEffect, useRef } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { bytesToBase64 } from 'byte-base64';
import brotliPromise from 'brotli-wasm';

import { Container, ContentArea, Header, ParametersSidebar, ViewEditToggle } from './components';
import { useDecodeUrl, useScrollWrapper } from './hooks';
import { useBlockState } from './states';

export const Root = () => {
    const contentRef = useRef<HTMLDivElement>(null);
    const { setSettings, setData } = useBlockState();

    const [searchParams, setSearchParams] = useSearchParams();
    const { data, settings } = useDecodeUrl(searchParams);
    useEffect(() => {
        try {
            setData(JSON.parse(data || '{}'));
        } catch {}
    }, [data, setData]);
    useEffect(() => setSettings(settings), [settings, setSettings]);

    const computeHashAndSetUrl = useCallback(
        async (key: string, value: string) => {
            const url = new URL(window.location.href);

            if (value) {
                const brotli = await brotliPromise;

                const textEncoder = new TextEncoder();

                const uncompressedData = textEncoder.encode(value);
                const compressedData = brotli.compress(uncompressedData);

                const b64encoded = bytesToBase64(compressedData);
                url.searchParams.set(key, b64encoded);
            } else {
                url.searchParams.delete(key);
            }

            setSearchParams(url.searchParams, { replace: true });
        },
        [setSearchParams],
    );

    const { showTopShadow } = useScrollWrapper(contentRef);

    return (
        <div className="h-screen divide-y divide-[#f1f1f1] select-none flex flex-col">
            <Header showShadow={showTopShadow} />

            <div className="w-full overflow-auto flex justify-center" ref={contentRef}>
                <Container>
                    <div className="pt-4 flex flex-col-reverse justify-end lg:flex-row lg:divide-x lg:divide-[#f1f1f1]">
                        <aside className="lg:w-4/12 xl:2/12 p-4 lg:pr-6 flex flex-col gap-6">
                            <ParametersSidebar
                                onDataChange={(value) => computeHashAndSetUrl('data', value)}
                                onSettingsChange={(value) => computeHashAndSetUrl('settings', value)}
                            />
                        </aside>
                        <main className="lg:w-8/12 xl:10/12 p-4 lg:pl-6 flex flex-col gap-4">
                            <div className="flex items-center">
                                <h1 className="text-lg font-mono font-bold mr-4">Block Rendering</h1>
                                <ViewEditToggle />
                                <NavLink
                                    to={`/embed?${searchParams.toString()}`}
                                    title="Open block embed"
                                    className="ml-2 p-2 flex items-center justify-center rounded hover:bg-[#eaebeb]"
                                >
                                    <div className="i-octicon-link-external-16" />
                                </NavLink>
                            </div>

                            <ContentArea />
                        </main>
                    </div>
                </Container>
            </div>
        </div>
    );
};
