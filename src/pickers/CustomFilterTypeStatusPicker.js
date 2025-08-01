import React from "react";
import { injectIntl } from "react-intl";

import SelectInput from "../components/inputs/SelectInput";
import { MODULE_NAME } from "../constants";
import { useTranslations } from "../helpers/i18n";

const CustomFilterTypeStatusPicker = ({
  intl,
  value,
  label,
  onChange,
  readOnly = false,
  withNull = false,
  nullLabel = null,
  withLabel = true,
  required = false,
  customFilters,
  customFilterField,
}) => {
  const { formatMessage } = useTranslations(MODULE_NAME);

  // Filter the available options based on the selected field
  const filterTypes = customFilters
    ? customFilters
        .filter((filter) => filter.field === customFilterField)
        .map((filter) => {
          return filter.filter;
        })
        .flat()
    : [];

  const filteredOptions = filterTypes.map((filter) => ({
    value: filter,
    label: formatMessage(`advancedFilters.${filter}`),
  }));

  if (withNull) {
    filteredOptions.unshift({
      value: null,
      label: nullLabel || "",
    });
  }

  return (
    <SelectInput
      module="core"
      label={withLabel && label}
      options={filteredOptions}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      required={required}
    />
  );
};

export default injectIntl(CustomFilterTypeStatusPicker);
