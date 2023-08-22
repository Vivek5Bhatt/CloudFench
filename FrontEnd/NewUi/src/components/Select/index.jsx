import React, { PureComponent } from "react";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import Chip from "@mui/material/Chip";
import BlockIcon from "@mui/icons-material/Block";

export default class List extends PureComponent {
  constructor(props) {
    super(props);

    function generateItems(numberOfItems) {
      return [...Array(numberOfItems).keys()].map((i) => {
        const num = i + 1;
        return { label: `Item ${num}`, id: `value-${num}` };
      });
    }

    this.state = {
      items: generateItems(5),
      isShiftDown: false,
      selectedItems: [],
      lastSelectedItem: null,
    };

    this.listEl = null;

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSelectItem = this.handleSelectItem.bind(this);
    this.handleSelectStart = this.handleSelectStart.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keyup", this.handleKeyUp, false);
    document.addEventListener("keydown", this.handleKeyDown, false);
    this.listEl.addEventListener("selectstart", this.handleSelectStart, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyUp);
    document.removeEventListener("keydown", this.handleKeyDown);
    this.listEl.removeEventListener("selectstart", this.handleSelectStart);
  }

  handleSelectStart(e) {
    // if we're clicking the labels it'll select the text if holding shift
    if (this.state.isShiftDown) {
      e.preventDefault();
    }
  }

  handleKeyUp(e) {
    if (e.key === "Shift" && this.state.isShiftDown) {
      this.setState({ isShiftDown: false });
    }
  }

  handleKeyDown(e) {
    if (e.key === "Shift" && !this.state.isShiftDown) {
      this.setState({ isShiftDown: true });
    }
  }

  handleSelectItem(e) {
    const { value } = e.target;
    const nextValue = this.getNextValue(value);
    this.setState({ selectedItems: nextValue, lastSelectedItem: value });
  }

  getNextValue(value) {
    const { isShiftDown, selectedItems } = this.state;
    const hasBeenSelected = !selectedItems.includes(value);

    if (isShiftDown) {
      const newSelectedItems = this.getNewSelectedItems(value);
      // de-dupe the array using a Set
      const selections = [...new Set([...selectedItems, ...newSelectedItems])];

      if (!hasBeenSelected) {
        return selections.filter((item) => !newSelectedItems.includes(item));
      }

      return selections;
    }

    // if it's already in there, remove it, otherwise append it
    return selectedItems.includes(value)
      ? selectedItems.filter((item) => item !== value)
      : [...selectedItems, value];
  }

  getNewSelectedItems(value) {
    const { lastSelectedItem, items } = this.state;
    const currentSelectedIndex = items.findIndex((item) => item.id === value);
    const lastSelectedIndex = items.findIndex(
      (item) => item.id === lastSelectedItem
    );

    return items
      .slice(
        Math.min(lastSelectedIndex, currentSelectedIndex),
        Math.max(lastSelectedIndex, currentSelectedIndex) + 1
      )
      .map((item) => item.id);
  }

  renderItems() {
    const { items, selectedItems } = this.state;
    return items.map((item) => {
      const { id, label } = item;
      return (
        <li key={id} className="listing_block_table">
          <FormLabel
            htmlFor={`item-${id}`}
            sx={{
              fontSize: "13px",
              // '& input:checked ~ .listing_group': {
              //   backgroundColor:"#000",
              // },
            }}
          >
            <input
              onChange={this.handleSelectItem}
              type="checkbox"
              checked={selectedItems.includes(id)}
              value={id}
              id={`item-${id}`}
            />
            {this.props.type === "category" ? (
              <Box className="truncate listing_group title_up_inner">
                Punishing URL
              </Box>
            ) : (
              <Box
                className="truncate listing_group "
                sx={{ paddingLeft: "8px" }}
              >
                <Chip
                  size="small"
                  variant="text"
                  icon={<BlockIcon color="error" />}
                  label="Block"
                  sx={{
                    backgroundColor: "transparent",
                    borderRadius: "0px",
                  }}
                />
              </Box>
            )}
          </FormLabel>
        </li>
      );
    });
  }

  render() {
    return <ul ref={(node) => (this.listEl = node)}>{this.renderItems()}</ul>;
  }
}
