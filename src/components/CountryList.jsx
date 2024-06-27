import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
import { useCitiesContext } from "../hooks/useCitiesContext";

const CountryList = () => {
  const { cities, isLoading } = useCitiesContext();
  if (isLoading) return <Spinner />;

  if (!cities.length) return <Message message="No countries added" />;

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country)) {
      return [...arr, { country: city.country, emoji: city.emoji }];
    } else {
      return arr;
    }
  }, []);

  console.log(countries);

  return (
    <ul className={styles.countryList}>
      {countries?.map((country, idx) => {
        return <CountryItem key={idx} country={country} />;
      })}
    </ul>
  );
};

export default CountryList;
