import React from "react";
import P2 from "../../typography/P2";
import { css } from "emotion";
import P1 from "../../typography/P1";
import H5 from "../../typography/H5";
import colors from "../../style/colors";
import ColoredDot from "../../buttons/ColoredDot";
import InputField from "../../buttons/InputField";
import Toggle from "../../buttons/Toggle";
import removeSvg from "../../../images/ui/remove.svg";
import dragHandleSvg from "../../../images/ui/dragHandle.svg";
import SvgButton from "../../buttons/SvgButton";
import Button from "../../buttons/Button";
import AddGlyph from "../../../images/Glyphs/AddGlyph";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const DefaultStatusRow = props => {
  const { status, index } = props;
  const { id, name, color } = status;

  return (
    <Draggable draggableId={id} index={index}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={css`
            border: 1px solid ${colors.light};
            padding: 0.2em 0.5em;
            margin-top: 1em;
            border-radius: 4px;
            p {
              margin: 0;
              padding: 0;
            }
          `}
        >
          <P1>
            {name}{" "}
            {color && <ColoredDot color={color} style={{ marginLeft: 4 }} />}
          </P1>
          <div style={{ display: "none" }} {...provided.dragHandleProps} />
        </div>
      )}
    </Draggable>
  );
};

const CustomStatusRow = props => {
  const { status, index, onDelete, onToggle, onChangeName } = props;
  const { id, name, enabled } = status;

  return (
    <Draggable draggableId={id} index={index}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={css`
            display: flex;
            align-items: center;
            margin-top: 1em;
            border-radius: 4px;
            p {
              margin: 0;
              padding: 0;
            }
            input {
              flex: 1;
            }
          `}
        >
          <InputField
            onChange={event => {
              onChangeName(event.target.value);
            }}
            value={name}
            style={{ marginRight: "1em" }}
            placeholder="Name for your custom status"
            autoFocus
          />{" "}
          <Toggle
            enabled={enabled}
            onChange={onToggle}
            style={{ marginRight: "0.5em" }}
          />
          <SvgButton
            size={20}
            svg={removeSvg}
            onClick={onDelete}
            style={{ marginRight: "0.5em" }}
          />
          <SvgButton
            size={20}
            svg={dragHandleSvg}
            style={{ cursor: "grab", marginRight: "0.5em" }}
            {...provided.dragHandleProps}
          />
        </div>
      )}
    </Draggable>
  );
};

const BookingStatusesSettingsSection = props => {
  const { state, dispatch } = props;

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    dispatch({
      type: "reorder_status",
      from: result.source.index,
      to: result.destination.index
    });
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <P2 color="grey">
              Add new custom booking statuses you can use in your organization.
              You can’t edit or remove the default ones.
            </P2>
            <div style={{ marginTop: 10 }}>
              <H5>Status</H5>
              {state.bookingStatuses.map((status, index) =>
                status.type === "default" ? (
                  <DefaultStatusRow
                    key={status.id}
                    index={index}
                    status={status}
                  />
                ) : (
                  <CustomStatusRow
                    key={status.id}
                    index={index}
                    status={status}
                    onToggle={() =>
                      dispatch({ type: "toggle_custom_status", index })
                    }
                    onDelete={() => {
                      dispatch({ type: "remove_custom_status", index });
                    }}
                    onChangeName={name =>
                      dispatch({
                        type: "update_custom_status_name",
                        index,
                        name
                      })
                    }
                  />
                )
              )}
              {provided.placeholder}
            </div>
            <Button
              primary
              onClick={() => dispatch({ type: "append_custom_status" })}
              iconComponent={() => <AddGlyph fill={colors.white} />}
              style={{ marginTop: "2em" }}
            >
              Add Status
            </Button>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default BookingStatusesSettingsSection;
