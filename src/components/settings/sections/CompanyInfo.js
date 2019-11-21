import React, { useEffect, useState, useCallback } from "react";
import axios from 'axios';
import { css } from "emotion";
import Dropzone from 'react-dropzone'
import styled from "styled-components";

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

const DropzonContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  text-align: center;
  background-color: white;
  border-radius: 0.25em;
  border: 1px solid #e6e8e9;
  color: #93989F;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% auto;
  background-image: url("${props => props.backgroundImage}");
  cursor: pointer;
  &:hover {
    p {
      visibility: visible !important;
      cursor: pointer;
    }
  }

`
const DropZoneDescription = styled.p`
  visibility: ${props => props.isVisible ? "visible" : "hidden"};
`

const CompanyInfoSettingsSection = props => {
  const { state, dispatch } = props;
  const [ companyInfo, setCompanyInfo] = useState({
    name: "",
    vatId: "",
    street: "",
    city: "",
    postCode: "",
    phone: "",
    currency: "",
    vatRate: "",
    logoImg: "",
  })
  const [ isNameValidate, setIsNameValidate ] = useState(true);
  const [ imageUploading, setImageUploading ] = useState(false);
  const [ companyLoading, setCompanyLoading ] = useState(false);

  useEffect(() => {    

    const getCompanyInfo = async () => {
      try {
        setCompanyLoading(true)        
        const res = await axios.get('/company');
        if (res.data.company != null) {          
          setCompanyInfo({
            ...res.data.company,
          })
        }
        setCompanyLoading(false)    
      } catch (err) {
        setCompanyLoading(false)    
      }      
    }
    getCompanyInfo();
  }, []);

  const onSaveCompanyInfo = async () => {
    try {        
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      let res = {};
      if (companyInfo.id) {
        res = await axios.put(
          `/companies/${companyInfo.id}`, 
          JSON.stringify(companyInfo),
          config
        );
      } else {
        res = await axios.post(
          `/companies`, 
          JSON.stringify(companyInfo),
          config
        );
      }

      dispatch({
        type: GET_UPDATE_COMPANYINFO_SUCCESS,
        payload: res.data.company,
      })
    } catch (err) {
      dispatch({
        type: GET_UPDATE_COMPANYINFO_ERROR,
        payload: companyInfo,
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

  const onDrop = async (acceptedFiles) => {
    let imageFormData = new FormData();
    imageFormData.append('file', acceptedFiles[0])

    setImageUploading(true);
    const resUpload = await axios.post(
      '/upload/image',
      imageFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    setImageUploading(false)
    setCompanyInfo({
      ...companyInfo,
      logoImg: resUpload.data.fileNames[0],
    })
  }

  return (
    <div>
      <SpinnerContainer loading={companyLoading.toString()} />
      <P2 color="grey">These info will be used to generate invoices.</P2>
      <Dropzone onDrop={onDrop} accept="image/png, image/gif, image/jpg, image/jpeg" multiple={false}>
        {({getRootProps, getInputProps, isDragActive}) => (
          <DropzonContainer 
            {...getRootProps()}
            backgroundImage={companyInfo.logoImg}            
          >
            <input {...getInputProps()} />
            <DropZoneDescription isVisible={(companyInfo.logoImg && companyInfo.logoImg.length > 0) ? false : true}>
              {isDragActive ? "Drop it like it's hot!" : 'Click me or drag a file to upload!'}
            </DropZoneDescription>            
            {
              imageUploading && <SpinnerContainer loading={'true'} />
            }
          </DropzonContainer>
        )}
      </Dropzone>
      <TableEditableValue
        label="Company Name"
        value={companyInfo.name}
        onChange={value => {changeCompanyName(value)}}          
        style={{ width: "100%", marginTop: 24 }}
        className={!isNameValidate? "error" : ""}
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
        value={companyInfo.vatId}
        onChange={value => {changeCompanyInfo("vatId", value)}}          
        style={{ width: "100%", marginTop: 14 }}
      />
      <Grid columns="1fr 1fr" style={{ width: "100%", marginTop: 14 }}>
        <TableEditableValue
          label="Street"
          value={companyInfo.street}
          onChange={value => {changeCompanyInfo("street", value)}}
          style={{ width: "100%" }}
        />
        <TableEditableValue
          label="City"
          value={companyInfo.city}
          onChange={value => {changeCompanyInfo("city", value)}}
          style={{ width: "100%" }}
        />
        <TableEditableValue
          label="Post Code"
          value={companyInfo.postCode}
          onChange={value => {changeCompanyInfo("postCode", value)}}            
          style={{ width: "100%" }}
        />
        <TableEditableValue
          label="Phone Number"
          value={companyInfo.phone}
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
          optionsForSearch={
            Object.keys(currencies).map(item => ({value: item, label: item}))
          }
          selectedOption={companyInfo.currency.toUpperCase()}
          displayTransformer={option =>
            `${currencies[option].code} (${currencies[option].symbol})`
          }
          onOptionSelected={currency => {changeCompanyInfo("currency", currency)}}
          style={{ width: "100%" }}
        />

        <TableEditableValue
          label="Default VAT Rate (%)"
          value={companyInfo.vatRate}
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
