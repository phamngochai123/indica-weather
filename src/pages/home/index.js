import { Layout, Input, Row, Col, Button, List, Radio } from "antd";
import debounce from "lodash/debounce";
import { useRef, useState } from "react";
import {
  getOneCallWeather,
  getSuggest,
  getUrlIcon,
} from "../../connector/Connector";
import { unitType } from "../../defined";
import { getLabelUnitTemp, getLabelUnitSpeed } from "../../helper";
import "./index.css";
import moment from "moment-timezone";
import LocalStorage from "../../defined/localStorage";

const { Header, Content } = Layout;
const dataGrid = {
  wind_speed: {
    key: "wind_speed",
    label: "Wind",
    getUnit: (unit) => getLabelUnitSpeed(unit),
  },
  pressure: { key: "pressure", label: "Pressure", unit: "hPa" },
  humidity: { key: "humidity", label: "Humidity", unit: "%" },
  uv: { key: "uvi", label: "UV" },
  devPoint: {
    key: "dew_point",
    label: "Dew point",
    getUnit: (unit) => getLabelUnitTemp(unit),
  },
  visibility: { key: "visibility", label: "Visibility", unit: "m" },
};
const getFullNameItemSuggest = (item) => {
  return item.name + " - " + item.country;
};
const Home = () => {
  const [inputvalue, setInputValue] = useState("");
  const [suggestLocation, setSuggestLocation] = useState([]);
  const [detailWeatherLocation, setDetailWeatherLocation] = useState(null);
  const [units, setUnits] = useState(unitType.imperial);
  const [itemSelected, setItemSelected] = useState(null);
  const changeLocationInput = (e) => {
    setInputValue(e.target.value);
    debounceSuggestData(e.target.value);
  };
  const getSuggestLocation = async (value) => {
    try {
      const resSuggest = await getSuggest(value);
      console.log("getSuggestLocation=>", resSuggest);
      setSuggestLocation(resSuggest.data || []);
    } catch (error) {}
  };
  const debounceSuggestData = useRef(
    debounce(getSuggestLocation, 500, { leading: false, trailing: true })
  ).current;
  const handlerSearch = async () => {
    try {
      getSuggestLocation(inputvalue);
    } catch (error) {
      console.log("resSearch=>error", error);
    }
  };
  const handleClickItemSuggest = async (item) => {
    if (!item.lat && !item.lon) return;
    setItemSelected(item);
    try {
      const resOneCall = await getOneCallWeather({
        lat: item.lat,
        lon: item.lon,
        units,
      });
      setSuggestLocation([]);
      setInputValue(getFullNameItemSuggest(item));
      setDetailWeatherLocation(resOneCall.data);
    } catch (error) {}
  };
  const changeUnit = (e) => {
    const valueChange = e.target.value;
    console.log("changeUnit=>", valueChange);
    setUnits(valueChange);
  };
  const clickLogout = () => {
    LocalStorage.clear();
    window.location.reload();
  };
  return (
    <Layout>
      <Header className="container-header">
        <div className="wrap-header-icon">
          <img
            className="logo-header"
            alt="logo"
            src={require("../../assets/image/weatherIcon.png")}
          />
        </div>
        <div className="header-name">Indica Weather</div>
        <div>
          <Button onClick={clickLogout}>{"Logout"}</Button>
        </div>
      </Header>
      <Content>
        <div className="wrap-content">
          <div className="wrap-search">
            <div className="wrap-input">
              <div>
                <Input
                  onChange={changeLocationInput}
                  className="search-input"
                  placeholder="Search location"
                  value={inputvalue}
                />
                <Button onClick={handlerSearch} type="primary">
                  Search
                </Button>
                <Radio.Group
                  className="group-unit"
                  value={units}
                  onChange={changeUnit}
                >
                  <Radio.Button value={unitType.imperial}>
                    {getLabelUnitTemp(unitType.imperial)}
                  </Radio.Button>
                  <Radio.Button value={unitType.metric}>
                    {getLabelUnitTemp(unitType.metric)}
                  </Radio.Button>
                </Radio.Group>
              </div>
              <div className="wrap-suggest">
                <div>
                  {suggestLocation.length ? (
                    <List
                      bordered
                      dataSource={suggestLocation}
                      renderItem={(item) => (
                        <List.Item className="list-item-suggest">
                          <div
                            className="item-suggest"
                            onClick={() => handleClickItemSuggest(item)}
                          >
                            {getFullNameItemSuggest(item)}
                          </div>
                        </List.Item>
                      )}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {itemSelected && detailWeatherLocation ? (
            <div className="wrap-detail-weather">
              <div>
                <h1 className="name-location">
                  {itemSelected.name + " - " + itemSelected.country}
                </h1>
                <div className="current-temp">
                  <img
                    src={getUrlIcon(
                      detailWeatherLocation.current.weather[0].icon
                    )}
                    className="icon-weather-current"
                    alt={detailWeatherLocation.current.weather[0].main}
                  />
                  <span className="txt-current-temp">
                    {detailWeatherLocation.current.temp +
                      getLabelUnitTemp(units)}
                  </span>
                </div>
                <div className="desc-weather">
                  {`Feels like ${
                    detailWeatherLocation.current.feels_like
                  }${getLabelUnitTemp(units)}. ${
                    detailWeatherLocation.current.weather[0].main
                  }. ${detailWeatherLocation.current.weather[0].description}`}
                </div>
                <div>
                  <Row>
                    {Object.keys(dataGrid).map((key) => {
                      const itemGrid = dataGrid[key];
                      const currentWeather = detailWeatherLocation.current;
                      return (
                        <Col key={key} span={12}>
                          <div className="list-detail-current txt-left">
                            {itemGrid.label +
                              ": " +
                              currentWeather[itemGrid.key] +
                              (itemGrid.getUnit
                                ? itemGrid.getUnit(units)
                                : itemGrid.unit
                                ? itemGrid.unit
                                : "")}
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              </div>
              <div className="wrap-hourly">
                <div className="title-day">Hourly forecast</div>
                {detailWeatherLocation.hourly.map((itemDaily, index) => {
                  console.log(
                    "detailWeatherLocation=>",
                    moment().tz(detailWeatherLocation.timezone).date()
                  );
                  return moment().tz(detailWeatherLocation.timezone).date() ===
                    moment(itemDaily.dt * 1000)
                      .tz(detailWeatherLocation.timezone)
                      .date() ? (
                    <Row key={index} className="item-daily">
                      <Col span={8}>
                        {moment(itemDaily.dt * 1000)
                          .tz(detailWeatherLocation.timezone)
                          .format("DD/MM HH:mm")}
                      </Col>
                      <Col span={8}>
                        <img
                          src={getUrlIcon(itemDaily.weather[0].icon)}
                          alt={itemDaily.weather[0].main}
                          className="icon-daily"
                        />
                        <span>
                          {Math.round(itemDaily.temp) + getLabelUnitTemp(units)}
                        </span>
                      </Col>
                      <Col span={8}>{itemDaily.weather[0].description}</Col>
                    </Row>
                  ) : null;
                })}
              </div>
              <div className="wrap-daily">
                <div className="title-day">Day forecast</div>
                {detailWeatherLocation.daily.map((itemDaily, index) => {
                  return (
                    <Row key={index} className="item-daily">
                      <Col span={8}>
                        {moment(itemDaily.dt * 1000)
                          .tz(detailWeatherLocation.timezone)
                          .format("ddd, MMM DD")}
                      </Col>
                      <Col span={8}>
                        <img
                          src={getUrlIcon(itemDaily.weather[0].icon)}
                          alt={itemDaily.weather[0].main}
                          className="icon-daily"
                        />
                        <span>
                          {Math.round(itemDaily.temp.max) +
                            " / " +
                            Math.round(itemDaily.temp.min) +
                            getLabelUnitTemp(units)}
                        </span>
                      </Col>
                      <Col span={8}>{itemDaily.weather[0].description}</Col>
                    </Row>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </Content>
    </Layout>
  );
};
export default Home;
