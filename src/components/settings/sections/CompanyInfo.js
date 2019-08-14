import React, { useEffect, useState } from "react";
import axios from 'axios';
import { css } from "emotion";
import P2 from "../../typography/P2";
import {
  TableEditableValue,
  TableDivider,
  TablePicker
} from "../../tables/tables";
import currencies from "../../../models/currencies";
import Grid from "../../layout/Grid";
import Button from "../../buttons/Button";
import SpinnerContainer from "../../layout/Spinner";

import {
  REQUEST_GET_COMPANYINFO,
  GET_COMPANYINFO_SUCCESS,
  GET_COMPANYINFO_ERROR,
  REQUEDST_UPDATE_COMPANYINFO,
  GET_UPDATE_COMPANYINFO_SUCCESS,
  GET_UPDATE_COMPANYINFO_ERROR,
  CHANGE_COMPANY_INFO,
} from "../../../reducers/actionType";

const CompanyInfoSettingsSection = props => {
  const { state, dispatch } = props;
  const [ isNameValidate, setIsNameValidate ] = useState(true);

  useEffect(() => {
    const getCompanyInfo = async () => {

      try {
        dispatch({ type: REQUEST_GET_COMPANYINFO });
        const res = await axios.get('/company');

        dispatch({ 
          type: GET_COMPANYINFO_SUCCESS,
          payload: res.data.company,
        })
      } catch (err) {
        dispatch({ type: GET_COMPANYINFO_ERROR })
      }      
    }
    getCompanyInfo();
  }, []);

  const onSaveCompanyInfo = async () => {
    try {      
      dispatch({
        type: REQUEDST_UPDATE_COMPANYINFO
      })
  
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
    
      const res = await axios.put(
        `/companies/${state.companyInfo.id}`, 
        JSON.stringify(state.companyInfo),
        config
      );

      dispatch({
        type: GET_UPDATE_COMPANYINFO_SUCCESS,
        payload: res.data.company,
      })
    } catch (err) {
      dispatch({
        type: GET_UPDATE_COMPANYINFO_ERROR,
        payload: state.companyInfo,
      })
    }    
  }

  const changeCompanyInfo = (key, value) => {
    dispatch({
      type: CHANGE_COMPANY_INFO,
      payload: {key, value}
    })
  }

  const changeCompanyName = (value) => {
    if (value.length === 0) {
      setIsNameValidate(false);
    } else {
      setIsNameValidate(true);
    }
    dispatch({
      type: CHANGE_COMPANY_INFO,
      payload: {key: "name", value}
    })
  }

  return (
    <div>
      <SpinnerContainer loading={state.companyLoading.toString()} />
      <P2 color="grey">These info will be used to generate invoices.</P2>
      <TableEditableValue
        label="Company Name"
        value={state.companyInfo.name}
        onChange={value => {changeCompanyName(value)}}          
        style={{ width: "100%", marginTop: 24 }}
      />
      {
        !isNameValidate && 
        <p 
          className={
            css`
              color: #E92579;            
              margin: 0.2em 0 0 0;
              padding: 0 0.6em;
              font-size: 0.8em;
            `
          }
        >
          Company Name is required.
        </p>
      }     
      <TableEditableValue
        label="VAT ID"
        value={state.companyInfo.vatId}
        onChange={value => {changeCompanyInfo("vatId", value)}}          
        style={{ width: "100%", marginTop: 14 }}
      />
      <Grid columns="1fr 1fr" style={{ width: "100%", marginTop: 14 }}>
        <TableEditableValue
          label="Street"
          value={state.companyInfo.street}
          onChange={value => {changeCompanyInfo("street", value)}}
          style={{ width: "100%" }}
        />
        <TableEditableValue
          label="City"
          value={state.companyInfo.city}
          onChange={value => {changeCompanyInfo("city", value)}}
          style={{ width: "100%" }}
        />
        <TableEditableValue
          label="Post Code"
          value={state.companyInfo.postCode}
          onChange={value => {changeCompanyInfo("postCode", value)}}            
          style={{ width: "100%" }}
        />
        <TableEditableValue
          label="Phone Number"
          value={state.companyInfo.phone}
          onChange={value => {changeCompanyInfo("phone", value)}}
          style={{ width: "100%" }}
        />
      </Grid>
      <TableDivider />
      <Grid columns="1fr 1fr" style={{ width: "100%", marginTop: 14 }}>
        <TablePicker
          label="Currency"
          searchEnabled
          options={Object.keys(currencies)}
          selectedOption={state.companyInfo.currency.toUpperCase()}
          displayTransformer={option =>
            `${currencies[option].code} (${currencies[option].symbol})`
          }
          onOptionSelected={currency => {changeCompanyInfo("currency", currency)}}
          style={{ width: "100%" }}
        />

        <TableEditableValue
          label="Default VAT Rate (%)"
          value={state.companyInfo.vatRate}
          onChange={value => {changeCompanyInfo("vatRate", value)}}            
          style={{ width: "100%" }}
        />
      </Grid>
      <TableDivider />
      <div 
        className={css`
          display: flex;
          justify-content: flex-end;
        `}
      >
        <Button 
          primary 
          onClick={onSaveCompanyInfo} 
          style={{ minWidth: "100px"}}
          disabled={!isNameValidate}
        >
          Save
        </Button>       
      </div>
    </div>
  );
};

export default CompanyInfoSettingsSection;
