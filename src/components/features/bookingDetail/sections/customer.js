import React from "react";
import { css } from "emotion";
import Grid from "../../../layout/Grid";
import { TableEditableValue } from "../../../tables/Tables";

const CustomerSection = props => {
	
    const { customerData, dispatch } = props;
  
    const handleChangeName = (value) => {      
	  dispatch({
		  type: 'select_customer_data',
		  key: 'name',
		  value: {value, validate: value.length !== 0}
	  })
    }
  
    return (
      <React.Fragment>        
		<TableEditableValue
			label="Name"
			value={customerData.name.value}
			onChange={value =>
				handleChangeName(value)
			}
			style={{ width: "100%", marginTop: "1.4rem" }}
			className={(!customerData.name.validate? "error" : "")}
		/>
		{
			!customerData.name.validate && 
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
  
        <Grid columns="1fr 1fr" style={{ width: "100%", marginTop: "1.4rem" }}>
          <TableEditableValue
            label="Phone Number"
            value={customerData.phone.value}
			onChange={value =>
				dispatch({
					type: 'select_customer_data',
					key: 'phone',
					value: {value}
				})              
            }
          />
  
          <TableEditableValue
            label="Email"
            value={customerData.email.value}
			onChange={value =>
				dispatch({
					type: 'select_customer_data',
					key: 'email',
					value: {value}
				})              
            }
          />
  
          {/* <TableEditableValue
            label="Address"
            value={customerData.address.value}
            onChange={value =>
				dispatch({
					type: 'select_customer_data',
					key: 'address',
					value: {value}
				})
            }
          />
  
          <TableEditableValue
            label="VAT Number"
            value={customerData.vatNumber.value}
            onChange={value =>
				dispatch({
					type: 'select_customer_data',
					key: 'vatNumber',
					value: {value}
				})
            }
          /> */}
        </Grid>
  
        {/* <TableEditableValue
          label="Private Notes"
          value={customerData.note.value}
          longText
          style={{
            width: "100%",
            marginTop: "1.4rem",
          }}
          longTextHeight = "60px"
		  onChange={value =>
			dispatch({
				type: 'select_customer_data',
				key: 'note',
				value: {value}
			})			
          }
        /> */}
      </React.Fragment>
    )
  }
  
  export default CustomerSection;