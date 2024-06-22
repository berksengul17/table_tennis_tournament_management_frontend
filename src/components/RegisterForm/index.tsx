import { SubmitHandler, useForm } from "react-hook-form";
import { PlayerInfo } from "../../type";
import styles from "./index.module.css";

type Inputs = Omit<PlayerInfo, "id">;

const RequiredLabel = ({
  htmlFor,
  text,
  required,
}: {
  htmlFor: string;
  text: string;
  required: boolean;
}) => {
  return (
    <label htmlFor={htmlFor}>
      {text}
      {required && <span style={{ color: "red" }}>*</span>}
    </label>
  );
};

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      email: "",
      phoneNumber: "",
      birthDate: new Date(),
      ageCategory: "",
      city: "",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Kayıt Formu</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.inputContainer}>
          <RequiredLabel htmlFor="firstName" text="Adı" required />
          <input
            {...register("firstName", { required: true })}
            id="firstName"
          />
        </div>

        <div className={styles.inputContainer}>
          <RequiredLabel htmlFor="lastName" text="Soyadı" required />
          <input {...register("lastName", { required: true })} id="lastName" />
        </div>

        <div className={styles.inputContainer}>
          <RequiredLabel htmlFor="email" text="Email" required />
          <input {...register("email", { required: true })} id="email" />
        </div>

        <div className={styles.inputContainer}>
          <RequiredLabel
            htmlFor="phoneNumber"
            text="Telefon Numarası"
            required
          />
          <input
            {...register("phoneNumber", { required: true })}
            id="phoneNumber"
            type="tel"
            pattern="[0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}"
          />
        </div>

        <div className={styles.inputContainer}>
          <RequiredLabel htmlFor="gender" text="Cinsiyet" required />
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: "1rem" }}>
              <input
                {...register("gender", { required: true })}
                type="radio"
                id="male"
                value="Erkek"
              />
              <label htmlFor="male">Erkek</label>
            </div>

            <div>
              <input
                {...register("gender", { required: true })}
                type="radio"
                id="female"
                value="Kadın"
              />
              <label htmlFor="female">Kadın</label>
            </div>
          </div>
        </div>

        <div className={styles.inputContainer}>
          <RequiredLabel htmlFor="birthDate" text="Doğum Tarihi" required />
          <input
            {...register("birthDate", { required: true })}
            id="birthDate"
            type="date"
          />
        </div>

        <div className={styles.inputContainer}>
          <RequiredLabel htmlFor="ageCategory" text="Yaş Grubu" required />

          <select
            {...register("ageCategory", { required: true })}
            id="ageCategory"
          >
            <option value="forty-fifty">40-49</option>
            <option value="fifty-sixty">50-59</option>
            <option value="sixty-seventy">60-69</option>
            <option value="seventy-plus">70+</option>
          </select>
        </div>

        <div className={styles.inputContainer}>
          <RequiredLabel htmlFor="city" text="Katılınan Şehir" required />
          <input {...register("city", { required: true })} id="city" />
        </div>

        <input type="submit" value={"Kaydol"} />
      </form>
    </div>
  );
}

export default RegisterForm;
