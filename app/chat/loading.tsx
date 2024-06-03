import { EmptyScreen } from "@/components/empty-screen";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <div className={"pb-[200px] pt-4 md:pt-10"}>
        <div className="mx-auto max-w-2xl px-4 flex flex-col gap-4">
          <EmptyScreen />
        </div>
      </div>
    </div>
  );
}
