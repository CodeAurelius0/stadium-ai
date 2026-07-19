"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  ArrowLeftRight,
  Copy,
  Volume2,
  Sparkles,
  RefreshCw,
  Check,
  History,
  Star,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LANGUAGES } from "@/lib/constants";

interface TranslationResult {
  translation: string;
  pronunciation?: string;
  culturalNote?: string;
  alternatives?: string[];
}

interface TranslationHistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: Date;
}

const commonPhrases = [
  { text: "Where is the nearest restroom?", category: "Navigation" },
  { text: "I need medical help", category: "Emergency" },
  { text: "How do I get to my seat?", category: "Navigation" },
  { text: "What time does the match start?", category: "Match" },
  { text: "Where can I buy water?", category: "Food" },
  { text: "I've lost my child", category: "Emergency" },
  { text: "Where is the nearest exit?", category: "Safety" },
  { text: "How long is the wait?", category: "Queue" },
  { text: "Can you help me find my seat?", category: "Navigation" },
  { text: "Is there a vegetarian option?", category: "Food" },
  { text: "Where is the lost and found?", category: "Services" },
  { text: "I need wheelchair assistance", category: "Accessibility" },
];

export default function TranslatePage() {
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [sourceText, setSourceText] = useState("");
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  const [showSourceLangs, setShowSourceLangs] = useState(false);
  const [showTargetLangs, setShowTargetLangs] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sourceLangData = LANGUAGES.find((l) => l.code === sourceLang)!;
  const targetLangData = LANGUAGES.find((l) => l.code === targetLang)!;

  const handleSwapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    if (result) {
      setSourceText(result.translation);
      setResult(null);
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    setResult(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sourceText,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
        setHistory((prev) => [
          {
            id: Math.random().toString(36).slice(2),
            sourceText,
            translatedText: data.translation,
            sourceLang,
            targetLang,
            timestamp: new Date(),
          },
          ...prev.slice(0, 9),
        ]);
      } else {
        throw new Error("Translation failed");
      }
    } catch {
      // Fallback demo translation
      const demoTranslations: Record<string, Record<string, string>> = {
        "Where is the nearest restroom?": {
          es: "¿Dónde está el baño más cercano?",
          fr: "Où sont les toilettes les plus proches ?",
          de: "Wo ist die nächste Toilette?",
          pt: "Onde fica o banheiro mais próximo?",
          ar: "أين أقرب دورة مياه؟",
          zh: "最近的洗手间在哪里？",
          ja: "一番近いトイレはどこですか？",
          hi: "सबसे नज़दीकी शौचालय कहाँ है?",
        },
        "I need medical help": {
          es: "Necesito ayuda médica",
          fr: "J'ai besoin d'aide médicale",
          de: "Ich brauche medizinische Hilfe",
          pt: "Preciso de ajuda médica",
        },
      };

      const fallbackTranslation = demoTranslations[sourceText]?.[targetLang] || `[${targetLangData.name}] ${sourceText}`;
      
      const fallbackResult: TranslationResult = {
        translation: fallbackTranslation,
        pronunciation: targetLang === "ja" ? "Ichiban chikai toire wa doko desu ka?" :
                       targetLang === "zh" ? "Zuìjìn de xǐshǒujiān zài nǎlǐ?" :
                       targetLang === "ar" ? "Ayna aqrab dawrat miyah?" :
                       targetLang === "hi" ? "Sabse nazdeeki shauchalay kahaan hai?" : undefined,
        culturalNote: "In stadium contexts, restrooms are typically referred to by section numbers. Staff can assist with directions.",
        alternatives: [],
      };

      setResult(fallbackResult);
      setHistory((prev) => [
        {
          id: Math.random().toString(36).slice(2),
          sourceText,
          translatedText: fallbackResult.translation,
          sourceLang,
          targetLang,
          timestamp: new Date(),
        },
        ...prev.slice(0, 9),
      ]);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [sourceText]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-3">
          <Globe className="w-7 h-7 text-primary" />
          AI Translator
        </h1>
        <p className="text-muted-foreground mt-1">
          Real-time translation with FIFA stadium context awareness
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Translation Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Language Selector */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-4">
                {/* Source Language */}
                <div className="relative flex-1">
                  <button
                    onClick={() => { setShowSourceLangs(!showSourceLangs); setShowTargetLangs(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors w-full"
                    aria-label="Select source language"
                  >
                    <span className="text-xl">{sourceLangData.flag}</span>
                    <span className="font-medium text-sm">{sourceLangData.name}</span>
                    <ChevronDown className="w-4 h-4 ml-auto text-muted-foreground" />
                  </button>
                  <AnimatePresence>
                    {showSourceLangs && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full left-0 mt-2 w-full max-h-64 overflow-y-auto rounded-xl border border-border bg-popover shadow-xl z-50 p-1"
                      >
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => { setSourceLang(lang.code); setShowSourceLangs(false); }}
                            className={cn(
                              "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors",
                              sourceLang === lang.code ? "bg-primary/10 text-primary" : "hover:bg-muted"
                            )}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Swap Button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSwapLanguages}
                  className="shrink-0 rounded-full"
                  aria-label="Swap languages"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </Button>

                {/* Target Language */}
                <div className="relative flex-1">
                  <button
                    onClick={() => { setShowTargetLangs(!showTargetLangs); setShowSourceLangs(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors w-full"
                    aria-label="Select target language"
                  >
                    <span className="text-xl">{targetLangData.flag}</span>
                    <span className="font-medium text-sm">{targetLangData.name}</span>
                    <ChevronDown className="w-4 h-4 ml-auto text-muted-foreground" />
                  </button>
                  <AnimatePresence>
                    {showTargetLangs && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full right-0 mt-2 w-full max-h-64 overflow-y-auto rounded-xl border border-border bg-popover shadow-xl z-50 p-1"
                      >
                        {LANGUAGES.filter((l) => l.code !== sourceLang).map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => { setTargetLang(lang.code); setShowTargetLangs(false); }}
                            className={cn(
                              "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors",
                              targetLang === lang.code ? "bg-primary/10 text-primary" : "hover:bg-muted"
                            )}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Translation Input/Output */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Input */}
            <Card className="relative">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">{sourceLangData.flag} {sourceLangData.name}</span>
                  <span className="text-xs text-muted-foreground">{sourceText.length} / 5000</span>
                </div>
                <textarea
                  ref={textareaRef}
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Type or paste text to translate..."
                  className="w-full min-h-[160px] bg-transparent text-base leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/50"
                  aria-label="Text to translate"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      handleTranslate();
                    }
                  }}
                />
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Text to speech">
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button onClick={handleTranslate} disabled={isTranslating || !sourceText.trim()} className="gap-2">
                    {isTranslating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Translate
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output */}
            <Card className={cn("relative transition-all duration-300", result ? "border-primary/30 bg-primary/[0.02]" : "")}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">{targetLangData.flag} {targetLangData.name}</span>
                  {result && (
                    <Badge variant="secondary" className="text-[10px] gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      Gemini
                    </Badge>
                  )}
                </div>

                {isTranslating ? (
                  <div className="min-h-[160px] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Translating...</p>
                    </div>
                  </div>
                ) : result ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    <p className="text-base leading-relaxed min-h-[80px]">{result.translation}</p>

                    {result.pronunciation && (
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-0.5">Pronunciation</p>
                        <p className="text-sm italic">{result.pronunciation}</p>
                      </div>
                    )}

                    {result.culturalNote && (
                      <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
                        <p className="text-xs text-blue-600 dark:text-blue-400 mb-0.5">💡 Cultural Note</p>
                        <p className="text-xs text-muted-foreground">{result.culturalNote}</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="min-h-[160px] flex items-center justify-center">
                    <p className="text-sm text-muted-foreground/50">Translation will appear here</p>
                  </div>
                )}

                {result && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Listen to translation">
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(result.translation)}
                      className="gap-1.5"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Common Phrases */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                Stadium Phrases
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {commonPhrases.map((phrase, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSourceText(phrase.text);
                    setTimeout(handleTranslate, 100);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left text-sm hover:bg-muted/50 transition-colors group"
                >
                  <span className="flex-1">{phrase.text}</span>
                  <Badge variant="secondary" className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                    {phrase.category}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Translation History */}
          {history.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="w-4 h-4 text-muted-foreground" />
                  Recent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {history.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSourceText(item.sourceText);
                      setSourceLang(item.sourceLang);
                      setTargetLang(item.targetLang);
                      setResult({ translation: item.translatedText });
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <p className="text-xs text-muted-foreground truncate">{item.sourceText}</p>
                    <p className="text-sm font-medium truncate mt-0.5">{item.translatedText}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] text-muted-foreground">
                        {LANGUAGES.find((l) => l.code === item.sourceLang)?.flag} →{" "}
                        {LANGUAGES.find((l) => l.code === item.targetLang)?.flag}
                      </span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Click-outside handler */}
      {(showSourceLangs || showTargetLangs) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowSourceLangs(false); setShowTargetLangs(false); }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
