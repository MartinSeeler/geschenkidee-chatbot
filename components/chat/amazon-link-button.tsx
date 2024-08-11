import { FC } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";

interface AmazonLinkButtonProps {
  query: string;
}

const AmazonLinkButton: FC<AmazonLinkButtonProps> = ({ query }) => {
  return (
    <div className="flex flex-col items-start md:items-center gap-2 mb-8">
      <Button asChild theme={"yellow"} className="">
        <Link
          href={`https://www.amazon.de/s?k=${query}&tag=geschenkideeio-21`}
          target="_blank"
          className="flex gap-1 w-full items-center justify-between"
        >
          <div className="flex flex-col">
            <div className="font-heading font-space text-lg">{query}</div>
            auf Amazon ansehen
          </div>
          <ShoppingCartIcon size={36} />
        </Link>
      </Button>
      <small className="text-xs opacity-50">
        * als Amazon-Partner verdienen wir an qualifizierten Verkäufen
      </small>
    </div>
  );
};
export default AmazonLinkButton;
