import React from "react";
import styled from "styled-components";

import colors from "../../../style/colors";
import H3 from "../../../typography/H3";
import P2 from "../../../typography/P2";

const PanelDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1em;
  background-color: white;
  box-shadow: 0 5px 15px 5px rgba(164, 173, 186, 0.25);
  border-radius: 3px;
  margin-bottom: 2em;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #E6E8E9;
`;

const NameColumn = styled(P2)`
  width: 30%;
  margin-top: 0.6em;
`;

const ValueColmun = styled(P2)`
  width: 35%;
  text-align: right;
  margin-top: 0.6em;
`;

const TopStaffTable = () => {
  return (
    <PanelDiv>
      <H3>Top Staff</H3>
      <Row>
        <NameColumn style={{color: `${colors.grey}`}}>Staff</NameColumn>
        <ValueColmun style={{color: `${colors.grey}`}}>This month</ValueColmun>
        <ValueColmun style={{color: `${colors.grey}`}}>Last month</ValueColmun>
      </Row>
      <Row>
        <NameColumn>Steven Stward</NameColumn>
        <ValueColmun>$20</ValueColmun>
        <ValueColmun>$20</ValueColmun>
      </Row>
      <Row>
        <NameColumn>Space2</NameColumn>
        <ValueColmun>$20</ValueColmun>
        <ValueColmun>$20</ValueColmun>
      </Row>
    </PanelDiv>
  );
};

export default TopStaffTable;