
// import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Yantarne FM - радіо рідного міста",
  description: "Yantarne FM - радіо рідного міста",
};

export default function Page() {


  return (
    <main className='w-full h-full flex  items-center justify-center p-5'>
      <Link href='/home'>
        <Image src={'/logo.webp'} width={190} height={190} alt='' className='rounded-3xl cursor-pointer' />
      </Link>
  </main>
     
  );
}
