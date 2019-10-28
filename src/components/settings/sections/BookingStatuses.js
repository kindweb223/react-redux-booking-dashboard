import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { AppReducerContext } from "../../../contexts/AppReducerContext";
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
import SpinnerContainer from "../../../components/layout/Spinner";
import reorder from "../../../utils/reorder";

import {
  REQUEST_GET_BOOKINGSTATUS,
  GET_BOOKING_STATUS_SUCCESS,
  GET_BOOKING_STATUS_ERROR,
  REQUEST_ADD_BOOKING_STATUS,
  GET_ADD_BOOKING_STATUS_SUCCESS,
  GET_ADD_BOOKING_STATUS_ERROR,
  REQUEST_UPDATE_BOOKING_STATUS,
  GET_UPDATE_BOOKING_STATUS_SUCCESS,
  GET_UPDATE_BOOKING_STATUS_ERROR,
  REQUEST_DELETE_BOOKING_STATUS,
  GET_DELETE_BOOKING_STATUS_SUCCESS,
  GET_DELETE_BOOKING_STATUS_ERROR,
  APPEND_CUSTOM_STATUS,
  REMOVE_NEW_BOOKING_STATUS,
  SET_BOOKING_STATUS_PAGE_STATUS,
  UPDATE_ALL_BOOKINGSTATUS_SUCCESS,
} from "../../../reducers/actionType";

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
  const { 
    status, 
    index, 
    onDelete, 
    onToggle, 
    onChangeName, 
    draggable, 
    changeSelectedIndex, 
    selectedStatusIndex 
  } = props;
  const { id, name, active } = status;  
  const [ nameValue, setNameValue ] = useState("");
  const [ isValidate, setIsValidate ] = useState(true);

  const { state, dispatch } = useContext(AppReducerContext);

  useEffect(() => {    
    setNameValue(name);
  }, [name]);

  const handleChangeName = value => {
    if (value.length === 0)
      setIsValidate(false);
    else setIsValidate(true);    
    setNameValue(value);
  }

  const handleNameKeyPress = event => {
    if (event.key === 'Enter') {
      if (nameValue.length > 0) {
        onChangeName(nameValue, index);
        dispatch({ 
          type: SET_BOOKING_STATUS_PAGE_STATUS,
          payload: true,
        })
      }
    }
  }

  const onBlurName = value => {
    setNameValue(name);
    if (name.length > 0) {
      setIsValidate(true);
      dispatch({ 
        type: SET_BOOKING_STATUS_PAGE_STATUS,
        payload: true,
      })
      changeSelectedIndex(null);
    } else setIsValidate(false);
  }

  const handleOnFocus = value => {
    dispatch({ 
      type: SET_BOOKING_STATUS_PAGE_STATUS,
      payload: false,
    })
    changeSelectedIndex(index);
  }

  return (
    <Draggable draggableId={id} index={index}>
      {provided => (
        <div 
          className={css`
            display: flex;
            flex-direction: column;
            width: 100%;        
            pointer-events: ${selectedStatusIndex !== index && !state.settings.enableBookingSection ? "none" : "inherit"};
          `}
        >
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={css`
              display: flex;
              align-items: center;
              margin-top: 1em;
              border-radius: 4px;
              width: 100%;              
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
                handleChangeName(event.target.value)
              }}
              value={nameValue}
              style={{ marginRight: "1em" }}
              placeholder="Name for your custom status"
              onBlur={event => {onBlurName(event.target.value)}}
              autoFocus={(id === -1)}
              className={isValidate ? "" : "error"}
              onKeyPress={event => {handleNameKeyPress(event)}}
              onFocus={event => {handleOnFocus(event)}}              
            />
            <Toggle
              enabled={active}
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
              className={
                css`
                  pointer-events: ${isValidate && draggable ? "inherit" : "none"};
                `
              }
            />
          </div>
          { !isValidate && 
            <p
              className={
                css`
                  color: #E92579;
                  font-size: 0.8em;
                  line-height: 28px;
                  padding: 0 0.6em;
                  margin: 0.2em 0 0 0;
                `
              }
            >
              Required
            </p>
          }          
        </div>
      )}
    </Draggable>
  );
};

const BookingStatusesSettingsSection = props => {
  const { state, dispatch } = props;
  const [ selectedStatusIndex, setSelectedStatusIndex ] = useState(null);

  useEffect(() => {
    const getBookingStatus = async () => {

      try {
        dispatch({ type: REQUEST_GET_BOOKINGSTATUS });
        const res = await axios.get('/statuses');
        
        dispatch({ 
          type: GET_BOOKING_STATUS_SUCCESS,
          payload: res.data.statuses,
        })

      } catch (err) {
        dispatch({ type: GET_BOOKING_STATUS_ERROR })
      }      
    }
    getBookingStatus();
  }, []);

  const onDragEnd = async (result) => {
    if (!result.destination || result.destination.index === 0) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }
   
    let nIndex = 0
    if(result.destination.index >= 1)
      nIndex = result.destination.index-1;

    let newUpdateStatus = state.bookingStatuses[result.source.index];
    if (state.bookingStatuses[nIndex].type === 'default')
      newUpdateStatus.parentId = state.bookingStatuses[nIndex].name;
    else newUpdateStatus.parentId = state.bookingStatuses[nIndex].parentId;    

    newUpdateStatus.order = result.destination.index;        

    dispatch({ type: REQUEST_UPDATE_BOOKING_STATUS });

    dispatch({
      type: "reorder_status",
      from: result.source.index,
      to: result.destination.index
    });

    const { id, name, active, order, parentId } = newUpdateStatus;

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put(
      `./statuses/${id}`, 
      JSON.stringify({
        id, name, active, parentId, order
      }), 
      config
    );

    let bookingStatuses = reorder(state.bookingStatuses, result.source.index, result.destination.index);
    bookingStatuses = bookingStatuses.map(item => {
      if (item.id === res.data.status.id)
        return res.data.status;
      else return item;
    })
    
    dispatch({ 
      type: UPDATE_ALL_BOOKINGSTATUS_SUCCESS,
      payload: bookingStatuses
    })
    // dispatch({
    //   type: "reorder_status",
    //   payload: bookingStatuses
    // });

    // dispatch({
    //   type: GET_UPDATE_BOOKING_STATUS_SUCCESS,
    //   payload: res.data.status
    // })

    // dispatch({
    //   type: "reorder_status",
    //   from: result.source.index,
    //   to: result.destination.index
    // });
    
  }

  const changeBookingStatus = async (nameValue, index) => {

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (state.bookingStatuses[index].id === -1) {
      try {
        dispatch({ type: REQUEST_ADD_BOOKING_STATUS });
        
        const { active } = state.bookingStatuses[index];

        let parentId = null;
        let order = index;
        if(state.bookingStatuses[index-1].name === "Enquiry" || state.bookingStatuses[index-1].name === "Proposal"){
          parentId = state.bookingStatuses[index-1].name;
          order = 0;
        } else if(state.bookingStatuses[index-1].parentId != null) {
          parentId = state.bookingStatuses[index-1].parentId;
          order = state.bookingStatuses[index-1].order + 1;
        }
          
        const res = await axios.post(
          './statuses', 
          JSON.stringify({
            name: nameValue,
            active, 
            parentId,
            order,
          }), 
          config
        );
        
        dispatch({
          type: GET_ADD_BOOKING_STATUS_SUCCESS,
          payload: res.data.status
        });
      } catch (err) {
        dispatch({ type: GET_ADD_BOOKING_STATUS_ERROR });
      }
    } else {
      try {
        dispatch({ type: REQUEST_UPDATE_BOOKING_STATUS });

        const { id, active, order, parentId } = state.bookingStatuses[index];
        const res = await axios.put(
          `./statuses/${id}`, 
          JSON.stringify({
            id, name: nameValue, active, parentId, order
          }), 
          config
        );

        dispatch({
          type: GET_UPDATE_BOOKING_STATUS_SUCCESS,
          payload: res.data.status
        })
      } catch (err) {
        dispatch({ type: GET_UPDATE_BOOKING_STATUS_ERROR })
      }
    }    
  }  

  const changeToggle = async (index) => {    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      dispatch({ type: REQUEST_UPDATE_BOOKING_STATUS });

      const { id, name, active, order, parentId } = state.bookingStatuses[index];
      const res = await axios.put(
        `./statuses/${id}`, 
        JSON.stringify({
          id, name, active: !active, parentId, order
        }), 
        config
      );

      dispatch({
        type: GET_UPDATE_BOOKING_STATUS_SUCCESS,
        payload: res.data.status
      })
    } catch (err) {
      dispatch({ type: GET_UPDATE_BOOKING_STATUS_ERROR })
    } 
  }

  const deleteBookingStatus = async (index) => {
    if (state.bookingStatuses[index].id === -1) {
      dispatch({ type: REMOVE_NEW_BOOKING_STATUS });
      setSelectedStatusIndex(null);      
    } else {        
      try {
        dispatch({ type: REQUEST_DELETE_BOOKING_STATUS })
        
        const id = state.bookingStatuses[index].id;
        await axios.delete(`/statuses/${id}`);

        dispatch({ 
          type: GET_DELETE_BOOKING_STATUS_SUCCESS,
          payload: id
        })
      } catch (err) {
        dispatch({ type: GET_DELETE_BOOKING_STATUS_ERROR });
      }
    }
  }

  const changeSelectedIndex = index => {
    setSelectedStatusIndex(index);
  }

  const onAddStatus = () => {
    dispatch({ type: APPEND_CUSTOM_STATUS });
    setSelectedStatusIndex(state.bookingStatuses.length);
  }

  return (
    <React.Fragment>
      { state.bookingStatusesLoading ? (
          <SpinnerContainer loading={state.bookingStatusesLoading.toString()} />
        ) : (
          <React.Fragment>
            <SpinnerContainer loading={state.bookingStatusActionLoading.toString()} />
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
                              changeToggle(index)
                            }
                            onDelete={() => {
                              deleteBookingStatus(index);
                            }}
                            onChangeName={changeBookingStatus}
                            draggable={state.enableBookingSection}
                            changeSelectedIndex={changeSelectedIndex}
                            selectedStatusIndex={selectedStatusIndex}
                          />
                        )
                      )}
                      {provided.placeholder}
                    </div>
                    <Button
                      primary
                      onClick={onAddStatus}
                      iconComponent={() => <AddGlyph fill={colors.white} />}
                      style={{ marginTop: "2em" }}
                      disabled={!state.enableBookingSection}
                    >
                      Add Status
                    </Button>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </React.Fragment>
        )
      }
    </React.Fragment>
  );
};

export default BookingStatusesSettingsSection;
