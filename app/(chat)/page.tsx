import { nanoid } from "@/lib/utils";
import { Chat } from "@/components/chat";
import { AI } from "@/lib/chat/actions";

export const metadata = {
  //   title: "GeschenkIdee.io",
};

export default async function IndexPage() {
  const id = nanoid();

  return (
    <AI initialAIState={{ chatId: id, interactions: [], messages: [] }}>
      <Chat id={id} />
    </AI>
  );
}
