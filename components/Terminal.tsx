'use client';

import { useState, useEffect, useRef } from 'react';

interface Command {
  input: string;
  output: string[];
  timestamp: Date;
}

const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    const initialCommand: Command = {
      input: '',
      output: [
        'Welcome to Austin Crinklaw\'s Personal Terminal',
        'Type "help" to see available commands',
        ''
      ],
      timestamp: new Date()
    };
    setHistory([initialCommand]);
  }, []);

  const commands = {
    help: () => [
      'Available commands:',
      '  about       - Learn about me',
      '  experience  - View work experience',
      '  projects    - See my projects',
      '  skills      - Technical skills',
      '  contact     - Contact information',
      '  whoami      - Current user info',
      '  ls          - List available sections',
      '  cat <file>  - Display file contents',
      '  clear       - Clear terminal',
      '  help        - Show this help message',
      ''
    ],

    about: () => [
      'Austin Crinklaw - Bioinformatics Scientist & Software Developer',
      '',
      'I\'m a bioinformatics scientist with a passion for building software',
      'that solves real problems in life sciences. My journey started in wet',
      'lab research working with E. coli genetics at UCSD, where I discovered',
      'my love for the computational side of biology.',
      '',
      'Over the past 7 years, I\'ve worked across the biotech spectrum—from',
      'academic research in computational immunology to leading technical teams',
      'at therapeutics startups. I particularly enjoy the challenge of translating',
      'complex scientific workflows into software solutions.',
      '',
      'Currently, I\'m leading the development of a comprehensive laboratory',
      'information management system for siRNA therapeutic development at',
      'Empirico Inc. If you\'re reading this, send me a horror movie recommendation!',
      ''
    ],

    experience: () => [
      'Work Experience:',
      '',
      '📍 Empirico Inc (March 2023 - Present)',
      '   Senior Bioinformatics Scientist & Technical Lead',
      '   • Architected siRCH™ platform from concept to deployment',
      '   • Leading technical development with cross-functional team',
      '   • Built complete siRNA therapeutic workflow tracking system',
      '',
      '📍 Jumpcode Genomics (March 2022 - March 2023)',
      '   Research Associate III',
      '   • Designed CRISPR/Cas9 gRNA computational pipelines',
      '   • Reduced AWS compute costs by 50%',
      '   • Specialized in PacBio long-read RNA-Seq analysis',
      '',
      '📍 1859 inc. (September 2021 - March 2022)',
      '   Senior Associate Scientist',
      '   • Enhanced Python applications for DNA-encoded library analysis',
      '   • Built interactive web apps for data visualization',
      '',
      '📍 La Jolla Institute (February 2018 - September 2021)',
      '   Research Tech - Peters Lab',
      '   • Developed T-Cell Receptor specificity prediction tool (co-first author)',
      '   • Built Python package for immune protein identification',
      '   • Contributed to multiple peer-reviewed publications',
      ''
    ],

    projects: () => [
      'Notable Projects:',
      '',
      '🧬 siRCH™ Platform',
      '   Comprehensive LIMS for siRNA therapeutic development',
      '   Tech: React, Python, AWS, PostgreSQL, Docker',
      '   Link: https://www.empiri.co/our-science/',
      '',
      '🔬 TCRMatch',
      '   CLI tool for T-Cell Receptor specificity prediction',
      '   Tech: C++, Bioinformatics',
      '   Link: https://github.com/IEDB/TCRMatch',
      '',
      '🦀 RustMelt5',
      '   Fast Rust library for oligonucleotide melting temps',
      '   Tech: Rust, Bioinformatics',
      '   Link: https://github.com/acrinklaw/RustMelt5',
      '',
      '🧪 ARC',
      '   Python package for immune system protein identification',
      '   Tech: Python, Bioinformatics',
      '   Link: https://github.com/IEDB/ARC',
      ''
    ],

    skills: () => [
      'Technical Skills:',
      '',
      '💻 Programming:',
      '   Python, Rust, JavaScript, TypeScript, React, C++',
      '',
      '🧬 Bioinformatics:',
      '   NGS, RNA-Seq, Long-read, Single-cell, CRISPR design, siRNA design',
      '',
      '☁️  Infrastructure:',
      '   AWS, Docker, CI/CD, PostgreSQL, Linux, NextFlow',
      '',
      '👥 Leadership:',
      '   Team Management, Technical Leadership, Code Review, Mentoring',
      ''
    ],

    contact: () => [
      'Contact Information:',
      '',
      '📧 Email: austincrinklaw@gmail.com',
      '📱 Phone: (760) 214-1126',
      '📍 Location: San Diego, CA',
      '🐙 GitHub: https://github.com/acrinklaw',
      '',
      'Feel free to reach out for opportunities or collaborations!',
      ''
    ],

    whoami: () => [
      'austin@crinklaw.dev',
      'Bioinformatics Scientist & Software Developer',
      'San Diego, CA',
      ''
    ],

    ls: () => [
      'total 6',
      'drwxr-xr-x  about.txt',
      'drwxr-xr-x  experience.txt',
      'drwxr-xr-x  projects.txt',
      'drwxr-xr-x  skills.txt',
      'drwxr-xr-x  contact.txt',
      ''
    ],

    clear: () => {
      setHistory([]);
      return [];
    }
  };

  const handleCatCommand = (filename: string): string[] => {
    const fileMap: { [key: string]: () => string[] } = {
      'about.txt': commands.about,
      'about': commands.about,
      'experience.txt': commands.experience,
      'experience': commands.experience,
      'projects.txt': commands.projects,
      'projects': commands.projects,
      'skills.txt': commands.skills,
      'skills': commands.skills,
      'contact.txt': commands.contact,
      'contact': commands.contact
    };

    if (fileMap[filename]) {
      return fileMap[filename]();
    }
    
    return [`cat: ${filename}: No such file or directory`, ''];
  };

  const executeCommand = (cmd: string): string[] => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (!trimmedCmd) return [''];

    if (trimmedCmd.startsWith('cat ')) {
      const filename = trimmedCmd.substring(4).trim();
      return handleCatCommand(filename);
    }

    const commandFunction = commands[trimmedCmd as keyof typeof commands];
    
    if (commandFunction) {
      return commandFunction();
    }

    return [`Command not found: ${trimmedCmd}`, 'Type "help" for available commands', ''];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const output = executeCommand(input);
    const newCommand: Command = {
      input,
      output,
      timestamp: new Date()
    };

    if (input.trim().toLowerCase() === 'clear') {
      setHistory([]);
    } else {
      setHistory(prev => [...prev, newCommand]);
    }

    if (input.trim()) {
      setCommandHistory(prev => [...prev, input]);
    }
    
    setInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className="h-screen w-screen bg-black text-green-400 font-mono text-sm overflow-hidden flex flex-col cursor-text relative fixed inset-0"
      onClick={handleTerminalClick}
      style={{
        background: 'radial-gradient(ellipse at center, #001100 0%, #000000 70%)',
        textShadow: '0 0 5px currentColor',
        filter: 'contrast(1.2) brightness(1.1)',
        transform: 'perspective(1000px) rotateX(0.5deg)',
      }}
    >
      {/* CRT scanlines effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.1) 2px, rgba(0, 255, 0, 0.1) 4px)',
        }}
      />
      
      {/* Screen flicker effect */}
      <div 
        className="absolute inset-0 pointer-events-none animate-pulse opacity-5"
        style={{
          background: 'linear-gradient(180deg, rgba(0, 255, 0, 0.02) 0%, transparent 100%)',
          animation: 'flicker 0.15s infinite linear alternate',
        }}
      />
      
      {/* CRT barrel distortion effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.1) 85%, rgba(0, 0, 0, 0.4) 100%)',
          mixBlendMode: 'multiply',
        }}
      />
      
      <form onSubmit={handleSubmit} className="p-4 border-b border-green-800">
        <div className="flex items-center">
          <span className="text-green-500">austin@crinklaw.dev:~$ </span>
          <div className="flex-1 flex items-center ml-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-green-400 outline-none"
              style={{ 
                textShadow: '0 0 5px currentColor',
                width: `${Math.max(1, input.length)}ch`,
                minWidth: '1ch',
                caretColor: 'transparent'
              }}
              spellCheck={false}
              autoComplete="off"
            />
            <span 
              className="text-green-500"
              style={{ 
                animation: 'blink 1s infinite',
                textShadow: '0 0 3px currentColor'
              }}
            >
              █
            </span>
          </div>
        </div>
      </form>
      
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 space-y-1"
      >
        {history.map((command, index) => (
          <div key={index}>
            {command.output.map((line, lineIndex) => (
              <div key={lineIndex} className="whitespace-pre-wrap">
                {line}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Terminal;