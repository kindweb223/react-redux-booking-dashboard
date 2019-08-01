import React, { useState } from "react";

import { storiesOf } from "@storybook/react";

import "../src/index.css";
import H1 from "../src/components/typography/H1";
import H3 from "../src/components/typography/H3";
import H2 from "../src/components/typography/H2";
import H4 from "../src/components/typography/H4";
import P1 from "../src/components/typography/P1";
import LayoutWrapper from "../src/components/layout/LayoutWrapper";
import LayoutSection from "../src/components/layout/LayoutSection";
import Sidebar from "../src/components/layout/Sidebar";
import Calendar from "../src/components/features/calendar";
import TabBar from "../src/components/features/tabBar";
import Button from "../src/components/buttons/Button";
import PickerButton from "../src/components/buttons/PickerButton";
import Grid from "../src/components/layout/Grid";
import {
  TableItem,
  TableSectionHeader,
  Table,
  TableValue
} from "../src/components/tables/tables";
import OutlinedButton from "../src/components/buttons/OutlinedButton";
import addGlyph from "../src/images/Glyphs/add.svg";
import BookingFilters from "../src/components/features/bookingFilters";

storiesOf("Layout", module).add("Basic", () => (
  <>
    <Sidebar>Text</Sidebar>
    <LayoutWrapper>
      <LayoutSection>
        <H3>Text</H3>
        <Calendar />
      </LayoutSection>
    </LayoutWrapper>
  </>
));

storiesOf("Typography", module).add("All", () => (
  <>
    <H1>This is a H1 heading</H1>
    <H2>This is a H2 heading</H2>
    <H3>This is a H3 heading</H3>
    <H4>This is a H4 heading</H4>
    <P1>This is a paragraph.</P1>
    <P1>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
      ultrices vehicula est, at pharetra arcu consectetur id. Mauris vitae quam
      efficitur, ornare velit nec, placerat eros. In et venenatis velit. In
      justo neque, scelerisque quis sagittis ac, aliquet a felis. Mauris quis
      luctus felis. Praesent purus ipsum, convallis eu convallis quis, ornare
      sed mi. Phasellus sit amet lorem vehicula, consequat ex id, convallis
      tortor. Sed eros enim, tincidunt ac lorem sit amet, ultrices eleifend
      lorem. Phasellus euismod, diam eget lacinia egestas, quam urna efficitur
      risus, in pretium justo metus vel odio.
    </P1>
  </>
));

storiesOf("Components", module).add("TabBar", () => {
  function Component() {
    const [selectedItem, setSelectedItem] = useState("One");
    return (
      <TabBar
        items={["One", "Two", "Three"]}
        selectedItem={selectedItem}
        onOptionSelected={item => setSelectedItem(item)}
      />
    );
  }
  return <Component />;
});

storiesOf("Components", module).add("Button", () => {
  return (
    <div style={{ padding: 20 }}>
      <Button>Button</Button>
      <Button primary>Primary</Button>
      <PickerButton
        options={["Accepted", "Declined", "Paid"]}
        selectedOption={"Accepted"}
      />
      <OutlinedButton>Outlined</OutlinedButton>
      <OutlinedButton primary>Outlined (Primary)</OutlinedButton>
      <OutlinedButton primary icon={addGlyph}>
        Outlined with Icon
      </OutlinedButton>
    </div>
  );
});

storiesOf("Tables", module).add("Items", () => {
  return (
    <div style={{ padding: 20 }}>
      <Grid columns="1fr 1fr 1fr">
        <TableItem label={"Vanue (Space)"} value={"Gallery (Main Room)"} />
        <TableItem label={"Customer"} value={"Company Ltd."} />
        <TableItem label={"Payment Method"} value={"Online Payment"} />
      </Grid>
    </div>
  );
});

storiesOf("Tables", module).add("Section Headers", () => {
  return (
    <div style={{ padding: 20 }}>
      <TableSectionHeader title={"Booking Slots"} />
      <TableSectionHeader title={"Cost Items"} />
    </div>
  );
});

storiesOf("Tables", module).add("Tables", () => {
  return (
    <div style={{ padding: 20 }}>
      <Table
        columns="1fr 1fr 1fr"
        columnTitles={["Name", "Description", "Quantity"]}
      >
        <TableValue>Venue Hire</TableValue>
        <TableValue>No description</TableValue>
        <TableValue>1</TableValue>
        <TableValue>Venue Hire</TableValue>
        <TableValue>No description</TableValue>
        <TableValue>1</TableValue>
      </Table>
    </div>
  );
});

storiesOf("Components", module).add("Booking Filters", () => {
  return (
    <div style={{ padding: 20 }}>
      <BookingFilters
        items={["All", "Enquiry", "Proposal", "Accepted", "Finished"]}
        selectedItem={"All"}
      />
    </div>
  );
});
