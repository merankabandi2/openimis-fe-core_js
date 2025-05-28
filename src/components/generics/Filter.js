import React from 'react';
import {
  FormControlLabel,
  Checkbox,
  Grid,
  withTheme,
  withStyles,
} from '@material-ui/core';
import {
  formatMessage,
  TextInput,
  PublishedComponent,
} from '@openimis/fe-core';
import _debounce from 'lodash/debounce';
import { injectIntl } from 'react-intl';

export const useFilterChangeHandler = (onChangeFilters) => {
  const debouncedOnChangeFilters = _debounce(onChangeFilters, 300);

  const onChangeStringFilter = (filterName, lookup = null) => (value) => {
    const filterValue = lookup ? `${filterName}_${lookup}: "${value}"` : `${filterName}: "${value}"`;
    debouncedOnChangeFilters([{ id: filterName, value, filter: filterValue }]);
  };

  const onChangeFilter = (k, v) => {
    let gqlQuery = `${k}: ${v}`
    if (v && typeof v === "object" && "id" in v) {
      gqlQuery = v.id ? `${k}_Id: "${v.id}"` : ''
    }
    onChangeFilters([{ id: k, value: v, filter: gqlQuery }]);
  };

  return { onChangeStringFilter, onChangeFilter };
};



function FilterTextInput({
  classes, module, label, value, onChange,
}) {
  return (
    <Grid item xs={3} className={classes.item}>
      <TextInput
        module={module}
        label={label}
        value={value}
        onChange={onChange}
      />
    </Grid>
  );
}

function FilterCheckbox({
  classes, module, checked, onChange, label, intl, filterName,
}) {
  return (
    <Grid item xs={3} className={classes.item}>
      <FormControlLabel
        control={(
          <Checkbox
            checked={checked}
            onChange={onChange}
            name={filterName}
          />
        )}
        label={formatMessage(intl, module, label)}
      />
    </Grid>
  );
}

function Filter({
  moduleName,
  intl,
  classes,
  filters,
  onChangeFilters,
  filterFields,
  pickerFields,
  checkboxFields,
  withLocationFilter,
}) {
  const { onChangeStringFilter, onChangeFilter } = useFilterChangeHandler(onChangeFilters);

  return (
    <Grid container className={classes.form}>
      {filterFields.map((field) => (
        <FilterTextInput
          classes={classes}
          key={field.name}
          module={moduleName}
          label={field.label}
          value={filters?.[field.name]?.value ?? ''}
          onChange={onChangeStringFilter(field.name, field.lookup)}
        />
      ))}

      {pickerFields?.map((field) => (
        <Grid item xs={3} key={field.name} className={classes.item}>
          <field.component
            withLabel
            value={filters?.[field.name]?.value ?? null}
            onChange={(v) => onChangeFilter(field.name, v)}
            readOnly={false}
            {...field.props}
          />
        </Grid>
      ))}

      {checkboxFields.map((field) => (
        <FilterCheckbox
          classes={classes}
          key={field.name}
          checked={filters?.[field.name]?.value ?? false}
          onChange={(event) => onChangeFilter(field.name, event.target.checked)}
          label={field.label}
          intl={intl}
          module={moduleName}
          filterName={field.name}
        />
      ))}

      {withLocationFilter && (
        <Grid item xs={12}>
          <PublishedComponent
            pubRef="location.DetailedLocationFilter"
            withNull
            filters={filters}
            onChangeFilters={onChangeFilters}
            anchor="parentLocation"
          />
        </Grid>
      )}
    </Grid>
  );
}

const defaultFilterStyles = (theme) => ({
  form: {
    padding: 0,
  },
  item: {
    padding: theme.spacing(1),
  },
});

export default injectIntl(withTheme(withStyles(defaultFilterStyles)(Filter)));
