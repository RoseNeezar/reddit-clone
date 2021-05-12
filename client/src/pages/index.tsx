import Head from "next/head";
import { useEffect, useState } from "react";
import { Post } from "../typings/types";
import axios from "axios";
import PostCard from "../components/PostCard";
import useSWR from "swr";

export default function Home() {
  const { data: posts } = useSWR<Post[]>("/posts");

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
      </div>
    </>
  );
}
