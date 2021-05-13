import Head from "next/head";
import { useEffect } from "react";
import { ISub, Post } from "../typings/types";

import PostCard from "../components/PostCard";
import useSWR from "swr";
import { useAuthState } from "../context/auth";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { data: posts, revalidate } = useSWR<Post[]>("/posts");
  const { data: topSubs } = useSWR<ISub[]>("/subs/top/subs");
  const { authenticated } = useAuthState();
  useEffect(() => {
    revalidate();
  }, [revalidate, authenticated]);
  return (
    <>
      <Head>
        <title>reddit: front stuff</title>
      </Head>
      <div className="container flex pt-5 ">
        <div className=" w-160">
          {posts?.map((post) => (
            <PostCard key={post.identifier} post={post} />
          ))}
        </div>
        <div className="ml-6 w-80">
          <div className="w-full bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top communities
              </p>
            </div>
          </div>
          {topSubs?.map((sub) => (
            <div
              key={sub.name}
              className="flex items-center px-4 py-2 text-xs bg-white border-b"
            >
              <div className="mr-2 overflow-hidden rounded-full cursor-pointer">
                <Link href={`/r/${sub.name}`}>
                  <Image
                    src={sub.imageUrl}
                    alt="Sub"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                </Link>
              </div>
              <Link href={`/r/${sub.name}`}>
                <a className="font-bold hover:cursor-pointer">/r/{sub.name}</a>
              </Link>
              <p className="ml-auto font-med">{sub.postCount}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
