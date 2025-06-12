'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Utils } from '@/utils/index';

const { getBase64FromUrl } = Utils;

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
      const slideWidth = pptx.width;
      const slideHeight = pptx.height;

      // 先获取base64图片
      const base64Img = await getBase64FromUrl('/poetry-strands-ppt/img/cover_bg.png');

      const slide = pptx.addSlide();

      // 用base64图片铺满背景
      slide.addImage({
        data: base64Img,
        x: 0,
        y: 0,
        w: slideWidth,
        h: slideHeight,
      });

      // 添加正中间文本
      slide.addText('诗词串串', {
        x: 0,
        y: slideHeight / 2 - 1,
        w: slideWidth,
        h: 2,
        fontSize: 48,
        color: 'ffffff',
        bold: true,
        align: 'center',
        valign: 'middle',
        fontFace: '微软雅黑',
        shadow: { type: 'outer', color: '000000', blur: 5, offset: 2, angle: 45, opacity: 0.5 },
      });

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
