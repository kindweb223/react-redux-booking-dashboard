import React from "react";
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
} from "../../../reducers/actionType";

const CompanyInfoSettingsSection = props => {
  const { state, dispatch } = props;
  
  const onSaveCompanyInfo = () => {

  }

  return (
    <div>
      <SpinnerContainer loading={state.loading.toString()} />
      <P2 color="grey">These info will be used to generate invoices.</P2>
      <TableEditableValue
        label="Company Name"
        value={state.company_name}
        onChange={value =>
          dispatch({
            type: "update_settings_value",
            key: "company_name",
            value: value
          })
        }
        style={{ width: "100%", marginTop: 24 }}
      />
      <TableEditableValue
        label="VAT ID"
        value={state.vat_id}
        onChange={value =>
          dispatch({
            type: "update_settings_value",
            key: "vat_id",
            value: value
          })
        }
        style={{ width: "100%", marginTop: 14 }}
      />
      <Grid columns="1fr 1fr" style={{ width: "100%", marginTop: 14 }}>
        <TableEditableValue
          label="Street"
          value={state.street}
          onChange={value =>
            dispatch({
              type: "update_settings_value",
              key: "street",
              value: value
            })
          }
          style={{ width: "100%" }}
        />
        <TableEditableValue
          label="City"
          value={state.city}
          onChange={value =>
            dispatch({
              type: "update_settings_value",
              key: "city",
              value: value
            })
          }
          style={{ width: "100%" }}
        />
        <TableEditableValue
          label="Post Code"
          value={state.post_code}
          onChange={value =>
            dispatch({
              type: "update_settings_value",
              key: "post_code",
              value: value
            })
          }
          style={{ width: "100%" }}
        />
        <TableEditableValue
          label="Phone Number"
          value={state.phone}
          onChange={value =>
            dispatch({
              type: "update_settings_value",
              key: "phone",
              value: value
            })
          }
          style={{ width: "100%" }}
        />
      </Grid>
      <TableDivider />
      <Grid columns="1fr 1fr" style={{ width: "100%", marginTop: 14 }}>
        <TablePicker
          label="Currency"
          searchEnabled
          options={Object.keys(currencies)}
          selectedOption={state.currency}
          displayTransformer={option =>
            `${currencies[option].code} (${currencies[option].symbol})`
          }
          onOptionSelected={currency =>
            dispatch({
              type: "update_settings_value",
              key: "currency",
              value: currency
            })
          }
          style={{ width: "100%" }}
        />

        <TableEditableValue
          label="Default VAT Rate (%)"
          value={state.defaultVatRateText}
          onChange={value =>
            dispatch({
              type: "update_settings_default_vat_rate",
              value: value
            })
          }
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
        <Button primary onClick={onSaveCompanyInfo} style={{ minWidth: "100px"}}>
          Save
        </Button>       
      </div>
    </div>
  );
};

export default CompanyInfoSettingsSection;
