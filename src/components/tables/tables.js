import React from "react";
import H5 from "../typography/H5";
import P1 from "../typography/P1";
import styled from "styled-components";
import H4 from "../typography/H4";
import colors from "../style/colors";
import Grid from "../layout/Grid";
import InputField from "../buttons/InputField";
import InputLabel from "../buttons/InputLabel";
import PickerButton from "../buttons/PickerButton";
import TextArea from "../buttons/TextArea";

const TableLabel = props => {
  const { color = "grey", tall, right } = props;
  return (
    <H5
      style={{
        margin: 0,
        lineHeight: tall && "2.6",
        textAlign: right && "right"
      }}
      color={color}
      {...props}
    />
  );
};

const TableValue = props => {
  const { color = "dark", centered = false } = props;
  return (
    <P1
      style={{
        margin: 0,
        textAlign: centered ? "center" : "left"
      }}
      color={color}
      {...props}
      ellipses
    />
  );
};

const TableEditableValue = props => {
  const {
    style,
    label,
    placeholder,
    value,
    defaultValue,
    longText,
    type = "text",
    onChange,
    autoFocus,
    tabIndex
  } = props;

  let mergedStyle = {
    display: "flex",
    flexDirection: "column",
    ...style
  };

  return (
    <div style={mergedStyle}>
      {label && <InputLabel htmlFor={label}>{label}</InputLabel>}
      {longText ? (
        <TextArea
          id={label}
          value={value}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChange={event => onChange && onChange(event.target.value)}
          tabIndex={tabIndex}
          rows={6}
        />
      ) : (
        <InputField
          id={label}
          type={type}
          value={value}
          placeholder={placeholder}
          defaultValue={defaultValue}
          tabIndex={tabIndex}
          onChange={event => onChange && onChange(event.target.value)}
          autoFocus={autoFocus}
          className={props.className}
        />
      )}
    </div>
  );
};

const TablePicker = props => {
  const { label, style } = props;

  let mergedStyle = {
    display: "flex",
    flexDirection: "column",
    ...style
  };

  return (
    <div style={mergedStyle}>
      {label && <InputLabel htmlFor={label}>{label}</InputLabel>}
      <PickerButton {...props} />
    </div>
  );
};

const TableItem = props => {
  const { label, value, labelColor = "grey", valueColor = "dark" } = props;

  const Container = styled.div``;

  return (
    <Container style={props.style}>
      <TableLabel color={labelColor}>{label}</TableLabel>
      <TableValue color={valueColor}>{value}</TableValue>
    </Container>
  );
};

const TableSectionHeader = props => {
  const { title, style } = props;

  const Container = styled.div`
    border-bottom: 1px solid ${colors.light};
    margin: 1.6em 0 0.5em;
    width: 100%;
  `;

  return (
    <Container style={style}>
      <H4 style={{ marginBottom: 3 }}>{title}</H4>
    </Container>
  );
};

const TableDivider = props => {
  const Container = styled.div`
    border-bottom: 1px solid ${colors.light};
    padding-top: 1.4em;
    margin-bottom: 1.4em;
    width: 100%;
  `;

  return <Container />;
};

const Table = props => {
  const { rows, columns, columnTitles = [], style, children } = props;
  return (
    <Grid
      rows={rows}
      columns={columns}
      gap="0.8em"
      style={{ minWidth: "100%", ...style }}
    >
      {columnTitles.map((t, index) => (
        <TableLabel style={{ margin: 0 }} key={index}>
          {t}
        </TableLabel>
      ))}
      {children}
    </Grid>
  );
};

export {
  TableItem,
  TableSectionHeader,
  Table,
  TableValue,
  TableEditableValue,
  TablePicker,
  TableLabel,
  TableDivider
};
