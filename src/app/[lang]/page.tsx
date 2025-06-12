import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

const Home = async ({ params }: { params: Promise<{ lang: string }> }) => {
  const t = await getTranslations();
  const { lang } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <nav>
        <ul>
          <h1>{t('link_home')}</h1>
          <h1>{t('test_interpolation', { name: 'John' })}</h1>
          <li>本地环境变量: {process.env.NEXT_PUBLIC_ENV_NAME}</li>
        </ul>
      </nav>

      <Image src="/img/logo.png" alt="logo" width={180} height={180} priority />

      <div className="font-zqk text-4xl">
        <h1>自定义字体: Hello World</h1>
      </div>

      <Link href={`/${lang}/page-1`}>跳转到页面1</Link>
    </main>
  );
};

export default Home;
