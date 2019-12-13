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
import InputLabel from '../../buttons/InputLabel';

import CONFIG from '../../../config';

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
const SubdomainDiv = styled.div`
  display: flex;
  align-items: center;

  input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`

const SubdomainUrl = styled.div`
  background-color: #93989F;
  padding: 0 1em;
  border-radius: 0.25em;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  height: 34px;
  display: flex;
  align-items: center;
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
    subdomain: "",
  })
  const [ isNameValidate, setIsNameValidate ] = useState(true);
  const [ imageUploading, setImageUploading ] = useState(false);
  const [ companyLoading, setCompanyLoading ] = useState(false);
  const [ validateSubdomain, setValidateSubdomain ] = useState({ validate: true, msg: ""})

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
      const axios_config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      let saveOne = { ...companyInfo }
      delete saveOne['subdomain']

      let res = {};
      if (companyInfo.id) {
        res = await axios.put(
          `/companies/${companyInfo.id}`, 
          JSON.stringify(saveOne),
          axios_config
        );
      } else {
        res = await axios.post(
          `/companies`, 
          JSON.stringify(saveOne),
          axios_config
        );
        setCompanyInfo({
          ...companyInfo,
          id: res.data.company.id,
        })  
      }
    } catch (err) {
    }    
  }

  const changeCompanyInfo = (key, value) => {    
    const companyOne = {...companyInfo}
    companyOne[key] = value
    setCompanyInfo({
      ...companyOne
    })
  }

  const changeCompanyName = (value) => {
    if (value.length === 0) {
      setIsNameValidate(false);
    } else {
      setIsNameValidate(true);
    }
    setCompanyInfo({
      ...companyInfo,
      name: value,
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

  const onSaveSubdomain = async () => {
    try {
      const res = await axios.put(
        `/companies/savesubdomain/${companyInfo.id}`,
        {subdomain: companyInfo.subdomain},
        {
          headers: {
            'Content-Type': 'application/json'
          } 
        }
      )
            
      if (!res.data.success) {
        setValidateSubdomain({
          validate: false,
          msg: res.data.error,
        })
      }
    } catch(err) {

    }    
  }

  return (
    <div>
      <SpinnerContainer loading={companyLoading.toString()} />
      <P2 color="grey">This information below will be used to generate invoices.</P2>

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
      <Grid columns="1fr" style={{ width: "100%", marginTop: 14 }}> 
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <InputLabel>Company Logo</InputLabel> 
          <Dropzone onDrop={onDrop} accept="image/png, image/gif, image/jpg, image/jpeg" multiple={false}>
            {({getRootProps, getInputProps, isDragActive}) => (
              <DropzonContainer 
                {...getRootProps()}
                backgroundImage={companyInfo.logoImg ? CONFIG.API_URL + companyInfo.logoImg : ""}
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
        </div>             
      </Grid>      

      <Grid columns="1fr" style={{ width: "100%", marginTop: 14 }}>      
        <Button 
          primary 
          onClick={onSaveCompanyInfo} 
          style={{ maxWidth: "100px"}}
          disabled={!isNameValidate}
        >
          Save
        </Button>       
      </Grid>

      <TableDivider />
      
      <InputLabel>Subdomain</InputLabel>
      <SubdomainDiv>
        <TableEditableValue          
          value={companyInfo.subdomain}
          onChange={value => {changeCompanyInfo("subdomain", value)}}
          style={{ width: '100%'}}
          className={!validateSubdomain.validate? "error" : ""}
        />
        <SubdomainUrl>
          app.heyagenda.com
        </SubdomainUrl>
      </SubdomainDiv>
      {
        !validateSubdomain.validate && 
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
          {validateSubdomain.msg}
        </p>
      }           
      
      <Button 
        primary 
        onClick={onSaveSubdomain} 
        disabled={!companyInfo.subdomain.length > 0}
        style={{marginTop: 14}}
      >
        Change subdomain
      </Button>
    </div>
  );
};

export default CompanyInfoSettingsSection;
