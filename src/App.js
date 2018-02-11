import { h } from 'hyperapp'

const inputPattern = ".+";

export const initialState = {
  items: [], // Will be a list of strings, each an item on the list
  text: '', // Will be our memo of what text is in the input. May not actually be necessary, as we could allow the input to be *uncontrolled*.
  textValidationMessage: '',
}

export const actions = {
  addItem: () => state => ({
    text: '', // Clear our input box
    textValidationMessage: '',
    items: state.items.concat(state.text), // Add the item (also should be the same as state.text) to our items list
  }),

  setText: input => state => ({
    text: input.value, // Update our text to `value`, which should be coming from oninput event.target.value (see line 46)
    textValidationMessage: input.validationMessage,
  }),

  remItem: index => state => ({
    items: state.items
      .slice(0, index) // Get all the items in the list before the index we're removing
      .concat(state.items.slice(index + 1)) // Get all the items in the list after the index we're removing
  }),
}

export const view = (state, actions) => {
  /*
   * Some notes:
   *  - Because we're outputting an array to the virtual dom, I'm keying all the <li>s.
   *  - I'm also keying the <li> wrapping our input at the bottom to guarantee that hyperapp doesn't create a new dom element.
   */
  return (
    <form
      action="#"
      method="GET"
      onsubmit={(e) => {
        e.preventDefault();
        actions.addItem();
      }}
    >
      <ul>
        {state.items.map((item, idx) => (
          <li key={idx}>
            <a
              href="#"
              onclick={(e) => {
                e.preventDefault()
                actions.remItem(idx)
              }}
            >
              &times;
            </a>

            &nbsp;

            {item}
          </li>
        ))}
        <li key="text">
          <div>
            <label for="text">Add an item:</label><br />
            <input
              id="text"
              type="text"
              value={state.text}
              oninput={(e) => actions.setText(e.target)}
              pattern={inputPattern}
              required

              oncreate={(input) => actions.setText(input)}
            />
            <br />
            <small>{state.textValidationMessage ? state.textValidationMessage : `Input should match /${inputPattern}/`}</small>

          </div>
        </li>
      </ul>
    </form>
  );
}
