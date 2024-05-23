// @ts-nocheck
import "server-only";

import {
  SearchItemsRequest,
  PartnerType,
  Host,
  Region,
  SearchItemsResponse,
  SearchResultItem,
} from "paapi5-typescript-sdk";
import { sleep } from "../utils";
import { Client, ClientOptions } from "@elastic/elasticsearch";

const config: ClientOptions = {
  cloud: {
    id: process.env.ES_CLOUD_ID as string,
  },
  auth: {
    apiKey: process.env.ES_API_KEY as string,
  },
};
const client = new Client(config);

export async function get_item_by_asin(
  asin: string
): Promise<SearchResultItem | undefined> {
  // return FakeResponse.SearchResult.Items.find(item => item.ASIN === asin)
  const { _source } = await client.get<SearchResultItem>({
    index: "amz-pa-api",
    id: asin,
  });

  return _source;
}

export async function search_items(
  query: string,
  page: number = 1,
  maxPrice: number = 100000
): Promise<SearchItemsResponse> {
  const request = new SearchItemsRequest(
    {
      Keywords: query,
      LanguagesOfPreference: ["de_DE"],
      Availability: "Available",
      Condition: "New",
      SortBy: "Relevance",
      ItemCount: 4,
      ItemPage: page,
      MaxPrice: maxPrice * 100,
      Resources: [
        "BrowseNodeInfo.BrowseNodes",
        // @ts-ignore
        "BrowseNodeInfo.BrowseNodes.SalesRank",
        "BrowseNodeInfo.WebsiteSalesRank",
        // @ts-ignore
        "CustomerReviews.Count",
        // @ts-ignore
        "CustomerReviews.StarRating",
        "Images.Primary.Small",
        "Images.Primary.Medium",
        "Images.Primary.Large",
        // @ts-ignore
        "Images.Primary.HighRes",
        // @ts-ignore
        "Images.Variants.Small",
        // @ts-ignore
        "Images.Variants.Medium",
        // @ts-ignore
        "Images.Variants.Large",
        // @ts-ignore
        "Images.Variants.HighRes",
        "ItemInfo.ByLineInfo",
        "ItemInfo.ContentInfo",
        "ItemInfo.ContentRating",
        "ItemInfo.Classifications",
        "ItemInfo.ExternalIds",
        "ItemInfo.Features",
        "ItemInfo.ManufactureInfo",
        "ItemInfo.ProductInfo",
        "ItemInfo.TechnicalInfo",
        "ItemInfo.Title",
        "ItemInfo.TradeInInfo",
        "Offers.Listings.Availability.MaxOrderQuantity",
        "Offers.Listings.Availability.Message",
        "Offers.Listings.Availability.MinOrderQuantity",
        "Offers.Listings.Availability.Type",
        "Offers.Listings.Condition",
        "Offers.Listings.Condition.ConditionNote",
        "Offers.Listings.Condition.SubCondition",
        "Offers.Listings.DeliveryInfo.IsAmazonFulfilled",
        "Offers.Listings.DeliveryInfo.IsFreeShippingEligible",
        "Offers.Listings.DeliveryInfo.IsPrimeEligible",
        "Offers.Listings.IsBuyBoxWinner",
        "Offers.Listings.MerchantInfo",
        "Offers.Listings.Price",
        "Offers.Listings.ProgramEligibility.IsPrimeExclusive",
        "Offers.Listings.ProgramEligibility.IsPrimePantry",
        "Offers.Listings.Promotions",
        "Offers.Listings.SavingBasis",
        "Offers.Summaries.HighestPrice",
        "Offers.Summaries.LowestPrice",
        "Offers.Summaries.OfferCount",
        "ParentASIN",
        "SearchRefinements",
      ],
    },
    "geschenkideeio-21",
    PartnerType.ASSOCIATES,
    process.env.AMZ_ACCESS_KEY as string,
    process.env.AMZ_SECRET as string,
    Host.GERMANY,
    Region.GERMANY
  );

  const items = await request.send();

  if (items.Errors) {
    console.log(items.Errors);
    return items;
  }

  for (const item of items.SearchResult.Items) {
    await client.index({
      index: "amz-pa-api",
      id: item.ASIN,
      body: item,
    });
  }

  return items;
  // await sleep(1000);

  // return FakeResponse;
}

export const FakeResponse: SearchItemsResponse = {
  SearchResult: {
    Items: [
      {
        ASIN: "B0BPSLH3G7",
        BrowseNodeInfo: {
          BrowseNodes: [
            {
              ContextFreeName: "Konservierte Blumen",
              DisplayName: "Konservierte Blumen",
              Id: "26470768031",
              IsRoot: false,
              SalesRank: 15,
            },
          ],
          WebsiteSalesRank: { SalesRank: 12767 },
        },
        DetailPageURL:
          "https://www.amazon.de/dp/B0BPSLH3G7?tag=geschenkideeio-21&linkCode=osi&th=1&psc=1&language=de_DE",
        Images: {
          Primary: {
            Large: {
              Height: 500,
              URL: "https://m.media-amazon.com/images/I/51iFFlZgsDL._SL500_.jpg",
              Width: 500,
            },
            Medium: {
              Height: 160,
              URL: "https://m.media-amazon.com/images/I/51iFFlZgsDL._SL160_.jpg",
              Width: 160,
            },
            Small: {
              Height: 75,
              URL: "https://m.media-amazon.com/images/I/51iFFlZgsDL._SL75_.jpg",
              Width: 75,
            },
          },
          Variants: [
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/518ODtlAnhL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/518ODtlAnhL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/518ODtlAnhL._SL75_.jpg",
                Width: 75,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/51hGTB3FOPL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/51hGTB3FOPL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/51hGTB3FOPL._SL75_.jpg",
                Width: 75,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/51IkmKg6BmL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/51IkmKg6BmL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/51IkmKg6BmL._SL75_.jpg",
                Width: 75,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/51XjzBio6VL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/51XjzBio6VL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/51XjzBio6VL._SL75_.jpg",
                Width: 75,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/61oPaJtQECL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/61oPaJtQECL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/61oPaJtQECL._SL75_.jpg",
                Width: 75,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/517rBo0IaTL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/517rBo0IaTL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/517rBo0IaTL._SL75_.jpg",
                Width: 75,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/518XdyF5HcL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/518XdyF5HcL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/518XdyF5HcL._SL75_.jpg",
                Width: 75,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/51lJG9YffiL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/51lJG9YffiL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/51lJG9YffiL._SL75_.jpg",
                Width: 75,
              },
            },
          ],
        },
        ItemInfo: {
          ByLineInfo: {
            Brand: {
              DisplayValue: "BoriYa mit einem extrem langen Firmennamen",
              Label: "Brand",
              Locale: "de_DE",
            },
            Manufacturer: {
              DisplayValue: "BoriYa",
              Label: "Manufacturer",
              Locale: "de_DE",
            },
          },
          Classifications: {
            ProductGroup: {
              DisplayValue: "Möbel",
              Label: "ProductGroup",
              Locale: "de_DE",
            },
          },
          Features: {
            DisplayValues: [
              "Rose im Glas mit Licht 💕 Rote ewige rose in voller Blüte sind in der mitte des glas engel von Eukalyptusblättern umgeben und akzentuiert mit led licht und perlen.Das einzigartige warme Lichtdesign lässt die rose glas engel in lebendiger Schönheit funkeln und leuchten.Tag und Nacht können Sie die romantische, warme und liebevolle Atmosphäre durch die glasabdeckung spüren.",
              "Ewiges Herz 💕 Infinity rosen die handgefertigt aus sorgfältig ausgewählten echten rosen, bewahrt die einzigartige Konservierungstechnik die Farbe und Struktur der Rosen, so dass sie ewig blühen und niemals verblassen. Konservierte rose symbolisieren die ewige und leidenschaftliche Liebe, die Sie Ihrem geliebten Menschen ausdrücken möchten.",
              "Ewige Rose in Engel Glaskuppel 💕 Das exklusive Design der gläs engel ist kristallklar, mit einem goldenen Heiligenschein um den Kopf und offenen Flügeln dahinter. Eine lebensechte forever rose engelsfigur, wie eine sich Schmetterlingsfee, die Liebe und Schönheit repräsentiert, wird Ihren Lieben Glück und Hoffnung bringen.",
              "Rose im Glas 💕 Das engel glas besteht aus neu entwickeltem, verdicktem Hochborosilikatglas und ist durch eine verdickte und flexible Schaumstoffverpackung geschützt. Das ewige blume engel hat einen massiven Holzsockel, der den durch die Logistik verursachten Bruch stark reduziert.",
              "Muttertags Geschenke für Mama 💕 Die led eternal rose angel wird in einer schönen Geschenkbox mit Griffen geliefert und wird mit einer Grußkarte geliefert, damit Sie die engel ewige rosen direkt an Ihre Liebsten verschenken können. ewige rose im glas mit led licht sind eine Überraschung für Mama.",
            ],
            Label: "Features",
            Locale: "de_DE",
          },
          ManufactureInfo: {
            ItemPartNumber: {
              DisplayValue: "003",
              Label: "PartNumber",
              Locale: "en_US",
            },
            Model: { DisplayValue: "003", Label: "Model", Locale: "en_US" },
          },
          ProductInfo: {
            Color: { DisplayValue: "Rot", Label: "Color", Locale: "de_DE" },
            ItemDimensions: {
              Height: {
                DisplayValue: 1.181102361,
                Label: "Height",
                Locale: "de_DE",
                Unit: "Zoll",
              },
              Length: {
                DisplayValue: 0.393700787,
                Label: "Length",
                Locale: "de_DE",
                Unit: "Zoll",
              },
              Width: {
                DisplayValue: 0.787401574,
                Label: "Width",
                Locale: "de_DE",
                Unit: "Zoll",
              },
            },
            Size: { DisplayValue: "Small", Label: "Size", Locale: "de_DE" },
            UnitCount: {
              DisplayValue: 1,
              Label: "NumberOfItems",
              Locale: "en_US",
            },
          },
          Title: {
            DisplayValue:
              "BoriYa Muttertagsgeschenk Infinity Rosen im Glas Engel - Ewige Rose in Angel Glaskuppel mit LED Licht und Perlen,Konservierte Blumen in Engelsfigur, Eternal Rosen Geschenk für Mama, Frauen,Sie,Frau",
            Label: "Title",
            Locale: "de_DE",
          },
        },
        Offers: {
          Listings: [
            {
              Availability: {
                Message: "Auf Lager",
                MinOrderQuantity: 1,
                Type: "Now",
              },
              Condition: { SubCondition: { Value: "New" }, Value: "New" },
              DeliveryInfo: {
                IsAmazonFulfilled: true,
                IsFreeShippingEligible: true,
                IsPrimeEligible: true,
              },
              Id: "AQITlx7xW6ZMR%2BFIHK35%2BzRh10kceBksDBBpXhxOPTN9hhOYdbaIx%2Bu5mZaB0h%2F7MLgB8M6kbMQt9nBK8IcEL2I65esGbcipwY9Vj9P9BhJbYUT6VskMdmNjuxj%2FZIpreI6wXFYHyJFgA9xdluAC3ZUJhuZCDNtq318G8CWxOsqVw3P7EkhkyUCUtPxFD6qc",
              IsBuyBoxWinner: true,
              MerchantInfo: {
                DefaultShippingCountry: "FR",
                FeedbackCount: 8,
                FeedbackRating: 4.87,
                Id: "A34H263XQ7VCPK",
                Name: "HXIN SARL",
              },
              Price: {
                Amount: 18.99,
                Currency: "EUR",
                DisplayAmount: "18,99 €",
              },
              ProgramEligibility: {
                IsPrimeExclusive: false,
                IsPrimePantry: false,
              },
              ViolatesMAP: false,
            },
          ],
          Summaries: [
            {
              Condition: { Value: "New" },
              HighestPrice: {
                Amount: 18.99,
                Currency: "EUR",
                DisplayAmount: "18,99 €",
              },
              LowestPrice: {
                Amount: 18.99,
                Currency: "EUR",
                DisplayAmount: "18,99 €",
              },
              OfferCount: 1,
            },
          ],
        },
        ParentASIN: "B0C3CN82T3",
      },
      {
        ASIN: "B0BPXQ26LC",
        BrowseNodeInfo: {
          BrowseNodes: [
            {
              ContextFreeName: "Konservierte Blumen",
              DisplayName: "Konservierte Blumen",
              Id: "26470768031",
              IsRoot: false,
              SalesRank: 8,
            },
          ],
          WebsiteSalesRank: { SalesRank: 9366 },
        },
        DetailPageURL:
          "https://www.amazon.de/dp/B0BPXQ26LC?tag=geschenkideeio-21&linkCode=osi&th=1&psc=1&language=de_DE",
        Images: {
          Primary: {
            Large: {
              Height: 500,
              URL: "https://m.media-amazon.com/images/I/41cq8EwQKgL._SL500_.jpg",
              Width: 500,
            },
            Medium: {
              Height: 160,
              URL: "https://m.media-amazon.com/images/I/41cq8EwQKgL._SL160_.jpg",
              Width: 160,
            },
            Small: {
              Height: 75,
              URL: "https://m.media-amazon.com/images/I/41cq8EwQKgL._SL75_.jpg",
              Width: 75,
            },
          },
          Variants: [
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/41rgLELp9kL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/41rgLELp9kL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/41rgLELp9kL._SL75_.jpg",
                Width: 75,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/51qssUdF+oL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/51qssUdF+oL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/51qssUdF+oL._SL75_.jpg",
                Width: 75,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/4148+Q5qkZL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/4148+Q5qkZL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/4148+Q5qkZL._SL75_.jpg",
                Width: 75,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/4197j5GisQL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/4197j5GisQL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/4197j5GisQL._SL75_.jpg",
                Width: 75,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/41Qz6PUQmtL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/41Qz6PUQmtL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/41Qz6PUQmtL._SL75_.jpg",
                Width: 75,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/51ews8AzuZL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/51ews8AzuZL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/51ews8AzuZL._SL75_.jpg",
                Width: 75,
              },
            },
          ],
        },
        ItemInfo: {
          ByLineInfo: {
            Brand: { DisplayValue: "OEAGO", Label: "Brand", Locale: "de_DE" },
            Manufacturer: {
              DisplayValue: "Leti",
              Label: "Manufacturer",
              Locale: "de_DE",
            },
          },
          Classifications: {
            Binding: {
              DisplayValue: "Haushaltswaren",
              Label: "Binding",
              Locale: "de_DE",
            },
            ProductGroup: {
              DisplayValue: "Heim und Haus",
              Label: "ProductGroup",
              Locale: "de_DE",
            },
          },
          Features: {
            DisplayValues: [
              "💕【Muttertagsgeschenke Rose für Mama】Diese künstliche Rose ist das perfekte Muttertagsgeschenke Rose für Mama, um Ihre wahre Liebe auszudrücken und sie wissen zu lassen, dass sie immer die wichtigste Rolle in Ihrem Herzen gespielt hat. Es eignet sich auch für Geburtstage, Weihnachten, Jahrestage, Hochzeiten, Thanksgiving, Abschlussfeiern und vieles mehr.Coole Muttertagsgeschenke.",
              "💕【Hohe Qualität】Die geschenke für den valentinstag blätter und blütenblätter sind aus hochwertigem Kunststoff gefertigt, und der Blumenstiel ist aus Polyethylen mit Goldfolie überzogen. Die Blätter haben eine klare und lebensechte Textur, eine lebendige Blume, sind langlebig, nicht leicht gebrochen, und kann auf unbestimmte Zeit ohne Verblassen erhalten werden.",
              "💕【Geschenkkarton】Es kommt mit Luxus-Geschenk-Box mit Rosenmuster auf der Oberfläche. Die Vase ist mit Schutzschaum befestigt, und Sie machen sich keine Sorgen über das Brechen. Es wäre ein romantisches Geschenk für Mama, Oma, Frau, Freundin, Schwester, Freund, Lehrer sein.",
              "💕【Schöne Dekoration】Diese Muttertagsgeschenke für Mama Rosenblüte wird mit einer Vase von guter Qualität geliefert, die bei jeder Gelegenheit verwendet werden kann; die Rose in der Vase sieht sehr elegant und schön aus und Sie können sie auf den Esstisch, das Schlafzimmer, das Wohnzimmer, das Arbeitszimmer, das Büro oder viele andere Orte stellen.",
              "💕【Bedeutung der Liebe】Die ewige Rosenblüte reflektiert verschiedene Farben und Stimmungen je nach Winkel oder Licht, dem sie ausgesetzt ist. Diese Rosenblüte wird niemals sterben oder verwelken. Genau wie die Liebe zwischen Mutter/Frau und uns wird sie niemals verschwinden.",
            ],
            Label: "Features",
            Locale: "de_DE",
          },
          ManufactureInfo: {
            ItemPartNumber: {
              DisplayValue: "artificial flower white",
              Label: "PartNumber",
              Locale: "en_US",
            },
            Model: {
              DisplayValue: "artificial flower white",
              Label: "Model",
              Locale: "en_US",
            },
          },
          ProductInfo: {
            Color: { DisplayValue: "Vase", Label: "Color", Locale: "de_DE" },
            ItemDimensions: {
              Weight: {
                DisplayValue: 0.6172943336,
                Label: "Weight",
                Locale: "de_DE",
                Unit: "pounds",
              },
            },
            Size: { DisplayValue: "1", Label: "Size", Locale: "de_DE" },
            UnitCount: {
              DisplayValue: 1,
              Label: "NumberOfItems",
              Locale: "en_US",
            },
          },
          Title: {
            DisplayValue:
              "OEAGO Muttertagsgeschenke Geschenke für Mama, Muttertagsgeschenk Personalisiert Galaxy Rose Blume mit Vase Geschenke von Tochter Sohn,Mama Geschenk für Weihnachten Muttertag Geburtstag Vase",
            Label: "Title",
            Locale: "de_DE",
          },
        },
        Offers: {
          Listings: [
            {
              Availability: {
                Message: "Auf Lager",
                MinOrderQuantity: 1,
                Type: "Now",
              },
              Condition: { SubCondition: { Value: "New" }, Value: "New" },
              DeliveryInfo: {
                IsAmazonFulfilled: true,
                IsFreeShippingEligible: true,
                IsPrimeEligible: true,
              },
              Id: "AQITlx7xW6ZMR%2BFIHK35%2B%2BpsoucDysHTG6XVvx5Fd4Aw2dS%2FR475Ijkfpa08v9B%2Bmgv%2BSdSm7FbeHF3gaznTMBK%2BpS65SGg3lx905BsfRE20FUzMLZZsZEHyQ0VdXJxTIC2bW%2FmuUWuoI9OW4KaGVOgAQqk3II4pTIMBJmV3yZ%2FiZl%2BJm2qxZoxQoZz4216j",
              IsBuyBoxWinner: true,
              MerchantInfo: {
                DefaultShippingCountry: "CN",
                FeedbackCount: 8,
                FeedbackRating: 4.75,
                Id: "A28OII9FQZNJ0C",
                Name: "Happybuy De",
              },
              Price: {
                Amount: 9.99,
                Currency: "EUR",
                DisplayAmount: "9,99 €",
                Savings: {
                  Amount: 4,
                  Currency: "EUR",
                  DisplayAmount: "4,00 € (29%)",
                  Percentage: 29,
                },
              },
              ProgramEligibility: {
                IsPrimeExclusive: false,
                IsPrimePantry: false,
              },
              SavingBasis: {
                Amount: 13.99,
                Currency: "EUR",
                DisplayAmount: "13,99 €",
                PriceType: "WAS_PRICE",
              },
              ViolatesMAP: false,
            },
          ],
          Summaries: [
            {
              Condition: { Value: "New" },
              HighestPrice: {
                Amount: 15.99,
                Currency: "EUR",
                DisplayAmount: "15,99 €",
              },
              LowestPrice: {
                Amount: 9.99,
                Currency: "EUR",
                DisplayAmount: "9,99 €",
              },
              OfferCount: 2,
            },
          ],
        },
        ParentASIN: "B0CH9KDYHN",
      },
      {
        ASIN: "B09M9YMY3L",
        BrowseNodeInfo: {
          BrowseNodes: [
            {
              ContextFreeName: "Konservierte Blumen",
              DisplayName: "Konservierte Blumen",
              Id: "26470768031",
              IsRoot: false,
              SalesRank: 61,
            },
          ],
          WebsiteSalesRank: { SalesRank: 37616 },
        },
        DetailPageURL:
          "https://www.amazon.de/dp/B09M9YMY3L?tag=geschenkideeio-21&linkCode=osi&th=1&psc=1&language=de_DE",
        Images: {
          Primary: {
            Large: {
              Height: 500,
              URL: "https://m.media-amazon.com/images/I/51SPkJOcOPL._SL500_.jpg",
              Width: 500,
            },
            Medium: {
              Height: 160,
              URL: "https://m.media-amazon.com/images/I/51SPkJOcOPL._SL160_.jpg",
              Width: 160,
            },
            Small: {
              Height: 75,
              URL: "https://m.media-amazon.com/images/I/51SPkJOcOPL._SL75_.jpg",
              Width: 75,
            },
          },
          Variants: [
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/51eny01g6eL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/51eny01g6eL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/51eny01g6eL._SL75_.jpg",
                Width: 75,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/51Dx8uAh4hL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/51Dx8uAh4hL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/51Dx8uAh4hL._SL75_.jpg",
                Width: 75,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/51TDJnX028L._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/51TDJnX028L._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/51TDJnX028L._SL75_.jpg",
                Width: 75,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/610H2TMkCDL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/610H2TMkCDL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/610H2TMkCDL._SL75_.jpg",
                Width: 75,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/51oMa8pXGtL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/51oMa8pXGtL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/51oMa8pXGtL._SL75_.jpg",
                Width: 75,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/51DM2yhWd-L._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/51DM2yhWd-L._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/51DM2yhWd-L._SL75_.jpg",
                Width: 75,
              },
            },
          ],
        },
        ItemInfo: {
          ByLineInfo: {
            Brand: { DisplayValue: "ROEXUN", Label: "Brand", Locale: "de_DE" },
            Manufacturer: {
              DisplayValue: "ROEXUN",
              Label: "Manufacturer",
              Locale: "de_DE",
            },
          },
          Classifications: {
            Binding: {
              DisplayValue: "Haushaltswaren",
              Label: "Binding",
              Locale: "de_DE",
            },
            ProductGroup: {
              DisplayValue: "Heim und Haus",
              Label: "ProductGroup",
              Locale: "de_DE",
            },
          },
          ExternalIds: {
            EANs: {
              DisplayValues: ["0751315591089"],
              Label: "EAN",
              Locale: "en_US",
            },
            UPCs: {
              DisplayValues: ["751315591089"],
              Label: "UPC",
              Locale: "en_US",
            },
          },
          Features: {
            DisplayValues: [
              "🎁🌹【Größen】Bunte künstliche rose Blumen geschenk Spezifikationen: Produktmenge: 1 Stück.Karte: 1 Material: Kunststoff + Glas + Holz. Produktfarbe: Regenbogen. Produktgröße: 11.2(Basisdurchmesser)*21 CM. LED Menge: 20 PCS. LED-Farbe: Warmes Gelb . Geschenk-Box Größe: 13*13*25.5 CM. Produktgewicht: 0.4 6KG.",
              "🎁🌹【Materialien】Ewige Rosen einzigartiges Geschenk ist 100% handgefertigt und umfasst bunte Rosen, LED String Leuchten, Glaskuppel, Holzsockel. Forever rose wird nie verdorgen. Die Schönheit und das Tier Rose Kit blumen symbolisieren ständige Hoffnung und ewige Liebe. sondern auch als Symbol der besten Wünsche.",
              "🎁🌹【Helles LED-Rosenlicht】 Das LED-Licht umhüllt die Rose und bringt warmen Schimmer auf die Blumen! Erleuchten Sie Ihre Liebe mit unserem Rosen-Nachtlicht! Die Glaskuppel reflektiert sanft die LED-Lichter und erzeugt einen schönen und romantischen Effekt! Schaffen Sie eine romantische Atmosphäre für Ihr Jubiläum und Ihre Feierlichkeiten, damit Sie einen warmen und angenehmen Abend verbringen können.",
              "🎁🌹【Gelegenheiten】Verzauberte rose Geschenk für Mama bringt Harmonie und die besten Wünsche zu Ihnen. Perfekte forever Rosen beste Geschenke für Frauen, Liebhaber, Freunde am Geburtstag, Muttertag, Jahrestag, Valentinstag,Erntedank , Weihnachten, Hochzeit. Blumen für Muttertag können tagsüber und nachts für die Raumdekoration verwendet werden.",
              "🎁🌹【Verpackung 】 Exquisite Verpackung und brillante Beleuchtung, kann direkt als Geschenk verschickt werden,Valentinstagsgeschenk Geburtstagsgeschenke Rose Blume für Frauen kommen mit einer rosa Verpackung Geschenk-Boxohne Zeit auf der Verpackung zu verschwenden. perfektes Muttertagsgeschenk.Wir bieten das zufriedenstellendste Serviceerlebnis. Bei Fragen wenden Sie sich bitte an uns. Wir bieten 24 Stunden Online-Service.",
            ],
            Label: "Features",
            Locale: "de_DE",
          },
          ManufactureInfo: {
            ItemPartNumber: {
              DisplayValue: "yx001",
              Label: "PartNumber",
              Locale: "en_US",
            },
            Model: { DisplayValue: "YX001", Label: "Model", Locale: "en_US" },
          },
          ProductInfo: {
            Color: { DisplayValue: "Gelb", Label: "Color", Locale: "de_DE" },
            ItemDimensions: {
              Height: {
                DisplayValue: 8.267716527,
                Label: "Height",
                Locale: "de_DE",
                Unit: "Zoll",
              },
              Length: {
                DisplayValue: 4.330708657,
                Label: "Length",
                Locale: "de_DE",
                Unit: "Zoll",
              },
              Weight: {
                DisplayValue: 1.0141264052,
                Label: "Weight",
                Locale: "de_DE",
                Unit: "pounds",
              },
              Width: {
                DisplayValue: 4.330708657,
                Label: "Width",
                Locale: "de_DE",
                Unit: "Zoll",
              },
            },
            UnitCount: {
              DisplayValue: 1,
              Label: "NumberOfItems",
              Locale: "en_US",
            },
          },
          Title: {
            DisplayValue:
              "YUEHAO Die Schöne Und Das Biest Rose In Glaskuppel LED-Lichter,Enchanted Rose Eternal Rose Satz aus Seide,Romantisches Geschenk für Frauen,Hochzeit, Valentinstag, Muttertag, Jubiläum, Weihnachtstag",
            Label: "Title",
            Locale: "de_DE",
          },
        },
        Offers: {
          Listings: [
            {
              Availability: {
                Message: "Auf Lager",
                MinOrderQuantity: 1,
                Type: "Now",
              },
              Condition: { SubCondition: { Value: "New" }, Value: "New" },
              DeliveryInfo: {
                IsAmazonFulfilled: true,
                IsFreeShippingEligible: true,
                IsPrimeEligible: true,
              },
              Id: "AQITlx7xW6ZMR%2BFIHK35%2Bwdv0f89bMK22vmZQD4m8G%2BNcMu4dubJIOXGsGmX6x6SUTAgLED1sa2CaTC%2FuXc%2BGPlNSpI0eS91JIB%2FiTYUHitoM6nGhVUks%2FKAfxsHv1hfE%2BylkccEHBUA0HzzdhQ4WOgpu3YUpZT%2B5YcG5cLsULIINl7aZS9XlguhprQA0s3K",
              IsBuyBoxWinner: true,
              MerchantInfo: {
                DefaultShippingCountry: "FR",
                FeedbackCount: 155,
                FeedbackRating: 4.88,
                Id: "A3NS1KU3QIZUM2",
                Name: "SAOUR",
              },
              Price: {
                Amount: 10.82,
                Currency: "EUR",
                DisplayAmount: "10,82 €",
                Savings: {
                  Amount: 1,
                  Currency: "EUR",
                  DisplayAmount: "1,00 € (8%)",
                  Percentage: 8,
                },
              },
              ProgramEligibility: {
                IsPrimeExclusive: false,
                IsPrimePantry: false,
              },
              SavingBasis: {
                Amount: 11.82,
                Currency: "EUR",
                DisplayAmount: "11,82 €",
                PriceType: "WAS_PRICE",
              },
              ViolatesMAP: false,
            },
          ],
          Summaries: [
            {
              Condition: { Value: "New" },
              HighestPrice: {
                Amount: 23.06,
                Currency: "EUR",
                DisplayAmount: "23,06 €",
              },
              LowestPrice: {
                Amount: 10.82,
                Currency: "EUR",
                DisplayAmount: "10,82 €",
              },
              OfferCount: 2,
            },
          ],
        },
      },
      {
        ASIN: "B09LLY1DQG",
        BrowseNodeInfo: {
          BrowseNodes: [
            {
              ContextFreeName: "Blumensträuße",
              DisplayName: "Blumensträuße",
              Id: "677395031",
              IsRoot: false,
              SalesRank: 4,
            },
          ],
        },
        DetailPageURL:
          "https://www.amazon.de/dp/B09LLY1DQG?tag=geschenkideeio-21&linkCode=osi&th=1&psc=1&language=de_DE",
        Images: {
          Primary: {
            Large: {
              Height: 500,
              URL: "https://m.media-amazon.com/images/I/51HdaSAJiFL._SL500_.jpg",
              Width: 500,
            },
            Medium: {
              Height: 160,
              URL: "https://m.media-amazon.com/images/I/51HdaSAJiFL._SL160_.jpg",
              Width: 160,
            },
            Small: {
              Height: 75,
              URL: "https://m.media-amazon.com/images/I/51HdaSAJiFL._SL75_.jpg",
              Width: 75,
            },
          },
          Variants: [
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/51Hp2VG1YLL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/51Hp2VG1YLL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/51Hp2VG1YLL._SL75_.jpg",
                Width: 75,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/410R-qQRIQL._SL500_.jpg",
                Width: 477,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/410R-qQRIQL._SL160_.jpg",
                Width: 152,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/410R-qQRIQL._SL75_.jpg",
                Width: 71,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/51A4vbr0UzL._SL500_.jpg",
                Width: 477,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/51A4vbr0UzL._SL160_.jpg",
                Width: 152,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/51A4vbr0UzL._SL75_.jpg",
                Width: 71,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/51iG6bcxCLL._SL500_.jpg",
                Width: 477,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/51iG6bcxCLL._SL160_.jpg",
                Width: 152,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/51iG6bcxCLL._SL75_.jpg",
                Width: 71,
              },
            },
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/51xNfHuTWML._SL500_.jpg",
                Width: 477,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/51xNfHuTWML._SL160_.jpg",
                Width: 152,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/51xNfHuTWML._SL75_.jpg",
                Width: 71,
              },
            },
          ],
        },
        ItemInfo: {
          ByLineInfo: {
            Brand: {
              DisplayValue: "Blume Ideal",
              Label: "Brand",
              Locale: "de_DE",
            },
          },
          Classifications: {
            ProductGroup: {
              DisplayValue: "Heim und Haus",
              Label: "ProductGroup",
              Locale: "de_DE",
            },
          },
          Features: {
            DisplayValues: [
              "-💐ROMANTISCHES WUNDER - Mit unserem Blumenstrauß Rosenwunder bekommst du eine himmlische Komposition voller Romantik und liebevoller Zuneigung. Der prachtvolle Strauß weiß mit seiner Optik und seinem Duft zu überzeugen und zieht alle Blicke auf sich.",
              "-💐TRAUMHAFT SCHÖN - Dieses Arrangement sorgt mit herrlich duftenden roten und pinken Rosen sowie exotischen roten und weißen Inkalilien für Herzklopfen. Jetzt unser Rosenwunder bestellen und mit bis zu 100 Blüten leidenschaftliche Momente kreieren.",
              "-💐LIEBEVOLLES GESCHENK - Als Liebesbeweis oder zum Muttertag kannst du dieses Rosenwunder verschenken und für echte Begeisterung sorgen. Und von erfahrenen Floristen wundervoll hergerichtet, bekommst du dieses romantische Blumengeschenk zum Top Preis.",
              "-💐GENIALE FRISCHE - Die wunderschönen Rosen und Inkalilien kaufen wir direkt beim Gärtner. Jedes Rosenwunder verschicken wir deshalb immer mit unserer genialen 7-Tage-Frischegarantie. So werden die hübschen Blumen lange herrlich lebhaft erstrahlen.",
              "-💐BLUMENVERSAND - Den Blumenstrauß Rosenwunder versenden wir in einem speziellen Versandkarton mit Wasserversorgung durch eine Frischetüte. Top Qualität bequem zum Empfänger an die Haustür. Inklusive Pflegeanleitung und Blumenfrisch für lange Freude.",
            ],
            Label: "Features",
            Locale: "de_DE",
          },
          ManufactureInfo: {
            Model: {
              DisplayValue: "Blume Ideal",
              Label: "Model",
              Locale: "en_US",
            },
          },
          ProductInfo: {
            Color: {
              DisplayValue: "rot, rosa",
              Label: "Color",
              Locale: "de_DE",
            },
            Size: {
              DisplayValue: "ca. 30 cm Ø",
              Label: "Size",
              Locale: "de_DE",
            },
            UnitCount: {
              DisplayValue: 1,
              Label: "NumberOfItems",
              Locale: "en_US",
            },
          },
          Title: {
            DisplayValue:
              "Blumenstrauß Rosenwunder, Rosen und Inkalilien, Rot und Rosa, 7-Tage-Frischegarantie, Qualität vom Floristen, handgebunden, perfekte Geschenkidee bestellen",
            Label: "Title",
            Locale: "de_DE",
          },
        },
        Offers: {
          Listings: [
            {
              Availability: {
                Message: "Auf Lager",
                MinOrderQuantity: 1,
                Type: "Now",
              },
              Condition: { SubCondition: { Value: "New" }, Value: "New" },
              DeliveryInfo: {
                IsAmazonFulfilled: false,
                IsFreeShippingEligible: false,
                IsPrimeEligible: false,
              },
              Id: "AQITlx7xW6ZMR%2BFIHK35%2B94cZgJOCllEp3gQ4CUzWCh2d%2FbrM2Gy0p5PV0RLbNjUUmWFK546sL2J8cANoGNHW1xz2lHQNhtFaC0me19NkoEAJPk%2BDlIgI8udRxDQrMLgZshH0ZWAcXhCVGdktU8XTasK8hCDNy3L96Op84ZybbeWVvLz5o%2BqdzpY5u9UKExG",
              IsBuyBoxWinner: true,
              MerchantInfo: {
                DefaultShippingCountry: "DE",
                FeedbackCount: 519,
                FeedbackRating: 4.14,
                Id: "A3MRSJP2QSGOVU",
                Name: "Blume Ideal",
              },
              Price: {
                Amount: 31.99,
                Currency: "EUR",
                DisplayAmount: "31,99 €",
              },
              ProgramEligibility: {
                IsPrimeExclusive: false,
                IsPrimePantry: false,
              },
              ViolatesMAP: false,
            },
          ],
          Summaries: [
            {
              Condition: { Value: "New" },
              HighestPrice: {
                Amount: 31.99,
                Currency: "EUR",
                DisplayAmount: "31,99 €",
              },
              LowestPrice: {
                Amount: 31.99,
                Currency: "EUR",
                DisplayAmount: "31,99 €",
              },
              OfferCount: 1,
            },
          ],
        },
      },
    ],
    SearchRefinements: {
      SearchIndex: {
        Bins: [
          { DisplayName: "Elektronik & Foto", Id: "Electronics" },
          { DisplayName: "Küche, Haushalt & Wohnen", Id: "HomeAndKitchen" },
          { DisplayName: "Bürobedarf & Schreibwaren", Id: "OfficeProducts" },
          { DisplayName: "Garten", Id: "GardenAndOutdoor" },
          {
            DisplayName: "Gewerbe, Industrie & Wissenschaft",
            Id: "Industrial",
          },
          { DisplayName: "Beauty", Id: "Beauty" },
          { DisplayName: "Spielzeug", Id: "ToysAndGames" },
          { DisplayName: "Sport & Freizeit", Id: "SportsAndOutdoors" },
          { DisplayName: "Beleuchtung", Id: "Lighting" },
          { DisplayName: "Handmade", Id: "Handmade" },
          {
            DisplayName: "Lebensmittel & Getränke",
            Id: "GroceryAndGourmetFood",
          },
          { DisplayName: "Baby", Id: "Baby" },
          { DisplayName: "Drogerie & Körperpflege", Id: "HealthPersonalCare" },
          { DisplayName: "Baumarkt", Id: "ToolsAndHomeImprovement" },
          { DisplayName: "Auto & Motorrad", Id: "Automotive" },
          { DisplayName: "Geschenkgutscheine", Id: "GiftCards" },
          { DisplayName: "Computer & Zubehör", Id: "Computers" },
          { DisplayName: "Sonstiges", Id: "EverythingElse" },
          { DisplayName: "Elektro-Großgeräte", Id: "Appliances" },
          { DisplayName: "Haustier", Id: "PetSupplies" },
        ],
        DisplayName: "Kategorie",
        Id: "SearchIndex",
      },
    },
    SearchURL:
      "https://www.amazon.de/s?k=blumen+muttertag&rh=p_n_availability%3A-1%2Cp_n_condition-type%3ANew&tag=geschenkideeio-21&linkCode=osi",
    TotalResultCount: 306,
  },
};
