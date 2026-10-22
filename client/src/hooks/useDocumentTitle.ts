import { useEffect, useRef } from "react";

export function useDocumentTitle(title: string, restoreOnUnmount: boolean = false): void {
  const previousTitleRef = useRef<string>(document.title);

  useEffect(() => {
    const previousTitle = previousTitleRef.current;
    document.title = title;

    return () => {
      if (restoreOnUnmount) {
        document.title = previousTitle;
      }
    };
  }, [title, restoreOnUnmount]);
}
