'use client';

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [showWechat, setShowWechat] = useState(false);
  const [showShipinhao, setShowShipinhao] = useState(false);
  const [showGongzhonghao, setShowGongzhonghao] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 滚动监听 - 显示返回顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 滚动动画 - Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
            entry.target.classList.remove('fade-in-section');
            // 观察后取消观察，避免重复触发
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.fade-in-section');
    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // 平滑滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tags = [
    '市场人',
    '解决方案专家',
    '商业IP操盘手',
    '科技博主',
    'AI创业者'
  ];

  const experiences = [
    {
      highlight: '10年+',
      text: '市场开发和to B业务经验，曾是500强外企MNC的高级销售工程师，后来跨界到互联网，经历过SaaS、IOT和平台型公司，销售、产品、运营都做过，在创业公司做创新业务，有很多创新尝试，也有很多失败经验。'
    },
    {
      highlight: '2023年',
      text: '开启自由职业，做过短视频IP操盘手，主要做商业IP、创始人IP，合作孵化的IP 4个月涨粉15w+。'
    },
    {
      highlight: '2025年',
      text: '开始一人公司的创业探索，做了自己的个人IP短视频账号【孟善见AI】，半年46条视频，涨粉4w+，初步验证内容与流量。'
    }
  ];

  const socialAccounts = [
    {
      name: '抖音',
      username: '孟善见AI',
      qr: '/douyin-qr.jpg',
      link: 'https://v.douyin.com/Jach0wpuERU/'
    },
    {
      name: '小红书',
      username: '孟善见AI',
      qr: '/xiaohongshu-qr.jpg',
      link: 'https://xhslink.com/m/9oMqJGLzyUb'
    },
    {
      name: '视频号',
      username: '孟善见AI',
      qr: '/shipinhao-qr.jpg',
      link: null
    },
    {
      name: '公众号',
      username: '孟善见Erika',
      qr: '/gongzhonghao-qr.png',
      link: null
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">

      {/* 1. Header Section - 头像、姓名、标签 */}
      <section className="container mx-auto px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          {/* Avatar - 圆形头像带动效 */}
          <div className="mb-8 inline-block">
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-2xl transition-all duration-500 ease-out hover:scale-110 hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] group cursor-pointer">
              <Image
                src="/avatar.jpg"
                alt="孟善见 Erika"
                fill
                className="object-cover object-[center_5%] transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
          </div>

          {/* Name - 中文名和英文名字号一致，英文名用灰色区分，细字体 */}
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-bold mb-2 tracking-tight">
              孟善见 <span className="text-5xl md:text-6xl text-gray-400 dark:text-gray-500 font-light ml-2">Erika</span>
            </h1>
          </div>

          {/* Basic Info */}
          <div className="mb-10 text-gray-600 dark:text-gray-400 text-base md:text-lg">
            <p>INTJ · QS Top 30 工科生+商业教育 · 热爱科技与商业</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-5 py-2 border border-gray-300 dark:border-gray-700 rounded-full text-base hover:border-gray-900 dark:hover:border-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Experience Section - 个人经历 Point Form */}
      <section className="container mx-auto px-6 pt-2 pb-16 fade-in-section">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm md:text-base tracking-[0.3em] text-gray-500 dark:text-gray-400 mb-10 uppercase text-center">
            Experience / 个人经历
          </h2>

          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="flex gap-6 items-start group"
              >
                {/* Bullet Point */}
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-900 dark:bg-white mt-2.5 group-hover:scale-150 transition-transform duration-300"></div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-white">{exp.highlight}</span> {exp.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Current Status - 当前状态差异化设计 */}
      <section className="container mx-auto px-6 pt-12 pb-20 fade-in-section">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 md:p-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl border-2 border-gray-900 dark:border-white shadow-xl">
            {/* Label Badge */}
            <div className="absolute -top-4 left-8">
              <span className="px-4 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs tracking-[0.2em] rounded-full font-medium">
                正在探索 / EXPLORING
              </span>
            </div>

            <div className="pt-4">
              <p className="text-lg md:text-xl leading-relaxed text-gray-800 dark:text-gray-200">
                目前正在从<span className="font-bold text-gray-900 dark:text-white">"AI内容人"</span>到<span className="font-bold text-gray-900 dark:text-white">"AI产品人"</span>的定位迁移和内容升级，分享用AI编程和智能体做产品的探索过程，与用户共创和打造自己的AI产品，正在实践成为一个AI产品创业者。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Philosophy - 理念，显眼突出 */}
      <section className="container mx-auto px-6 pt-12 pb-24 md:pb-28 fade-in-section">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative inline-block">
            {/* Decorative Elements */}
            <div className="absolute -top-6 -left-6 w-12 h-12 border-t-4 border-l-4 border-gray-900 dark:border-white"></div>
            <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-4 border-r-4 border-gray-900 dark:border-white"></div>

            {/* 大引号装饰 */}
            <div className="absolute -top-8 -left-12 text-8xl text-gray-200 dark:text-gray-800 font-serif opacity-50">"</div>
            <div className="absolute -bottom-8 -right-12 text-8xl text-gray-200 dark:text-gray-800 font-serif opacity-50">"</div>

            <div className="px-8 py-12 md:px-16 md:py-16">
              <p className="text-sm md:text-base tracking-[0.3em] text-gray-500 dark:text-gray-400 mb-6 uppercase">
                My Philosophy / 我的理念
              </p>
              <h2 className="text-3xl md:text-5xl font-bold leading-relaxed tracking-tight">
                产品即表达，<br />
                每个人都可以用产品与世界对话。
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Social Accounts - 4个账号二维码 */}
      <section className="container mx-auto px-6 pt-12 pb-16 fade-in-section">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm md:text-base tracking-[0.3em] text-gray-500 dark:text-gray-400 mb-10 uppercase text-center">
            Follow Me / 关注我的账号
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialAccounts.map((account, index) => {
              const isClickable = account.link || account.name === '视频号' || account.name === '公众号';
              const handleClick = () => {
                if (account.name === '视频号') {
                  setShowShipinhao(true);
                } else if (account.name === '公众号') {
                  setShowGongzhonghao(true);
                } else if (account.link) {
                  window.open(account.link, '_blank');
                }
              };

              return (
                <div
                  key={index}
                  onClick={isClickable ? handleClick : undefined}
                  className={`group bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl p-6 transition-all duration-300 ${
                    isClickable ? 'hover:border-gray-900 dark:hover:border-white hover:shadow-xl cursor-pointer hover:scale-105' : ''
                  }`}
                >
                  {/* QR Code with overlay effect */}
                  <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden bg-white shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-100/50 dark:to-gray-900/50 pointer-events-none"></div>
                    <Image
                      src={account.qr}
                      alt={`${account.name}二维码`}
                      fill
                      className="object-contain p-3 transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <h3 className="font-semibold text-base mb-1">{account.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{account.username}</p>
                    {isClickable && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        {account.link ? '点击访问 →' : '点击查看 →'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Contact Section - 地图、微信、邮箱 */}
      <section className="container mx-auto px-6 pt-12 pb-24 fade-in-section">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm md:text-base tracking-[0.3em] text-gray-500 dark:text-gray-400 mb-10 uppercase text-center">
            Contact / 联系方式
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left - Location Map */}
            <div className="flex flex-col justify-center">
              <a
                href="https://map.qq.com/?type=marker&isopeninfowin=1&markertype=1&pointx=104.066803&pointy=30.572816&name=成都&addr=四川省成都市"
                target="_blank"
                rel="noopener noreferrer"
                className="block group cursor-pointer mx-auto w-[80%] focus:outline-none focus:ring-4 focus:ring-gray-400 rounded-xl"
              >
                <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white transition-all duration-300 hover:shadow-lg bg-gray-50 dark:bg-gray-900" style={{ aspectRatio: '16/10' }}>
                  {/* 使用腾讯地图静态图 - 成都地图，大标记 */}
                  <img
                    src="https://apis.map.qq.com/ws/staticmap/v2/?center=30.572816,104.066803&zoom=11&size=600*400&maptype=roadmap&markers=size:large|color:red|30.572816,104.066803&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77"
                    alt="成都地图"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // 如果图片加载失败，显示备用内容
                      e.currentTarget.style.display = 'none';
                      const backup = e.currentTarget.nextElementSibling as HTMLElement;
                      if (backup) backup.style.display = 'flex';
                    }}
                  />
                  {/* 备用显示（当图片加载失败时） */}
                  <div className="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📍</div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">成都</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">30.57°N, 104.07°E</p>
                    </div>
                  </div>
                  {/* 悬浮提示 */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-center pb-6">
                    <span className="bg-white/95 dark:bg-gray-900/95 px-4 py-2 rounded-full text-xs font-medium text-gray-900 dark:text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      点击查看详细地图 →
                    </span>
                  </div>
                </div>
              </a>
              <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
                📍 中国 · 成都 | Chengdu, China
              </p>
            </div>

            {/* Right - Contact Info */}
            <div className="flex flex-col justify-start space-y-6">
              {/* WeChat */}
              <button
                onClick={() => setShowWechat(true)}
                className="group p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-900 dark:hover:border-white transition-all duration-300 text-left hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-400"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">💬</div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 tracking-wider">WECHAT</p>
                    <p className="text-lg font-medium">erikam711</p>
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    →
                  </div>
                </div>
              </button>

              {/* Email */}
              <a
                href="mailto:erikamengsj@gmail.com"
                className="group p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-900 dark:hover:border-white transition-all duration-300 text-left hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-400"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">✉️</div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 tracking-wider">EMAIL</p>
                    <p className="text-base md:text-lg font-medium">erikamengsj@gmail.com</p>
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    →
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            © 2025 孟善见 Erika. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Wechat QR Modal */}
      {showWechat && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setShowWechat(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-sm w-full shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold">扫码添加微信</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">微信号: erikam711</p>
            </div>

            <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden mb-6">
              <Image
                src="/wechat-qr.jpg"
                alt="微信二维码"
                fill
                className="object-contain p-4"
              />
            </div>

            <button
              onClick={() => setShowWechat(false)}
              className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-400"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* Shipinhao QR Modal */}
      {showShipinhao && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setShowShipinhao(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-sm w-full shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold">扫码关注视频号</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">孟善见AI</p>
            </div>

            <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden mb-6">
              <Image
                src="/shipinhao-qr.jpg"
                alt="视频号二维码"
                fill
                className="object-contain p-4"
              />
            </div>

            <button
              onClick={() => setShowShipinhao(false)}
              className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-400"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* Gongzhonghao QR Modal */}
      {showGongzhonghao && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setShowGongzhonghao(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-sm w-full shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold">扫码关注公众号</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">孟善见Erika</p>
            </div>

            <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden mb-6">
              <Image
                src="/gongzhonghao-qr.png"
                alt="公众号二维码"
                fill
                className="object-contain p-4"
              />
            </div>

            <button
              onClick={() => setShowGongzhonghao(false)}
              className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-400"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 返回顶部按钮 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 animate-fadeIn focus:outline-none focus:ring-4 focus:ring-gray-400"
          aria-label="返回顶部"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .fade-in-section {
          opacity: 0;
          will-change: opacity, transform;
        }
      `}</style>
    </div>
  );
}
