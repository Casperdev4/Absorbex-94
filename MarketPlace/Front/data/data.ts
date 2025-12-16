import { v4 as uuidv4 } from "uuid";

//home one slider
import homeHeorSliderImg1 from "@/public/images/hero_slider_img_1.png";
import homeHeorSliderImg2 from "@/public/images/hero_slider_img_2.png";
import homeHeorSliderImg3 from "@/public/images/hero_slider_img_3.png";
import homeHeorSliderImg4 from "@/public/images/hero_slider_img_4.png";

//expert img slider
import expertImgSlider1 from "@/public/images/expert_slider_img_1.png";
import expertImgSlider2 from "@/public/images/expert_slider_img_2.png";
import expertImgSlider3 from "@/public/images/expert_slider_img_3.png";
import expertImgSlider4 from "@/public/images/expert_slider_img_4.png";
import expertImgSlider5 from "@/public/images/expert_slider_img_5.png";
import expertImgSlider6 from "@/public/images/expert_slider_img_6.png";

//small people image
import smallPeople1 from "@/public/images/people_small1.png";
import smallPeople2 from "@/public/images/people_small2.png";
import smallPeople3 from "@/public/images/people_small3.png";

//worker portfolio images
import portfolioImg1 from "@/public/images/worker-portfolio-img-1.png";
import portfolioImg2 from "@/public/images/worker-portfolio-img-2.png";
import portfolioImg3 from "@/public/images/worker-portfolio-img-3.png";
import portfolioImg4 from "@/public/images/worker-portfolio-img-4.png";

//blog post img
import blogImg1 from "@/public/images/blog-post-image-1.png";
import blogImg2 from "@/public/images/blog-post-image-2.png";
import blogImg3 from "@/public/images/blog-post-image-3.png";
import blogImg4 from "@/public/images/blog-post-image-4.png";
import blogImg5 from "@/public/images/blog-post-image-5.png";
import blogImg6 from "@/public/images/blog-post-image-6.png";
import React from "react";
import {
  PiBehanceLogo,
  PiBellSimpleRingingThin,
  PiCurrencyCircleDollar,
  PiCurrencyDollarSimpleBold,
  PiDribbbleLogo,
  PiFacebookLogo,
  PiFileTextBold,
  PiHandshake,
  PiHeadphonesThin,
  PiInstagramLogo,
  PiListChecks,
  PiLockBold,
  PiMoney,
  PiShieldThin,
  PiStarThin,
  PiThumbsUpBold,
  PiTwitterLogo,
} from "react-icons/pi";

//professional tab name icon
import frame1 from "@/public/images/frame_1.svg";
import frame2 from "@/public/images/frame_2.svg";
import frame3 from "@/public/images/frame_3.svg";
import frame4 from "@/public/images/frame_4.svg";
import frame5 from "@/public/images/frame_5.png";
import frame6 from "@/public/images/frame_6.svg";

//explore category icon
import categoryIcon1 from "@/public/images/category_icon_1.png";
import categoryIcon2 from "@/public/images/category_icon_2.png";
import categoryIcon3 from "@/public/images/category_icon_3.png";
import categoryIcon4 from "@/public/images/category_icon_4.png";
import categoryIcon5 from "@/public/images/category_icon_5.png";
import categoryIcon6 from "@/public/images/category_icon_6.png";

//worker services images
import serviceImage1 from "@/public/images/workers_profile_service_img1.png";
import serviceImage2 from "@/public/images/workers_profile_service_img2.png";
import serviceImage3 from "@/public/images/workers_profile_service_img3.png";
import serviceImage4 from "@/public/images/workers_profile_service_img4.png";

//more services images
import moreServiceImg1 from "@/public/images/view_services_img1.png";
import moreServiceImg2 from "@/public/images/view_services_img2.png";
import moreServiceImg3 from "@/public/images/view_services_img3.png";
import moreServiceImg4 from "@/public/images/view_services_img4.png";
import moreServiceImg5 from "@/public/images/view_services_img5.png";
import moreServiceImg6 from "@/public/images/view_services_img6.png";

//chat poeple image
import img1 from "@/public/images/chat1.png";
import img2 from "@/public/images/chat2.png";
import img3 from "@/public/images/chat3.png";
import img4 from "@/public/images/chat4.png";
import img5 from "@/public/images/chat5.png";
import img6 from "@/public/images/chat6.png";

//dashboard services image
import dashboardServicesImg1 from "@/public/images/dashboard-services-img1.png";
import dashboardServicesImg2 from "@/public/images/dashboard-services-img2.png";
import dashboardServicesImg3 from "@/public/images/dashboard-services-img3.png";
import dashboardServicesImg4 from "@/public/images/dashboard-services-img4.png";

//comment people images
import commentPeople1 from "@/public/images/comment_people_1.png";
import commentPeople2 from "@/public/images/comment_people_2.png";
import commentPeople3 from "@/public/images/comment_people_3.png";

export const headerMenu = [
  {
    id: uuidv4(),
    name: "Services",
    isSubmenu: true,
    submenu: [
      {
        id: uuidv4(),
        name: "Tous les services",
        link: "/services",
      },
      {
        id: uuidv4(),
        name: "Parcourir les missions",
        link: "/browse-tasks",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Prestataires",
    isSubmenu: true,
    submenu: [
      {
        id: uuidv4(),
        name: "Trouver un prestataire",
        link: "/find-workers",
      },
      {
        id: uuidv4(),
        name: "Devenir prestataire",
        link: "/become-tasker",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Aide",
    isSubmenu: true,
    submenu: [
      {
        id: uuidv4(),
        name: "Messagerie",
        link: "/chat",
      },
      {
        id: uuidv4(),
        name: "FAQ",
        link: "/faq",
      },
      {
        id: uuidv4(),
        name: "Contact",
        link: "/contact",
      },
    ],
  },
];

export const homeOneHeroSlider = [
  {
    id: uuidv4(),
    title: "Photographie",
    desc: "Services photo professionnels pour tous vos événements.",
    img: homeHeorSliderImg1,
    bgColor: "bg-g300",
  },
  {
    id: uuidv4(),
    title: "Bricolage",
    desc: "Réparations et améliorations de vos espaces.",
    img: homeHeorSliderImg2,
    bgColor: "bg-b300",
  },
  {
    id: uuidv4(),
    title: "Ménage",
    desc: "Services de nettoyage experts pour maisons et bureaux impeccables.",
    img: homeHeorSliderImg3,
    bgColor: "bg-b900",
  },
  {
    id: uuidv4(),
    title: "Rénovation",
    desc: "Services de rénovation professionnels disponibles maintenant.",
    img: homeHeorSliderImg4,
    bgColor: "bg-o300",
  },
];

export const howItWorksOne = [
  {
    id: uuidv4(),
    title: "Évaluez les prestataires",
    desc: "Choisissez un prestataire selon le prix, les compétences et les avis.",
  },
  {
    id: uuidv4(),
    title: "Réservez maintenant",
    desc: "Planifiez un prestataire dès aujourd'hui.",
  },
  {
    id: uuidv4(),
    title: "Messagerie intégrée",
    desc: "Discutez, payez et laissez un avis, tout au même endroit.",
  },
];

export const topExperts = [
  {
    id: uuidv4(),
    img: "expertImg1",
    expertName: "Jean Dupont",
    location: "Paris, France",
    features: ["50€ - 100€/h", "INDÉPENDANT", "DISPONIBLE"],
    services: ["Bricolage", "Jardinage"],
    sliderImg: [
      expertImgSlider2,
      expertImgSlider1,
      expertImgSlider3,
      expertImgSlider4,
      expertImgSlider5,
      expertImgSlider6,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg2",
    expertName: "Pierre Martin",
    location: "Lyon, France",
    features: ["45€ - 80€/h", "INDÉPENDANT", "DISPONIBLE"],
    services: ["Plomberie", "Bricolage"],
    sliderImg: [
      expertImgSlider6,
      expertImgSlider5,
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider3,
      expertImgSlider4,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg3",
    expertName: "Leroy Curtis",
    location: "Brooklyn, NY, USA",
    features: ["$75 - &150/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: [
      "Gardening",
      "Plumber",
      "Plumber",
      "Handyman",
      "Plumber",
      "Plumber",
      "Plumber",
      "Plumber",
    ],
    sliderImg: [
      expertImgSlider3,
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider4,
      expertImgSlider5,
      expertImgSlider6,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg4",
    expertName: "Kenneth Sims",
    location: "Brooklyn, NY, USA",
    features: ["$25 - &150/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: ["Plumber", "Cleaning", "Plumber", "Plumber"],
    sliderImg: [
      expertImgSlider6,
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider3,
      expertImgSlider4,
      expertImgSlider5,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg5",
    expertName: "Sarah Bryan",
    location: "Brooklyn, NY, USA",
    features: ["$75 - &200/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: ["Plumber", "Gardening", "Plumber"],
    sliderImg: [
      expertImgSlider5,
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider3,
      expertImgSlider4,
      expertImgSlider6,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg6",
    expertName: "Todd Meyer",
    location: "Brooklyn, NY, USA",
    features: ["$75 - &150/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: ["Gardening", "Photography", "Plumber", "Plumber", "Handyman"],
    sliderImg: [
      expertImgSlider3,
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider4,
      expertImgSlider5,
      expertImgSlider6,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg1",
    expertName: "Jeanette Alexander",
    location: "Brooklyn, NY, USA",
    features: ["$50 - &100/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: ["Handyman", "Photography", "Plumber", "Plumber"],
    sliderImg: [
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider3,
      expertImgSlider4,
      expertImgSlider5,
      expertImgSlider6,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg5",
    expertName: "Beatrice Gill",
    location: "Brooklyn, NY, USA",
    features: ["$75 - &100/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: [
      "Photography",
      "Gardening",
      "Plumber",
      "Plumber",
      "Plumber",
      "Plumber",
      "Plumber",
      "Plumber",
    ],
    sliderImg: [
      expertImgSlider2,
      expertImgSlider1,
      expertImgSlider3,
      expertImgSlider4,
      expertImgSlider5,
      expertImgSlider6,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg4",
    expertName: "Marvin Perry",
    location: "Brooklyn, NY, USA",
    features: ["$50 - &150/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: ["Gardening", "Handyman", "Plumber", "Plumber", "Plumber"],
    sliderImg: [
      expertImgSlider3,
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider4,
      expertImgSlider5,
      expertImgSlider6,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg2",
    expertName: "Marvin Lamb",
    location: "Brooklyn, NY, USA",
    features: ["$75 - &120/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: ["Photography", "Renovation", "Plumber", "Plumber"],
    sliderImg: [
      expertImgSlider4,
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider3,
      expertImgSlider5,
      expertImgSlider6,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg6",
    expertName: "Bradley Pittman",
    location: "Brooklyn, NY, USA",
    features: ["$25 - &120/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: ["Renovation", "Cleaning", "Plumber", "Plumber"],
    sliderImg: [
      expertImgSlider5,
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider3,
      expertImgSlider4,
      expertImgSlider6,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg3",
    expertName: "Alice Ortega",
    location: "Brooklyn, NY, USA",
    features: ["$75 - &100/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: ["Renovation", "Photography", "Plumber", "Plumber"],
    sliderImg: [
      expertImgSlider6,
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider3,
      expertImgSlider4,
      expertImgSlider5,
    ],
  },
];

export const testimonialData = [
  {
    id: uuidv4(),
    review:
      "J'ai été impressionnée par l'efficacité de la plateforme. Le prestataire est arrivé à l'heure et a réalisé le travail avec professionnalisme. Je suis une cliente satisfaite et j'utiliserai certainement ce service à nouveau !",
    img: smallPeople1,
    name: "Marie Laurent",
    profileId: "@marielaurent",
  },
  {
    id: uuidv4(),
    review:
      "Service rapide et efficace ! J'ai trouvé un plombier en moins d'une heure. Travail soigné et tarif transparent. Je recommande vivement.",
    img: smallPeople2,
    name: "Pierre Dumont",
    profileId: "@pierredumont",
  },
  {
    id: uuidv4(),
    review:
      "Excellente expérience avec Servibe. Le jardinier était ponctuel, professionnel et son travail impeccable. Mon jardin n'a jamais été aussi beau !",
    img: smallPeople3,
    name: "Sophie Mercier",
    profileId: "@sophiemercier",
  },
  {
    id: uuidv4(),
    review:
      "Plateforme intuitive et prestataires de qualité. J'ai fait appel à un électricien qui a résolu mon problème en un temps record. Merci Servibe !",
    img: smallPeople2,
    name: "Thomas Bernard",
    profileId: "@thomasbernard",
  },
  {
    id: uuidv4(),
    review:
      "Super concept ! J'ai pu comparer plusieurs devis et choisir le meilleur rapport qualité-prix. Le système d'avis est très utile.",
    img: smallPeople3,
    name: "Claire Dupuis",
    profileId: "@clairedupuis",
  },
  {
    id: uuidv4(),
    review:
      "En tant que prestataire, Servibe m'a permis de développer ma clientèle facilement. L'interface est simple et les paiements sont sécurisés. Une vraie réussite !",
    img: smallPeople1,
    name: "Nicolas Fontaine",
    profileId: "@nicolasfontaine",
  },
];

export const loginReviewData = [
  {
    id: uuidv4(),
    review:
      "J'ai trouvé un excellent plombier en moins de 24h grâce à Servibe. Le service était rapide, professionnel et le prix très raisonnable. Je recommande vivement cette plateforme !",
    img: smallPeople1,
    name: "Marie Dubois",
    profileId: "@mariedubois",
  },
  {
    id: uuidv4(),
    review:
      "En tant que prestataire, Servibe m'a permis de développer ma clientèle de manière significative. L'interface est intuitive et les clients sont sérieux. Une vraie réussite !",
    img: smallPeople2,
    name: "Thomas Martin",
    profileId: "@thomasmartin",
  },
  {
    id: uuidv4(),
    review:
      "Super expérience ! J'avais besoin d'un cours de guitare et j'ai trouvé un prof génial près de chez moi. La réservation était simple et le suivi impeccable.",
    img: smallPeople3,
    name: "Sophie Bernard",
    profileId: "@sophiebernard",
  },
  {
    id: uuidv4(),
    review:
      "Servibe a changé ma façon de trouver des services. Plus besoin de chercher pendant des heures, tout est centralisé et les avis sont fiables. Bravo !",
    img: smallPeople2,
    name: "Pierre Leroy",
    profileId: "@pierreleroy",
  },
  {
    id: uuidv4(),
    review:
      "J'ai fait appel à un jardinier trouvé sur Servibe. Travail soigné, ponctualité et tarif transparent. Je n'utiliserai plus que cette plateforme désormais.",
    img: smallPeople3,
    name: "Claire Moreau",
    profileId: "@clairemoreau",
  },
  {
    id: uuidv4(),
    review:
      "Plateforme au top ! J'ai pu comparer plusieurs devis pour mes travaux de peinture. Le prestataire choisi était très compétent. Merci Servibe !",
    img: smallPeople1,
    name: "Lucas Petit",
    profileId: "@lucaspetit",
  },
  {
    id: uuidv4(),
    review:
      "Service client réactif et prestataires de qualité. J'ai trouvé une aide-ménagère formidable en quelques clics. L'application est vraiment bien pensée.",
    img: smallPeople1,
    name: "Emma Roux",
    profileId: "@emmaroux",
  },
  {
    id: uuidv4(),
    review:
      "Excellent concept ! J'ai pu proposer mes services de photographe et j'ai déjà plusieurs clients réguliers. La commission est raisonnable et le paiement sécurisé.",
    img: smallPeople2,
    name: "Antoine Garcia",
    profileId: "@antoinegarcia",
  },
  {
    id: uuidv4(),
    review:
      "Je cherchais un coach sportif à domicile depuis longtemps. Grâce à Servibe, j'ai trouvé la perle rare ! Séances personnalisées et résultats visibles.",
    img: smallPeople3,
    name: "Julie Lambert",
    profileId: "@julielambert",
  },
  {
    id: uuidv4(),
    review:
      "Très satisfait de mon expérience. Le système de messagerie permet d'échanger facilement avec les prestataires avant de réserver. C'est rassurant et pratique.",
    img: smallPeople2,
    name: "Nicolas Faure",
    profileId: "@nicolasfaure",
  },
  {
    id: uuidv4(),
    review:
      "J'ai fait appel à un électricien en urgence un dimanche. Grâce à Servibe, j'ai trouvé quelqu'un de disponible en moins d'une heure. Service 5 étoiles !",
    img: smallPeople3,
    name: "Camille Girard",
    profileId: "@camillegirard",
  },
  {
    id: uuidv4(),
    review:
      "Plateforme intuitive et sécurisée. J'y trouve tous les services dont j'ai besoin au quotidien. Les prestataires sont vérifiés et professionnels. Je recommande !",
    img: smallPeople1,
    name: "Maxime Bonnet",
    profileId: "@maximebonnet",
  },
];

export const blogDetails = [
  {
    id: uuidv4(),
    title: "Comment choisir le bon prestataire",
    date: "12 Mai",
    category: "Conseils",
    img: blogImg1,
  },
  {
    id: uuidv4(),
    title: "Témoignages de clients satisfaits",
    date: "12 Mai",
    category: "Témoignages",
    img: blogImg2,
  },
  {
    id: uuidv4(),
    title: "Montage de meubles : nos astuces",
    date: "12 Mai",
    category: "Conseils",
    img: blogImg3,
  },
  {
    id: uuidv4(),
    title: "Retour d'expérience de nos prestataires",
    date: "12 Mai",
    category: "Témoignages",
    img: blogImg4,
  },
  {
    id: uuidv4(),
    title: "Les services à domicile en plein essor",
    date: "12 Mai",
    category: "Actualités",
    img: blogImg5,
  },
  {
    id: uuidv4(),
    title: "Réussir sur Servibe : guide complet",
    date: "12 Mai",
    category: "Conseils",
    img: blogImg6,
  },
];

export const companyFeatures = [
  {
    id: uuidv4(),
    title: "1M+ clients",
    desc: "Notifications en temps réel",
    icon: React.createElement(PiBellSimpleRingingThin),
  },
  {
    id: uuidv4(),
    title: "4M+ avis",
    desc: "Évaluations transparentes",
    icon: React.createElement(PiStarThin),
  },
  {
    id: uuidv4(),
    title: "2M+ missions",
    desc: "Paiements sécurisés",
    icon: React.createElement(PiShieldThin),
  },
  {
    id: uuidv4(),
    title: "Support 24/7",
    desc: "Assistance réactive",
    icon: React.createElement(PiHeadphonesThin),
  },
];

export const popularTabNames = [
  {
    id: uuidv4(),
    name: "Photographie",
    img: frame1,
  },
  {
    id: uuidv4(),
    name: "Bricolage",
    img: frame2,
  },
  {
    id: uuidv4(),
    name: "Garde d'enfants",
    img: frame3,
  },
  {
    id: uuidv4(),
    name: "Rénovation",
    img: frame4,
  },
  {
    id: uuidv4(),
    name: "Jardinage",
    img: frame5,
  },
  {
    id: uuidv4(),
    name: "Ménage",
    img: frame6,
  },
];

export const socialLinks = [
  {
    id: uuidv4(),
    name: "Facebook",
    link: "#",
    icon: React.createElement(PiFacebookLogo),
  },
  {
    id: uuidv4(),
    name: "Twitter",
    link: "#",
    icon: React.createElement(PiTwitterLogo),
  },
  {
    id: uuidv4(),
    name: "Instagram",
    link: "#",
    icon: React.createElement(PiInstagramLogo),
  },
  {
    id: uuidv4(),
    name: "Behance",
    link: "#",
    icon: React.createElement(PiBehanceLogo),
  },
  {
    id: uuidv4(),
    name: "Dribbble",
    link: "#",
    icon: React.createElement(PiDribbbleLogo),
  },
];

export const exploreCategory = [
  {
    id: uuidv4(),
    name: "Bricolage",
    desc: "Bricoleur polyvalent pour vos réparations et travaux avec précision.",
    icon: categoryIcon1,
    bgColor: "bg-r50 ",
    iconBgColor: "bg-bg5",
  },
  {
    id: uuidv4(),
    name: "Photographie",
    desc: "Capturez vos moments avec nos services photo professionnels.",
    icon: categoryIcon2,
    bgColor: "bg-bg2",
    iconBgColor: "bg-[#8CEDF6]",
  },
  {
    id: uuidv4(),
    name: "Garde d'enfants",
    desc: "Baby-sitters de confiance pour votre tranquillité d'esprit.",
    icon: categoryIcon3,
    bgColor: "bg-[#FEE6B2]",
    iconBgColor: "bg-bg6",
  },
  {
    id: uuidv4(),
    name: "Rénovation",
    desc: "Transformez vos espaces avec nos services de rénovation experts !",
    icon: categoryIcon4,
    bgColor: "bg-[#E9E7F7]",
    iconBgColor: "bg-[#B9AFFF]",
  },
  {
    id: uuidv4(),
    name: "Jardinage",
    desc: "Cultivez votre jardin avec des services de jardinage professionnels.",
    icon: categoryIcon5,
    bgColor: "bg-bg4",
    iconBgColor: "bg-[#D4EDB3]",
  },
  {
    id: uuidv4(),
    name: "Ménage",
    desc: "Solutions de nettoyage efficaces pour un espace impeccable.",
    icon: categoryIcon6,
    bgColor: "bg-eb50",
    iconBgColor: "bg-[#9DC4FC]",
  },
];

export const faqData = [
  {
    id: uuidv4(),
    question: "Quels types de services proposez-vous ?",
    answer:
      "Nous proposons une large gamme de services : ménage, bricolage, jardinage, garde d'enfants, photographie, rénovation et plomberie.",
  },
  {
    id: uuidv4(),
    question: "Quels sont les moyens de paiement acceptés ?",
    answer:
      "Nous acceptons les paiements par carte bancaire, PayPal et virement. Le paiement est sécurisé et effectué après validation du service.",
  },
  {
    id: uuidv4(),
    question: "Combien de temps dure une prestation ?",
    answer:
      "La durée varie selon le type de service et les besoins. Chaque prestataire indique la durée estimée sur son profil.",
  },
  {
    id: uuidv4(),
    question: "Comment annuler une réservation ?",
    answer:
      "Vous pouvez annuler votre réservation depuis votre tableau de bord. Les conditions d'annulation varient selon le prestataire.",
  },
];

export const workerServices = [
  {
    id: uuidv4(),
    img: serviceImage1,
    name: "Ménage Express - Nettoyage complet",
    startingPrice: "75€ - 100€/h",
  },
  {
    id: uuidv4(),
    img: serviceImage2,
    name: "Nettoyage maison intégral",
    startingPrice: "50€ - 100€/h",
  },
  {
    id: uuidv4(),
    img: serviceImage3,
    name: "Nettoyage bureaux professionnels",
    startingPrice: "50€ - 150€/h",
  },
  {
    id: uuidv4(),
    img: serviceImage4,
    name: "Installation électroménager",
    startingPrice: "25€ - 100€/h",
  },
];

export const recommendationsData = [
  {
    id: uuidv4(),
    profileImg: "expertImg4",
    name: "Sophie Martin",
    address: "Paris, France",
    review:
      "C'était un plaisir de travailler avec ce prestataire. Il était très clair et détaillé sur les exigences du projet. J'apprécie sa communication, sa collaboration et sa flexibilité. Merci !",
  },
  {
    id: uuidv4(),
    profileImg: "expertImg3",
    name: "Thomas Dubois",
    address: "Lyon, France",
    review:
      "C'est notre deuxième collaboration. Comme toujours, ce prestataire est incroyable. Il est super clair sur les livrables, agréable à contacter et une personne formidable avec qui travailler !",
  },
  {
    id: uuidv4(),
    profileImg: "expertImg2",
    name: "Marie Leroy",
    address: "Marseille, France",
    review:
      "J'ai adoré travailler sur ce projet ! Le prestataire était très réactif et clair sur tout. J'ai apprécié la liberté créative. Nous avons tellement aimé collaborer que nous continuons sur un nouveau projet !",
  },
];

export const moreProjectData = [
  {
    id: uuidv4(),
    img: moreServiceImg1,
    name: "Ménage",
  },
  {
    id: uuidv4(),
    img: moreServiceImg2,
    name: "Garde d'enfants",
  },
  {
    id: uuidv4(),
    img: moreServiceImg3,
    name: "Jardinage",
  },
  {
    id: uuidv4(),
    img: moreServiceImg4,
    name: "Bricolage",
  },
  {
    id: uuidv4(),
    img: moreServiceImg5,
    name: "Plomberie",
  },
  {
    id: uuidv4(),
    img: moreServiceImg6,
    name: "Rénovation",
  },
];

export const becomeTaskerFeatures = [
  {
    id: uuidv4(),
    icon: React.createElement(PiFileTextBold),
    title: "À vos conditions",
    desc: "Trouvez des missions qui correspondent à vos compétences et votre emploi du temps.",
  },
  {
    id: uuidv4(),
    icon: React.createElement(PiThumbsUpBold),
    title: "Inscription gratuite",
    desc: "Rejoignez-nous gratuitement et commencez à gagner immédiatement.",
  },
  {
    id: uuidv4(),
    icon: React.createElement(PiLockBold),
    title: "Paiements sécurisés",
    desc: "Paiements directs sur votre compte à la fin de chaque mission.",
  },
  {
    id: uuidv4(),
    icon: React.createElement(PiCurrencyDollarSimpleBold),
    title: "Valorisez vos talents",
    desc: "Ménage, bricolage, jardinage et bien plus encore !",
  },
];

export const chatList = [
  {
    id: uuidv4(),
    name: "Piter Maio",
    img: img1,
    isNew: true,
    newMessage: "I am a ga..",
    lastMessageTime: "15min",
  },
  {
    id: uuidv4(),
    name: "Leslie Alexander",
    img: img2,
    lastMessageTime: "12min",
    isMyReply: true,
    myReply: "Why...",
  },
  {
    id: uuidv4(),
    name: "Sa Kib",
    img: img3,
    lastMessageTime: "25min",
    isMyReply: true,
    myReply: "Hello...",
  },
  {
    id: uuidv4(),
    name: "Brooklyn Simmons",
    img: img4,
    isNew: true,
    newMessage: "Duis tincid",
    lastMessageTime: "18min",
  },
  {
    id: uuidv4(),
    name: "Leslie Alexander",
    img: img5,
    lastMessageTime: "20mins",
    isMyReply: true,
    myReply: "I am...",
  },
  {
    id: uuidv4(),
    name: "Piter Maio",
    img: img6,
    lastMessageTime: "19mins",
    isMyReply: true,
    myReply: "How are...",
  },
  {
    id: uuidv4(),
    name: "Cody Fisher",
    img: img1,
    lastMessageTime: "13mins",
    isMyReply: true,
    myReply: "Video",
  },
  {
    id: uuidv4(),
    name: "Bessie Cooper",
    img: img2,
    lastMessageTime: "23mins",
    isMyReply: true,
    myReply: "Photo",
  },
  {
    id: uuidv4(),
    name: "Brooklyn Simmons",
    img: img3,
    lastMessageTime: "14mins",
    isMyReply: true,
    myReply: "How...",
  },
  {
    id: uuidv4(),
    name: "Theresa Webb",
    img: img4,
    lastMessageTime: "45mins",
    isMyReply: true,
    myReply: "Friend...",
  },

  {
    id: uuidv4(),
    name: "Piter Maio",
    img: img5,
    isNew: true,
    newMessage: "Hello",
    lastMessageTime: "14mins",
  },
  {
    id: uuidv4(),
    name: "Leslie Alexander",
    img: img6,
    lastMessageTime: "1hour",
    isMyReply: true,
    myReply: "I'm...",
  },
];

export const workerPortfolioData = [
  {
    id: uuidv4(),
    img: portfolioImg1,
    name: "Nettoyage restaurant",
  },
  {
    id: uuidv4(),
    img: portfolioImg2,
    name: "Ménage maison",
  },
  {
    id: uuidv4(),
    img: portfolioImg3,
    name: "Nettoyage bureaux",
  },
  {
    id: uuidv4(),
    img: portfolioImg4,
    name: "Entretien locaux scolaires",
  },
];

export const dashboardMenu = [
  {
    id: uuidv4(),
    name: "Tableau de bord",
    link: "/dashboard/home",
  },
  {
    id: uuidv4(),
    name: "Mes services",
    link: "/dashboard/services",
  },
  {
    id: uuidv4(),
    name: "Favoris",
    link: "/dashboard/wishlist",
  },
  {
    id: uuidv4(),
    name: "Avis",
    link: "/dashboard/reviews",
  },
  {
    id: uuidv4(),
    name: "Messages",
    link: "/chat",
  },
];

export const dashborarNotificationData = [
  {
    id: uuidv4(),
    name: "Nouveau message reçu",
    time: "Il y a 7 heures",
  },
  {
    id: uuidv4(),
    name: "Demande de réservation",
    time: "Il y a 8 heures",
  },
  {
    id: uuidv4(),
    name: "Nouvel avis publié",
    time: "Il y a 9 heures",
  },
  {
    id: uuidv4(),
    name: "Service approuvé",
    time: "Il y a 10 heures",
  },
];

export const dashboardProfileLink = [
  {
    id: uuidv4(),
    name: "Profil",
    link: "/dashboard/profile",
  },
  {
    id: uuidv4(),
    name: "Modifier le profil",
    link: "/dashboard/edit-profile",
  },
  {
    id: uuidv4(),
    name: "Paramètres",
    link: "/dashboard/settings",
  },
  {
    id: uuidv4(),
    name: "Déconnexion",
    link: "/sign-in",
  },
];

export const userInformationCard = [
  {
    id: uuidv4(),
    count: "17",
    title: "En attente",
    iconBgColor: "bg-r300",
    icon: React.createElement(PiListChecks),
  },
  {
    id: uuidv4(),
    count: "2750",
    title: "Terminées",
    iconBgColor: "bg-o300",
    icon: React.createElement(PiHandshake),
  },
  {
    id: uuidv4(),
    count: "07",
    title: "Gains totaux",
    iconBgColor: "bg-b300",
    icon: React.createElement(PiCurrencyCircleDollar),
  },
  {
    id: uuidv4(),
    count: "1204",
    title: "Solde",
    iconBgColor: "bg-g300",
    icon: React.createElement(PiMoney),
  },
];

export const thisMonthSummeryCard = [
  {
    id: uuidv4(),
    count: "145",
    title: "Commandes",
    bgColor: "bg-o300",
    icon: React.createElement(PiListChecks),
  },
  {
    id: uuidv4(),
    count: "7500",
    title: "Gains",
    bgColor: "bg-b300",
    icon: React.createElement(PiHandshake),
  },
  {
    id: uuidv4(),
    count: "4205",
    title: "Solde",
    bgColor: "bg-g300",
    icon: React.createElement(PiCurrencyCircleDollar),
  },
  {
    id: uuidv4(),
    count: "740",
    title: "Clients réguliers",
    bgColor: "bg-r300",
    icon: React.createElement(PiMoney),
  },
];

export const orderInfo = [
  {
    id: uuidv4(),
    name: "Jerome Bell",
    status: "Completed",
    location: "New York",
    price: "26547",
  },
  {
    id: uuidv4(),
    name: "Lola Matthews",
    status: "Inprogress",
    location: "Gokrenon",
    price: "51757",
  },
  {
    id: uuidv4(),
    name: "Jane Wallace",
    status: "Completed",
    location: "Uvodowar",
    price: "44137",
  },
  {
    id: uuidv4(),
    name: "Maria Waters",
    status: "Pending",
    location: "Noizus",
    price: "12876",
  },
  {
    id: uuidv4(),
    name: "Bertie Dawson",
    status: "Completed",
    location: "Vadajiz",
    price: "37188",
  },
  {
    id: uuidv4(),
    name: "Myra Sullivan",
    status: "Pending",
    location: "Gijsegsuh",
    price: "38603",
  },
];

export const dashboardTodolist = [
  "Répondre aux messages clients en attente",
  "Mettre à jour les photos de mon profil",
  "Vérifier les nouvelles demandes de service",
  "Consulter les avis récents",
];

export const profileServicesData = [
  {
    id: uuidv4(),
    title: "Services à la demande pour emplois du temps chargés",
    img: dashboardServicesImg1,
    startingPrice: "150",
    ratingCount: "946",
    viewCount: "1863",
    inQ: "37",
    completed: "6137",
    cancelled: "103",
  },
  {
    id: uuidv4(),
    title: "Services adaptés à tous vos besoins",
    img: dashboardServicesImg2,
    startingPrice: "63",
    ratingCount: "501",
    viewCount: "6072",
    inQ: "71",
    completed: "3805",
    cancelled: "212",
  },
  {
    id: uuidv4(),
    title: "Ménage Express - Solutions complètes",
    img: dashboardServicesImg3,
    startingPrice: "66",
    ratingCount: "644",
    viewCount: "4683",
    inQ: "51",
    completed: "4846",
    cancelled: "881",
  },
  {
    id: uuidv4(),
    title: "Témoignages de réussites clients",
    img: dashboardServicesImg4,
    startingPrice: "70",
    ratingCount: "593",
    viewCount: "5849",
    inQ: "67",
    completed: "4020",
    cancelled: "194",
  },
];

export const payoutHistory = [
  {
    id: uuidv4(),
    refId: "EX16 9QT",
    method: "Peinture & Rénovation",
    date: "29/04/2024",
    amount: "1891",
  },
  {
    id: uuidv4(),
    refId: "WF8 4PR",
    method: "Nettoyage bureaux",
    date: "06/09/2024",
    amount: "1635",
  },
  {
    id: uuidv4(),
    refId: "CW12 3NB",
    method: "Ménage & Entretien",
    date: "23/12/2024",
    amount: "5177",
  },
  {
    id: uuidv4(),
    refId: "NW6 4HA",
    method: "Services bricolage",
    date: "25/02/2024",
    amount: "8814",
  },
  {
    id: uuidv4(),
    refId: "HA5 2HS",
    method: "Services photographie",
    date: "02/07/2024",
    amount: "7735",
  },
  {
    id: uuidv4(),
    refId: "AL5 2TR",
    method: "Services plomberie",
    date: "31/07/2024",
    amount: "3792",
  },
  {
    id: uuidv4(),
    refId: "ME1 1YL",
    method: "Services jardinage",
    date: "07/05/2024",
    amount: "4669",
  },
  {
    id: uuidv4(),
    refId: "NW6 4HA",
    method: "Services rénovation",
    date: "20/06/2024",
    amount: "8244",
  },
];

export const blogCommentData = [
  {
    id: uuidv4(),
    name: "Jean Dupont",
    img: commentPeople1,
    date: "2 Octobre",
    comment:
      "J'ai récemment utilisé Servibe pour un service de ménage à domicile et je suis ravi des résultats ! La personne était professionnelle, minutieuse et attentive à chaque détail. Ma maison n'a jamais été aussi propre ! Je recommande vivement leurs services.",
    isReply: true,
    reply: [
      {
        id: uuidv4(),
        name: "Marie Martin",
        img: commentPeople2,
        date: "7 Octobre",
        comment:
          "J'ai fait appel à un bricoleur via Servibe pour réparer un robinet qui fuyait. Il a fait un travail fantastique ! Il était compétent, efficace et a pris le temps de m'expliquer ce qu'il faisait.",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Pierre Bernard",
    img: commentPeople3,
    date: "9 Octobre",
    comment:
      "Excellente expérience avec Servibe pour un service de nettoyage. Le prestataire était très professionnel, minutieux et attentif aux détails. Mon appartement est impeccable ! Je recommande sans hésitation à tous ceux qui cherchent un service de qualité.",
    isReply: false,
  },
];
