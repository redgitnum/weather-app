import React from 'react';
import { Container, Button, Row, Col, InputGroup, Media, FormControl } from 'react-bootstrap';
import ForecastList from './ForecastList.component'
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as icon from './assets/'

class App extends React.Component {
  constructor(props){
    super(props);
    this.textInput = React.createRef();
    this.state = {
      cityInput: '',
      weatherData: '',
      activeHour: ''
    }
  }

  GetData = () => {
      fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${this.state.cityInput}&units=metric&APPID=dab281bb786d769f183cd1acebde6fd4`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if(data.message) {
          this.setState({
            cityInput: '',
            weatherData: data,
          })
          console.log(data)
        }
        else{
          this.setState({
            cityInput: '',
            weatherData: data,
            activeHour: data.list[0]
          }, () => {
            document.getElementById('scrollable').scrollLeft = 0;
            // console.log(this.state.weatherData)
          })
        }
        
      })
    
    
  }

  render(){
    let run = (e) =>{
      let scrollable = document.getElementById('scrollable');
      if(e === 'left'){
        scrollable.scrollLeft = scrollable.scrollLeft - 150;
      }
      else {
        scrollable.scrollLeft = scrollable.scrollLeft + 150;
      }
      
    }
    
    let inputCity = (e) => {
      if(e.key === 'Enter') {
        this.GetData()
      }
      else {
        this.setState({
          cityInput: this.textInput.current.value
        })
      }
    }

    let weatherIcon = (e) => {
      if( e.dt_txt.slice(11, 13) === '21' || 
          e.dt_txt.slice(11, 13) === '00' ||
          e.dt_txt.slice(11, 13) === '03'){
        switch (e.weather[0].main) {
          case 'Clear' : return 'night';
          case 'Rain' : return 'rainy5';
          case 'Snow' : return 'snowy5';
          case 'Clouds' : return 'cloudynight2';
          default: return 'night';
        }
      }
      else {
        switch (e.weather[0].main) {
          case 'Clear' : return 'day';
          case 'Rain' : return 'rainy5';
          case 'Snow' : return 'snowy5';
          case 'Clouds' : return 'cloudyday2';
          default: return 'day';
        }
      }
      
    }

    let changeView = (e) => {
      this.setState({
        activeHour: this.state.weatherData.list[e]
      })
    }
    
    
    return(
      <>
        <h2 className="title-custom text-center text-white py-2 bg-primary rounded-pill">Weather Forecast App</h2>
        <InputGroup className="px-auto my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>City:</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl 
          ref={this.textInput} 
          onChange={inputCity} 
          onKeyPress={(e) => inputCity(e)} 
          value={this.state.cityInput}
          placeholder="put city name..."></FormControl>
        </InputGroup>
        {this.state.weatherData.cod === '404' && <Container>{this.state.weatherData.message}</Container>}
        {this.state.weatherData.cod === '200' && <Container>
        <h3 className="text-center">{this.state.weatherData.city.name}, {this.state.weatherData.city.country}</h3>
          <h4 className="text-center">{this.state.activeHour.dt_txt.slice(0,16)}</h4>
          <Row className="align-items-center">
            <Col>
              <Media>
                <img src={icon[weatherIcon(this.state.activeHour)]} alt="weather icon" width='100%' className="ml-5"/>
              </Media>
            </Col>
            <Col className="border-left">
              <h2 className="mb-0">{Number(this.state.activeHour.main.temp).toFixed(1)}&#xb0; C</h2>
              <h6 >Feels like: {this.state.activeHour.main.feels_like}&#xb0; C</h6>
              <h5 className="mb-0">{this.state.activeHour.weather[0].description}</h5>
              <h6>Cloud coverage: {this.state.activeHour.clouds.all}%</h6>
              <br></br>
              <h6 className="mb-0">Pressure:</h6>
              <h4>{this.state.activeHour.main.grnd_level} hPa</h4>
            </Col>
          </Row>
          <Row className="pt-2 mt-1 border-top " >
            <Col className="text-right">
              <h5>Wind: {Number(this.state.activeHour.wind.speed).toFixed(1)} m/s</h5>
              <h5>Direction: <img src={icon.arrow} alt="wind direction" style={{transform: `rotate(${this.state.activeHour.wind.deg + 90}deg)`}}/></h5>
            </Col>
            <Col className="text-left border-left">
              <h5>Humidity: {this.state.activeHour.main.humidity}%</h5>
              <h5>Precipitation: {this.state.activeHour.rain ? this.state.activeHour.rain['3h'] : 0} mm</h5>
            </Col>
          </Row>
          <Row className="border-top mt-2 pt-2 mb-1">
            <Col className="text-center">
              <h2>5 day forecast</h2>
            </Col>
          </Row>
          <Row className="flex-nowrap">
            <Button className="px-2 py-0 btn-success" onClick={() => run('left')}>&#x2190;</Button>
            <Row id="scrollable" className="mx-1 flex-nowrap overflow-auto text-center">
              <ForecastList 
              list={this.state.weatherData.list} 
              icon={weatherIcon}
              changeView={changeView}></ForecastList>        
            </Row>
            <Button className="px-2 py-0 btn-success" onClick={() => run('right')}>&#x2192;</Button>
          </Row>
        </Container>}
      </>
    )
  }
}

export default App;
