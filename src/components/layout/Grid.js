import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const GridWrapper = styled.div`
  display: grid;
  min-height: ${props => (props.fullheight ? "100%" : "auto")};
  grid-template-columns: ${props => props.columns || "1fr"};
  grid-template-rows: ${props => props.rows};
  grid-gap: ${props => props.gap || "1.4em"};
  @media (max-width: ${props => props.break}) {
    grid-template-columns: 1fr;
  }
  @media (max-width: ${props => props.split}) {
    grid-template-columns: 1fr 1fr;
  }
  overflow: visible;
  > * {
    min-width: 0;
  }
  &:empty {
    display: block;
  }
`;

const Grid = props => <GridWrapper {...props}>{props.children}</GridWrapper>;

Grid.propTypes = {
  fullheight: PropTypes.bool,
  columns: PropTypes.string,
  rows: PropTypes.string,
  gap: PropTypes.string,
  break: PropTypes.string,
  split: PropTypes.string
};

export default Grid;
