"use client";

import { useState, useCallback, useEffect } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

export default function Home() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let charset = "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
  }, [length, includeUppercase, includeNumbers, includeSymbols]);

  // Generate on initial load
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans text-zinc-900 p-4">
      {/* Card Container */}
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-zinc-900/5">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            密码生成器
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            自定义并生成安全且随机的密码
          </p>
        </div>

        {/* Password Display */}
        <div className="relative mb-8 group">
          <div className="flex h-16 w-full items-center justify-between rounded-xl bg-zinc-100 px-4 transition-colors group-hover:bg-zinc-50 ring-1 ring-transparent group-hover:ring-zinc-200">
            <input
              type="text"
              value={password}
              readOnly
              className="w-full bg-transparent text-xl font-mono text-zinc-800 outline-none placeholder:text-zinc-400"
              placeholder="Generating..."
            />
            <button
              onClick={handleCopy}
              className="ml-2 flex h-10 w-10 items-center justify-center rounded-lg text-zinc-500 hover:bg-white hover:text-zinc-900 hover:shadow-sm transition-all active:scale-95"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
          </div>
          {/* Tooltip/Status for Copy - optional but nice */}
          {copied && (
            <div className="absolute -top-8 right-0 rounded bg-black px-2 py-1 text-xs text-white animate-fade-in-up">
              已复制
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Length Slider */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700">
                密码长度
              </label>
              <span className="inline-flex h-6 min-w-[2rem] items-center justify-center rounded bg-zinc-100 px-2 text-sm font-mono font-medium text-zinc-900">
                {length}
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="32"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-black outline-none hover:bg-zinc-300"
            />
            <div className="mt-2 flex justify-between text-xs text-zinc-400">
              <span>8</span>
              <span>32</span>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-100 p-3 transition-colors hover:bg-zinc-50 hover:border-zinc-200">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-zinc-300 checked:bg-black checked:border-black transition-all"
                />
                <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm font-medium text-zinc-700 select-none">
                包含数字 (0-9)
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-100 p-3 transition-colors hover:bg-zinc-50 hover:border-zinc-200">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-zinc-300 checked:bg-black checked:border-black transition-all"
                />
                <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm font-medium text-zinc-700 select-none">
                包含符号 (!@#$)
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-100 p-3 transition-colors hover:bg-zinc-50 hover:border-zinc-200">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-zinc-300 checked:bg-black checked:border-black transition-all"
                />
                <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm font-medium text-zinc-700 select-none">
                包含大写字母 (A-Z)
              </span>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generatePassword}
          className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black text-white font-semibold shadow-lg shadow-zinc-900/10 transition-all hover:bg-zinc-800 hover:shadow-zinc-900/20 active:scale-[0.98]"
        >
          <RefreshCw className="h-5 w-5" />
          生成密码
        </button>
      </div>
    </div>
  );
}
