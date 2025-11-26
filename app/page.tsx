"use client";

import { useState, useCallback, useEffect } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

export default function Home() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState(0);

  // Function to calculate password strength
  const calculateStrength = (pwd: string) => {
    if (pwd.length === 0) return 0;
    
    let score = 0;
    
    // Length check
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    
    // Complexity check
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    
    return score;
  };

  useEffect(() => {
    setStrength(calculateStrength(password));
  }, [password]);

  // Core generation logic - separated from state
  const generatePasswordLogic = (
    len: number, 
    incNum: boolean, 
    incSym: boolean, 
    incUpper: boolean, 
    incLower: boolean
  ) => {
    let charset = "";
    if (incLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (incUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (incNum) charset += "0123456789";
    if (incSym) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (charset === "") return "";

    let newPassword = "";
    for (let i = 0; i < len; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return newPassword;
  };

  // Wrapper to update state
  const updatePassword = useCallback((
    len = length, 
    incNum = includeNumbers, 
    incSym = includeSymbols, 
    incUpper = includeUppercase,
    incLower = includeLowercase
  ) => {
    const newPassword = generatePasswordLogic(len, incNum, incSym, incUpper, incLower);
    if (newPassword) {
      setPassword(newPassword);
    }
  }, [length, includeNumbers, includeSymbols, includeUppercase, includeLowercase]);

  // Generate ONLY on initial load
  useEffect(() => {
    // Initial generation
    const initialPwd = generatePasswordLogic(12, true, true, true, true);
    setPassword(initialPwd);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle manual password input
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    // Allow typical password characters
    if (/^[a-zA-Z0-9!@#$%^&*()_+~`|}{[\]:;?><,./\-=]*$/.test(newPassword)) {
      setPassword(newPassword);
      // Update length slider to match if within range
      if (newPassword.length >= 8 && newPassword.length <= 32) {
        setLength(newPassword.length);
        // Do NOT regenerate password here
      }
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLength = Number(e.target.value);
    setLength(newLength);
    // Regenerate immediately when slider moves
    updatePassword(newLength, includeNumbers, includeSymbols, includeUppercase, includeLowercase);
  };

  const handleCheckboxChange = (type: 'numbers' | 'symbols' | 'uppercase' | 'lowercase', checked: boolean) => {
    let newNumbers = includeNumbers;
    let newSymbols = includeSymbols;
    let newUppercase = includeUppercase;
    let newLowercase = includeLowercase;

    if (type === 'numbers') {
        setIncludeNumbers(checked);
        newNumbers = checked;
    } else if (type === 'symbols') {
        setIncludeSymbols(checked);
        newSymbols = checked;
    } else if (type === 'uppercase') {
        setIncludeUppercase(checked);
        newUppercase = checked;
    } else if (type === 'lowercase') {
        setIncludeLowercase(checked);
        newLowercase = checked;
    }
    
    // Regenerate immediately when checkbox toggles
    updatePassword(length, newNumbers, newSymbols, newUppercase, newLowercase);
  };

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthLabel = () => {
    if (strength === 0) return "";
    if (strength <= 2) return "弱";
    if (strength <= 4) return "中";
    return "强";
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
          <div className="flex flex-col rounded-xl bg-zinc-100 px-4 py-2 transition-colors group-hover:bg-zinc-50 ring-1 ring-transparent group-hover:ring-zinc-200">
            <div className="flex w-full items-center justify-between">
              <input
                type="text"
                value={password}
                onChange={handlePasswordChange}
                className="w-full bg-transparent text-xl font-mono text-zinc-800 outline-none placeholder:text-zinc-400"
                placeholder="输入或生成密码..."
              />
              <button
                onClick={handleCopy}
                className="ml-2 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-white hover:text-zinc-900 hover:shadow-sm transition-all active:scale-95"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>
            
            {/* Strength Indicator */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex h-1 flex-1 gap-1 bg-zinc-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getStrengthColor()}`} 
                  style={{ width: `${Math.min(100, (strength / 6) * 100)}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${
                strength <= 2 ? "text-red-500" : 
                strength <= 4 ? "text-yellow-600" : "text-green-600"
              }`}>
                {getStrengthLabel()}
              </span>
            </div>
          </div>
          
          {/* Tooltip/Status for Copy */}
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
              onChange={handleSliderChange}
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
                  checked={includeLowercase}
                  onChange={(e) => handleCheckboxChange('lowercase', e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-zinc-300 checked:bg-black checked:border-black transition-all"
                />
                <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm font-medium text-zinc-700 select-none">
                包含小写字母 (a-z)
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-100 p-3 transition-colors hover:bg-zinc-50 hover:border-zinc-200">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => handleCheckboxChange('numbers', e.target.checked)}
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
                  onChange={(e) => handleCheckboxChange('symbols', e.target.checked)}
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
                  onChange={(e) => handleCheckboxChange('uppercase', e.target.checked)}
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
          onClick={() => updatePassword(length, includeNumbers, includeSymbols, includeUppercase, includeLowercase)}
          className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black text-white font-semibold shadow-lg shadow-zinc-900/10 transition-all hover:bg-zinc-800 hover:shadow-zinc-900/20 active:scale-[0.98]"
        >
          <RefreshCw className="h-5 w-5" />
          生成密码
        </button>
      </div>
    </div>
  );
}
