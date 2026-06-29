'use client'

import { Bookmark } from "lucide-react";
import { useFavoritesStore } from "../stores/favorite.store";

export default function BookmarkButton({ sessionId }: { sessionId: string }) {
    const { toggle, isFavorite } = useFavoritesStore();
    const saved = isFavorite(sessionId);

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(sessionId);
    };

    return (<button
        onClick={handleBookmark}
        aria-label={saved ? 'Remove from agenda' : 'Save to agenda'}
        data-saved={saved}
        className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground data-[saved=true]:text-foreground"
    >
        <Bookmark
            className="h-4 w-4 transition-all"
            fill={saved ? 'currentColor' : 'none'}
        />
    </button>)
}