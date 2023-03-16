// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';

export default class Iphone extends Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		// temperature state



		this.state.temp = "";
		// button display state
		this.setState({ display: true });

		navigator.geolocation.getCurrentPosition(
			(pos) => {
				var lat = parseFloat(pos.coords.latitude);
				var long = parseFloat(pos.coords.longitude);

				this.setState({lat: lat});
				this.setState({long: long});
			},
			(error) => {
				alert(JSON.stringify(error));
			},
			{
				enableHighAccuracy: true,
				timeout: 20000,
				maximumAge: 1000
			}
			//test
		);
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData = () => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		var url = "http://api.openweathermap.org/data/2.5/weather?q=London&units=metric&APPID=cf17e23b1d108b29a4d738d2084baf5";
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		})
		// once the data grabbed, hide the button
		this.setState({ display: false });
	}

	// the main render method for the iphone component
	render() {
		// check if temperature data is fetched, if so add the sign styling to the page
		const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;

		// display all weather data
		return (
			<div class={ style.container }>
				<div class={ style.header }>
					<div class={ style.city }>{ this.state.locate }</div>
					<div class={ style.conditions }>{ this.state.cond }</div>
					<span class={ tempStyles }>{ this.state.temp }</span>
				</div>
				<div class={ style.details }></div>
				<div class= { style_iphone.container }>
					{ this.state.display ? <Button class={ style_iphone.button } clickFunction={ this.fetchWeatherData }/ > : null }
				</div>

				<p>{this.state.lat}, {this.state.long}</p>
			</div>
		);
	}

	parseResponse = (parsed_json) => {
		var location = parsed_json['name'];
		var temp_c = parsed_json['main']['temp'];
		var conditions = parsed_json['weather']['0']['description'];

		// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			temp: temp_c,
			cond : conditions
		});
	}
}
