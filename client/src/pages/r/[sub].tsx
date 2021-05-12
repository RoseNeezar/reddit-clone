import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import PostCard from "../../components/PostCard";
import { ISub } from "../../typings/types";

const Sub = () => {
  const router = useRouter();
  const { sub: subName }: any = router.query;
  const { data: sub, error } = useSWR<ISub>(
    subName ? `/subs/${subName}` : null
  );
  if (error) router.push("/");

  let postsMarkup;
  if (!sub) {
    postsMarkup = <p className="text-lg text-center">Loading..</p>;
  } else if (sub.posts.length === 0) {
    postsMarkup = <p className="text-lg text-center">No posts submitted yet</p>;
  } else {
    postsMarkup = sub.posts.map((post) => (
      <PostCard key={post.identifier} post={post} />
    ));
  }
  return (
    <div className="container flex pt-5">
      {sub && <div className="w-160">{postsMarkup}</div>}
    </div>
  );
};

export default Sub;
