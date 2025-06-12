import Image from 'next/image';

const Home = async () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <nav>
        <ul>
          <li>本地环境变量: {process.env.NEXT_PUBLIC_ENV_NAME}</li>
        </ul>
      </nav>

      <Image src="/img/logo.png" alt="logo" width={180} height={180} priority />

      <div className="font-zqk text-4xl">
        <h1>自定义字体: Hello World</h1>
      </div>
    </main>
  );
};

export default Home;
