import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import {FirestoreAdapter} from "@auth/firebase-adapter"
import { adminAuth, adminDb } from '@/firebase-admin';


const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { prompt: 'select_account' },
      },
    }),
  ],
  session:{
    strategy: "jwt",
  },
  callbacks:{
    session: async({session, token}) => {
        if(session?.user){
            if(token.sub){
                session.user.id= token.sub;

                const firebaseToken = await adminAuth.createCustomToken(token.sub);
                session.firebaseToken = firebaseToken;
            }
        }
        return session;
    },
    jwt: async ({user, token}) => {
        if(user){
            token.sub= user.id;
        }
        return token;
    },
},
  secret: process.env.NEXTAUTH_SECRET,

  adapter: FirestoreAdapter(adminDb) as any,
  
});

export { handler as GET, handler as POST };
