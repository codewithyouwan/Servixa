// Dummy data for the provider chats page. Replace with API data later.

export type Conversation = {
  id: string;
  name: string;
  project: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
};

export const conversations: Conversation[] = [
  { id: "c1", name: "Sarah Mitchell", project: "Kitchen Remodel", lastMessage: "Perfect, see you Thursday at 1:30!", time: "9:41 AM", unread: 2, online: true },
  { id: "c2", name: "Tom Nguyen", project: "Deck Build", lastMessage: "Do you have a cedar sample photo?", time: "8:17 AM", unread: 1, online: true },
  { id: "c3", name: "James Okafor", project: "Roof Replacement", lastMessage: "The shingles arrived this morning.", time: "Yesterday", unread: 0, online: false },
  { id: "c4", name: "Elena Vasquez", project: "Bathroom Remodel", lastMessage: "Thank you again — it looks amazing!", time: "Yesterday", unread: 0, online: false },
  { id: "c5", name: "Dan Kowalski", project: "Fence Install", lastMessage: "Any update on the HOA approval?", time: "Tue", unread: 0, online: false },
  { id: "c6", name: "Priya Raman", project: "Garage Conversion", lastMessage: "The v3 floorplan works for us.", time: "Mon", unread: 0, online: true },
];

export type Message = {
  id: string;
  conversationId: string;
  from: "them" | "me";
  text: string;
  time: string;
};

export const messages: Message[] = [
  { id: "m1", conversationId: "c1", from: "them", text: "Hi! Just checking — are we still on for the final walkthrough this week?", time: "9:02 AM" },
  { id: "m2", conversationId: "c1", from: "me", text: "Yes! Thursday at 1:30 PM. We'll go through the punch list together and I'll have the crew fix anything on the spot.", time: "9:15 AM" },
  { id: "m3", conversationId: "c1", from: "them", text: "Great. One thing I noticed — the pantry door doesn't fully soft-close.", time: "9:28 AM" },
  { id: "m4", conversationId: "c1", from: "me", text: "Already on the list 👍 It's a 5-minute hinge adjustment.", time: "9:33 AM" },
  { id: "m5", conversationId: "c1", from: "them", text: "Perfect, see you Thursday at 1:30!", time: "9:41 AM" },
  { id: "m6", conversationId: "c2", from: "them", text: "Morning! We're leaning toward cedar for the decking.", time: "7:58 AM" },
  { id: "m7", conversationId: "c2", from: "me", text: "Good choice — it weathers beautifully here. I can bring samples to the site visit tomorrow.", time: "8:05 AM" },
  { id: "m8", conversationId: "c2", from: "them", text: "Do you have a cedar sample photo?", time: "8:17 AM" },
  { id: "m9", conversationId: "c3", from: "me", text: "Delivery is scheduled for Wednesday 8 AM — someone from the crew will meet the truck.", time: "Mon" },
  { id: "m10", conversationId: "c3", from: "them", text: "The shingles arrived this morning.", time: "Yesterday" },
  { id: "m11", conversationId: "c4", from: "them", text: "Thank you again — it looks amazing!", time: "Yesterday" },
  { id: "m12", conversationId: "c4", from: "me", text: "It was a pleasure working with you! Don't hesitate to reach out if anything needs attention.", time: "Yesterday" },
  { id: "m13", conversationId: "c5", from: "them", text: "Any update on the HOA approval?", time: "Tue" },
  { id: "m14", conversationId: "c6", from: "them", text: "The v3 floorplan works for us.", time: "Mon" },
];
