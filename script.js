// DOM Elements
const temperatureInput = document.getElementById('temperature');
const fromUnitSelect = document.getElementById('from-unit');
const toUnitSelect = document.getElementById('to-unit');
const convertBtn = document.getElementById('convert-btn');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');
const resultDiv = document.getElementById('result');
const historyList = document.getElementById('history-list');
const themeToggle = document.getElementById('theme-toggle');
const mercury = document.getElementById('mercury');
const tempScale = document.getElementById('temp-scale');

// State
let history = JSON.parse(localStorage.getItem('conversionHistory')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateHistoryUI();
  applyThemePreference();
});

// Event Listeners
convertBtn.addEventListener('click', convertTemperature);
copyBtn.addEventListener('click', copyResult);
clearBtn.addEventListener('click', clearAll);
themeToggle.addEventListener('click', toggleTheme);

// Real-time conversion with debounce
temperatureInput.addEventListener('input', debounce(() => {
  if (temperatureInput.value) convertTemperature();
}, 300));

// Conversion Functions
function convertTemperature() {
  const temperature = parseFloat(temperatureInput.value);
  const fromUnit = fromUnitSelect.value;
  const toUnit = toUnitSelect.value;

  if (isNaN(temperature)) {
    resultDiv.textContent = 'Please enter a valid number.';
    return;
  }

  let convertedTemp;
  let formula;

  if (fromUnit === toUnit) {
    convertedTemp = temperature;
    formula = 'No conversion needed';
  } else {
    switch (fromUnit) {
      case 'Celsius':
        convertedTemp = toUnit === 'Fahrenheit' ? celsiusToFahrenheit(temperature) : celsiusToKelvin(temperature);
        formula = toUnit === 'Fahrenheit' 
          ? `(${temperature} × 9/5) + 32` 
          : `${temperature} + 273.15`;
        break;
      case 'Fahrenheit':
        convertedTemp = toUnit === 'Celsius' ? fahrenheitToCelsius(temperature) : fahrenheitToKelvin(temperature);
        formula = toUnit === 'Celsius' 
          ? `(${temperature} - 32) × 5/9` 
          : `(${temperature} + 459.67) × 5/9`;
        break;
      case 'Kelvin':
        convertedTemp = toUnit === 'Celsius' ? kelvinToCelsius(temperature) : kelvinToFahrenheit(temperature);
        formula = toUnit === 'Celsius' 
          ? `${temperature} - 273.15` 
          : `(${temperature} × 9/5) - 459.67`;
        break;
    }
  }

  const result = `${temperature} ${getUnitSymbol(fromUnit)} = ${convertedTemp} ${getUnitSymbol(toUnit)}`;
  const formulaText = `Formula: ${formula}`;

  resultDiv.innerHTML = `<strong>${result}</strong><br><small>${formulaText}</small>`;
  updateThermometer(temperature, fromUnit);
  addToHistory(result, formulaText);
}

// Helper Functions
function celsiusToFahrenheit(c) { return (c * 9/5 + 32).toFixed(2); }
function celsiusToKelvin(c) { return (c + 273.15).toFixed(2); }
function fahrenheitToCelsius(f) { return ((f - 32) * 5/9).toFixed(2); }
function fahrenheitToKelvin(f) { return ((f + 459.67) * 5/9).toFixed(2); }
function kelvinToCelsius(k) { return (k - 273.15).toFixed(2); }
function kelvinToFahrenheit(k) { return (k * 9/5 - 459.67).toFixed(2); }

function getUnitSymbol(unit) {
  return unit === 'Celsius' ? '°C' : unit === 'Fahrenheit' ? '°F' : 'K';
}

function updateThermometer(temp, unit) {
  let normalizedTemp;
  if (unit === 'Celsius') normalizedTemp = Math.min(Math.max(temp, -20), 100);
  else if (unit === 'Fahrenheit') normalizedTemp = Math.min(Math.max(temp, -4), 212);
  else normalizedTemp = Math.min(Math.max(temp, 253.15), 373.15);

  const minTemp = unit === 'Celsius' ? -20 : unit === 'Fahrenheit' ? -4 : 253.15;
  const maxTemp = unit === 'Celsius' ? 100 : unit === 'Fahrenheit' ? 212 : 373.15;
  const percentage = ((normalizedTemp - minTemp) / (maxTemp - minTemp)) * 100;

  mercury.style.height = `${percentage}%`;
  tempScale.textContent = `${normalizedTemp} ${getUnitSymbol(unit)}`;
}

function addToHistory(result, formula) {
  const timestamp = new Date().toLocaleTimeString();
  history.unshift({ result, formula, timestamp });
  if (history.length > 5) history.pop();
  localStorage.setItem('conversionHistory', JSON.stringify(history));
  updateHistoryUI();
}

function updateHistoryUI() {
  historyList.innerHTML = history.map(item => `
    <li>
      <span>${item.result}</span>
      <small>${item.timestamp}</small>
    </li>
  `).join('');
}

function copyResult() {
  if (!resultDiv.textContent) return;
  navigator.clipboard.writeText(resultDiv.textContent)
    .then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => copyBtn.innerHTML = originalText, 2000);
    });
}

function clearAll() {
  temperatureInput.value = '';
  resultDiv.textContent = '';
  mercury.style.height = '0%';
  tempScale.textContent = '';
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function applyThemePreference() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function debounce(func, delay) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), delay);
  };
}