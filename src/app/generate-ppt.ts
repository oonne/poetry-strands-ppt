import { Utils } from '@/utils/index';
import poetryList from './poetry-list';

const { getBase64FromUrl } = Utils;

// 幻灯片宽高常量（英寸）
export const slideWidth = 13.3;
export const slideHeight = 7.5;

/*
 * 生成封面页
 */
const addCoverSlide = async (pptx: any) => {
  // 设置布局（16:9）
  pptx.layout = 'LAYOUT_WIDE';

  // 获取背景图片
  const bgImg = await getBase64FromUrl('/poetry-strands-ppt/img/cover_bg.png');
  const slide = pptx.addSlide();
  slide.background = { data: bgImg };

  // 竖排文字内容
  const leftTextArr = ['诗', '词'];
  const rightTextArr = ['串', '串'];
  const fontSize = 96;
  const fontColor = '555555';
  const fontFace = 'KaiTi'; // 宋体，可换成 'KaiTi' 楷体
  const textBoxWidth = 1.3; // 单个字的宽度（英寸）
  const textBoxHeight = 1.5; // 单个字的高度（英寸）
  const colGap = 0.05; // 两列之间的间距（英寸）

  // 两列整体宽度
  const totalWidth = textBoxWidth * 2 + colGap;
  // 两列整体高度
  const totalHeight = textBoxHeight * 2;

  // 居中起始坐标
  const startX = (slideWidth - totalWidth) / 2;
  const startY = (slideHeight - totalHeight) / 2;

  // 错位设置：左列比右列高一些
  const leftColumnOffsetY = -0.6; // 左列向上偏移
  const rightColumnOffsetY = 0; // 右列向下偏移

  // 左列"诗词"
  leftTextArr.forEach((char, idx) => {
    slide.addText(char, {
      x: startX,
      y: startY + idx * textBoxHeight + leftColumnOffsetY,
      w: textBoxWidth,
      h: textBoxHeight,
      fontSize,
      color: fontColor,
      bold: false,
      align: 'center',
      valign: 'middle',
      fontFace,
    });
  });

  // 右列"串串"
  rightTextArr.forEach((char, idx) => {
    slide.addText(char, {
      x: startX + textBoxWidth + colGap,
      y: startY + idx * textBoxHeight + rightColumnOffsetY,
      w: textBoxWidth,
      h: textBoxHeight,
      fontSize,
      color: fontColor,
      bold: false,
      align: 'center',
      valign: 'middle',
      fontFace,
    });
  });
};

/*
 * 从诗词列表中随机获取指定数量的字
 */
const getRandomChars = (
  count: number,
  existingChars: string[],
  sourcePoetries: string[] = poetryList,
): string[] => {
  const allChars = sourcePoetries.join('').split('');
  // 过滤掉已经存在的字符
  const availableChars = allChars.filter(char => !existingChars.includes(char));
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * availableChars.length);
    result.push(availableChars[randomIndex]);
  }
  return result;
};

/*
 * 生成诗词页
 */
const addPoetryPageSlide = async (
  pptx: any,
  poetry: string,
  sourcePoetries: string[] = poetryList,
) => {
  // 将诗句拆分成字符数组
  const chars = poetry.split('');
  // 如果不足9个字，随机补充
  const remainingChars = 9 - chars.length;
  if (remainingChars > 0) {
    chars.push(...getRandomChars(remainingChars, chars, sourcePoetries));
  }

  // 随机打乱字符数组
  chars.sort(() => Math.random() - 0.5);

  const pageBgImg = await getBase64FromUrl('/poetry-strands-ppt/img/page_bg.png');
  const tianImg = await getBase64FromUrl('/poetry-strands-ppt/img/tian.png');
  const slide = pptx.addSlide();
  slide.background = { data: pageBgImg };

  // 九宫格参数
  const gridRows = 3;
  const gridCols = 3;
  const cellSize = 2.1; // 每个田字格的宽高（英寸），可根据实际调整
  const gridWidth = cellSize * gridCols;
  const gridHeight = cellSize * gridRows;
  const startX = (slideWidth - gridWidth) / 2;
  const startY = (slideHeight - gridHeight) / 2;

  // 字体参数
  const fontSize = 60;
  const fontColor = '222222';
  const fontFace = 'KaiTi';

  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      const idx = row * gridCols + col;
      const char = chars[idx] || '';
      const x = startX + col * cellSize;
      const y = startY + row * cellSize;
      // 田字格图片
      slide.addImage({ data: tianImg, x, y, w: cellSize, h: cellSize });
      // 居中汉字
      slide.addText(char, {
        x,
        y,
        w: cellSize,
        h: cellSize,
        fontSize,
        color: fontColor,
        bold: true,
        align: 'center',
        valign: 'middle',
        fontFace,
      });
    }
  }
};

/*
 * 生成结束页
 */
const addEndSlide = async (pptx: any) => {
  const pageBgImg = await getBase64FromUrl('/poetry-strands-ppt/img/page_bg.png');
  const logoImg = await getBase64FromUrl('/poetry-strands-ppt/img/poetry-strands.png');
  const slide = pptx.addSlide();
  slide.background = { data: pageBgImg };

  // 居中显示logo图片
  const imgWidth = 9; // 图片宽度（英寸），可根据实际图片比例调整
  const imgHeight = 5.52; // 图片高度（英寸），可根据实际图片比例调整
  const x = (slideWidth - imgWidth) / 2;
  const y = (slideHeight - imgHeight) / 2;
  slide.addImage({ data: logoImg, x, y, w: imgWidth, h: imgHeight });
};

/*
 * 生成PPT
 */
export const generatePPTContent = async (
  customPoetries?: string[],
  onProgress?: (progress: number, currentStep: string) => void,
) => {
  // @ts-expect-error PptxGenJS 挂载在 window 上
  const pptx = new window.PptxGenJS();

  // 使用传入的诗词列表，如果没有则使用默认的poetryList
  const poetriesToUse = customPoetries || poetryList;

  // 计算总步骤数：封面页 + 诗词页面数 + 结束页 + 生成文件
  const totalSteps = 1 + poetriesToUse.length + 1 + 1;
  let currentStep = 0;

  // 生成封面页
  onProgress?.((++currentStep / totalSteps) * 100, '正在生成封面页...');
  await addCoverSlide(pptx);

  // 根据诗词数量生成页面
  for (let i = 0; i < poetriesToUse.length; i++) {
    onProgress?.((++currentStep / totalSteps) * 100, `正在生成第${i + 1}页诗词页面...`);
    await addPoetryPageSlide(pptx, poetriesToUse[i], poetriesToUse);
  }

  // 生成结束页
  onProgress?.((++currentStep / totalSteps) * 100, '正在生成结束页...');
  await addEndSlide(pptx);

  // 生成文件
  onProgress?.((++currentStep / totalSteps) * 100, '正在保存PPT文件...');
  await pptx.writeFile({ fileName: '诗歌串串.pptx' });

  onProgress?.(100, '生成完成！');
};
