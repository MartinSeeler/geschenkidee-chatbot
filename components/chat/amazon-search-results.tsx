"use client";

import { SearchItemsResponse, SearchResultItem } from "paapi5-typescript-sdk";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, Percent } from "lucide-react";

interface AmazonSearchResultsProps {
  query: string;
  results: SearchItemsResponse;
}

const getPrice = (item: SearchResultItem) => {
  return item.Offers?.Listings[0].Price?.Amount.toFixed(2);
};

const getSavings = (item: SearchResultItem) => {
  return item.Offers?.Listings[0].Price?.Savings?.Percentage.toFixed(0);
};

export function AmazonSearchResults({
  query,
  results,
}: AmazonSearchResultsProps) {
  return (
    <div className="grid gap-8 mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {results.SearchResult?.Items?.map((item) => {
          const price = getPrice(item);
          const savings = getSavings(item);
          return (
            <Button
              key={`${item.ASIN}-preview-grid-${query}`}
              theme="neutral"
              size="none"
              asChild
            >
              <Link
                href={item.DetailPageURL}
                target="_blank"
                className="relative"
              >
                <div className="flex flex-col gap-1 h-full overflow-hidden">
                  <div className="w-full max-w-full flex flex-col border-b-2 border-black overflow-hidden rounded-none rounded-t-lg aspect-square">
                    <img
                      src={item.Images?.Primary?.Large?.URL}
                      alt={item.ItemInfo?.Title?.DisplayValue}
                      className="object-cover object-center aspect-square w-full max-w-full"
                    />
                  </div>
                  <div className="flex-1 flex-grow px-2 pb-1 flex flex-col text-wrap text-sm overflow-hidden line-clamp-2">
                    <p className="font-space font-heading line-clamp-2">
                      von {item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue}
                    </p>
                    <p className="font-normal text-xs">{price}€</p>
                  </div>
                </div>
                {savings && (
                  <div className="absolute flex items-center gap-0.5 top-0 right-0 -mt-3 -mr-3 rounded-xl bg-mainAccent py-0.5 px-1.5 border-2 border-black">
                    <span className="text-xs font-bold text-white">
                      -{savings}
                    </span>
                    <Percent size={10} absoluteStrokeWidth color="white" />
                  </div>
                )}
              </Link>
            </Button>
          );
        })}
      </div>
      {results.SearchResult?.TotalResultCount >
        results.SearchResult?.Items?.length && (
        <div className="flex content-center">
          <Button theme="purple" asChild>
            <Link
              href={results.SearchResult?.SearchURL}
              target="_blank"
              className="flex gap-2 w-full font-heading"
            >
              Noch mehr Produkte anzeigen
              <ExternalLink size={16} absoluteStrokeWidth />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
