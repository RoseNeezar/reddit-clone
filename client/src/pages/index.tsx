import Head from "next/head";

export default function Home() {
  return (
    <div className="pt-12">
      <Head>
        <title>reddit: front stuff</title>
      </Head>
      <div className="container flex pr-4 bg-green-300">
        <div className="bg-purple-300 w-160">post</div>
      </div>
    </div>
  );
}
