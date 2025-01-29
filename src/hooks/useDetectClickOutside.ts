import { RefObject, useEffect } from "react";

/**
 * Hook that detects clicks outside of a component. You need to provide a ref and put it in the component
 * @param ref
 * @param onClick
 */
export const useDetectClickOutside = (
    ref: RefObject<HTMLElement>,
    onClick: () => void
) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClick();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, onClick]);
};
