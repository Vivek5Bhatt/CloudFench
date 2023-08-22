import {
  Box,
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

const MultiSelectField = (props: MultiSelectMenuProps): JSX.Element => {
  const properties = [
    "CidrBlock",
    "State",
    "VpcId",
    "IsDefault",
    "AvailabilityZone",
    "AvailabilityZoneId",
    "DefaultForAz",
    "SubnetId",
    "VpcId",
  ];
  const { label, options, buttonProps } = props;
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  React.useEffect(() => {}, [selectedOptions]);
  let detailsObject: any = undefined;

  const handleHoverEvent = (
    event: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    const filteredOption = options.filter(
      (option) => option.id === event.currentTarget.value
    );
    detailsObject = filteredOption[0];
  };
  return (
    <Menu matchWidth={true} closeOnSelect={false}>
      {({ onClose }) => (
        <>
          <MenuButton
            width={"100%"}
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
          <MenuList overflowY={"auto"} maxHeight="400px">
            <MenuGroup title={undefined} overflowY="auto">
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
              position="relative"
              /* eslint-disable @typescript-eslint/ban-ts-comment */
              // @ts-ignore Arguments type is just wrong upstream.

              /* eslint-enable @typescript-eslint/ban-ts-comment */
            >
              {detailsObject && (
                <Box
                  position={"absolute"}
                  left="110%"
                  top="0"
                  zIndex={"1000"}
                  backgroundColor="white"
                  padding={"2rem"}
                  border="solid"
                  borderColor={"gray.200"}
                  width="300px"
                >
                  {/* {JSON.stringify(detailsObject)} */}
                  {properties.map((property, index) => {
                    return (
                      detailsObject[property] && (
                        <p key={index}>
                          {property} : {detailsObject[property].toString()}
                        </p>
                      )
                    );
                  })}
                  {detailsObject.Tags && detailsObject.Tags.length !== 0 && (
                    <p>
                      Name :{" "}
                      {(() => {
                        const arr = detailsObject.Tags.filter(
                          (tag: { Key: string }) => tag.Key === "Name"
                        );
                        if (arr.length) {
                          return arr[0].Value;
                        }
                      })()}
                    </p>
                  )}
                </Box>
              )}
              {options.map((option) => {
                return (
                  // Use 'type'='button' to make sure it doesn't default to 'type'='submit'.
                  <>
                    <MenuItemOption
                      onMouseEnter={(event) => handleHoverEvent(event)}
                      onMouseLeave={() => (detailsObject = undefined)}
                      key={`multiselect-menu-${option.id}`}
                      /* eslint-disable @typescript-eslint/ban-ts-comment */
                      // @ts-ignore <MenuItemOption> does have a 'type' prop because it is just a button. This is to make sure clicking this doesn't submit any forms.
                      type="button"
                      position={"relative"}
                      /* eslint-enable @typescript-eslint/ban-ts-comment */
                      value={option.id}
                      backgroundColor={
                        selectedOptions.includes(option.id) ? "blue.200" : ""
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
                          tempOptions.splice(
                            selectedOptions.indexOf(option),
                            1
                          );
                          setSelectedOptions(tempOptions);
                          props.onChange?.(tempOptions);
                        } else {
                          setSelectedOptions([...selectedOptions, option]);
                          props.onChange?.([...selectedOptions, option]);
                        }
                      }}
                    >
                      {option.id}
                    </MenuItemOption>
                  </>
                );
              })}
            </MenuOptionGroup>
          </MenuList>
        </>
      )}
    </Menu>
  );
};

MultiSelectField.displayName = "MultiSelectField";

export type MultiSelectMenuProps = {
  label: string;
  options: any[];
  onChange?: (selectedValues: string[]) => void;
  buttonProps?: MenuButtonProps;
};

export default MultiSelectField;
