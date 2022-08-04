import NextAuth from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
export default NextAuth({
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        username: {
          label: "Email",
          type: "email",
          placeholder: "johndoe@test.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: (credentials) => {
        if(credentials.username === "")
      },
    })
  ]
})