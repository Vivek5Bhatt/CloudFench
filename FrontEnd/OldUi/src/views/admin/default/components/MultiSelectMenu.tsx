import {
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";
import React, { useState } from "react";

const MultiSelectMenu = (props: MultiSelectMenuProps): JSX.Element => {
  const { label, options, buttonProps } = props;
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  React.useEffect(() => {}, [selectedOptions]);
  return (
    <Menu closeOnSelect={false}>
      {({ onClose }) => (
        <>
          <MenuButton
            /* eslint-disable @typescript-eslint/ban-ts-comment */
            // @ts-ignore <MenuButton> does have a 'type' prop because it is just a button. This is to make sure clicking this doesn't submit any forms.
            type="button"
            /* eslint-enable @typescript-eslint/ban-ts-comment */
            backgroundColor={selectedOptions.length ? "blue.200" : "white"}
            color={selectedOptions.length ? "blue.500" : "gray.600"}
            borderColor={selectedOptions.length ? "blue.200" : "gray.300"}
            borderWidth={1}
            p={2}
            px={4}
            borderRadius="25px"
            _focus={{
              outline: "none",
            }}
            {...buttonProps}
          >
            {`${label}${
              selectedOptions.length > 0 ? ` (${selectedOptions.length})` : ""
            }`}
          </MenuButton>
          <MenuList>
            <MenuGroup title={undefined}>
              <MenuItem
                onClick={() => {
                  setSelectedOptions([]);
                  // Have to close, otherwise the defaultValue won't be reset correctly
                  // and so the UI won't immediately show the menu item options unselected.
                  props.onChange?.([]);
                  onClose();
                }}
              >
                Clear all
              </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuOptionGroup
              title={undefined}
              defaultValue={selectedOptions}
              // type="checkbox"
              /* eslint-disable @typescript-eslint/ban-ts-comment */
              // @ts-ignore Arguments type is just wrong upstream.

              /* eslint-enable @typescript-eslint/ban-ts-comment */
            >
              {options.map((option) => {
                return (
                  // Use 'type'='button' to make sure it doesn't default to 'type'='submit'.
                  <MenuItemOption
                    key={`multiselect-menu-${option}`}
                    /* eslint-disable @typescript-eslint/ban-ts-comment */
                    // @ts-ignore <MenuItemOption> does have a 'type' prop because it is just a button. This is to make sure clicking this doesn't submit any forms.
                    type="button"
                    /* eslint-enable @typescript-eslint/ban-ts-comment */
                    value={option}
                    backgroundColor={
                      selectedOptions.includes(option) ? "blue.200" : ""
                    }
                    _hover={{
                      background: selectedOptions.includes(option)
                        ? "blue.200"
                        : "",
                    }}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      const option = event.currentTarget.value;

                      // Filter out empty strings, because, well, this component seems to add
                      // an empty string out of nowhere.
                      if (selectedOptions.includes(option)) {
                        const tempOptions = selectedOptions;
                        tempOptions.splice(selectedOptions.indexOf(option), 1);
                        setSelectedOptions(tempOptions);
                        props.onChange?.(tempOptions);
                      } else {
                        if (selectedOptions.length < 2) {
                          setSelectedOptions([...selectedOptions, option]);
                          props.onChange?.([...selectedOptions, option]);
                        }
                      }
                    }}
                  >
                    {option}
                  </MenuItemOption>
                );
              })}
            </MenuOptionGroup>
          </MenuList>
        </>
      )}
    </Menu>
  );
};

MultiSelectMenu.displayName = "MultiSelectMenu";

export type MultiSelectMenuProps = {
  label: string;
  options: string[];
  onChange?: (selectedValues: string[]) => void;
  buttonProps?: MenuButtonProps;
};

export default MultiSelectMenu;
