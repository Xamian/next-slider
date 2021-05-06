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
        <span>v1.0.1</span><br />
        <span>Se flere tåbeligheder på <a href="https://max-it.dk/">max-it.dk</a></span><br />
        Image from <a target="_blank" href="https://thispersondoesnotexist.com/">thispersondoesnotexist.com</a><br />
          Powered by{' '}
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
