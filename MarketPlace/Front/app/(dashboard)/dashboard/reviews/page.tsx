"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PiSpinner, PiStarFill, PiStar, PiChatCircle } from "react-icons/pi";
import { useAuthStore } from "@/stores/authStore";
import { reviewsApi } from "@/lib/api";
import { Review, User } from "@/types";

function ReviewPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user, isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/sign-in?redirect=/dashboard/reviews");
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user) return;

      try {
        const response = await reviewsApi.getByUser(user._id || user.id);
        setReviews(response.data.data);
      } catch (error) {
        console.error("Erreur chargement avis:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchReviews();
    }
  }, [isAuthenticated, user]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-xl">
            {star <= rating ? (
              <PiStarFill className="text-y300" />
            ) : (
              <PiStar className="text-n200" />
            )}
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authLoading || isLoading) {
    return (
      <section className="mt-[100px] pt-15 flex items-center justify-center">
        <PiSpinner className="animate-spin text-4xl text-b300" />
      </section>
    );
  }

  return (
    <section className="mt-[100px] pt-15">
      <div className="4xl:large-container grid grid-cols-12 gap-6 overflow-hidden rounded-2xl bg-white p-4 max-4xl:mx-4 sm:p-10">
        <div className="col-span-12 flex items-center justify-between gap-4">
          <h4 className="heading-4">Avis reçus</h4>
          <p className="font-medium text-b300 md:text-lg">
            {reviews.length} avis
          </p>
        </div>

        {reviews.length > 0 ? (
          reviews.map((review) => {
            const reviewer = review.reviewer as User;
            return (
              <div key={review._id} className="col-span-12 md:col-span-6">
                <div className="group rounded-3xl border border-n40 p-1 duration-500 hover:border-b300">
                  <div className="flex flex-col items-start justify-start gap-4 rounded-3xl border border-n40 p-4 duration-500 group-hover:border-b300 sm:p-6">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center justify-start gap-4">
                        {reviewer?.avatar ? (
                          <img
                            src={reviewer.avatar}
                            alt={reviewer.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-b300 flex items-center justify-center text-white font-bold">
                            {reviewer?.name?.charAt(0) || "?"}
                          </div>
                        )}
                        <div>
                          <p className="heading-5">{reviewer?.name || "Utilisateur"}</p>
                          <p className="font-medium text-n500 text-sm">{reviewer?.city || ""}</p>
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-lg text-n400">{review.comment}</p>
                    <p className="font-medium text-n300 text-sm">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-12 text-center py-20">
            <PiChatCircle className="text-6xl text-n200 mx-auto mb-4" />
            <p className="text-n300 text-lg">Vous n'avez pas encore reçu d'avis</p>
            <p className="text-n200 mt-2">Les avis apparaîtront ici après vos prestations</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ReviewPage;
