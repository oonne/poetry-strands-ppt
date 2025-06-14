'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { generatePPTContent } from './generate-ppt';
import poetryList from './poetry-list';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [poetryInputs, setPoemInputs] = useState<string[]>(poetryList);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // 动态插入 script
    const script = document.createElement('script');
    script.src = '/poetry-strands-ppt/lib/pptxgen.bundle.js';
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
    setProgress(0);
    setCurrentStep('');
    setShowSuccess(false);

    try {
      // 过滤空输入框，并截取每行最多9个字符
      const validPoetries = poetryInputs
        .filter(poetry => poetry.trim() !== '')
        .map(poetry => poetry.trim().slice(0, 9));

      if (validPoetries.length === 0) {
        alert('请至少输入一句诗词');
        return;
      }

      await generatePPTContent(validPoetries, (progressValue, stepText) => {
        setProgress(progressValue);
        setCurrentStep(stepText);
      });

      // 显示成功消息
      setShowSuccess(true);
      // 3秒后隐藏成功消息
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
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
      {/* LOGO */}
      <Image src="/poetry-strands-ppt/img/logo.jpg" alt="logo" width={604} height={267} priority />

      <div className="w-full max-w-4xl mt-8">
        {/* 游戏规则部分 */}
        <section className="mb-12">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 border-b-2 border-blue-500 pb-3">
            🎮 游戏规则
          </h1>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-6">
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                巨好玩的诗词九宫格游戏，规则简单，好玩到停不下来！语文老师必备的古诗词小游戏课件！
              </p>
              <p>
                <strong>🎯 游戏目标：</strong>将打散的诗词字符重新连接，还原完整的诗句。
              </p>
              <p>
                <strong>🎲 游戏规则：</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>每句诗词的字符会被随机打散放置在3×3的九宫格中。找出正确的诗句！</li>
                <li>如果想要提高难度，找出诗句之后，要求玩家说出诗句的出处，并背诵全诗。</li>
              </ul>
              <p>
                <strong>🎈 适用场景：</strong>
                <span className="font-semibold text-blue-800">语文课</span>、
                <span className="font-semibold text-blue-800">班会课</span>、
                <span className="font-semibold text-blue-800">学校诗词大会</span>、
                <span className="font-semibold text-blue-800">公司年会</span>、
                <span className="font-semibold text-blue-800">团建游戏</span> 等。
              </p>
            </div>
          </div>
        </section>

        {/* PPT模板部分 */}
        <section className="mb-12">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 border-b-2 border-green-500 pb-3">
            📄 PPT模板
          </h1>
          <div className="bg-green-50 border-l-4 border-green-400 rounded-r-lg p-6">
            <div className="text-center space-y-4">
              <p className="text-gray-700 leading-relaxed">
                精美的模板，内置题库，可直接下载使用。诗词内容可编辑，可轻松添加自己想要的诗词。
              </p>
              {/* PPT预览图片 */}
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <Image
                      src="/poetry-strands-ppt/preview/ppt_1.jpg"
                      alt="PPT预览1"
                      width={300}
                      height={225}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <Image
                      src="/poetry-strands-ppt/preview/ppt_2.jpg"
                      alt="PPT预览2"
                      width={300}
                      height={225}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <Image
                      src="/poetry-strands-ppt/preview/ppt_3.jpg"
                      alt="PPT预览3"
                      width={300}
                      height={225}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <Image
                      src="/poetry-strands-ppt/preview/ppt_4.jpg"
                      alt="PPT预览4"
                      width={300}
                      height={225}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <Image
                      src="/poetry-strands-ppt/preview/ppt_5.jpg"
                      alt="PPT预览5"
                      width={300}
                      height={225}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <Image
                      src="/poetry-strands-ppt/preview/ppt_6.jpg"
                      alt="PPT预览6"
                      width={300}
                      height={225}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
              {/* 下载按钮 */}
              <div className="flex justify-center gap-4 mb-6">
                <a
                  href="/poetry-strands-ppt/pptx/诗词串串.pptx"
                  download
                  className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  下载PPT模板
                </a>
              </div>{' '}
            </div>
          </div>
        </section>

        {/* 诗词游戏PPT生成器部分 */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 border-b-2 border-blue-500 pb-3">
            🚀 PPT生成器
          </h1>
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-6 mb-6">
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>可自定义诗词，一键生成PPT。</p>
              <p>每句诗词最多使用前9个字符，空白行将被忽略。</p>
              <p>下方列表支持滚动，自定义添加的诗句在最下方。</p>
            </div>
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

          {/* 进度条 */}
          {isLoading && (
            <div className="mt-4 w-full bg-gray-100 rounded-lg p-4">
              <div className="mb-2 text-sm text-gray-600">{currentStep}</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-right">{Math.round(progress)}%</div>
            </div>
          )}

          {/* 成功消息 */}
          {showSuccess && (
            <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">生成成功，已自动下载</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 页脚 */}
        <footer className="mt-8 text-sm text-gray-500 text-center border-t pt-6">
          <p className="flex items-center justify-center gap-2">
            <a
              href="https://github.com/oonne/poetry-strands-ppt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 hover:underline transition-colors inline-flex items-center gap-1"
            >
              <Image src="/poetry-strands-ppt/img/github.svg" alt="GitHub" width={16} height={16} />
              GitHub
            </a>
            <span className="mx-2">|</span>
            作者微信公众号:
            <a
              href="https://blog.oonne.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 hover:underline transition-colors"
            >
              工程师加一
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Home;
