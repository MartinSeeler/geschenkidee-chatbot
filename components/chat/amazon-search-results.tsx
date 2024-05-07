"use client";

import { SearchItemsResponse } from "paapi5-typescript-sdk";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";

interface AmazonSearchResultsProps {
  query: string;
  results: SearchItemsResponse;
}

export function AmazonSearchResults({
  query,
  results,
}: AmazonSearchResultsProps) {
  return (
    <div className="grid gap-2 rounded-2xl border border-zinc-200 bg-white p-2 sm:p-2 mb-6">
      <div className="grid gap-2 sm:flex sm:flex-row justify-between border-b p-2">
        <div>
          <div className="text-xs text-zinc-600">Vorschau für</div>
          <div className="font-medium capitalize">{query}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
        {results.SearchResult?.Items?.map((item) => (
          <Link
            key={`${item.ASIN}-preview-grid-${query}`}
            className="flex cursor-pointer flex-row items-start sm:items-center gap-2 rounded-xl p-2 hover:bg-zinc-50"
            href={item.DetailPageURL}
            target="_blank"
          >
            <div className="grid gap-4 sm:grid-cols-6 items-start sm:gap-6 flex-1">
              <div className="w-full sm:w-18 justify-center aspect-square rounded-lg bg-zinc-50 overflow-hidden">
                <img
                  src={item.Images?.Primary?.Large?.URL}
                  className="object-cover aspect-square"
                  alt={item.ItemInfo?.Title?.DisplayValue}
                />
              </div>
              <div className="col-span-2 sm:col-span-4">
                <div className="font-medium text-sm text-pretty line-clamp-2">
                  {item.ItemInfo?.Title?.DisplayValue}
                </div>
                <div className="text-sm text-zinc-600 pt-1">
                  {item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="sm:text-right font-semibold">
                  {item.Offers?.Listings[0].Price?.Amount.toFixed(2)}€
                </div>
                <div className="sm:text-right text-xs">
                  {item.Offers?.Listings[0].Price?.Savings?.Amount ? (
                    <>
                      <div className="text-muted-foreground line-through">
                        {(
                          item.Offers?.Listings[0].Price?.Amount +
                          item.Offers?.Listings[0].Price?.Savings.Amount
                        ).toFixed(2)}{" "}
                        €
                      </div>
                      <div className="text-red-500">
                        {item.Offers?.Listings[0].Price?.Savings.Percentage}%
                        sparen
                      </div>
                    </>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="grid gap-2 sm:flex sm:flex-row content-center pt-2">
        <Button variant="ghost" size="default" asChild>
          <Link
            href={results.SearchResult?.SearchURL}
            target="_blank"
            className="flex gap-2 w-full"
          >
            Alle {results.SearchResult?.TotalResultCount} Ergebnisse anzeigen
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
