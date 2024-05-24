import { nanoid } from "@/lib/utils";
import { Chat } from "@/components/chat";
import { AI } from "@/lib/chat/actions";

export const dynamic = "force-dynamic";

// export const metadata = {
//   //   title: "GeschenkIdee.io",
// };

export default async function IndexPage() {
  const id = nanoid();

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} />
    </AI>
  );
}
