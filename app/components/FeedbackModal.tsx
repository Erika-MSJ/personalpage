'use client';

import { useState } from 'react';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const [formData, setFormData] = useState({
        nickname: '',
        contact: '',
        idea: '',
        files: [] as File[],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const validFiles: File[] = [];
            let error = null;

            // Check max file count
            if (formData.files.length + newFiles.length > 3) {
                error = '最多只能上传 3 个文件 / Max 3 files allowed';
            } else {
                for (const file of newFiles) {
                    // Check file size (3MB = 3 * 1024 * 1024 bytes)
                    if (file.size > 3 * 1024 * 1024) {
                        error = `文件 ${file.name} 超过 3MB / File ${file.name} exceeds 3MB`;
                        break;
                    }
                    validFiles.push(file);
                }
            }

            if (error) {
                setErrorMessage(error);
                // Clear error after 3 seconds
                setTimeout(() => setErrorMessage(null), 3000);
            } else {
                setFormData(prev => ({
                    ...prev,
                    files: [...prev.files, ...validFiles]
                }));
            }

            // Reset input value to allow selecting the same file again if needed
            e.target.value = '';
        }
    };

    const removeFile = (index: number) => {
        setFormData(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('nickname', formData.nickname);
            formDataToSend.append('contact', formData.contact);
            formDataToSend.append('idea', formData.idea);

            formData.files.forEach((file) => {
                formDataToSend.append('files', file);
            });

            const response = await fetch('/api/submit-idea', {
                method: 'POST',
                body: formDataToSend,
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSubmitStatus('success');
                setFormData({ nickname: '', contact: '', idea: '', files: [] });
            } else {
                setSubmitStatus('error');
                setErrorMessage(data.message || '提交失败 / Submission failed');
            }
        } catch (error) {
            setSubmitStatus('error');
            setErrorMessage('网络错误 / Network error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-lg w-full shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">Share Your Idea</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wider uppercase">
                        分享你的想法
                    </p>
                </div>

                {submitStatus === 'success' ? (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-4">✨</div>
                        <h4 className="text-xl font-bold text-[#1a5f7a] dark:text-[#2d7a9b] mb-2">
                            提交成功 / Submitted
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">
                            感谢你的分享，我会认真阅读！
                        </p>
                        <button
                            onClick={onClose}
                            className="px-8 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            关闭 / Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nickname Field */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider mb-2">
                                Nickname / 昵称
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={100}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-[#1a5f7a] dark:focus:border-[#2d7a9b] focus:ring-2 focus:ring-[#1a5f7a]/20 dark:focus:ring-[#2d7a9b]/20 outline-none transition-all"
                                placeholder="怎么称呼你？"
                                value={formData.nickname}
                                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                            />
                        </div>

                        {/* Contact Field */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider mb-2">
                                Contact / 联系方式
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={100}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-[#1a5f7a] dark:focus:border-[#2d7a9b] focus:ring-2 focus:ring-[#1a5f7a]/20 dark:focus:ring-[#2d7a9b]/20 outline-none transition-all"
                                placeholder="微信 / 手机 / 邮箱"
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            />
                        </div>

                        {/* Idea Field */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider mb-2">
                                Your Idea / 您的想法
                            </label>
                            <textarea
                                required
                                rows={6}
                                maxLength={2000}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-[#1a5f7a] dark:focus:border-[#2d7a9b] focus:ring-2 focus:ring-[#1a5f7a]/20 dark:focus:ring-[#2d7a9b]/20 outline-none transition-all resize-none"
                                placeholder="展开说说你的想法..."
                                value={formData.idea}
                                onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                            />
                            <div className="text-right text-xs text-gray-400 mt-1">
                                {formData.idea.length}/2000
                            </div>
                        </div>

                        {/* File Upload Field */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider mb-2">
                                Attachment / 附件 (Optional, Max 3, &lt;3MB)
                            </label>

                            {/* File List */}
                            {formData.files.length > 0 && (
                                <div className="mb-3 space-y-2">
                                    {formData.files.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center overflow-hidden">
                                                <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px]">
                                                    {file.name}
                                                </span>
                                                <span className="text-xs text-gray-400 ml-2">
                                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upload Button */}
                            {formData.files.length < 3 && (
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".doc,.docx,.pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-upload"
                                        multiple
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-[#1a5f7a] dark:hover:border-[#2d7a9b] transition-colors group"
                                    >
                                        <div className="text-center">
                                            <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                                                点击上传文件 (Word, PDF, JPG, PNG)
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            )}

                            {errorMessage && (
                                <p className="text-red-500 text-xs mt-2 animate-pulse">
                                    {errorMessage}
                                </p>
                            )}
                        </div>

                        {submitStatus === 'error' && !errorMessage && (
                            <p className="text-red-500 text-sm text-center">
                                提交失败，请稍后重试。
                            </p>
                        )}

                        <div className="flex gap-4 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 px-6 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                            >
                                取消 / Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-[#1a5f7a] to-[#2d7a9b] text-white font-medium hover:shadow-lg hover:shadow-[#1a5f7a]/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? '提交中...' : '提交 / Submit'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
