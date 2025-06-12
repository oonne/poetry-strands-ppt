import { connection } from 'next/server';
import { Utils } from '@/utils';

const { randomChars } = Utils;

const RandomChars = async () => {
  await connection();
  const chars = randomChars(10);

  return <div>{chars}</div>;
};

export default RandomChars;
