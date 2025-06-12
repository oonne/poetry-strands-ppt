'use client';

import Image from 'next/image';
import { useState } from 'react';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);

  const generatePPT = async () => {
    setIsLoading(true);
    try {
      //
      const pptxgen = (await import('pptxgenjs')).default;
      const pptx = new pptxgen();

      // 添加一个幻灯片
      const slide = pptx.addSlide();

      // 添加标题
      slide.addText('诗歌串串', {
        x: 1,
        y: 1,
        fontSize: 44,
        color: '363636',
        bold: true,
        align: 'center',
      });

      // 添加内容
      slide.addText('这是一个示例PPT', {
        x: 1,
        y: 2,
        fontSize: 24,
        color: '666666',
      });

      // 保存文件
      await pptx.writeFile({ fileName: '诗歌串串.pptx' });
    } catch (error) {
      console.error('生成PPT时出错:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
