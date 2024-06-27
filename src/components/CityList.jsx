import Spinner from "./Spinner";

import styles from "./CityList.module.css";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCitiesContext } from "../hooks/useCitiesContext";

function CityList() {
  const { cities, isLoading } = useCitiesContext();

  if (isLoading) return <Spinner />;

  if (!cities.length) return <Message message="Add cities" />;
  return (
    <ul className={styles.cityList}>
      {cities?.map((city) => {
        return <CityItem key={city.id} city={city} />;
      })}
    </ul>
  );
}

export default CityList;
