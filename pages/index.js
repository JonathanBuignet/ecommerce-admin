import Layout from '@/components/Layout';
import { useSession } from 'next-auth/react';

export default function Home() {
  // const { data: session } = useSession();
  return (
    <Layout>
      <div className='flex justify-between text-blue-900'>
        <h2>
          Bonjour potentiel futur employeur 👋 <br />
          <br />
          Normalement l'accès à ce panel est controlé via NextAuth et l'API de
          Google. <br /> J'ai désactivé cette couche de sécurité afin de vous
          permettre d'accéder à ce panneau d'administration. <br />
          <br /> Bonne visite !
          {/* <b>{session?.user.name}</b> */}
        </h2>
        {/* <div className='flex overflow-hidden rounded-lg bg-gray-300 text-black'>
          <img src={session?.user?.image} alt='' className='h-6 w-6' />
          <span className='px-2'>{session?.user.name}</span>
        </div> */}
      </div>
    </Layout>
  );
}
