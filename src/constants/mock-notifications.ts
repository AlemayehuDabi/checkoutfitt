import type { AppNotification } from "@/types";

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    title: "Today's outfit is ready",
    body: "We picked a look based on this morning's weather.",
    time: "9:02 AM",
    unread: true,
    icon: "sun",
  },
  {
    id: "n2",
    title: "New outfit idea",
    body: "Your AI stylist put together a Date Night look worth saving.",
    time: "Yesterday",
    unread: true,
    icon: "sparkles",
  },
  {
    id: "n3",
    title: "Item added to closet",
    body: "\"Denim Jacket\" was added to your digital closet.",
    time: "2 days ago",
    unread: false,
    icon: "heart",
  },
  {
    id: "n4",
    title: "CheckoutFitt Pro",
    body: "Unlock unlimited AI styling and a capsule wardrobe builder.",
    time: "4 days ago",
    unread: false,
    icon: "crown",
  },
  {
    id: "n5",
    title: "Welcome to CheckoutFitt",
    body: "Your digital closet and AI stylist are ready to go.",
    time: "1 week ago",
    unread: false,
    icon: "bell",
  },
];
