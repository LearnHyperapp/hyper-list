import { h } from 'hyperapp'

export const initialState = {
  items: [], // Will be a list of strings, each an item on the list
  text: '', // Will be our memo of what text is in the input. May not actually be necessary, as we could allow the input to be *uncontrolled*.
}

export const actions = {
  addItem: item => state => ({
    text: '', // Clear our input box
    items: state.items.concat(item), // Add the item (also should be the same as state.text) to our items list
  }),
  setText: value => state => ({
    text: value, // Update our text to `value`, which should be coming from oninput event.target.value (see line 46)
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
    <div>
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
          <input
            type="text"
            value={state.text}
            oninput={(e) => actions.setText(e.target.value)}
            onkeydown={(e) => {
              if (e.which === 13) { // 13 is the enter/return key
                e.preventDefault() // If we were in a form, we'd definitely need to call this to prevent a form submit. I think it's just a generally good idea for keyDown handling for enter in inputs.
                actions.addItem(state.text) // Could also swap state.text with e.target.value if we had an uncontrolled input.
              }
            }}
          />
        </li>
      </ul>
    </div>
  );
}
