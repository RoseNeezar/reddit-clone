import Head from "next/head";
import { useEffect, useState } from "react";
import { Post } from "../typings/types";
import axios from "axios";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    axios
      .get("/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="pt-12">
      <Head>
        <title>reddit: front stuff</title>
      </Head>
      <div className="container flex pt-4 ">
        <div className=" w-160">
          {posts.map((post) => (
            <PostCard key={post.identifier} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
