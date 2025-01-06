import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDetectClickOutside } from "../../../hooks/useDetectClickOutside";
import { selectIsTileSet, selectSolveTile } from "../../../redux/selectors";
import { TileState } from "../../../redux/solve/SolveTile";
import { removeValue, updateValue } from "../../../redux/solve/solveSlice";

// Tile for the solve page
// When the tile is set, it cannot be clicked on
// When the tile is not set, the user can click on it to access a text box, letting them change its value
// When the user clicks outside of the tile or enters a number, save that number and apply effects
export const SolveTile = ({ row, column }: { row: number; column: number }) => {
    const solveData = useSelector(selectSolveTile(row, column));
    const value = solveData.value;
    const isSet = useSelector(selectIsTileSet(row, column));

    const dispatch = useDispatch();

    // Is the tile currently active?
    const [active, setActive] = useState(false);

    // Set up ref + hook to detect clicks outside
    // When the user clicks outside, it should save whatever they typed
    const ref = useRef(null);

    useDetectClickOutside(ref, () => {
        if (active) {
            setActive(false);
        }
    });

    // When clicked, set it to active if it is not already
    const onClicked = () => {
        if (!isSet) {
            setActive(true);
        }
    };

    // When a key is pressed, if it is active and the key is a valid number, set the value to that. If it is delete, then get rid of the value.
    useEffect(() => {
        const onKeyPressed = (event: KeyboardEvent) => {
            if (active) {
                const key = event.key;

                if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(key)) {
                    // Set the tile to this value
                    dispatch(
                        updateValue({
                            row,
                            column,
                            value: parseInt(key)
                        })
                    );

                    // Set this tile to inactive
                    setActive(false);
                } else if (key === "Backspace") {
                    // Remove the value of this tile
                    dispatch(
                        removeValue({
                            row,
                            column
                        })
                    );

                    // Set this tile to inactive
                    setActive(false);
                }
            }
        };

        document.addEventListener("keydown", onKeyPressed);

        return () => document.removeEventListener("keydown", onKeyPressed);
    }, [dispatch, active, row, column]);

    // Resolves the value of the effect
    // const resolveValue = () => {
    //     if (inputValue.length === 1 && "123456789".includes(inputValue)) {
    //         // Value was a success, so update that part of the grid
    //         dispatch(
    //             updateValue({
    //                 row,
    //                 column,
    //                 value: parseInt(inputValue)
    //             })
    //         );
    //     }

    //     setInputValue("");
    // };

    return (
        <div
            ref={ref}
            className={classNames(
                "solve-tile",
                "flex-center",
                !isSet && "solve-tile-unset",
                active && "solve-tile-active"
            )}
            onClick={onClicked}
        >
            {active ? (
                <input
                    autoFocus
                    className="solve-tile-input"
                    placeholder={value === 0 ? "" : value.toString()}
                />
            ) : solveData.state === TileState.EMPTY ? (
                ""
            ) : (
                solveData.value
            )}
        </div>
    );
};
