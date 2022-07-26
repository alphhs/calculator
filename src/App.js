import { useReducer, useState, useEffect } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import { AiOutlineClose } from "react-icons/ai";
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const cur = parseFloat(currentOperand);
  if (isNaN(prev) && isNaN(cur)) return "";
  let computation = "";
  switch (operation) {
    default:
      return null;
    case "+":
      computation = prev + cur;
      break;
    case "-":
      computation = prev - cur;
      break;
    case "*":
      computation = prev * cur;
      break;
    case "÷":
      computation = prev / cur;
      break;
  }
  return computation.toString();
}
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}
function App() {
  const remover = () => {
    const newlist = historyList.slice(1);
    setHistoryList((prev) => newlist);
  };
  const deleter = (index) => {
    const newlist = historyList.filter(
      (item) => historyList.indexOf(item) !== index
    );
    setHistoryList((prev) => newlist);
  };

  function reducer(state, { type, payload }) {
    // eslint-disable-next-line default-case
    switch (type) {
      case ACTIONS.ADD_DIGIT:
        if (state.overwrite)
          return {
            ...state,
            currentOperand: payload.digit,
            overwrite: false,
          };
        if (payload.digit === "0" && state.currentOperand === "0") return state;
        if (payload.digit === "." && state.currentOperand.includes("."))
          return state;
        return {
          ...state,
          currentOperand: `${state.currentOperand || ""}${payload.digit}`,
        };
      case ACTIONS.CLEAR:
        return {};

      case ACTIONS.CHOOSE_OPERATION:
        if (state.currentOperand == null && state.previousOperand == null) {
          return state;
        }
        if (state.currentOperand == null) {
          return {
            ...state,
            operation: payload.operation,
          };
        }
        if (state.previousOperand == null) {
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null,
          };
        }
        if (state.previousOperand !== null && state.currentOperand !== null) {
          setHistoryList([
            ...historyList,
            `${state.previousOperand}${state.operation}${
              state.currentOperand
            }=${evaluate(state)}`,
          ]);

          return {
            ...state,
            previousOperand: evaluate(state),
            currentOperand: null,
            operation: payload.operation,
          };
        }
        break;
      case ACTIONS.EVALUATE:
        setHistoryList([
          ...historyList,
          `${state.previousOperand}${state.operation}${
            state.currentOperand
          }=${evaluate(state)}`,
        ]);
        if (
          state.previousOperand == null ||
          state.currentOperand == null ||
          state.operation == null
        ) {
          return state;
        }

        return {
          ...state,
          overwrite: true,
          previousOperand: null,
          currentOperand: evaluate(state),
          operation: null,
        };
      case ACTIONS.DELETE_DIGIT:
        if (state.overwrite)
          return {
            ...state,
            currentOperand: null,
            overwrite: false,
          };
        if (state.currentOperand == null) {
          return state;
        }
        if (state.currentOperand.length === 1) {
          return {
            ...state,
            currentOperand: null,
          };
        }
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1),
        };
    }
  }

  // eslint-disable-next-line no-unused-vars
  const [historyList, setHistoryList] = useState([]);
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("items"));
    setHistoryList(items);
  }, []);
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(historyList));
  }, [historyList]);

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <>
      <div className="calculator-container">
        <div className="calculator-grid">
          <div className="output">
            <div className="previous-operand">
              {formatOperand(previousOperand)}
              {operation}
            </div>
            <div className="current-operand">
              {formatOperand(currentOperand)}
            </div>
          </div>
          <button
            className="span-two"
            onClick={() => dispatch({ type: ACTIONS.CLEAR })}
          >
            AC
          </button>
          <button onClick={(state) => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
            DEL
          </button>
          <OperationButton operation="÷" dispatch={dispatch} />
          <DigitButton digit="1" dispatch={dispatch} />
          <DigitButton digit="2" dispatch={dispatch} />
          <DigitButton digit="3" dispatch={dispatch} />
          <OperationButton operation="*" dispatch={dispatch} />
          <DigitButton digit="4" dispatch={dispatch} />
          <DigitButton digit="5" dispatch={dispatch} />
          <DigitButton digit="6" dispatch={dispatch} />
          <OperationButton operation="+" dispatch={dispatch} />
          <DigitButton digit="7" dispatch={dispatch} />
          <DigitButton digit="8" dispatch={dispatch} />
          <DigitButton digit="9" dispatch={dispatch} />
          <OperationButton operation="-" dispatch={dispatch} />
          <DigitButton digit="." dispatch={dispatch} />
          <DigitButton digit="0" dispatch={dispatch} />
          <button
            className="span-two"
            onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
          >
            =
          </button>
        </div>
      </div>
      <div className="history">
        <h3>Calculator History</h3>
        <div className="history-container">
          {historyList.length === 0
            ? "Empty"
            : historyList.map((item, index) => (
                <div className="items" key={index}>
                  <div>
                    {index + 1}. {item}
                  </div>
                  <AiOutlineClose
                    onClick={() => deleter(index)}
                    className="svg"
                  />
                </div>
              ))}
        </div>

        <div className="buttons">
          <button
            className="ctrl-btn"
            onClick={() => setHistoryList((prev) => [])}
          >
            Clear History
          </button>
          <button className="ctrl-btn" onClick={() => remover()}>
            Remover
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
