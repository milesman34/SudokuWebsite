import reducer, {
    createInitialState,
    removeValue,
    setGridAt,
    setGridFromFormat,
    updateValue
} from "./solveSlice";
import { SolveTile, TileState } from "./SolveTile";

describe("solveSlice", () => {
    test("updateValue", () => {
        let state = createInitialState();

        state = reducer(
            state,
            updateValue({
                row: 2,
                column: 4,
                value: 6
            })
        );

        expect(state.grid[2][4].value).toBe(6);
        expect(state.grid[2][4].state).toBe(TileState.FILLED);
    });

    test("updateValue updates hints", () => {
        let state = createInitialState();

        state = reducer(
            state,
            setGridAt({
                row: 2,
                column: 2,
                tile: SolveTile({
                    hints: [true, true, true, false, false, false, false, true, true]
                })
            })
        );

        // Start with the same row
        state = reducer(
            state,
            updateValue({
                row: 2,
                column: 5,
                value: 3
            })
        );

        expect(state.grid[2][2].hints).toEqual([
            true,
            true,
            false,
            false,
            false,
            false,
            false,
            true,
            true
        ]);

        // Now do the same column
        state = reducer(
            state,
            updateValue({
                row: 6,
                column: 2,
                value: 8
            })
        );

        expect(state.grid[2][2].hints).toEqual([
            true,
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            true
        ]);

        // Now do the same box
        state = reducer(
            state,
            updateValue({
                row: 1,
                column: 1,
                value: 2
            })
        );

        expect(state.grid[2][2].hints).toEqual([
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            true
        ]);
    });

    test("removeValue", () => {
        let state = createInitialState();

        state = reducer(
            state,
            updateValue({
                row: 3,
                column: 1,
                value: 5
            })
        );

        state = reducer(
            state,
            removeValue({
                row: 3,
                column: 1
            })
        );

        expect(state.grid[3][1].value).toBe(0);
        expect(state.grid[3][1].state).toBe(TileState.EMPTY);
    });

    describe("setGridFromFormat", () => {
        test("Error, wrong number of rows", () => {
            let state = createInitialState();

            state = reducer(state, setGridFromFormat("1,2,3\n4,5,6"));

            expect(state.importError).toBeTruthy();
        });

        test("Error, wrong number of columns", () => {
            let state = createInitialState();

            state = reducer(
                state,
                setGridFromFormat(
                    "1,2,3\n4,5,6\n7,8,9\n2,3,4\n5,6,7\n8,9,1\n2,3,4\n5,6,7\n8,9,1"
                )
            );

            expect(state.importError).toBeTruthy();
        });

        test("Error, parsing error", () => {
            let state = createInitialState();

            state = reducer(
                state,
                setGridFromFormat(
                    "1,2,3,a,5,6,7,8,9\n2,3,4,5,6,7,8,9,1\n3,4,5,6,7,8,9,1,2\n4,5,6,7,8,9,1,2,3\n5,6,7,8,9,1,2,3,4\n6,7,8,9,1,2,3,4,5\n7,8,9,1,2,3,4,5,6\n8,9,1,2,3,4,5,6,7\n9,1,2,3,4,5,6,7,8"
                )
            );

            expect(state.importError).toBeTruthy();
        });

        test("Error, number too low", () => {
            let state = createInitialState();

            state = reducer(
                state,
                setGridFromFormat(
                    "1,2,3,4,-1,6,7,8,9\n2,3,4,5,6,7,8,9,1\n3,4,5,6,7,8,9,1,2\n4,5,6,7,8,9,1,2,3\n5,6,7,8,9,1,2,3,4\n6,7,8,9,1,2,3,4,5\n7,8,9,1,2,3,4,5,6\n8,9,1,2,3,4,5,6,7\n9,1,2,3,4,5,6,7,8"
                )
            );

            expect(state.importError).toBeTruthy();
        });

        test("Error, number too high", () => {
            let state = createInitialState();

            state = reducer(
                state,
                setGridFromFormat(
                    "1,2,3,4,5,6,7,8,9\n2,3,4,5,10,7,8,9,1\n3,4,5,6,7,8,9,1,2\n4,5,6,7,8,9,1,2,3\n5,6,7,8,9,1,2,3,4\n6,7,8,9,1,2,3,4,5\n7,8,9,1,2,3,4,5,6\n8,9,1,2,3,4,5,6,7\n9,1,2,3,4,5,6,7,8"
                )
            );

            expect(state.importError).toBeTruthy();
        });

        test("Failure due to error", () => {
            let state = createInitialState();

            state = reducer(
                state,
                setGridFromFormat(
                    "1,2,3,4,5,6,7,8,9\n2,3,4,5,0,0,0,9,1\n3,4,5,6,7,8,9,1,2\n4,5,6,7,8,9,1,2,3\n5,6,7,8,9,1,2,3,4\n6,7,8,9,1,2,3,4,5\n7,8,9,1,2,3,4,5,6\n8,9,1,2,3,4,5,6,7\n9,1,2,3,4,5,6,7,8"
                )
            );

            expect(state.importError).toBeTruthy();
            expect(state.grid.map((row) => row.map((col) => col.value))).toEqual([
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]);
        });

        test("Success", () => {
            let state = createInitialState();

            state = reducer(
                state,
                setGridFromFormat(
                    "1,0,0,0,0,0,0,0,0\n2,3,4,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,9\n5,6,7,8,0,0,0,0,0\n0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0"
                )
            );

            expect(state.importError).toBeFalsy();
            expect(state.grid.map((row) => row.map((col) => col.value))).toEqual([
                [1, 0, 0, 0, 0, 0, 0, 0, 0],
                [2, 3, 4, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 9],
                [5, 6, 7, 8, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]);
        });
    });
});
