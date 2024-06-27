// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";
import Message from "./Message";
import Spinner from "./Spinner";
import useUrlPosition from "../hooks/useUrlPosition";
import { useCitiesContext } from "../hooks/useCitiesContext";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

const flagemojiToPNG = (countryCode) => {
  return (
    <img
      src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
      alt="flag"
    />
  );
};
function countryCodeToFlag(countryCode) {
  const offset = 127397;
  const char1 = countryCode.toUpperCase().charCodeAt(0) + offset;
  const char2 = countryCode.toUpperCase().charCodeAt(1) + offset;
  return String.fromCodePoint(char1) + String.fromCodePoint(char2);
}

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [error, setError] = useState("");
  const { lat, lng } = useUrlPosition();

  const { createCity, isLoading } = useCitiesContext();

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!lat && !lng) return;

    const getCityData = async () => {
      try {
        setError("");
        setIsLoadingGeocoding(true);
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        if (res.ok === false) throw new Error("Something went wrong");

        const data = await res.json();

        if (!data.countryCode) throw new Error();
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(data.countryCode);
      } catch (error) {
        setError("No data found. Please select another location");
      } finally {
        setIsLoadingGeocoding(false);
      }
    };

    getCityData();
  }, [lat, lng]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cityName || !date) return;

    const data = {
      cityName,
      country,
      emoji: countryCodeToFlag(emoji.toLowerCase()),
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };

    await createCity(data);

    navigate("/app");
  };

  if (isLoadingGeocoding) return <Spinner />;

  if (!lat && !lng)
    return <Message message="Start by clicking somewhere on the map." />;

  if (error) return <Message message={error} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {emoji && <span className={styles.flag}>{flagemojiToPNG(emoji)}</span>}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">{isLoading ? "Adding..." : "Add"}</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate("/app/cities");
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
