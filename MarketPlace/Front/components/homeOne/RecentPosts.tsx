import { PiArrowRightBold } from "react-icons/pi";
import { blogDetails } from "../../data/data";
import Link from "next/link";
import BlogPostCard from "../ui/BlogPostCard";

function RecentPosts({ isBgWhite }: { isBgWhite?: boolean }) {
  return (
    <section className={`stp-30 sbp-30 ${isBgWhite ? "" : "bg-n20"}`}>
      <div className="container">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="heading-2 font-bold text-n900">
              Derniers <span className="text-b300 underline">Articles</span>
            </h2>
            <p className="pt-4 font-medium text-n500">
              Découvrez les derniers articles de notre blog.
            </p>
          </div>
          <div className="">
            <Link
              href="/blog"
              className="flex items-center justify-start gap-3 font-bold duration-300 hover:text-b300"
            >
              Tous les articles
              <span className="text-2xl !leading-none">
                <PiArrowRightBold />
              </span>
            </Link>
          </div>
        </div>
        <div className="stp-15 grid grid-cols-12 gap-6">
          {blogDetails.slice(0, 3).map(({ id, ...props }) => (
            <BlogPostCard key={id} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecentPosts;
