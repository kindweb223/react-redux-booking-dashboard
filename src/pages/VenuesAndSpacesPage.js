import { css } from "emotion";
import React, { useState } from "react";
import Button from "../components/buttons/Button";
import colors from "../components/style/colors";
import { TableEditableValue } from "../components/tables/tables";
import H3 from "../components/typography/H3";
import P1 from "../components/typography/P1";
import ColoredDot from "../components/buttons/ColoredDot";

const VenuesAndSpacesPage = props => {
  const { state, dispatch } = props;
  const [addingVenue, setAddingVenue] = useState(false);
  const [addingSpace, setAddingSpace] = useState(false);
  const [selectedVenueIndex, setSelectedVenueIndex] = useState(null);

  const selectedVenue =
    selectedVenueIndex !== null && state.venues[selectedVenueIndex];
  const spaces =
    selectedVenueIndex !== null ? state.venues[selectedVenueIndex].spaces : [];

  return (
    <ColumnContainer>
      {/* VENUES */}
      <Column
        title="Venues"
        buttonTitle="Add Venue"
        message={
          state.venues.length === 0 &&
          !addingVenue &&
          "Add a venue to get started"
        }
        onButtonClick={() => {
          setSelectedVenueIndex(null);
          setAddingVenue(true);
        }}
      >
        {addingVenue && (
          <Cell
            newMode
            insertPlaceholder={"Venue Name"}
            onAddValue={name => {
              dispatch({ type: "add_venue", name });
              setAddingVenue(false);
            }}
            onCancel={() => {
              setAddingVenue(false);
            }}
          />
        )}
        {state.venues.map((venue, index) => (
          <Cell
            selected={selectedVenueIndex === index}
            clickable
            key={venue.name}
            title={venue.name}
            onEditValue={name => {
              dispatch({ type: "edit_venue", index, name });
            }}
            onDelete={() => {
              setSelectedVenueIndex(null);
              dispatch({ type: "delete_venue", index });
            }}
            onClick={() => {
              setSelectedVenueIndex(index);
            }}
          />
        ))}
      </Column>

      {/* SPACES */}
      <Column
        title={selectedVenue ? selectedVenue.name : "Spaces"}
        buttonTitle={selectedVenueIndex !== null && "Add Space"}
        message={(() => {
          if (selectedVenueIndex === null) {
            return "Select a venue to view its spaces";
          } else if (spaces.length === 0 && !addingSpace) {
            return `Add a Space to get started`;
          }
        })()}
        onButtonClick={() => setAddingSpace(true)}
      >
        {addingSpace && (
          <Cell
            newMode
            insertPlaceholder={"Space Name"}
            onAddValue={name => {
              dispatch({ type: "add_space", venue: selectedVenueIndex, name });
              setAddingSpace(false);
            }}
            onCancel={() => {
              setAddingSpace(false);
            }}
          />
        )}

        {spaces.map((space, index) => (
          <Cell
            key={space.id}
            title={space.name}
            accentColor={space.accentColor}
            onEditValue={name => {
              dispatch({
                type: "edit_space",
                venue: selectedVenueIndex,
                space: index,
                name
              });
            }}
            onDelete={() => {
              dispatch({
                type: "delete_space",
                venue: selectedVenueIndex,
                space: index
              });
            }}
          />
        ))}
      </Column>
    </ColumnContainer>
  );
};

const ColumnContainer = ({ children = null }) => (
  <div
    className={css`
      display: flex;
      /* background-color: green; */
    `}
  >
    {children}
  </div>
);

const Column = ({
  title = "",
  buttonTitle = "",
  message = null,
  onButtonClick,
  children = null
}) => (
  <div
    className={css`
      width: 40%;
      min-width: 350px;
      margin-right: 2em;
    `}
  >
    <div
      className={css`
        display: flex;
        justify-content: space-between;
        margin-top: 0.8 em;
      `}
    >
      {title && <H3>{title}</H3>}
      {buttonTitle && (
        <Button primary onClick={onButtonClick}>
          {buttonTitle}
        </Button>
      )}
    </div>
    {message && <P1>{message}</P1>}

    {children}
  </div>
);

const Cell = ({
  title = "",
  newMode = false,
  insertPlaceholder: placeholder = "",
  onAddValue = null,
  onEditValue = null,
  onDelete = null,
  onCancel = null,
  onClick = null,
  selected = false,
  clickable = false,
  accentColor = null
}) => {
  const [value, setValue] = useState(title);
  const [editing, setEditing] = useState(newMode);

  return (
    <div
      className={css`
        width: 100%;
        background-color: ${selected ? colors.accent_pink + "10" : "white"};
        margin-right: 1em;
        padding: 5px 10px;
        border-bottom: 1px solid ${colors.lighter};
        p {
          margin: 0;
          height: 28px;
        }
        input {
          height: 28px;
        }
        ${!newMode &&
          !editing &&
          css`
            button {
              display: none;
            }
          `}
        :hover button {
          display: inline-block;
        }
        button {
          background: none;
          color: inherit;
          border: none;
          cursor: pointer;
          font-size: 0.8em;
          /* text-decoration: underline; */
          outline: none;
        }
      `}
    >
      {(() => {
        if (editing) {
          return (
            <div
              className={css`
                display: flex;
                justify-content: space-between;
              `}
            >
              <TableEditableValue
                autoFocus
                placeholder={placeholder}
                value={value}
                onChange={value => setValue(value)}
              />
              <div>
                <button
                  onClick={() => {
                    if (newMode) {
                      onCancel();
                    } else {
                      setEditing(false);
                    }
                  }}
                  style={{ color: "gray" }}
                >
                  cancel
                </button>
                <button
                  onClick={() => {
                    if (newMode) {
                      value.length > 0 ? onAddValue(value) : onCancel();
                    } else {
                      onEditValue(value);
                      setEditing(false);
                    }
                  }}
                  style={{ color: "green" }}
                >
                  save
                </button>
              </div>
            </div>
          );
        } else {
          return (
            <div
              className={css`
                display: flex;
                justify-content: space-between;
              `}
            >
              <P1
                color="dark"
                onClick={onClick}
                className={css`
                  width: 70%;
                  ${clickable &&
                    css`
                      :hover {
                        opacity: 0.7;
                      }
                      :active {
                        opacity: 0.9;
                      }
                      cursor: pointer;
                    `}
                `}
              >
                {accentColor && <ColoredDot color={accentColor} />} {title}
              </P1>
              <div>
                <button onClick={() => onDelete()} style={{ color: "red" }}>
                  remove
                </button>
                <button onClick={() => setEditing(true)}>edit</button>
              </div>
            </div>
          );
        }
      })()}
    </div>
  );
};

export default VenuesAndSpacesPage;