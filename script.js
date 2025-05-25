function convertTemperature() {
    const temperature = parseFloat(document.getElementById('temperature').value);
    const unit = document.getElementById('unit').value;
    let resultText = '';

    if (isNaN(temperature)) {
        resultText = 'Please enter a valid number.';
    } else {
        switch (unit) {
            case 'Celsius':
                resultText = `${temperature}°C is ${celsiusToFahrenheit(temperature)}°F and ${celsiusToKelvin(temperature)}K`;
                break;
            case 'Fahrenheit':
                resultText = `${temperature}°F is ${fahrenheitToCelsius(temperature)}°C and ${fahrenheitToKelvin(temperature)}K`;
                break;
            case 'Kelvin':
                resultText = `${temperature}K is ${kelvinToCelsius(temperature)}°C and ${kelvinToFahrenheit(temperature)}°F`;
                break;
        }
    }

    document.getElementById('result').innerText = resultText;
}

function celsiusToFahrenheit(celsius) {
    return ((celsius * 9/5) + 32).toFixed(2);
}

function celsiusToKelvin(celsius) {
    return (celsius + 273.15).toFixed(2);
}

function fahrenheitToCelsius(fahrenheit) {
    return ((fahrenheit - 32) * 5/9).toFixed(2);
}

function fahrenheitToKelvin(fahrenheit) {
    return ((fahrenheit + 459.67) * 5/9).toFixed(2);
}

function kelvinToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(2);
}

function kelvinToFahrenheit(kelvin) {
    return ((kelvin * 9/5) - 459.67).toFixed(2);
}