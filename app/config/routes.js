export const routes = {
  home: "/",
  shop: {
    index: "/shop",
    candles: "/shop/candles",
    personalCare: "/shop/personal-care",
    incense: "/shop/incense",
    books: "/shop/books-and-gifts",
  },
  journal: "/journal",
  about: "/about",
  contact: "/contact",
  cart: "/cart",
  account: "/account",
  legal: {
    privacy: "/legal/privacy",
    terms: "/legal/terms",
    shipping: "/legal/shipping",
    returns: "/legal/returns",
  },
};

export const mainNavItems = [
  {
    title: "SHOP",
    href: routes.shop.index,
    items: [
      { title: "Candles", href: routes.shop.candles },
      { title: "Personal Care", href: routes.shop.personalCare },
      { title: "Incense", href: routes.shop.incense },
      { title: "Books & Gifts", href: routes.shop.books },
    ],
  },
  { title: "JOURNAL", href: routes.journal },
  { title: "ABOUT", href: routes.about },
  { title: "CONTACT", href: routes.contact },
];
