"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PiImage, PiSpinner, PiX, PiPlus } from "react-icons/pi";
import { useAuthStore } from "@/stores/authStore";
import { useServicesStore } from "@/stores/servicesStore";
import { categoryLabels, Category } from "@/types";

function EditServiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("id");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore();
  const { currentService, isLoading, error, fetchService, createService, updateService, clearError } = useServicesStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as Category | "",
    price: "",
    priceType: "fixed" as "fixed" | "hourly" | "starting_from",
    city: "",
    deliveryTime: "",
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/sign-in?redirect=/dashboard/edit-service");
    }
  }, [authLoading, isAuthenticated]);

  // Charger le service si on est en mode édition
  useEffect(() => {
    if (serviceId && isAuthenticated) {
      fetchService(serviceId);
    }
  }, [serviceId, isAuthenticated]);

  // Remplir le formulaire avec les données du service existant
  useEffect(() => {
    if (currentService && serviceId) {
      setFormData({
        title: currentService.title || "",
        description: currentService.description || "",
        category: currentService.category as Category || "",
        price: currentService.price?.toString() || "",
        priceType: currentService.priceType || "fixed",
        city: currentService.city || "",
        deliveryTime: currentService.deliveryTime || "",
        tags: currentService.tags || [],
      });
      setExistingImages(currentService.images || []);
    }
  }, [currentService, serviceId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length + existingImages.length > 5) {
      setSubmitError("Maximum 5 images autorisées");
      return;
    }
    setImages((prev) => [...prev, ...files]);

    // Créer les URLs de prévisualisation
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const adjustedIndex = index - existingImages.length;
      setImages((prev) => prev.filter((_, i) => i !== adjustedIndex));
      URL.revokeObjectURL(previewUrls[adjustedIndex]);
      setPreviewUrls((prev) => prev.filter((_, i) => i !== adjustedIndex));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    clearError();

    // Validation
    if (!formData.title || !formData.description || !formData.category || !formData.price || !formData.city) {
      setSubmitError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setSubmitLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("priceType", formData.priceType);
      data.append("city", formData.city);
      if (formData.deliveryTime) {
        data.append("deliveryTime", formData.deliveryTime);
      }
      if (formData.tags.length > 0) {
        data.append("tags", JSON.stringify(formData.tags));
      }

      // Ajouter les images existantes à conserver
      if (existingImages.length > 0) {
        data.append("existingImages", JSON.stringify(existingImages));
      }

      // Ajouter les nouvelles images
      images.forEach((image) => {
        data.append("images", image);
      });

      if (serviceId) {
        await updateService(serviceId, data);
      } else {
        await createService(data);
      }

      router.push("/dashboard/services");
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (authLoading) {
    return (
      <section className="mt-[100px] pt-15 flex items-center justify-center min-h-[400px]">
        <PiSpinner className="animate-spin text-4xl text-b300" />
      </section>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const allImages = [...existingImages, ...previewUrls];

  return (
    <section className="mt-[100px] pt-15">
      <div className="4xl:large-container grid grid-cols-12 gap-4 rounded-2xl bg-white p-4 max-4xl:mx-4 sm:gap-6 sm:p-10">
        <div className="col-span-12 flex items-start justify-between gap-4">
          <div>
            <h4 className="heading-4 pb-6">
              {serviceId ? "Modifier le service" : "Créer un service"}
            </h4>
            <p className="text-xl font-medium">
              {serviceId ? "Mettez à jour les informations" : "Ajoutez un nouveau service"}
            </p>
          </div>
          <Link
            href="/dashboard/services"
            className="text-lg font-medium text-b300"
          >
            Voir mes services
          </Link>
        </div>

        {(submitError || error) && (
          <div className="col-span-12 rounded-xl bg-red-50 p-4 text-red-500">
            {submitError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="col-span-12 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6">
            <p className="pb-3 font-medium text-n100">Titre du service*</p>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ex: Cours de piano à domicile"
              className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n300"
              disabled={submitLoading}
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <p className="pb-3 font-medium text-n100">Catégorie*</p>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none"
              disabled={submitLoading}
            >
              <option value="">Sélectionnez une catégorie</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-12">
            <p className="pb-3 font-medium text-n100">Description*</p>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Décrivez votre service en détail..."
              className="min-h-40 w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n300"
              disabled={submitLoading}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <p className="pb-3 font-medium text-n100">Prix*</p>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Ex: 25"
              min="0"
              step="0.01"
              className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n300"
              disabled={submitLoading}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <p className="pb-3 font-medium text-n100">Type de tarification*</p>
            <select
              name="priceType"
              value={formData.priceType}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none"
              disabled={submitLoading}
            >
              <option value="fixed">Prix fixe</option>
              <option value="hourly">Taux horaire</option>
              <option value="starting_from">À partir de</option>
            </select>
          </div>

          <div className="col-span-12 md:col-span-4">
            <p className="pb-3 font-medium text-n100">Ville*</p>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Ex: Paris"
              className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n300"
              disabled={submitLoading}
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <p className="pb-3 font-medium text-n100">Délai de livraison (optionnel)</p>
            <input
              type="text"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleInputChange}
              placeholder="Ex: 2-3 jours"
              className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n300"
              disabled={submitLoading}
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <p className="pb-3 font-medium text-n100">Tags (optionnel)</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                placeholder="Ajouter un tag"
                className="flex-1 rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n300"
                disabled={submitLoading}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-xl bg-b300 px-4 py-3 text-white hover:bg-b400"
                disabled={submitLoading}
              >
                <PiPlus />
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-b50 px-3 py-1 text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-n300 hover:text-r300"
                    >
                      <PiX />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-12">
            <p className="pb-3 font-medium text-n100">Images (max 5)</p>

            {allImages.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-3">
                {existingImages.map((url, idx) => (
                  <div key={`existing-${idx}`} className="relative">
                    <img
                      src={url}
                      alt={`Image ${idx + 1}`}
                      className="h-24 w-24 rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx, true)}
                      className="absolute -right-2 -top-2 rounded-full bg-r300 p-1 text-white"
                    >
                      <PiX />
                    </button>
                  </div>
                ))}
                {previewUrls.map((url, idx) => (
                  <div key={`new-${idx}`} className="relative">
                    <img
                      src={url}
                      alt={`Nouvelle image ${idx + 1}`}
                      className="h-24 w-24 rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(existingImages.length + idx, false)}
                      className="absolute -right-2 -top-2 rounded-full bg-r300 p-1 text-white"
                    >
                      <PiX />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {allImages.length < 5 && (
              <div className="flex w-full items-center justify-center">
                <label
                  htmlFor="fileUpload"
                  className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-b300 bg-n10 py-10 text-n300 hover:bg-b50 transition-colors"
                >
                  <span className="text-6xl text-b300">
                    <PiImage />
                  </span>
                  <span className="font-medium">
                    Glissez vos images ou <span className="text-b300">Parcourir</span>
                  </span>
                  <span className="text-sm">PNG, JPG jusqu'à 5MB</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  id="fileUpload"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={submitLoading}
                />
              </div>
            )}
          </div>

          <div className="col-span-12">
            <button
              type="submit"
              disabled={submitLoading}
              className="relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] sm:px-8 disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center gap-2">
                {submitLoading && <PiSpinner className="animate-spin" />}
                {serviceId ? "Mettre à jour" : "Créer le service"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function EditService() {
  return (
    <Suspense fallback={
      <section className="mt-[100px] pt-15 flex items-center justify-center min-h-[400px]">
        <PiSpinner className="animate-spin text-4xl text-b300" />
      </section>
    }>
      <EditServiceContent />
    </Suspense>
  );
}

export default EditService;
