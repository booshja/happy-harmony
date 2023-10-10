import { ACTIVITY_TIMES } from "../src/helpers/constants";
import type { Activity } from "../src/types/activities";

export const categories = [
    "Music",
    "Learning/Books",
    "Plants",
    "Dogs",
    "Friends",
    "Sports",
    "Coding",
    "Cleaning/Personal Grooming",
    "Misc.",
] as const;

export type Category = (typeof categories)[number];

const musicActivities: Activity<Category>[] = [
    {
        name: "Listen to a song",
        time: ACTIVITY_TIMES[5],
        category: "Music",
    },
    {
        name: "Listen to an album",
        time: ACTIVITY_TIMES[30],
        category: "Music",
    },
    {
        name: "Listen to a playlist",
        time: ACTIVITY_TIMES[60],
        category: "Music",
    },
    {
        name: "Listen to a record",
        time: ACTIVITY_TIMES[10],
        category: "Music",
    },
    {
        name: "Go to a headliner of a concert",
        time: ACTIVITY_TIMES[60],
        category: "Music",
    },
    {
        name: "Go to a concert",
        time: ACTIVITY_TIMES[3],
        category: "Music",
    },
    {
        name: "Go to a random concert",
        time: ACTIVITY_TIMES[60],
        category: "Music",
    },
    {
        name: "Listen to a new song",
        time: ACTIVITY_TIMES[0],
        category: "Music",
    },
    {
        name: "Listen to a new album",
        time: ACTIVITY_TIMES[30],
        category: "Music",
    },
    {
        name: "Listen to a new playlist",
        time: ACTIVITY_TIMES[60],
        category: "Music",
    },
    {
        name: "Look up new music",
        time: ACTIVITY_TIMES[10],
        category: "Music",
    },
    {
        name: "Look for new records",
        time: ACTIVITY_TIMES[10],
        category: "Music",
    },
];

const learningBooksActivities: Activity<Category>[] = [
    {
        name: "Read a book",
        time: ACTIVITY_TIMES[5],
        category: "Learning/Books",
    },
    {
        name: "Listen to an audiobook",
        time: ACTIVITY_TIMES[5],
        category: "Learning/Books",
    },
    {
        name: "Look up new books",
        time: ACTIVITY_TIMES[5],
        category: "Learning/Books",
    },
    {
        name: "Ask for book recommendations",
        time: ACTIVITY_TIMES[5],
        category: "Learning/Books",
    },
    {
        name: "Listen to a podcast",
        time: ACTIVITY_TIMES[5],
        category: "Learning/Books",
    },
    {
        name: "Look up new podcasts",
        time: ACTIVITY_TIMES[5],
        category: "Learning/Books",
    },
    {
        name: "Ask for podcast recommendations",
        time: ACTIVITY_TIMES[5],
        category: "Learning/Books",
    },
    {
        name: "Do logic puzzles",
        time: ACTIVITY_TIMES[5],
        category: "Learning/Books",
    },
    {
        name: "Learn about new puzzles",
        time: ACTIVITY_TIMES[10],
        category: "Learning/Books",
    },
    {
        name: "Look up new puzzle books",
        time: ACTIVITY_TIMES[5],
        category: "Learning/Books",
    },
];

const plantsActivities: Activity<Category>[] = [
    {
        name: "Look at bonsai trees",
        time: ACTIVITY_TIMES[5],
        category: "Plants",
    },
    {
        name: "Prune a bonsai tree",
        time: ACTIVITY_TIMES[10],
        category: "Plants",
    },
    {
        name: "Learn about bonsais",
        time: ACTIVITY_TIMES[5],
        category: "Plants",
    },
    {
        name: "Look at plants",
        time: ACTIVITY_TIMES[5],
        category: "Plants",
    },
    {
        name: "Water/take care of plants",
        time: ACTIVITY_TIMES[10],
        category: "Plants",
    },
    {
        name: "Learn about types of plants I have",
        time: ACTIVITY_TIMES[5],
        category: "Plants",
    },
    {
        name: "Wander a plant shop",
        time: ACTIVITY_TIMES[30],
        category: "Plants",
    },
    {
        name: "Go buy a new plant",
        time: ACTIVITY_TIMES[30],
        category: "Plants",
    },
    {
        name: "Go ask for advice about my plants at plant shop",
        time: ACTIVITY_TIMES[30],
        category: "Plants",
    },
    {
        name: "Find new plant shops",
        time: ACTIVITY_TIMES[5],
        category: "Plants",
    },
];

const dogsActivities: Activity<Category>[] = [
    {
        name: "Cuddle with dogs",
        time: ACTIVITY_TIMES[5],
        category: "Dogs",
    },
    {
        name: "Training session with dogs",
        time: ACTIVITY_TIMES[10],
        category: "Dogs",
    },
    {
        name: "Go for a walk with dogs",
        time: ACTIVITY_TIMES[10],
        category: "Dogs",
    },
    {
        name: "Brush Krew",
        time: ACTIVITY_TIMES[10],
        category: "Dogs",
    },
    {
        name: "Groom Ralph (minimal)",
        time: ACTIVITY_TIMES[10],
        category: "Dogs",
    },
    {
        name: "Groom Ralph (full)",
        time: ACTIVITY_TIMES[3],
        category: "Dogs",
    },
    {
        name: "Learn more about my dogs' breeds",
        time: ACTIVITY_TIMES[5],
        category: "Dogs",
    },
    {
        name: "Learn more about dog training",
        time: ACTIVITY_TIMES[5],
        category: "Dogs",
    },
    {
        name: "Play with the dogs",
        time: ACTIVITY_TIMES[5],
        category: "Dogs",
    },
];

const friendsActivities: Activity<Category>[] = [
    {
        name: "Go get a beer with a friend",
        time: ACTIVITY_TIMES[30],
        category: "Friends",
    },
    {
        name: "Go get food with a friend",
        time: ACTIVITY_TIMES[30],
        category: "Friends",
    },
    {
        name: "Go do an activity with a friend",
        time: ACTIVITY_TIMES[30],
        category: "Friends",
    },
    {
        name: "Go to Flatstick with a friend",
        time: ACTIVITY_TIMES[60],
        category: "Friends",
    },
];

const sportsActivities: Activity<Category>[] = [
    {
        name: "Watch videos about hockey",
        time: ACTIVITY_TIMES[5],
        category: "Sports",
    },
    {
        name: "Read articles/news about hockey",
        time: ACTIVITY_TIMES[5],
        category: "Sports",
    },
    {
        name: "Watch highlights of a hockey game",
        time: ACTIVITY_TIMES[5],
        category: "Sports",
    },
    {
        name: "Watch a full hockey game",
        time: ACTIVITY_TIMES[3],
        category: "Sports",
    },
    {
        name: "Go to a Pro hockey game",
        time: ACTIVITY_TIMES[3],
        category: "Sports",
    },
    {
        name: "Do stickhandling drills",
        time: ACTIVITY_TIMES[10],
        category: "Sports",
    },
    {
        name: "Tape hockey stick(s)",
        time: ACTIVITY_TIMES[10],
        category: "Sports",
    },
    {
        name: "Go to a stick and puck",
        time: ACTIVITY_TIMES[60],
        category: "Sports",
    },
    {
        name: "Play a hockey game",
        time: ACTIVITY_TIMES[60],
        category: "Sports",
    },
    {
        name: "Play roller hockey",
        time: ACTIVITY_TIMES[30],
        category: "Sports",
    },
    {
        name: "Go to a Mariners game",
        time: ACTIVITY_TIMES[3],
        category: "Sports",
    },
    {
        name: "Go to a football game (Seahawks, UW, etc.)",
        time: ACTIVITY_TIMES[3],
        category: "Sports",
    },
    {
        name: "Go to a Huskies basketball game",
        time: ACTIVITY_TIMES[3],
        category: "Sports",
    },
    {
        name: "Watch a Mariners game on TV",
        time: ACTIVITY_TIMES[60],
        category: "Sports",
    },
];

const codingActivities: Activity<Category>[] = [
    {
        name: "Work on a coding project",
        time: ACTIVITY_TIMES[30],
        category: "Coding",
    },
    {
        name: "Watch a coding video",
        time: ACTIVITY_TIMES[5],
        category: "Coding",
    },
    {
        name: "Read a coding book",
        time: ACTIVITY_TIMES[5],
        category: "Coding",
    },
];

const cleaningGroomingActivities: Activity<Category>[] = [
    {
        name: "Take a shower",
        time: ACTIVITY_TIMES[10],
        category: "Cleaning/Personal Grooming",
    },
    {
        name: "Take a bath",
        time: ACTIVITY_TIMES[30],
        category: "Cleaning/Personal Grooming",
    },
    {
        name: "Shave head",
        time: ACTIVITY_TIMES[10],
        category: "Cleaning/Personal Grooming",
    },
    {
        name: "Vacuum",
        time: ACTIVITY_TIMES[10],
        category: "Cleaning/Personal Grooming",
    },
    {
        name: "Clean/Tidy a room",
        time: ACTIVITY_TIMES[10],
        category: "Cleaning/Personal Grooming",
    },
    {
        name: "Paint nails",
        time: ACTIVITY_TIMES[60],
        category: "Cleaning/Personal Grooming",
    },
];

const miscActivities: Activity<Category>[] = [
    {
        name: "Go do something touristy in the city",
        time: ACTIVITY_TIMES[60],
        category: "Misc.",
    },
    {
        name: "Go for a walk",
        time: ACTIVITY_TIMES[10],
        category: "Misc.",
    },
    {
        name: "Go to a park",
        time: ACTIVITY_TIMES[10],
        category: "Misc.",
    },
    {
        name: "Go find a view",
        time: ACTIVITY_TIMES[10],
        category: "Misc.",
    },
    {
        name: "Make a nice meal",
        time: ACTIVITY_TIMES[30],
        category: "Misc.",
    },
];

export const activities: Activity<Category>[] = [
    ...musicActivities,
    ...learningBooksActivities,
    ...plantsActivities,
    ...dogsActivities,
    ...friendsActivities,
    ...sportsActivities,
    ...codingActivities,
    ...cleaningGroomingActivities,
    ...miscActivities,
];
