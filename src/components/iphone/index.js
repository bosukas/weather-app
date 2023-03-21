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
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData = () => {
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const long = pos.coords.longitude;
				const lat = pos.coords.latitude;
				const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,precipitation,rain,showers,snowfall,weathercode,pressure_msl,cloudcover,visibility,windspeed_10m,temperature_80m&current_weather=true`;

				$.ajax({
					url,
					dataType: "json",
					success: this.parseResponse,
					error(req, err){ console.log('API call failed ' + err); }
				});

				// once the data grabbed, hide the button
				this.setState({ display: false });
			},
			(err) => {
				alert(JSON.stringify(err));
			},
			{
				enableHighAccuracy: true,
				timeout: 20000,
				maximumAge: 1000
			}
		);
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
					{ this.state.display ? <Button class={style_iphone.button} clickFunction={this.fetchWeatherData}></Button>
						: null }
				</div>
			</div>
		);
	}

	parseResponse = (parsed_json) => {
		console.log(parsed_json);

		let current = parsed_json['current_weather'];
		let temp_c = current['temperature'];

		let location = 'local';
		let conditions = 'conditions';


		//let location = parsed_json['name'];
		//let temp_c = parsed_json['main']['temp'];
		//let conditions = parsed_json['weather']['0']['description'];

		/// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			temp: temp_c,
			cond : conditions
		});
	}
}
