'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, UploadCloud, VideoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TypingAnimation } from '@/components/magicui/typing-animation';
import { ShineBorder } from '@/components/magicui/shine-border';
export default function VideoCapture() {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [videoURL, setVideoURL] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setVideoURL(URL.createObjectURL(selectedFile));
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        setIsUploading(true);
        setMessage('');

        try {
            const res = await fetch('http://localhost:8080/api/video/analyze', {
                method: 'POST',
                body: formData,
            });
            const result = await res.text();
            setMessage(result);
        } catch (err) {
            console.error('Upload error:', err);
            setMessage('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex items-center justify-center p-6">
            <div className="relative">
                <ShineBorder
                shineColor={["#0d0d0d", // deep black
    "#595959", // mid gray
    "#c0c0c0", // chrome silver
    "#f5f5f5"]}
                borderWidth={3}
                duration={6}
                className="rounded-2xl">
                <div className="bg-zinc-800 p-6 rounded-2xl shadow-xl w-full max-w-lg space-y-6 border border-zinc-700">
                    <h1 className="font-mono text-2xl font-bold text-center">KICK SPECIALIST</h1>

                    <label
                        htmlFor="video"
                        className={cn(
                        "flex flex-col items-center justify-center h-40 border-2 border-dashed border-zinc-600 rounded-xl cursor-pointer hover:border-white transition-colors",
                        !file && "bg-zinc-900"
                    )}
                    >
                    {file ? (
                        <div className="flex items-center space-x-2 ">
                            <VideoIcon stroke="currentColor" className="w-6 h-6" />
                            <span>{file.name}</span>
                        </div>
                    ) : (
                        <div className="font-mono flex flex-col items-center text-zinc-400">
                            <UploadCloud className="w-8 h-8 mb-2" />
                            <p>Click to choose a video</p>
                        </div>
                    )}
                    <input
                        id="video"
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>

                {videoURL && (
                    <video controls className="rounded-lg w-full max-h-56 border border-zinc-700">
                        <source src={videoURL} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}

                <Button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="font-mono w-full text-lg font-semibold"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="font-mono mr-2 h-5 w-5 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        'Upload and Analyze'
                    )}
                </Button>

                {message && (
                    <div className="font-mono bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-center font-medium">
                        <TypingAnimation className = "text-sm font-mono #0d0d0d, #595959, #c0c0c0, #f5f5f5" duration={70}>{message}</TypingAnimation>
                    </div>
                )}
            </div>
            </ShineBorder>
            </div>
        </div>
    );
}
