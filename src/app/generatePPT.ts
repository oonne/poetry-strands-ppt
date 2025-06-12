import { Utils } from '@/utils/index';

const { getBase64FromUrl } = Utils;

export const generatePPTContent = async () => {
  // @ts-expect-error PptxGenJS 挂载在 window 上
  const pptx = new window.PptxGenJS();

  // 设置布局（16:9）
  pptx.layout = 'LAYOUT_WIDE';
  // 16:9标准宽高
  const slideWidth = 10; // 英寸
  const slideHeight = 5.625; // 英寸

  // 获取背景图片
  const bgImg = await getBase64FromUrl('/poetry-strands-ppt/img/cover_bg.png');
  const slide = pptx.addSlide();
  slide.background = { data: bgImg };

  // 竖排文字内容
  const leftTextArr = ['诗', '词'];
  const rightTextArr = ['串', '串'];
  const fontSize = 64;
  const fontColor = '555555';
  const fontFace = 'SimSun'; // 宋体，可换成 'KaiTi' 楷体
  const textBoxWidth = 1.5; // 单个字的宽度（英寸）
  const textBoxHeight = 1.5; // 单个字的高度（英寸）
  const colGap = 1.5; // 两列之间的间距（英寸）

  // 两列整体宽度
  const totalWidth = textBoxWidth * 2 + colGap;
  // 两列整体高度
  const totalHeight = textBoxHeight * 2;

  // 居中起始坐标
  const startX = (slideWidth - totalWidth) / 2;
  const startY = (slideHeight - totalHeight) / 2;

  // 左列"诗词"
  leftTextArr.forEach((char, idx) => {
    slide.addText(char, {
      x: startX,
      y: startY + idx * textBoxHeight,
      w: textBoxWidth,
      h: textBoxHeight,
      fontSize,
      color: fontColor,
      bold: true,
      align: 'center',
      valign: 'middle',
      fontFace,
      shadow: { type: 'outer', color: '000000', blur: 5, offset: 2, angle: 45, opacity: 0.5 },
    });
  });

  // 右列"串串"
  rightTextArr.forEach((char, idx) => {
    slide.addText(char, {
      x: startX + textBoxWidth + colGap,
      y: startY + idx * textBoxHeight,
      w: textBoxWidth,
      h: textBoxHeight,
      fontSize,
      color: fontColor,
      bold: true,
      align: 'center',
      valign: 'middle',
      fontFace,
      shadow: { type: 'outer', color: '000000', blur: 5, offset: 2, angle: 45, opacity: 0.5 },
    });
  });

  await pptx.writeFile({ fileName: '诗歌串串.pptx' });
};
