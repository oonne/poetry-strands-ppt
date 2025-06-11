import { h, VNode } from 'vue';

/*
 * 将文本内容按换行符格式化，并将链接转换为<a>标签
 */
interface IProps {
  content?: string;
}

const CreateText = (props: IProps) => {
  if (!props.content) {
    return h('div', [h('br')]);
  }

  const nodes: (VNode | string)[] = [];

  // 如果以\n开头，则去掉第一个\n
  let { content } = props;
  if (content.startsWith('\n')) {
    content = content.slice(1);
  }

  // 按换行符分割
  content.split('\n').forEach((item, index) => {
    if (index > 0) {
      nodes.push(h('br'));
    }

    // 检查文本是否包含链接
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (urlRegex.test(item)) {
      const parts = item.split(urlRegex);
      parts.forEach((part) => {
        if (urlRegex.test(part)) {
          // 如果是链接，则创建<a>标签
          nodes.push(h('a', { href: part, target: '_blank' }, part));
        } else {
          // 如果不是链接，则直接添加文本
          nodes.push(part);
        }
      });
    } else {
      nodes.push(item);
    }
  });

  return h('div', nodes);
};

export default CreateText;
