
import React, { useState } from 'react';
import { X, Send, MessageSquare, Loader2, CheckCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const FeedbackModal: React.FC<Props> = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      alert("请填写建议内容");
      return;
    }

    setIsSending(true);

    try {
        // 使用 FormSubmit 的 AJAX 接口发送邮件
        await fetch("https://formsubmit.co/ajax/siruizhou@gmail.com", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: "《星途》游戏新反馈", // 邮件标题
                _template: "table", // 邮件内容格式
                _captcha: "false", // 关闭验证码
                建议内容: message,
                联系方式: contact || "未预留"
            })
        });

        setIsSuccess(true);
        // 成功后延迟关闭
        setTimeout(() => {
            onClose();
        }, 2000);

    } catch (error) {
        console.error("Feedback error:", error);
        alert("网络开小差了，发送失败，请稍后再试。");
        setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in font-sans">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={!isSending ? onClose : undefined}></div>

      <div className="relative z-10 w-full max-w-[300px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
                <MessageSquare size={18} />
                <span className="font-bold text-sm">给开发者提建议</span>
            </div>
            {!isSending && !isSuccess && (
                <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <X size={18} />
                </button>
            )}
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
            {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-500">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">发送成功！</h3>
                    <p className="text-xs text-gray-500">感谢你的建议，开发者这就去修bug...</p>
                </div>
            ) : (
                <>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">你想说什么 (必填)</label>
                        <textarea 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none disabled:opacity-50"
                            placeholder="吐槽、建议、或者单纯的夸夸..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isSending}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">联系方式 (选填)</label>
                        <input 
                            type="text" 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            placeholder="微信号 / 邮箱"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            disabled={isSending}
                        />
                    </div>

                    <button 
                        onClick={handleSubmit}
                        disabled={isSending}
                        className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                            isSending 
                            ? 'bg-gray-400 text-white cursor-not-allowed' 
                            : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
                        }`}
                    >
                        {isSending ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> 发送中...
                            </>
                        ) : (
                            <>
                                <Send size={16} /> 直接发送
                            </>
                        )}
                    </button>
                    
                    {!isSending && (
                        <p className="text-[10px] text-gray-400 text-center leading-tight">
                            * 您的建议将直接发送至开发者邮箱
                        </p>
                    )}
                </>
            )}
        </div>
      </div>
    </div>
  );
};
