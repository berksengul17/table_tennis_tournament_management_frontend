import { Participant as PType } from "../../type";
import styles from "./index.module.css";

function Participant({ item }: { item: PType }) {
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

export default Participant;
