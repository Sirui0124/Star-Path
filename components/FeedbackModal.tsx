import React, { useState } from 'react';
import { X, MessageSquare, Copy, Check, Mail } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const FeedbackModal: React.FC<Props> = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // 开发者邮箱 - 使用您提供的QQ邮箱
  const DEVELOPER_EMAIL = "zhou01248@qq.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(DEVELOPER_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMailto = () => {
    const subject = "星途(Star Path) 游戏反馈";
    // 构建邮件正文
    const body = message ? `反馈内容：\n${message}\n\n----------------\n(来自游戏内反馈)` : "";
    
    // 尝试唤起系统邮件客户端
    window.location.href = `mailto:${DEVELOPER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in font-sans">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative z-10 w-full max-w-[340px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="bg-slate-900 p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-yellow-400" />
                <span className="font-bold text-sm">联系开发者/提建议</span>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X size={18} />
            </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
            
            <div className="text-xs text-gray-500 leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-100">
                👋 嘿！欢迎提建议！作者纯个人业余时间为爱发电搞着玩儿，永不收费，可以直接邮箱直接发送反馈给我。
            </div>

            {/* Email Display Section */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">开发者邮箱</label>
                <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 p-3 rounded-xl border border-gray-200 text-sm font-mono text-gray-800 font-bold select-all truncate">
                        {DEVELOPER_EMAIL}
                    </div>
                    <button 
                        onClick={handleCopy}
                        className={`p-3 rounded-xl border transition-all shadow-sm shrink-0 flex items-center justify-center ${
                            copied 
                            ? 'bg-green-50 border-green-200 text-green-600' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                        title="复制邮箱"
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                </div>
            </div>

            {/* Draft Section */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">预编辑内容 (可选)</label>
                <textarea 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 min-h-[80px] resize-none"
                    placeholder="在此草拟您的建议，点击下方按钮将自动填入邮件正文..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>

            {/* Action Buttons */}
            <button 
                onClick={handleMailto}
                className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
            >
                <Mail size={16} /> 唤起邮件APP发送
            </button>
        </div>
      </div>
    </div>
  );
};
