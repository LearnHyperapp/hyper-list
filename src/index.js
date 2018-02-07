import { h, app } from 'hyperapp'

const state = {
  items: [],
  text: '',
}

const actions = {
  addItem: item => state => ({ text: '', items: state.items.concat(item) }),
  setText: value => state => ({ items: state.items, text: value }),
  remItem: index => state => ({ items: state.items.slice(0, index).concat(state.items.slice(index + 1)) }),
}

const view = (state, actions) => {
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
              if (e.which === 13) {
                e.preventDefault()
                actions.addItem(state.text)
              }
            }}
          />
        </li>
      </ul>
    </div>
  )
}

const main = app(state, actions, view, document.getElementById('root'))
