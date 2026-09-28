import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "notice-stack",
  title: "Notice Stack",
  description:
    "A zero-dependency toast system: drop one `NoticeStack` in the layout and call `notice()` from anywhere, no provider needed. Notices stack like cards, the older ones tucked behind the newest, and fan out on hover or focus; they slide in and out on a soft overshoot, swipe away with a flick (the card resists when pulled toward the screen), pause their countdown while you read them or while the tab is hidden, and carry an optional action such as Undo. `notice.promise()` shows one notice that reads loading and turns into success or error in place. Six positions, success, error, warning, info and loading variants, polite or assertive announcements by variant, and F8 or Alt+T to jump into the stack.",
  category: "Notice",
  usage: `import { NoticeStack, notice } from "@/components/beste/component/notice-stack";

// Once, in the root layout
<NoticeStack closeButton />

// Anywhere after that
notice("Setlist saved");
notice.success("Tickets sent", { description: "Check hello@beste.co for the receipt." });
notice.error("Payment declined", { duration: 8000 });

notice("Track removed", {
  action: { label: "Undo", onClick: () => console.log("Restore the track") },
});

notice.promise(uploadMix(), {
  loading: "Uploading the mix",
  success: (file) => ({ title: "Mix uploaded", description: file.name }),
  error: "Upload failed",
});

const id = notice.loading("Syncing");
notice.success("Synced", { id });   // same id: updates in place
notice.dismiss();                   // clears every notice`,
};
