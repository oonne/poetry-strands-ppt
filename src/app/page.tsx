'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 动态插入 script
    const script = document.createElement('script');
    script.src = '/poetry-strands-ppt/script/pptxgen.bundle.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  /**
   * 生成PPT
   */
  const generatePPT = async () => {
    setIsLoading(true);
    try {
      // @ts-expect-error PptxGenJS 挂载在 window 上
      const pptx = new window.PptxGenJS();

      // 添加一页
      const slide = pptx.addSlide();

      // 添加文本文本
      slide.addText('新增的文本内容', {
        x: 1,
        y: 1,
        fontSize: 24,
        color: '363636',
        bold: true,
        align: 'center',
      });

      // 保存文件
      await pptx.writeFile({ fileName: '诗歌串串.pptx' });
    } catch (error) {
      console.error('生成PPT时出错:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 渲染页面
   */
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image src="/poetry-strands-ppt/img/logo.png" alt="logo" width={180} height={180} priority />
      <button
        onClick={generatePPT}
        disabled={isLoading}
        className={`px-6 py-3 rounded-lg text-white font-medium transition-all
          ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {isLoading ? '生成中...' : '生成PPT'}
      </button>
    </main>
  );
};

export default Home;
