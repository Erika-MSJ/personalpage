'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // 监听滚动以改变导航栏样式
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // 简单的滚动监听以高亮当前 Section
      const sections = ['home', 'journey', 'philosophy', 'products', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const navItems = [
    { id: 'home', label: '首页' },
    { id: 'journey', label: '经历' },
    { id: 'philosophy', label: '理念' },
    { id: 'products', label: '产品' },
    { id: 'contact', label: '联系' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo / Name */}
        <div 
          className="font-bold text-xl cursor-pointer flex items-center gap-2"
          onClick={() => scrollToSection('home')}
        >
          <span className="text-[#1a5f7a] dark:text-[#2d7a9b]">M.</span>
          <span className="text-gray-900 dark:text-white">Erika</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-sm font-medium transition-colors duration-300 ${
                activeSection === item.id
                  ? 'text-[#1a5f7a] dark:text-[#2d7a9b]'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button (Placeholder for now) */}
        <div className="md:hidden">
          {/* 这里可以添加移动端菜单按钮 */}
        </div>
      </div>
    </nav>
  );
}
