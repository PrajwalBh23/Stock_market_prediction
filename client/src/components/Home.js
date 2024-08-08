import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import './Header.css';
import hero from '../images/hero-banner2.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import nifty from '../images/nifty.png';
import sensex from '../images/sensex.jpg';
import niftybank from '../images/NiftyBank.jpg';
import niftyit from '../images/NiftyIt.jpg';
import sp from '../images/spx.jpeg';
import nasdaq from '../images/nasdaq.jpg';
import dow from '../images/dow.jpg';
import chart1 from '../images/chart-1.png';
import chart2 from '../images/chart-2.png';

const SHEET_ID = '1l9V31c-2azp1M7iYNLJ3--sb-EDD-p0GpMpa-JbA7_U';
const API_KEY = 'AIzaSyAA7_PbWCDhV5le_SQRT0F-z4lswTTkxVQ';
const SHEET_NAME = 'Sheet1';

const indices = {
  'India': [
    { name: 'Nifty 50', symbol: 'INDEXNSE:NIFTY_50', currency:'Rs', image: nifty },
    { name: 'Sensex', symbol: 'INDEXBOM:SENSEX', currency:'Rs',image: sensex },
    { name: 'Nifty Bank', symbol: 'INDEXNSE:NIFTY_BANK',currency:'Rs', image: niftybank },
    { name: 'Nifty IT', symbol: 'INDEXNSE:NIFTY_IT',currency:'Rs', image: niftyit }
  ],
  'USA': [
    { name: 'S&P 500', symbol: 'SPY', currency:'USD', image: sp },
    { name: 'NASDAQ Composite', symbol: 'INDEXNASDAQ:.IXIC',currency:'USD', image: nasdaq },
    { name: 'Dow Jones Industrial Average', symbol: 'INDEXDJX:.DJI',currency:'USD', image: dow }
  ],
  'China': [
    { name: 'Shanghai Composite Index', symbol: 'INDEXSSEC', currency:'CN¥', image: nifty },
    { name: 'Hang Seng Index', symbol: 'INDEXHANGSENG:HSI',currency:'CN¥', image: nifty },
    { name: 'Shenzhen Composite Index', symbol: 'INDEXSHA:000001', currency:'CN¥',image: nifty }
  ],
  'Japan': [
    { name: 'Nikkei 225', symbol: 'INDEXNIKKEI:NI225',currency:'¥', image: nifty },
    { name: 'Topix Index', symbol: 'INDEXTOPIX:TOPIX',currency:'¥', image: nifty },
    { name: 'JASDAQ Index', symbol: 'INDEXJASDAQ',currency:'¥', image: nifty },
    { name: 'Nikkei 400', symbol: 'INDEXNIKKEI:JP400',currency:'¥', image: nifty }
  ]
};

const fetchDataFromSheets = async () => {
  try {
    const [sheet1Response, sheet2Response] = await Promise.all([
      axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`),
      axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet2?key=${API_KEY}`)
    ]);

    return {
      sheet1Data: sheet1Response.data.values,
      sheet2Data: sheet2Response.data.values
    };
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return { sheet1Data: null, sheet2Data: null };
  }
};

const parseSheetData = (data, indicesList) => {
  const headers = data[0];
  const rows = data.slice(1);
  return indicesList.map(index => {
    const row = rows.find(r => r[1] === index.symbol);
    if (row) {
      const [name, symbol, currentPrice, priceChange, percentChange, volume] = row;
      return {
        ...index,
        todayPrice: parseFloat(currentPrice),
        priceChange: parseFloat(priceChange),
        percentChange: parseFloat(percentChange)
      };
    }
    return {
      ...index,
      todayPrice: null,
      priceChange: null,
      percentChange: null
    };
  });
};

// Function to get alternating chart images
const getChartImage = (index) => {
  return index % 2 === 0 ? chart1 : chart2;
};


const parseSheet2Data = (data) => {
  const headers = data[0];
  const rows = data.slice(1);
  return rows.map(row => {
    const [companyName, listingName, symbol, currentPrice, percentChange, marketCap, low52Days, high52Days, chart] = row;
    return {
      companyName,
      symbol,
      currentPrice: parseFloat(currentPrice),
      percentChange: parseFloat(percentChange),
      marketCap,
      low52Days: parseFloat(low52Days),
      high52Days: parseFloat(high52Days),
      chart
    };
  });
};

const Home = () => {
  const [activeTab, setActiveTab] = useState('India');
  const [indicesData, setIndicesData] = useState([]);
  const [sheet2Data, setSheet2Data] = useState([]);
  const navigate = useNavigate([]);

  const location = useLocation();

  const handleClick = () => {
    navigate('/predict');
  };

  useEffect(() => {
    if (location.pathname === '/market') {
      const marketSection = document.getElementById('market');
      if (marketSection) {
        marketSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchIndicesData = async () => {
      const { sheet1Data, sheet2Data } = await fetchDataFromSheets();
      if (sheet1Data) {
        const parsedSheet1Data = parseSheetData(sheet1Data, indices[activeTab]);
        setIndicesData(parsedSheet1Data);
      }
      if (sheet2Data) {
        const parsedSheet2Data = parseSheet2Data(sheet2Data);
        setSheet2Data(parsedSheet2Data);
      }
    };

    fetchIndicesData();
  }, [activeTab]);

  return (
    <>
      <Header />
      <section className="section hero" aria-label="hero" data-section>
        <div className="container">
          <div className="hero-content">
            <h1 className="h1 hero-title">Predict & Analyze Stock Trends with MarketSage</h1>
            <p className="hero-text">
              MarketSage leverages advanced machine learning algorithms to provide accurate stock market predictions and insights.
            </p>
            <button to='/predict' onClick={handleClick} className="btn btn-primary">Get started now</button>
          </div>
          <figure className="hero-banner">
            <img src={hero} width="500" height="408" alt="hero banner" className="w-100" />
          </figure>
        </div>
      </section>

      <section className="section trend" aria-label="crypto trend" data-section>
        <div className="container">
          <div className="trend-tab">
            <ul className="tab-nav">
              {Object.keys(indices).map((country) => (
                <li key={country}>
                  <button
                    className={`tab-btn ${activeTab === country ? 'active' : ''}`}
                    onClick={() => setActiveTab(country)}
                  >
                    {country}
                  </button>
                </li>
              ))}
            </ul>
            <ul className="tab-content">
              {indicesData.length > 0 ? (
                indicesData.map((indexData, idx) => (
                  <li key={idx}>
                    <div className="trend-card">
                      <div className="card-title-wrapper">
                        <img src={indexData.image} width="40"  alt={`${indexData.name} logo`} />
                        <a href="/" className="card-title">
                          {indexData.name} <span className="span">{indexData.symbol}</span>
                        </a>
                      </div>
                      <data className="card-value" value={indexData.todayPrice}>
                        {indexData.currency} {indexData.todayPrice !== null ? indexData.todayPrice.toFixed(2) : 'N/A'}
                      </data>
                      <div className="card-analytics">
                        <data className="current-price" value={indexData.todayPrice}>
                          {indexData.todayPrice !== null ? indexData.todayPrice.toFixed(2) : 'N/A'}
                        </data>
                        <div className={`badge ${indexData.percentChange >= 0 ? 'green' : 'red'}`}>
                          {indexData.percentChange !== null ? `${indexData.percentChange}%` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li>No data available</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      <section id="market" className="section market" aria-label="market update" data-section>
        <div className="container">
          <div className="title-wrapper">
            <Link to="/market#market"><h2 className="h2 section-title">Market Update</h2></Link>
            <a href="/" className="btn-linking">See All</a>
          </div>

          <div className="market-tab">
            <table className="market-table">
              <thead className="table-head">
                <tr className="table-row table-title table-title-border">
                  {['', '#', 'Company Name', 'Current Price', '%Change', 'Market Cap', 'Last 1 Month', ''].map((heading, index) => (
                    <th key={index} className="table-heading" scope="col">{heading}</th>
                  ))}
                </tr>
              </thead>

              <tbody className="table-body">
                {sheet2Data.map((coin, index) => (
                  <tr className="table-row" key={index}>
                    <td className="table-data">
                      <button className="add-to-fav" aria-label="Add to favourite" data-add-to-fav>
                        <i className="icon ion-icon ion-star-outline" aria-hidden="true"></i>
                        <i className="icon ion-icon ion-star" aria-hidden="true"></i>
                      </button>
                    </td>
                    <th className="table-data rank" scope="row">{index + 1}</th>
                    <td className="table-data">
                      <div className="wrapper">
                        <h3>
                          <Link to="/" className="coin-name">{coin.companyName} <span className="span">{coin.symbol}</span></Link>
                        </h3>
                      </div>
                    </td>
                    <td className={`table-data last-price ${coin.currentPrice < coin.low52Days ? 'red' : 'green'}`}>
                      Rs {coin.currentPrice.toFixed(2)}
                    </td>
                    <td className={`table-data last-update ${coin.percentChange >= 0 ? 'green' : 'red'}`}>
                      {coin.percentChange.toFixed(2)}%
                    </td>
                    <td className="table-data market-cap">{coin.marketCap}</td>
                    <td className="table-data">
                    {coin.chart ? (
          <img src={getChartImage(index)} width="100" height="40" alt="chart" className="chart" />
        ) : (
          'No chart available'
        )}
                    </td>
                    <td className="table-data">
                      <button className="btn btn-outline">Analysis</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
