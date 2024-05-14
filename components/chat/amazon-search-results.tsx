"use client";

import { SearchItemsResponse } from "paapi5-typescript-sdk";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface AmazonSearchResultsProps {
  query: string;
  results: SearchItemsResponse;
}

export function AmazonSearchResults({
  query,
  results,
}: AmazonSearchResultsProps) {
  return (
    <div className="grid gap-2 rounded-2xl border border-zinc-200 bg-white p-2 mb-8">
      <div className="grid gap-2 sm:flex sm:flex-row justify-between border-b p-2">
        <div>
          <div className="text-xs text-zinc-600">Vorschau für</div>
          <div className="font-medium capitalize">{query}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {results.SearchResult?.Items?.map((item) => (
          <Tooltip key={`${item.ASIN}-preview-grid-${query}`}>
            <TooltipTrigger asChild>
              <Link
                className="flex cursor-pointer flex-row items-start sm:items-center gap-2 rounded-xl hover:bg-zinc-50"
                href={item.DetailPageURL}
                target="_blank"
              >
                <div className="relative">
                  <div className="relative w-full overflow-hidden rounded-lg aspect-square">
                    <img
                      src={item.Images?.Primary?.Large?.URL}
                      alt={item.ItemInfo?.Title?.DisplayValue}
                      className="object-cover object-center aspect-square w-full"
                    />
                  </div>
                  <div className="absolute inset-x-0 top-0 flex w-full aspect-square items-end justify-end overflow-hidden rounded-lg pr-1">
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent"
                    />
                    <p className="relative text-lg sm:text-base font-semibold text-white flex items-baseline gap-1">
                      {item.Offers?.Listings[0].SavingBasis && (
                        <span className="line-through text-xs opacity-75">
                          {item.Offers?.Listings[0].SavingBasis?.Amount.toFixed(
                            2
                          )}
                          €
                        </span>
                      )}
                      <span>
                        {item.Offers?.Listings[0].Price?.Amount.toFixed(2)}€
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex max-w-sm">
                {item.ItemInfo?.Title?.DisplayValue}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="flex content-center">
        <Button variant="link" size="sm" asChild>
          <Link
            href={results.SearchResult?.SearchURL}
            target="_blank"
            className="flex gap-2 w-full"
          >
            Alle {results.SearchResult?.TotalResultCount} Ergebnisse anzeigen
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
