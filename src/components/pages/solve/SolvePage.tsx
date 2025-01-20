import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    selectErrorCount,
    selectImportError,
    selectMakeHints,
    selectSudokuSolved
} from "../../../redux/selectors";
import {
    setGridFromFormat,
    setMakeHints,
    setSudokuSolved
} from "../../../redux/solve/solveSlice";
import { BOX_SIZE, range } from "../../../utils";
import "./SolvePage.css";
import { SolveTileComponent } from "./SolveTileComponent";

/**
 * Component for the Solve Sudoku page
 * @returns
 */
const SolvePage = () => {
    const dispatch = useDispatch();

    const importError = useSelector(selectImportError);

    const canMakeHints = useSelector(selectMakeHints);

    const sudokuSolved = useSelector(selectSudokuSolved);

    const errorCount = useSelector(selectErrorCount);

    const onImportClicked = () => {
        const filePicker = document.createElement("input");
        filePicker.type = "file";
        filePicker.accept = ".txt";

        filePicker.onchange = () => {
            // Read the chosen file
            filePicker.files![0].arrayBuffer().then(async (arrayBuffer) => {
                const fileText = new TextDecoder().decode(arrayBuffer);

                dispatch(setGridFromFormat(fileText));
            });
        };

        filePicker.click();
    };

    // Set up effect for detecting shift
    useEffect(() => {
        const onListener = (event: KeyboardEvent) => {
            if (event.key === "Shift") {
                dispatch(setMakeHints(true));
            }
        };

        const offListener = (event: KeyboardEvent) => {
            if (event.key === "Shift") {
                dispatch(setMakeHints(false));
            }
        };

        document.addEventListener("keydown", onListener);
        document.addEventListener("keyup", offListener);

        return () => {
            document.removeEventListener("keydown", onListener);
            document.removeEventListener("keyup", offListener);
        };
    });

    // Alert the user when the sudoku is solved
    useEffect(() => {
        if (sudokuSolved) {
            alert("Congrats on solving the sudoku!");

            setSudokuSolved(false);
        }
    }, [sudokuSolved, dispatch]);

    // The 9x9 grid is basically a 3x3 grid of 3x3 boxes
    return (
        <div id="solve-page" data-testid="solve-page" className="flex-center-column">
            <div className="import-sudoku-row">
                <div id="import-sudoku-container" className="flex-center">
                    <button id="import-sudoku" type="button" onClick={onImportClicked}>
                        Import Sudoku
                    </button>
                </div>

                <div id="import-sudoku-error-text">
                    {importError ? "Error importing the sudoku!" : ""}
                </div>
            </div>

            <div id="solve-grid">
                {range(0, BOX_SIZE - 1).map((boxRow) => (
                    <div className="grid-row" key={boxRow}>
                        {range(0, BOX_SIZE - 1).map((boxColumn) => (
                            <div className="grid-box" key={boxColumn}>
                                {range(0, BOX_SIZE - 1).map((row) => (
                                    <div className="box-row" key={row}>
                                        {range(0, BOX_SIZE - 1).map((column) => (
                                            <SolveTileComponent
                                                key={column}
                                                row={boxRow * BOX_SIZE + row}
                                                column={boxColumn * BOX_SIZE + column}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div id="solve-hint-text">
                Hold Shift to create hints {canMakeHints ? "(ON)" : "(OFF)"}
            </div>

            <div id="solve-errors-count">Total Errors: {errorCount}</div>
        </div>
    );
};

export default SolvePage;
