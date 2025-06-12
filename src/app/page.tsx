import Image from 'next/image';

const Home = async () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image src="/poetry-strands-ppt/img/logo.png" alt="logo" width={180} height={180} priority />
    </main>
  );
};

export default Home;
