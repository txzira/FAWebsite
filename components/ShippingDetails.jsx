import React, { useState } from 'react-dom';
import styles from '../styles/CheckoutForm.module.css';

export default function ShippingDetails({countries, options}){
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [shippingSubdivision, setShippingSubdivision] = useState(''); //state|province
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [shippingLine1, setShippingLine1] = useState('');
    const [shippingLine2, setShippingLine2] = useState('');
    const [shippingOption, setShippingOption] = useState('');

    
    return (
        <div className={styles.customerInfoContainer}>
        <h1>Shipping Address</h1>
        <label>Email<input required name='shippingEmail' type='text' placeholder='abc123@example.com' value={email} onChange={(e)=> setEmail(e.target.value)}/></label>
        <label>Name<input required name='shippingName' type='text' placeholder='John Doe' value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label>Country
          <select value={shippingCountry} name='shippingCountry' onChange={(e) => setShippingCountry(e.target.value)}>
            {countries.map((country) => (
              <option value={country.id} key={country.id}>{country.label}</option>
            ))}
          </select>
        </label>
    
        <label>State
          <select value={shippingSubdivision} name='shippingState' onChange={(e) => setShippingSubdivision(e.target.value)}>
            {subdivisions.map((subdivision) => (
              <option value={subdivision.id} key={subdivision.id}>{subdivision.label}</option>
            ))}
          </select>
        </label>    
        <label>City<input required name='shippingCity' type='text' placeholder='Trenton' value={city} onChange={(e)=> setCity(e.target.value)} /></label>
        <label>Postal Code<input required name='shippingZip' type='text' placeholder="08608" value={postalCode} onChange={(e)=> setPostalCode(e.target.value)}/></label>
        <label>Address<input required name='shippingLine1' type='text' placeholder='20 S Montgomery St' value={shippingLine1} onChange={(e)=> setShippingLine1(e.target.value)} /></label>
        <label>Apartment, Suite, etc.. (Optional)<input name='shippingLine2' type='text' placeholder='Apt. 1' value={shippingLine2} onChange={(e)=> setShippingLine2(e.target.value)} /></label>
        <label>Shipping Option
          <select value={shippingOption} name='shippingOption' onChange={(e) => setShippingOption(e.target.value)}>
          {options.map((option) => (
              <option value={option.id} key={option.id}>{option.label}</option>
            ))}
          </select>
        </label>

      </div>
    )
}