import React, { useState, useRef } from 'react';
import { Download, Search, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

function App() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [agreed, setAgreed] = useState(false);
    const [removeWatermark, setRemoveWatermark] = useState(false);
    const [analyzedUrl, setAnalyzedUrl] = useState('');
    const [selectedFormatId, setSelectedFormatId] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(null);
    const [downloadedBytes, setDownloadedBytes] = useState(0);
    const downloadControllerRef = useRef(null);
    const sanitizeFilename = (name) => {
        if (!name) return 'download';
        return name
            .replace(/[/\\?%*:|"<>]/g, '-')
            .replace(/[^\x20-\x7E]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 120);
    };
    const formatCandidates = Array.isArray(data?.formats)
        ? data.formats.filter((fmt) => fmt.ext === 'mp4' && fmt.hasVideo)
        : [];
    const formatOptions = formatCandidates.length ? formatCandidates : (data?.formats || []);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError(null);
        setData(null);
        setAgreed(false);
        setRemoveWatermark(false);
        setSelectedFormatId('');

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            const text = await response.text();
            let payload = null;
            try {
                payload = text ? JSON.parse(text) : null;
            } catch {
                payload = null;
            }

            if (!response.ok) {
                throw new Error(payload?.hint || payload?.error || 'Failed to analyze URL');
            }

            if (!payload) {
                throw new Error('Empty response from server');
            }

            setData(payload);
            setAnalyzedUrl(url);
            if (payload.default_format_id) {
                setSelectedFormatId(payload.default_format_id);
            } else if (Array.isArray(payload.formats) && payload.formats.length > 0) {
                setSelectedFormatId(payload.formats[0].id);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!data || !agreed || downloading) return;

        try {
            setError(null);
            setDownloading(true);
            setDownloadProgress(0);
            setDownloadedBytes(0);
            const controller = new AbortController();
            downloadControllerRef.current = controller;

            const response = await fetch('/api/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: data.original_url,
                    title: data.title,
                    type: data.type,
                    removeWatermark: removeWatermark,
                    sourceUrl: analyzedUrl || url,
                    formatId: selectedFormatId || null
                }),
                signal: controller.signal
            });

            if (!response.ok) {
                const text = await response.text();
                let payload;
                try {
                    payload = text ? JSON.parse(text) : null;
                } catch {
                    payload = null;
                }
                throw new Error(payload?.hint || payload?.error || text || 'Download failed');
            }

            const contentLength = response.headers.get('content-length');
            const totalBytes = contentLength ? Number(contentLength) : null;
            let blob;

            if (response.body) {
                const reader = response.body.getReader();
                const chunks = [];
                let received = 0;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    chunks.push(value);
                    received += value.length;
                    if (totalBytes) {
                        const percent = Math.min(100, Math.round((received / totalBytes) * 100));
                        setDownloadProgress(percent);
                    } else {
                        setDownloadProgress(null);
                        setDownloadedBytes(received);
                    }
                }

                blob = new Blob(chunks, { type: response.headers.get('content-type') || 'application/octet-stream' });
            } else {
                setDownloadProgress(null);
                blob = await response.blob();
            }

            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            const safeTitle = sanitizeFilename(data.title || 'download');
            a.download = `${safeTitle}${removeWatermark ? '_clean' : ''}.${data.type === 'video' ? 'mp4' : 'jpg'}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        } catch (err) {
            if (err.name === 'AbortError') {
                setError('Download canceled.');
            } else {
                setError(err.message || 'Download failed. Please try again.');
            }
        } finally {
            setDownloading(false);
            downloadControllerRef.current = null;
            setDownloadProgress(null);
            setDownloadedBytes(0);
        }
    };

    const handleCancelDownload = () => {
        if (downloadControllerRef.current) {
            downloadControllerRef.current.abort();
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-10 px-4 font-sans">
            <div className="w-full max-w-lg">
                <h1 className="text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                    Media Downloader
                </h1>
                <p className="text-slate-400 text-center mb-8">
                    Instagram → YouTube → Facebook → Sora → Direct URLs
                </p>

                <form onSubmit={handleAnalyze} className="relative mb-8">
                    <input
                        type="text"
                        className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl py-4 pl-4 pr-32 text-lg focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Paste URL here..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading || !url}
                        className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                        Analyze
                    </button>
                </form>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3 text-red-200">
                        <AlertCircle size={24} />
                        <p>{error}</p>
                    </div>
                )}

                {data && (
                    <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {data.thumbnail && (
                            <div className="relative aspect-video bg-black">
                                <img
                                    src={data.thumbnail}
                                    alt="Preview"
                                    className="w-full h-full object-contain"
                                />
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-mono">
                                    {data.platform.toUpperCase()}
                                </div>
                            </div>
                        )}

                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-2 line-clamp-2">{data.title || 'Untitled Media'}</h2>
                        {data.duration && (
                            <p className="text-slate-400 text-sm mb-4">Duration: {(data.duration / 60).toFixed(2)} min</p>
                        )}
                        {formatOptions.length > 0 && (
                            <div className="bg-slate-900/50 rounded-lg p-4 mb-6 border border-slate-700/50">
                                <label className="block text-xs text-slate-400 mb-2">Format</label>
                                <select
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                                    value={selectedFormatId}
                                    onChange={(e) => setSelectedFormatId(e.target.value)}
                                >
                                    {formatOptions.map((fmt) => {
                                        const label = `${fmt.height || 'auto'}p ${fmt.ext}${fmt.hasAudio ? '' : ' (no audio)'}${fmt.fps ? ` ${fmt.fps}fps` : ''}`;
                                        return (
                                            <option key={fmt.id} value={fmt.id}>
                                                {label}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        )}
                            {data.direct_url && (
                                <div className="bg-slate-900/50 rounded-lg p-3 mb-4 border border-slate-700/50">
                                    <p className="text-xs text-slate-400 mb-1">Direct URL</p>
                                    <a
                                        href={data.direct_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-emerald-300 break-all hover:text-emerald-200"
                                    >
                                        {data.direct_url}
                                    </a>
                                </div>
                            )}

                            <div className="bg-slate-900/50 rounded-lg p-4 mb-6 border border-slate-700/50">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-600 checked:border-blue-500 checked:bg-blue-500 transition-all"
                                            checked={agreed}
                                            onChange={(e) => setAgreed(e.target.checked)}
                                        />
                                        <CheckCircle className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white" size={12} style={{ top: '4px', left: '4px' }} />
                                    </div>
                                    <span className="text-sm text-slate-400 select-none">
                                        I confirm that I own this content or have the necessary rights to download and use it. I understand that downloading copyrighted material is prohibited.
                                    </span>
                                </label>
                            </div>

                            <div className="bg-slate-900/50 rounded-lg p-4 mb-6 border border-slate-700/50">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-600 checked:border-purple-500 checked:bg-purple-500 transition-all"
                                            checked={removeWatermark}
                                            onChange={(e) => setRemoveWatermark(e.target.checked)}
                                        />
                                        <CheckCircle className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white" size={12} style={{ top: '4px', left: '4px' }} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-purple-300 select-none">
                                            Remove Watermark (Blur)
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            Experimental: Blurs the bottom-right corner.
                                        </span>
                                    </div>
                                </label>
                            </div>

                        <button
                            onClick={handleDownload}
                            disabled={!agreed || downloading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                        >
                            <Download size={24} />
                            {downloading ? 'Downloading...' : `Download ${data.type === 'video' ? 'Video' : 'Image'}`}
                        </button>

                        {downloading && (
                            <div className="mt-4">
                                <div className="h-2 bg-slate-700 rounded">
                                    <div
                                        className="h-2 bg-emerald-400 rounded transition-all"
                                        style={{ width: `${downloadProgress ?? 10}%` }}
                                    />
                                </div>
                                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                                    <span>
                                        {downloadProgress !== null
                                            ? `${downloadProgress}%`
                                            : `Downloaded ${(downloadedBytes / (1024 * 1024)).toFixed(2)} MB`}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleCancelDownload}
                                        className="text-slate-300 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

                <footer className="mt-12 text-center text-slate-500 text-xs">
                    <p>For educational purposes only. Do not infringe copyright.</p>
                </footer>
            </div>
        </div>
    );
}

export default App;
