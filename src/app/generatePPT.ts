import { Utils } from '@/utils/index';

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
  const fontSize = 88;
  const fontColor = '555555';
  const fontFace = 'KaiTi'; // 宋体，可换成 'KaiTi' 楷体
  const textBoxWidth = 1.3; // 单个字的宽度（英寸）
  const textBoxHeight = 1.5; // 单个字的高度（英寸），增加间距
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
 * 生成诗词页
 */
const addPoetryPageSlide = async (pptx: any) => {
  const pageBgImg = await getBase64FromUrl('/poetry-strands-ppt/img/page_bg.png');
  const slide2 = pptx.addSlide();
  slide2.background = { data: pageBgImg };
};

/*
 * 生成PPT
 */
export const generatePPTContent = async () => {
  // @ts-expect-error PptxGenJS 挂载在 window 上
  const pptx = new window.PptxGenJS();

  // 生成封面页
  await addCoverSlide(pptx);
  // 生成诗词页
  await addPoetryPageSlide(pptx);

  await pptx.writeFile({ fileName: '诗歌串串.pptx' });
};
