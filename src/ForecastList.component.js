import React from 'react';
import { Button } from 'react-bootstrap';
import * as icon from './assets/'


let ForecastList = (props) => {
    return(
        <>
        {props.list.map((item, i) => 
            <Button onClick={() => props.changeView(i)} index={i} key={item.dt+i} className="mr-1">{item.dt_txt.slice(0, 16)} <img alt="weather icon" src={icon[props.icon(item)]} /></Button>
        )}
        
        </>
    )
}

export default ForecastList;