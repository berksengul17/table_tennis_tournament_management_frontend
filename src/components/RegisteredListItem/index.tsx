import { PlayerInfo } from "../../type";
import styles from "./index.module.css";

function RegisteredListItem({ item }: { item: PlayerInfo }) {
  return (
    <div className={styles.item}>
      <p>
        <b>Adı-Soyadı:</b> {item.firstName} {item.lastName}
      </p>
      <p>
        <b>Email:</b> {item.email}
      </p>
      <p>
        <b>Telefon Numarası:</b> {item.phoneNumber}
      </p>
      <p>
        <b>Katıldığı Şehir:</b> {item.city}
      </p>
    </div>
  );
}

export default RegisteredListItem;
