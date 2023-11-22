import clientPromise from '@/lib/mongodb';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const adminEmails = ['jonathan.buignet@gmail.com'];

export const authOption = {
  //? Package NextAuth qui permet de s'auth avec google
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({ session, token, user }) => {
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
};

export default NextAuth(authOption);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOption);
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw `Vous n'avez pas les droits admin pour voir ceci`;
  }
}
