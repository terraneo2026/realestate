import '../admin/styles/globals.css';
import Head from 'next/head';
import { Montserrat, Open_Sans } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-open-sans',
});

function MyApp({ Component, pageProps }) {
  return (
    <div className={`${montserrat.variable} ${openSans.variable} font-sans`}>
      <Head>
        <title>Relocate Biz - Admin Dashboard</title>
      </Head>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
