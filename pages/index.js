import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import Game from './components/game'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>next-slider</title>
        <meta name="description" content="a simple slider game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* <h1 className={styles.title}>
          next-slider
        </h1> */}

        {/* <p className={styles.description}>
          try if you can guess the rules.
        </p> */}

        <Game width={600} height={600} />

      </main>

      <footer className={styles.footer}>
        <a href="https://thispersondoesnotexist.com/">Image from https://thispersondoesnotexist.com/</a>
      </footer>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
