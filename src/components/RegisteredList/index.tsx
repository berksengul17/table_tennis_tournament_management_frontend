import { useState } from "react";
import { PlayerInfo } from "../../type";
import RegisteredListItem from "../RegisteredListItem";
import styles from "./index.module.css";

const players: PlayerInfo[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    gender: "Male",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    birthDate: new Date("1990-01-15"),
    ageCategory: "Adult",
    city: "New York",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    gender: "Female",
    email: "jane.smith@example.com",
    phoneNumber: "987-654-3210",
    birthDate: new Date("1985-06-25"),
    ageCategory: "Adult",
    city: "Los Angeles",
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    gender: "Male",
    email: "mike.johnson@example.com",
    phoneNumber: "456-789-1230",
    birthDate: new Date("2005-08-20"),
    ageCategory: "Youth",
    city: "Chicago",
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Davis",
    gender: "Female",
    email: "emily.davis@example.com",
    phoneNumber: "321-654-9870",
    birthDate: new Date("2000-11-30"),
    ageCategory: "Young Adult",
    city: "Houston",
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Brown",
    gender: "Male",
    email: "david.brown@example.com",
    phoneNumber: "789-123-4560",
    birthDate: new Date("1995-03-05"),
    ageCategory: "Adult",
    city: "Phoenix",
  },
  {
    id: "6",
    firstName: "David",
    lastName: "Brown",
    gender: "Male",
    email: "david.brown@example.com",
    phoneNumber: "789-123-4560",
    birthDate: new Date("1995-03-05"),
    ageCategory: "Adult",
    city: "Phoenix",
  },
  {
    id: "7",
    firstName: "David",
    lastName: "Brown",
    gender: "Male",
    email: "david.brown@example.com",
    phoneNumber: "789-123-4560",
    birthDate: new Date("1995-03-05"),
    ageCategory: "Adult",
    city: "Phoenix",
  },
  {
    id: "8",
    firstName: "David",
    lastName: "Brown",
    gender: "Male",
    email: "david.brown@example.com",
    phoneNumber: "789-123-4560",
    birthDate: new Date("1995-03-05"),
    ageCategory: "Adult",
    city: "Phoenix",
  },
  {
    id: "9",
    firstName: "David",
    lastName: "Brown",
    gender: "Male",
    email: "david.brown@example.com",
    phoneNumber: "789-123-4560",
    birthDate: new Date("1995-03-05"),
    ageCategory: "Adult",
    city: "Phoenix",
  },
];

function RegisteredList() {
  const [registeredList, setRegisteredList] = useState<PlayerInfo[]>([
    ...players,
  ]);

  return (
    <div className={styles.container}>
      <h1>Kaydolan Oyuncular</h1>
      {registeredList.map((item) => (
        <RegisteredListItem key={item.id} item={item} />
      ))}
      <button>Yaş Gruplarına Ayır</button>
    </div>
  );
}

export default RegisteredList;
