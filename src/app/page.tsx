'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { generatePPTContent } from './generate-ppt';
import poetryList from './poetry-list';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [poetryInputs, setPoemInputs] = useState<string[]>(poetryList);

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
   * 更新诗词输入
   */
  const updatePoetryInput = (index: number, value: string) => {
    const newInputs = [...poetryInputs];
    newInputs[index] = value;
    setPoemInputs(newInputs);
  };

  /**
   * 添加新的诗词输入框
   */
  const addPoetryInput = () => {
    setPoemInputs([...poetryInputs, '']);
  };

  /**
   * 删除诗词输入框
   */
  const removePoetryInput = (index: number) => {
    if (poetryInputs.length > 1) {
      const newInputs = poetryInputs.filter((_, i) => i !== index);
      setPoemInputs(newInputs);
    }
  };

  /**
   * 生成PPT
   */
  const generatePPT = async () => {
    setIsLoading(true);
    try {
      // 过滤空输入框，并截取每行最多9个字符
      const validPoetries = poetryInputs
        .filter(poetry => poetry.trim() !== '')
        .map(poetry => poetry.trim().slice(0, 9));

      if (validPoetries.length === 0) {
        alert('请至少输入一句诗词');
        return;
      }

      await generatePPTContent(validPoetries);
    } catch (error) {
      console.error('生成PPT时出错:', error);
      alert('生成PPT时出错，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 渲染页面
   */
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <Image src="/poetry-strands-ppt/img/logo.jpg" alt="logo" width={604} height={267} priority />

      <div className="w-full max-w-2xl mt-8">
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">🎮 诗词游戏PPT生成器</h3>
          <h4 className="text-gray-700 leading-relaxed">
            巨好玩的诗词九宫格游戏。将一句诗的每个字打散，需要连接起来还原诗句。适合语文课、班会课、学校诗词大会活动、公司年会等场景。
          </h4>
          <h4 className="text-gray-700 leading-relaxed">
            适合 <b>语文课</b>、<b>班会课</b>、<b>学校诗词大会活动</b>、<b>公司年会</b> 等场景。
          </h4>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg">
          {poetryInputs.map((poetry, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm text-gray-500 w-8">{index + 1}</span>
              <input
                type="text"
                value={poetry}
                onChange={e => updatePoetryInput(index, e.target.value)}
                placeholder="请输入诗词（最多9个字符）"
                maxLength={20}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => removePoetryInput(index)}
                disabled={poetryInputs.length <= 1}
                className={`px-3 py-2 rounded-md text-white font-medium transition-all
                  ${
                    poetryInputs.length <= 1
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
              >
                删除
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={addPoetryInput}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-all mr-4"
          >
            添加诗词
          </button>

          <button
            onClick={generatePPT}
            disabled={isLoading}
            className={`px-6 py-2 rounded-md text-white font-medium transition-all
              ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isLoading ? '生成中...' : '生成PPT'}
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>提示：每句诗词最多使用前9个字符，空白行将被忽略</p>
        </div>

        <div className="mt-6 text-sm text-gray-500 text-center border-t pt-4">
          <p>
            作者：
            <a
              href="https://blog.oonne.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 hover:underline transition-colors"
            >
              工程师加一
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Home;
