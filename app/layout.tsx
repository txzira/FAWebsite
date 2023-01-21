import "./globals.css";
import ContextProviders from "../context/session";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import commerce from "../lib/commerce";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { data: categories } = await commerce.categories.list();
  return (
    <html>
      <body>
        <ContextProviders>
          <Header categories={categories} />
          <Main>{children}</Main>
          <Footer />
        </ContextProviders>
      </body>
    </html>
  );
}
