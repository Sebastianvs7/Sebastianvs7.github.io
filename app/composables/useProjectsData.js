export const useProjectsData = () => {
  const projectsData = ref([
    {
      id: "koh-i-noor",
      title: "Koh-I-Noor Deutschland",
      description: {
        cs: "KOH-I-NOOR Deutschland GmbH je německá pobočka renomované české společnosti KOH-I-NOOR Hardtmuth, která se specializuje na kvalitní psací a výtvarné potřeby. Nabízí široký sortiment produktů pro umělce, studenty a kanceláře, včetně akčních nabídek a novinek.",
        en: "KOH-I-NOOR Deutschland GmbH is the German branch of the renowned Czech company KOH-I-NOOR Hardtmuth, specializing in high-quality writing and art supplies. It offers a wide range of products for artists, students, and offices, including special offers and new arrivals.",
      },
      link: "https://www.kohinoordeutschland.de",
      visible: true,
      image: "./images/kin-logo.svg",
      position: 1,
    },
    {
      id: "zoeto",
      title: "Zoeto",
      description: {
        cs: "Aplikace Zoeto je mobilní nástroj vyvinutý společností Zoetis Inc., určený pro veterinární profesionály. Umožňuje přístup k produktovému katalogu s podrobnými informacemi o lécích, včetně složení, indikací, balení a cen. Uživatelé mohou snadno vytvářet objednávky, spravovat dodací adresy a prohlížet historii objednávek. Aplikace je dostupná zdarma pro zařízení s iOS a Androidem.",
        en: "The Zoeto application is a mobile tool developed by Zoetis Inc. for veterinary professionals. It provides access to a product catalog with detailed information on medicines, including composition, indications, packaging, and prices. Users can easily place orders, manage delivery addresses, and view order history. The app is available free of charge for both iOS and Android devices.",
      },
      links: [
        {
          url: "https://apps.apple.com/cz/app/zoeto/id6447378302",
          text: "iOS App",
        },
        {
          url: "https://play.google.com/store/apps/details?id=com.zoeto&hl=cs&pli=1",
          text: "Android App",
        },
      ],
      visible: true,
      image: "./images/logo_zoetis.svg",
      position: 2,
    },
    {
      id: "furnatura",
      title: "Furnatura",
      description: {
        cs: "Furnatura je česká značka přírodní kosmetiky pro psy, která se specializuje na šetrnou péči o srst a pokožku domácích mazlíčků. Produkty jsou vyráběny ručně v České republice z čistě přírodních surovin, jako jsou rostlinné extrakty, minerály z Mrtvého moře a výživné oleje. Neobsahují sulfáty, silikony, parabeny ani mikroplasty, a nejsou testovány na zvířatech.",
        en: "Furnatura is a Czech brand of natural cosmetics for dogs, specializing in gentle care for pets' coats and skin. The products are handmade in the Czech Republic from purely natural ingredients such as plant extracts, Dead Sea minerals, and nourishing oils. They contain no sulfates, silicones, parabens, or microplastics, and are not tested on animals.",
      },
      link: "https://furnatura.com/en-US/",
      visible: true,
      image: "./images/furnatura-prague.svg",
      position: 3,
    },
    {
      id: "shop8-cms",
      title: "Shop8 CMS",
      description: {
        cs: "Shop 8 je česká firma specializující se na vývoj e-commerce řešení na míru pro středně velké firmy, které již překonaly limity standardních šablonových platforem. Jejich cílem je poskytovat flexibilní a škálovatelné e-shopy, které rostou spolu s byznysem klienta.",
        en: "Shop 8 is a Czech company specializing in custom e-commerce solutions for medium-sized businesses that have outgrown standard template-based platforms. Their goal is to deliver flexible and scalable online stores that grow alongside their clients' businesses.",
      },
      link: "https://www.shop8.cz",
      visible: true,
      image: "./images/logo-code8.svg",
      position: 4,
    },
    {
      id: "mobile-phone-museum",
      title: "Mobile Phone Museum",
      description: {
        cs: "Mobile Phone Museum je online neziskové muzeum zaměřené na historii mobilních telefonů. Bylo založeno v roce 2021 odborníky Benem Woodem a Mattem Chatterleym s cílem uchovat a zpřístupnit vývoj mobilní technologie prostřednictvím sbírky více než 2800 unikátních zařízení od více než 200 výrobců.",
        en: "The Mobile Phone Museum is an online non-profit museum dedicated to the history of mobile phones. Founded in 2021 by experts Ben Wood and Matt Chatterley, it aims to preserve and showcase the evolution of mobile technology through a collection of over 2,800 unique devices from more than 200 manufacturers.",
      },
      link: "https://www.mobilephonemuseum.com",
      visible: true, // Hidden by default
      image: "./images/logo-mpm.svg",
      position: 5,
    },
    {
      id: "elements",
      title: "Elements",
      description: {
        cs: "Elements Tatranská Lomnica je moderní horský resort situovaný v srdci Vysokých Tater, přímo pod Lomnickým štítem. Jeho unikátní koncept vychází z pěti přírodních živlů – ohně, vody, dřeva, kovu a země – inspirovaných teorií feng-šuej. Tento designový přístup spojuje špičkový komfort s respektem k přírodě.",
        en: "Elements Tatranská Lomnica is a modern mountain resort located in the heart of the High Tatras, directly beneath Lomnický Peak. Its unique concept is inspired by the five natural elements – fire, water, wood, metal, and earth – based on feng shui principles. This design approach combines top-level comfort with respect for nature.",
      },
      link: "https://www.elementslomnica.sk/en",
      visible: true,
      image: "./images/logo-elements.svg",
      position: 6,
    },
    {
      id: "biocultus",
      title: "Biocultus",
      description: {
        cs: "Biocultus je česká firma ze Sušice, která vyrábí ekologické kompostovací toalety bez potřeby vody, elektřiny či kanalizace.",
        en: "Biocultus is a Czech company based in Sušice that produces eco-friendly composting toilets without the need for water, electricity, or sewage systems.",
      },
      link: "https://www.biocultus.com/cs",
      visible: false,
      image: "./images/biocultus-logo.svg",
      position: 7,
    },
    {
      id: "joalis",
      title: "Joalis",
      description: {
        cs: "Joalis je česká firma založená v roce 1999, specializující se na vývoj a výrobu přírodních doplňků stravy zaměřených na detoxikaci organismu.",
        en: "Joalis is a Czech company founded in 1999, specializing in the development and production of natural dietary supplements focused on body detoxification.",
      },
      link: "https://www.joalis.cz",
      visible: false,
      image: "./images/logo-joalis.png",
      position: 8,
    },

    {
      id: "yogarden",
      title: "Yogarden",
      description: {
        cs: "Yogarden je moderní jógové studio v pražské Letné, které nabízí širokou škálu lekcí pro všechny úrovně – od začátečníků po pokročilé. Studio se zaměřuje na propojení těla a mysli prostřednictvím různých jógových stylů, včetně Hatha jógy, Vinyasa Flow, Yin jógy, Somatic jógy, Pilates a Yoga Nidra.",
        en: "Yogarden is a modern yoga studio in Prague's Letná district, offering a wide variety of classes for all levels – from beginners to advanced practitioners. The studio focuses on connecting body and mind through different yoga styles, including Hatha Yoga, Vinyasa Flow, Yin Yoga, Somatic Yoga, Pilates, and Yoga Nidra.",
      },
      link: "https://www.yogarden.cz/cz",
      visible: false,
      image: "./images/logo-yogarden.svg",
      position: 9,
    },
    {
      id: "moonwood",
      title: "Moonwood",
      description: {
        cs: "Moonwood je česká společnost zaměřená na distribuci kvalitních anglických a cizojazyčných dětských knih po celé Evropě.",
        en: "Moonwood is a Czech company focused on the distribution of high-quality English and foreign-language children's books across Europe.",
      },
      link: "https://moonwood.com",
      visible: false,
      image: "./images/logo-moonwood.svg",
      position: 10,
    },
    {
      id: "magnus-art",
      title: "Magnus Art",
      description: {
        cs: "Galerie Magnus Art je pražská galerie zaměřená na prezentaci kvalitního českého i světového umění.",
        en: "Magnus Art Gallery is a Prague-based gallery dedicated to presenting high-quality Czech and international art.",
      },
      link: "https://magnusart.cz",
      visible: false,
      image: "./images/MA_logo.svg",
      position: 11,
    },
    {
      id: "mcled",
      title: "MCLED",
      description: {
        cs: "Přední výrobce LED osvětlení Praha, široký sortiment skladem, LED svítidla, LED pásky a profily na míru. Profesionální poradenství a rychlé dodání.",
        en: "Leading LED lighting manufacturer in Prague, wide range in stock, LED fixtures, LED strips and custom profiles. Professional consultation and fast delivery.",
      },
      link: "https://www.mcled.cz/",
      visible: false,
      image: "./images/mcled-logo.svg",
      position: 12,
    },
  ]);

  return {
    projectsData,
  };
};
