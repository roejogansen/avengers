import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronLeft, Video, Plus, Share, Signal, Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PhoneChat = () => {
    const [step, setStep] = useState(0);
    const scrollRef = useRef(null);

    // Auto-scroll effect
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [step]);

    useEffect(() => {
        const sequence = async () => {
            await new Promise(r => setTimeout(r, 800));
            setStep(1); // Message 1 (Vimeo)
            await new Promise(r => setTimeout(r, 1200));
            setStep(2); // Reply (Just this so far)
            await new Promise(r => setTimeout(r, 1200));
            setStep(3); // Attachment
            await new Promise(r => setTimeout(r, 1500));
            setStep(4); // Message Group 3 (Yo bro)
        };
        sequence();
    }, []);

    const messageVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } }
    };

    return (
        /* Responsive Wrapper */
        <div className="w-full flex justify-center perspective-1000">
            {/* iPhone 17 Silver Frame */}
            <div className="relative mx-auto w-[300px] sm:w-[340px] h-[600px] sm:h-[680px] rounded-[3rem] sm:rounded-[3.5rem] p-[3px] shadow-2xl transform transition-transform hover:scale-[1.01] duration-500 bg-gradient-to-br from-stone-200 via-white to-stone-300"
                style={{
                    boxShadow: '0 0 0 1px #c0c0c0, 0 20px 50px -10px rgba(0,0,0,0.2)'
                }}>

                <div className="relative w-full h-full bg-black rounded-[2.8rem] sm:rounded-[3.3rem] border-[6px] border-black overflow-hidden">

                    {/* Dynamic Island */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[28px] sm:h-[34px] w-[100px] sm:w-[120px] bg-black rounded-b-[20px] z-40 flex items-center justify-center gap-2 pointer-events-none">
                        <div className="w-2 h-2 rounded-full bg-[#1a1a1a] shadow-inner"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0f0f0f]"></div>
                    </div>

                    {/* Side Buttons */}
                    <div className="absolute -left-[10px] top-28 h-10 w-[4px] bg-[#d1d1d1] rounded-l-md z-0"></div>
                    <div className="absolute -left-[10px] top-44 h-16 w-[4px] bg-[#d1d1d1] rounded-l-md z-0"></div>
                    <div className="absolute -left-[10px] top-64 h-16 w-[4px] bg-[#d1d1d1] rounded-l-md z-0"></div>
                    <div className="absolute -right-[10px] top-40 h-24 w-[4px] bg-[#d1d1d1] rounded-r-md z-0"></div>

                    {/* Screen Content */}
                    <div className="w-full h-full bg-white rounded-[2.5rem] sm:rounded-[3rem] flex flex-col relative z-10 overflow-hidden font-sans">

                        {/* Status Bar */}
                        <div className="h-12 sm:h-14 flex justify-between items-end px-6 sm:px-8 pb-2 text-black z-30 absolute top-0 w-full pointer-events-none select-none">
                            <span className="text-[13px] sm:text-[15px] font-semibold tracking-tight ml-1">12:37</span>
                            <div className="flex gap-1.5 items-center">
                                <Signal className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                                <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <div className="w-5 sm:w-6 h-2.5 sm:h-3 bg-black/10 rounded-[3px] relative border border-black/30">
                                    <div className="absolute inset-0.5 bg-black rounded-[1px] w-[60%]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Nav Bar */}
                        <div className="bg-white/90 backdrop-blur-xl h-28 sm:h-32 flex items-end justify-between px-4 z-20 absolute top-0 w-full pb-3 border-b border-stone-200">
                            <div className="flex items-center text-[#007AFF] mb-0.5 cursor-pointer hover:opacity-70 transition-opacity">
                                <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 -ml-2" strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col items-center mb-1">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-stone-200 rounded-full mb-1 overflow-hidden flex items-center justify-center shadow-sm relative">
                                    <img
                                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ragnsan&backgroundColor=b6e3f4"
                                        alt="Ragnsan"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-[10px] sm:text-[11px] font-semibold text-black flex items-center gap-0.5">
                                    Ragnsan <span className="text-stone-300 text-[10px]">›</span>
                                </span>
                            </div>
                            <div className="w-8 flex justify-end mb-2 cursor-pointer hover:opacity-70 transition-opacity">
                                <Video className="w-6 h-6 sm:w-7 sm:h-7 text-[#007AFF]" />
                            </div>
                        </div>

                        {/* Chat Content */}
                        <div ref={scrollRef} className="flex-1 px-4 py-2 space-y-1 overflow-y-auto flex flex-col bg-white pt-32 sm:pt-36 pb-20 scroll-smooth no-scrollbar">

                            <AnimatePresence>
                                {step >= 1 && (
                                    <>
                                        <motion.div
                                            initial="hidden" animate="visible" variants={messageVariants}
                                            className="self-end max-w-[85%] bg-[#007AFF] text-white px-4 py-2.5 rounded-[20px] rounded-tr-sm text-[15px] sm:text-[17px] leading-snug shadow-sm mb-4"
                                        >
                                            Did you by any chance get some new replies from Vimeo?
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                                            className="text-center py-3"
                                        >
                                            <span className="text-[10px] sm:text-[11px] text-stone-400 font-medium">Sat, 21 Jun at 21:24</span>
                                        </motion.div>
                                    </>
                                )}

                                {step >= 2 && (
                                    <motion.div
                                        initial="hidden" animate="visible" variants={messageVariants}
                                        className="self-start max-w-[85%] bg-[#E9E9EB] text-black px-4 py-2.5 rounded-[20px] rounded-tl-sm text-[15px] sm:text-[17px] leading-snug shadow-sm mb-1"
                                    >
                                        Just this so far
                                    </motion.div>
                                )}

                                {step >= 3 && (
                                    <motion.div
                                        initial="hidden" animate="visible" variants={messageVariants}
                                        className="self-start max-w-[90%] bg-white border border-stone-200 rounded-[18px] p-4 mb-4 shadow-sm relative flex flex-col gap-3 cursor-pointer hover:bg-stone-50 transition-colors"
                                    >
                                        <div>
                                            <div className="text-[10px] text-stone-900 font-bold">Thank you for reaching out! 249...</div>
                                            <div className="text-[9px] text-stone-400 font-mono mb-1">Vimeo Support</div>
                                        </div>
                                        <div className="space-y-1.5 opacity-50 select-none">
                                            <div className="h-2 w-full bg-stone-100 rounded"></div>
                                            <div className="h-2 w-11/12 bg-stone-100 rounded"></div>
                                            <div className="h-2 w-4/6 bg-stone-100 rounded"></div>
                                            <div className="h-2 w-full bg-stone-100 rounded mt-2"></div>
                                            <div className="h-12 w-full border border-stone-100 rounded mt-2"></div>
                                        </div>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-transparent border border-[#007AFF] rounded-full flex items-center justify-center translate-x-full ml-4">
                                            <Share className="w-4 h-4 text-[#007AFF]" />
                                        </div>
                                    </motion.div>
                                )}

                                {step >= 4 && (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                                            className="text-center py-3"
                                        >
                                            <span className="text-[10px] sm:text-[11px] text-stone-400 font-medium">Today 12:21</span>
                                        </motion.div>

                                        <div className="flex flex-col items-end space-y-0.5 w-full">
                                            <motion.div initial="hidden" animate="visible" variants={messageVariants} className="bg-[#007AFF] text-white px-4 py-2.5 rounded-[20px] rounded-br-sm text-[15px] sm:text-[17px] leading-snug shadow-sm max-w-[85%] text-right">
                                                Yo bro
                                            </motion.div>
                                            <motion.div initial="hidden" animate="visible" variants={messageVariants} transition={{ delay: 0.1 }} className="bg-[#007AFF] text-white px-4 py-2.5 rounded-[20px] rounded-tr-sm rounded-br-sm text-[15px] sm:text-[17px] leading-snug shadow-sm max-w-[85%] text-right">
                                                How you doing bad boy
                                            </motion.div>
                                            <motion.div initial="hidden" animate="visible" variants={messageVariants} transition={{ delay: 0.2 }} className="bg-[#007AFF] text-white px-4 py-2.5 rounded-[20px] rounded-tr-sm text-[15px] sm:text-[17px] leading-snug shadow-sm max-w-[85%] text-right">
                                                Could you assist with the everfit apple dev thing kindly sir
                                            </motion.div>
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-[10px] text-stone-400 font-medium mt-1 mr-1">
                                                Delivered
                                            </motion.div>
                                        </div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Input Area */}
                        <div className="bg-white p-3 pb-8 flex items-end gap-3 z-20 absolute bottom-0 w-full border-t border-stone-100">
                            <div className="flex items-center justify-center h-[36px] w-[36px] bg-stone-200 rounded-full flex-shrink-0 cursor-pointer hover:bg-stone-300 transition-colors">
                                <Plus className="w-5 h-5 text-stone-500" strokeWidth={2.5} />
                            </div>
                            <div className="flex-1 min-h-[36px] bg-white rounded-[18px] border border-stone-300 flex items-center px-4 justify-between mb-0.5 cursor-text">
                                <span className="text-stone-400 text-[15px] sm:text-[17px]">iMessage</span>
                                <div className="w-[18px] flex items-center justify-center">
                                    <div className="flex items-center gap-[2px] h-4">
                                        <div className="w-[2px] h-2 bg-[#FF3B30] rounded-full"></div>
                                        <div className="w-[2px] h-3 bg-[#FF3B30] rounded-full"></div>
                                        <div className="w-[2px] h-2 bg-[#FF3B30] rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Home Indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-[5px] w-[130px] bg-black rounded-full z-30 pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhoneChat;
