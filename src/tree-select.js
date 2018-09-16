import { Component, linkEvent } from 'inferno';
import { h } from 'inferno-hyperscript';

import Input from './input';
import Tree from './tree';

function handleClick(instance, event) {
  let prev = instance.state;

  instance.setState({
    dropdown: !prev.dropdown
  , focused: true
  });

  // stop bubbles
  event.stopImmediatePropagation();
  event.preventDefault();
}

function handleClickOnDropdown(instance, event) {
  let prev = instance.state;

  instance.setState({
    dropdown: !prev.dropdown
  , focused: false
  });

  // stop bubbles
  event.stopImmediatePropagation();
  event.preventDefault();
}

// to onSelect
function onAction(instance, event, node) {
  instance.setState({
    currentNode: node
  , dropdown: false
  });

  if (typeof instance.props.onSelect === 'function') {
    instance.props.onSelect(node);
  }
}

// input
function handleFocusIn(instance, event) {
  console.log(event);
}

function handleFocusOut(instance, event) {
  console.log(event);
}

class TreeSelect extends Component {
  constructor(props) {
    super(props);

    const selected = props.selected;
    // TODO
    // find node by selected value

    this.state = {
      dropdown: false
    , focused: false
    , options: []
    , currentNode: null
    , hasOptions: false
    };
  }

  componentWillMount() {
    this.setState({
      options: this.props.options
    , hasOptions: (this.props.options.length > 0)
    })
  }

  render() {
    let content = [
      h('a', {
        onClick: linkEvent(this, handleClick)
      }, h(Input, {
        options: this.state.options
      , onFocusIn: linkEvent(this, handleFocusIn)
      , onFocusOut: linkEvent(this, handleFocusOut)
      }))
    ];
    if (this.state.dropdown) {
      let dropdownContent = [];
      if (!this.state.hasOptions) {
        dropdownContent = [
          h('span.not-found', {}, 'No matches found')
        ];
      } else {
        dropdownContent = [
          h(Tree, {
            items: this.state.options
          , onAction: linkEvent(this, onAction)
          })
        ];
      }
      content.push(h('.dropdown', {
        onClick: linkEvent(this, handleClickOnDropdown)
      }, dropdownContent));
    }

    const currentNode = this.state.currentNode;
    if (currentNode !== null) {
      content.unshift(h('span.current-node', null, currentNode.label));
    }

    return h('.tree-select', null, content);
  }
}

export { TreeSelect }
