import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  X, 
  Minimize2,
  Maximize2,
  Loader2,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { User as UserType } from '../../types/user';
import { chatbotService } from '../../services/chatbotService';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  functionCall?: {
    action: string;
    params: any;
    result?: any;
  };
}

interface VIRAChatProps {
  user: UserType;
  role: 'farmer' | 'consumer' | 'warehouse' | 'admin';
  onMinimize?: () => void;
  minimized?: boolean; // Deprecated - always starts minimized now
}

export function VIRAChat({ user, role, onMinimize, minimized = false }: VIRAChatProps) {
  // Safety check for user
  if (!user) {
    console.warn('VIRAChat: user prop is missing');
    return null;
  }

  // Initialize messages with role-specific welcome message
  const getInitialMessage = useCallback(() => ({
    id: '1',
    role: 'assistant' as const,
    content: getWelcomeMessage(role, user.name || 'User'),
    timestamp: new Date()
  }), [role, user.name]);
  
  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  
  // Update welcome message when role changes
  useEffect(() => {
    setMessages([getInitialMessage()]);
  }, [getInitialMessage]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Always start minimized
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const closeConfirmTimeoutRef = useRef<number | null>(null);

  const clearCloseConfirmTimeout = useCallback(() => {
    if (closeConfirmTimeoutRef.current) {
      window.clearTimeout(closeConfirmTimeoutRef.current);
      closeConfirmTimeoutRef.current = null;
    }
  }, []);

  const handleOpen = useCallback(() => {
    console.log('VIRAChat: Opening chat window', { wasOpen: isOpen });
    clearCloseConfirmTimeout();
    setShowCloseConfirm(false);
    setIsOpen(true);
    console.log('VIRAChat: Chat window state set to open');
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [clearCloseConfirmTimeout, isOpen]);

  const handleMinimize = useCallback(() => {
    clearCloseConfirmTimeout();
    setShowCloseConfirm(false);
    setIsOpen(false);
    onMinimize?.();
  }, [clearCloseConfirmTimeout, onMinimize]);

  const handleRequestClose = useCallback(() => {
    if (showCloseConfirm) {
      handleMinimize();
      return;
    }

    setShowCloseConfirm(true);
    clearCloseConfirmTimeout();
    closeConfirmTimeoutRef.current = window.setTimeout(() => {
      setShowCloseConfirm(false);
      closeConfirmTimeoutRef.current = null;
    }, 3000);
  }, [showCloseConfirm, handleMinimize, clearCloseConfirmTimeout]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const start = container.scrollTop;
      const end = container.scrollHeight - container.clientHeight;
      const change = end - start;
      const increment = 20;
      
      // Smooth scroll animation
      const animateScroll = (elapsed: number) => {
        elapsed += increment;
        const position = easeInOutQuad(elapsed, start, change, 200);
        container.scrollTop = position;
        
        if (elapsed < 200) {
          requestAnimationFrame(() => animateScroll(elapsed + increment));
        }
      };
      
      requestAnimationFrame(() => animateScroll(0));
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Easing function for smooth scrolling
  const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
  };

  const scrollToTop = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const start = container.scrollTop;
      const scrollAmount = container.clientHeight * 0.8;
      const end = Math.min(start + scrollAmount, container.scrollHeight - container.clientHeight);
      const change = end - start;
      const increment = 20;
      
      if (change === 0) return;
      
      // Smooth scroll animation
      const animateScroll = (elapsed: number) => {
        elapsed += increment;
        const position = easeInOutQuad(elapsed, start, change, 200);
        container.scrollTop = position;
        
        if (elapsed < 200) {
          requestAnimationFrame(() => animateScroll(elapsed + increment));
        }
      };
      
      requestAnimationFrame(() => animateScroll(0));
    }
  };

  const scrollUp = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const start = container.scrollTop;
      const scrollAmount = container.clientHeight * 0.8;
      const end = Math.max(start - scrollAmount, 0);
      const change = end - start;
      const increment = 20;
      
      if (change === 0) return;
      
      // Smooth scroll animation
      const animateScroll = (elapsed: number) => {
        elapsed += increment;
        const position = easeInOutQuad(elapsed, start, change, 200);
        container.scrollTop = position;
        
        if (elapsed < 200) {
          requestAnimationFrame(() => animateScroll(elapsed + increment));
        }
      };
      
      requestAnimationFrame(() => animateScroll(0));
    }
  };
  
  const checkScrollPosition = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setCanScrollUp(scrollTop > 0);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 10);
    }
  };

  // Debug: Log when component mounts and state changes
  useEffect(() => {
    console.log('VIRAChat: Component state changed', { 
      user: user?.name, 
      role, 
      botName: getBotName(role),
      userId: user?.id,
      isOpen,
      willShowLauncher: !isOpen,
      willShowChatWindow: isOpen,
      documentBody: !!document.body
    });
    
    // Verify the portal container exists and is visible
    setTimeout(() => {
      const container = document.getElementById('vira-chatbot-container');
      if (container) {
        const styles = window.getComputedStyle(container);
        if (isOpen) {
          // Look for the Card element which is inside the chat window
          const chatWindow = container.querySelector('.w-full.h-full.flex.flex-col.shadow-2xl');
          const chatWindowParent = chatWindow?.parentElement;
          const chatWindowStyles = chatWindowParent ? window.getComputedStyle(chatWindowParent as HTMLElement) : null;
          console.log('VIRAChat: Chat window check', { 
            containerExists: true,
            chatWindowCardExists: !!chatWindow,
            chatWindowParentExists: !!chatWindowParent,
            chatWindowDisplay: chatWindowStyles?.display,
            chatWindowVisibility: chatWindowStyles?.visibility,
            chatWindowOpacity: chatWindowStyles?.opacity,
            chatWindowWidth: chatWindowStyles?.width,
            chatWindowHeight: chatWindowStyles?.height,
            chatWindowVisible: chatWindowParent ? (chatWindowParent as HTMLElement).offsetWidth > 0 && (chatWindowParent as HTMLElement).offsetHeight > 0 : false
          });
        } else {
          const button = container.querySelector('button');
          const buttonStyles = button ? window.getComputedStyle(button) : null;
          console.log('VIRAChat: Launcher button check', { 
            containerExists: true,
            buttonExists: !!button,
            buttonDisplay: buttonStyles?.display,
            buttonVisibility: buttonStyles?.visibility,
            buttonOpacity: buttonStyles?.opacity,
            buttonVisible: button ? button.offsetWidth > 0 && button.offsetHeight > 0 : false
          });
        }
      } else {
        console.error('VIRAChat: Portal container NOT FOUND in DOM!');
      }
    }, 300);
  }, [isOpen, user, role]);

  useEffect(() => {
    scrollToBottom();
    checkScrollPosition();
  }, [messages]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        handleRequestClose();
        return;
      }

      if (e.ctrlKey) {
        if (e.key === 'ArrowUp' && canScrollUp) {
          e.preventDefault();
          scrollUp();
        } else if (e.key === 'ArrowDown' && canScrollDown) {
          e.preventDefault();
          scrollDown();
        } else if (e.key === 'Home') {
          e.preventDefault();
          scrollToTop();
        } else if (e.key === 'End') {
          e.preventDefault();
          scrollToBottom();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, canScrollUp, canScrollDown, handleRequestClose]);

  useEffect(() => {
    return () => {
      clearCloseConfirmTimeout();
    };
  }, [clearCloseConfirmTimeout]);

  // Check scroll position on scroll and when messages change
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      checkScrollPosition();
      container.addEventListener('scroll', checkScrollPosition, { passive: true });
      window.addEventListener('resize', checkScrollPosition, { passive: true });
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [messages]);

  const handleSend = async () => {
    const messageText = input.trim();
    if (!messageText || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatbotService.sendMessage(
        messageText,
        user,
        role,
        messages.map(m => ({ role: m.role, content: m.content }))
      );


      if (response.type === 'function_call') {
        const action = response.action;

        if (!action) {
          toast.error('Action missing', {
            description: 'The assistant could not determine which action to run. Please try again.'
          });
          const clarificationMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'I could not determine the exact action to take. Could you provide more details or rephrase your request?',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, clarificationMessage]);
          return;
        }

        // Show function call message with better formatting
        const functionMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `🔧 Executing: **${action.replace(/_/g, ' ')}**...\n\nPlease wait while I process this request.`,
          timestamp: new Date(),
          functionCall: {
            action,
            params: response.params
          }
        };
        setMessages(prev => [...prev, functionMessage]);
        scrollToBottom();

        // Execute function with progress indication
        const result = await chatbotService.executeFunction(
          action,
          response.params,
          user,
          role
        );

        // Update function message with result
        setMessages(prev => prev.map(msg => 
          msg.id === functionMessage.id 
            ? { 
                ...msg, 
                content: `✅ **${action.replace(/_/g, ' ')}** completed!`,
                functionCall: { ...msg.functionCall!, result } 
              }
            : msg
        ));

        // Add detailed result message
        const resultMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: result.message || `✅ ${action.replace(/_/g, ' ')} completed successfully.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, resultMessage]);

        if (result.success) {
          toast.success('Action completed successfully', {
            description: result.message?.split('\n')[0] || 'Your request has been processed.'
          });
        } else {
          toast.error('Action failed', {
            description: result.message || 'Please try again or contact support.'
          });
        }
      } else {
        // Regular message response with markdown support
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.content || 'I apologize, but I couldn\'t generate a response. Please try again.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ I apologize, but I encountered an error: ${error.message || 'Unknown error'}.\n\nPlease try again or rephrase your question. If the issue persists, contact support.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to process message', {
        description: error.message || 'Please try again.'
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Render both launcher and chat window, showing/hiding based on state
  return createPortal(
    <div
      id="vira-chatbot-container"
      style={{ 
        pointerEvents: 'none',
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999
      }}
    >
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="vira-chat-launcher"
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 180 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ 
              pointerEvents: 'auto', 
              position: 'relative',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Button
              onClick={handleOpen}
              className="rounded-full w-20 h-20 shadow-2xl bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 border-4 border-white p-0 relative group"
              aria-label="Open VIRA Chat"
              style={{
                boxShadow: '0 10px 40px rgba(34, 197, 94, 0.8), 0 0 30px rgba(59, 130, 246, 0.6), 0 0 50px rgba(34, 197, 94, 0.4)',
                backgroundColor: '#22c55e',
                backgroundImage: 'linear-gradient(to right, #22c55e, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                minWidth: '80px',
                minHeight: '80px',
                padding: 0
              }}
            >
              <MessageCircle className="w-8 h-8 text-white group-hover:scale-110 transition-transform" style={{ display: 'block', zIndex: 10 }} />
              <motion.span
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-green-400 blur-xl"
                style={{ zIndex: -1 }}
              />
              {messages.length > 1 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold border-2 border-white shadow-lg"
                  style={{ zIndex: 20 }}
                >
                  {messages.length - 1}
                </motion.span>
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="vira-chat-window"
            initial={{ scale: 0.8, opacity: 0, y: 20, x: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0, x: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20, x: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ 
              pointerEvents: 'auto',
              width: '384px',
              maxWidth: '90vw',
              height: '600px',
              maxHeight: '80vh'
            }}
          >
            <Card className="w-full h-full flex flex-col shadow-2xl border-2 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      {getBotName(role)}
                    </CardTitle>
                    <p className="text-xs text-gray-500">AI Assistant</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMinimize}
                    className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full"
                    title="Minimize"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRequestClose}
                      className={`h-9 w-9 p-0 rounded-full transition-all duration-200 ${
                        showCloseConfirm
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'hover:bg-red-100 hover:text-red-600 border-2 border-red-200'
                      }`}
                      title={showCloseConfirm ? 'Click again to close' : 'Close Chat (Esc)'}
                      style={{
                        minWidth: '36px',
                        minHeight: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      {showCloseConfirm ? (
                        <motion.span
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-xs font-medium"
                        >
                          ✓
                        </motion.span>
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </Button>
                    
                    {/* Confirmation tooltip */}
                    <AnimatePresence>
                      {showCloseConfirm && (
                        <motion.div
                          initial={{ opacity: 0, y: 5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          className="absolute -top-9 right-0 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap shadow-lg"
                        >
                          Click again to close
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
                <div className="flex-1 relative overflow-hidden">
                  <div 
                    ref={messagesContainerRef}
                    className="h-full overflow-y-auto p-4"
                    style={{ 
                      maxHeight: '100%',
                      paddingRight: '60px' // Add padding to prevent content from hiding behind scroll buttons
                    }}
                  >
                    <div className="space-y-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.role === 'assistant' && (
                            <Avatar className="w-8 h-8 border-2 border-green-200">
                              <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
                                <Bot className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`flex flex-col max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                message.role === 'user'
                                  ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <div className="text-sm whitespace-pre-wrap prose prose-sm max-w-none">
                                {formatMessageContent(message.content)}
                              </div>
                              {message.functionCall && (
                                <div className="mt-2 pt-2 border-t border-gray-300">
                                  <Badge variant="outline" className="text-xs">
                                    {message.functionCall.action}
                                  </Badge>
                                  {message.functionCall.result && (
                                    <div className="mt-1 text-xs">
                                      {message.functionCall.result.success ? (
                                        <CheckCircle className="w-3 h-3 text-green-500 inline mr-1" />
                                      ) : (
                                        <AlertCircle className="w-3 h-3 text-red-500 inline mr-1" />
                                      )}
                                      {message.functionCall.result.message}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 mt-1">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {message.role === 'user' && (
                            <Avatar className="w-8 h-8 border-2 border-green-200">
                              <AvatarFallback className="bg-blue-500 text-white">
                                {user.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {loading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 justify-start"
                      >
                        <Avatar className="w-8 h-8 border-2 border-green-200">
                          <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                          <span className="text-sm text-gray-600">VIRA is thinking...</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50"
                style={{
                  transition: 'all 0.2s ease-in-out',
                  opacity: 0.9,
                  pointerEvents: 'auto'
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: canScrollUp ? 1 : 0.4,
                    y: 0,
                    scale: canScrollUp ? 1 : 0.9
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  style={{
                    pointerEvents: canScrollUp ? 'auto' : 'none',
                    filter: canScrollUp ? 'none' : 'grayscale(50%)',
                    cursor: canScrollUp ? 'pointer' : 'not-allowed'
                  }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={scrollToTop}
                    disabled={!canScrollUp}
                    className="h-10 w-10 p-0 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-200"
                    title="Scroll to Top (Home)"
                    style={{
                      border: '2px solid rgba(59, 130, 246, 0.8)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      minWidth: '40px',
                      minHeight: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: canScrollUp ? 1 : 0.6
                    }}
                  >
                    <ChevronUp className="w-5 h-5 text-blue-500" />
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: canScrollUp ? 1 : 0.4,
                    y: 0,
                    scale: canScrollUp ? 1 : 0.9
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  style={{
                    pointerEvents: canScrollUp ? 'auto' : 'none',
                    filter: canScrollUp ? 'none' : 'grayscale(50%)',
                    cursor: canScrollUp ? 'pointer' : 'not-allowed'
                  }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={scrollUp}
                    disabled={!canScrollUp}
                    className="h-10 w-10 p-0 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-200"
                    title="Scroll Up (Ctrl+↑)"
                    style={{
                      border: '2px solid rgba(59, 130, 246, 0.8)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      minWidth: '40px',
                      minHeight: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: canScrollUp ? 1 : 0.6
                    }}
                  >
                    <ChevronUp className="w-5 h-5 text-blue-500" />
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: canScrollDown ? 1 : 0.4,
                    y: 0,
                    scale: canScrollDown ? 1 : 0.9
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  style={{
                    pointerEvents: canScrollDown ? 'auto' : 'none',
                    filter: canScrollDown ? 'none' : 'grayscale(50%)',
                    cursor: canScrollDown ? 'pointer' : 'not-allowed'
                  }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={scrollDown}
                    disabled={!canScrollDown}
                    className="h-10 w-10 p-0 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-200"
                    title="Scroll Down (Ctrl+↓)"
                    style={{
                      border: '2px solid rgba(59, 130, 246, 0.8)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      minWidth: '40px',
                      minHeight: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: canScrollDown ? 1 : 0.6
                    }}
                  >
                    <ChevronDown className="w-5 h-5 text-blue-500" />
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: canScrollDown ? 1 : 0.4,
                    y: 0,
                    scale: canScrollDown ? 1 : 0.9
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  style={{
                    pointerEvents: canScrollDown ? 'auto' : 'none',
                    filter: canScrollDown ? 'none' : 'grayscale(50%)',
                    cursor: canScrollDown ? 'pointer' : 'not-allowed'
                  }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={scrollToBottom}
                    disabled={!canScrollDown}
                    className="h-10 w-10 p-0 rounded-full bg-green-50/90 backdrop-blur-sm shadow-lg hover:bg-green-100 transition-all duration-200"
                    title="Scroll to Bottom (End)"
                    style={{
                      border: '2px solid rgba(34, 197, 94, 0.8)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      minWidth: '40px',
                      minHeight: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: canScrollDown ? 1 : 0.6
                    }}
                  >
                    <ChevronDown className="w-5 h-5 text-green-600" />
                  </Button>
                </motion.div>
              </div>

              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Powered by VIRA AI • {getBotName(role)}
                </p>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}

function getWelcomeMessage(role: string, userName: string): string {
  const messages = {
    farmer: `Hello ${userName}! I'm VIRA, your farming assistant. I can help you with:
• Crop advice and weather information
• Payment processing and ledger updates
• Government scheme information
• QR code generation
• Notifications and alerts

How can I help you today?`,
    consumer: `Hi ${userName}! I'm VIRA, your shopping assistant. I can help you with:
• Product information and recommendations
• Order tracking and delivery updates
• Payment processing
• Carbon footprint tracking
• Finding local farmers

What would you like to know?`,
    warehouse: `Hello ${userName}! I'm VIRA, your warehouse assistant. I can help you with:
• Inventory management
• Product movement tracking
• Order processing
• Storage optimization
• Analytics and reports

How can I assist you?`,
    admin: `Hello ${userName}! I'm VIRA, your admin assistant. I can help you with:
• System monitoring and analytics
• User management
• Transaction oversight
• System configuration
• Reports and insights

What do you need?`
  };
  return messages[role as keyof typeof messages] || `Hello ${userName}! How can I help you?`;
}

function getBotName(role: string): string {
  const names = {
    farmer: 'VIRA Farmer',
    consumer: 'VIRA Consumer',
    warehouse: 'VIRA Warehouse',
    admin: 'VIRA Admin'
  };
  return names[role as keyof typeof names] || 'VIRA';
}

// Format message content with markdown-like support
function formatMessageContent(content: string): React.ReactNode {
  // Split by newlines first
  const lines = content.split('\n');
  
  return (
    <>
      {lines.map((line, lineIndex) => {
        // Process bold text (**text**)
        const parts: React.ReactNode[] = [];
        const boldRegex = /\*\*([^*]+)\*\*/g;
        let match;
        let lastIndex = 0;
        let keyCounter = 0;
        
        while ((match = boldRegex.exec(line)) !== null) {
          // Add text before match
          if (match.index > lastIndex) {
            parts.push(
              <React.Fragment key={`text-${keyCounter++}`}>
                {line.substring(lastIndex, match.index)}
              </React.Fragment>
            );
          }
          // Add bold text
          parts.push(
            <strong key={`bold-${keyCounter++}`}>{match[1]}</strong>
          );
          lastIndex = match.index + match[0].length;
        }
        
        // Add remaining text
        if (lastIndex < line.length) {
          parts.push(
            <React.Fragment key={`text-${keyCounter++}`}>
              {line.substring(lastIndex)}
            </React.Fragment>
          );
        }
        
        // If no bold formatting found, use original line
        if (parts.length === 0) {
          parts.push(line);
        }
        
        return (
          <React.Fragment key={lineIndex}>
            {lineIndex > 0 && <br />}
            {parts}
          </React.Fragment>
        );
      })}
    </>
  );
}

